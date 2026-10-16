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
