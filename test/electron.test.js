// Pruebas de la parte de Electron que no necesita abrir una ventana:
// resolución de rutas del protocolo app:// y la caché de Pyodide.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { resolverRuta, tipoMime } from '../electron/rutas.js';
import { crearCacheRuntime } from '../electron/cache-runtimes.js';
import { RAIZ } from './motores-node.js';

test('las rutas del juego apuntan a archivos que existen', () => {
  for (const ruta of [
    '/',
    '/ui/app.js',
    '/estilos/base.css',
    '/vendor/codemirror/lib/codemirror.js',
    '/vendor/sql.js/sql-wasm.wasm',
    '/vendor/fuentes/vt323/vt323-latin-400-normal.woff2',
    '/datos/macro_eeuu_fred_1959_2009.csv',
    '/recursos/icono.png',
  ]) {
    const r = resolverRuta(RAIZ, ruta);
    assert.ok(r?.archivo, ruta);
    assert.ok(fs.existsSync(r.archivo), `${ruta} → ${r.archivo}`);
  }
});

test('no se puede salir de las carpetas permitidas con ../', () => {
  for (const ruta of ['/../package.json', '/vendor/sql.js/../../../package.json', '/datos/../../etc/passwd']) {
    const r = resolverRuta(RAIZ, ruta);
    if (r?.archivo) {
      const permitidas = ['src', 'datos', 'node_modules'].map((c) => path.join(RAIZ, c) + path.sep);
      assert.ok(
        permitidas.some((p) => r.archivo.startsWith(p)),
        `${ruta} salió a ${r.archivo}`,
      );
      assert.ok(!r.archivo.endsWith(path.join(RAIZ, 'package.json')));
    }
  }
  assert.equal(resolverRuta(RAIZ, '/runtime/pyodide/../../secreto'), null);
});

test('tipos MIME correctos (WebAssembly necesita application/wasm)', () => {
  assert.equal(tipoMime('x/pyodide.asm.wasm'), 'application/wasm');
  assert.match(tipoMime('a.mjs'), /javascript/);
  assert.match(tipoMime('a.csv'), /text\/csv/);
});

test('caché de Pyodide: descarga una vez, prueba el CDN siguiente si falla y luego lee del disco', async () => {
  const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), 'cache-pyodide-'));
  const pedidos = [];
  const cache = crearCacheRuntime({
    carpeta,
    cdns: ['https://cdn-caido.example/', 'https://cdn-ok.example/'],
    descargar: async (url) => {
      pedidos.push(url);
      if (url.startsWith('https://cdn-caido.example/')) return { ok: false, status: 503 };
      return { ok: true, status: 200, arrayBuffer: async () => new TextEncoder().encode(`contenido de ${url}`).buffer };
    },
  });
  const [a, b] = await Promise.all([cache.obtener('pyodide.mjs'), cache.obtener('pyodide.mjs')]);
  assert.equal(a.datos.toString(), 'contenido de https://cdn-ok.example/pyodide.mjs');
  assert.equal(b.datos.toString(), a.datos.toString());
  assert.equal(pedidos.length, 2, 'descargas simultáneas del mismo archivo se agrupan');
  const c = await cache.obtener('pyodide.mjs');
  assert.equal(c.origen, 'cache');
  assert.equal(pedidos.length, 2, 'la segunda vez no descarga');
  await assert.rejects(
    crearCacheRuntime({ carpeta, cdns: ['https://x/'], descargar: async () => ({ ok: false, status: 404 }) }).obtener('no-existe.whl'),
    /HTTP 404/,
  );
  fs.rmSync(carpeta, { recursive: true, force: true });
});

test('ranuras de partida: guardan por separado, la partida anterior se lee como ranura 1 y borrar no destruye', async () => {
  const { leerRanura, guardarRanura, borrarRanura, numeroValido, RANURAS } = await import('../electron/partidas.js');
  const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), 'condor-partidas-'));
  try {
    assert.equal(RANURAS, 3);
    assert.equal(numeroValido(0), false);
    assert.equal(numeroValido(4), false);
    assert.equal(numeroValido('1'), false);
    assert.equal(await leerRanura(carpeta, 2), null);

    fs.writeFileSync(path.join(carpeta, 'progreso.json'), '{"vieja":true}');
    assert.equal(await leerRanura(carpeta, 1), '{"vieja":true}', 'la partida de antes de las ranuras aparece en la ranura 1');
    assert.equal(await leerRanura(carpeta, 2), null);

    assert.equal(await guardarRanura(carpeta, 2, '{"b":1}'), true);
    assert.equal(await guardarRanura(carpeta, 2, '{"b":2}'), true);
    assert.equal(await leerRanura(carpeta, 2), '{"b":2}');
    assert.equal(fs.readFileSync(path.join(carpeta, 'ranura-2.json.bak'), 'utf8'), '{"b":1}', 'guarda copia de la versión anterior');
    assert.equal(await guardarRanura(carpeta, 2, 42), false, 'solo acepta texto');

    await borrarRanura(carpeta, 1);
    assert.equal(await leerRanura(carpeta, 1), null);
    await borrarRanura(carpeta, 2);
    assert.equal(await leerRanura(carpeta, 2), null);
    assert.equal(fs.readFileSync(path.join(carpeta, 'ranura-2.borrada.json'), 'utf8'), '{"b":2}', 'la partida borrada se puede recuperar a mano');
    await assert.rejects(guardarRanura(carpeta, 9, '{}'), /Ranura inválida/);
  } finally {
    fs.rmSync(carpeta, { recursive: true, force: true });
  }
});
