// Pruebas del contenido: integridad del catálogo y, sobre todo, que cada
// ejercicio funciona de verdad en los mismos motores que usa el juego:
//  - la solución de referencia se ejecuta sin errores y pasa,
//  - el código inicial NO pasa (el ejercicio no viene resuelto),
//  - las soluciones alternativas correctas pasan,
//  - las respuestas incorrectas conocidas fallan.

import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO, pasosEvaluables } from '../src/contenido/index.js';
import { auditarEjercicio } from './auditoria-contenido.js';
import { crearMotores, leerDato } from './motores-node.js';
import { leerCSV, ARCHIVOS_DATOS, generarOperaciones } from '../src/contenido/datos/fondo-condor.js';
import { validarRespuestaEscrita } from '../src/core/validacion.js';

const misiones = Object.values(CATALOGO.misiones);

function todosLosEjercicios() {
  const lista = [];
  for (const m of misiones) {
    for (const p of pasosEvaluables(m)) if (p.tipo === 'ejercicio') lista.push({ donde: `${m.id}/${p.id}`, paso: p });
  }
  for (const [id, c] of Object.entries(CATALOGO.conceptos)) {
    c.repasos.forEach((r, i) => {
      if (r.tipo === 'ejercicio') lista.push({ donde: `repaso ${id}#${i}`, paso: r, repaso: true });
    });
  }
  return lista;
}

test('los ids de misiones y pasos son únicos', () => {
  const ids = new Set();
  for (const m of misiones) {
    for (const p of pasosEvaluables(m)) {
      assert.ok(p.id, `${m.id} tiene un paso evaluable sin id`);
      assert.ok(!ids.has(p.id), `id repetido: ${p.id}`);
      ids.add(p.id);
    }
  }
});

test('todo concepto referenciado existe y tiene repasos', () => {
  for (const m of misiones) {
    for (const c of m.conceptos ?? []) {
      assert.ok(CATALOGO.conceptos[c], `${m.id} usa el concepto inexistente ${c}`);
      assert.ok(CATALOGO.conceptos[c].repasos.length >= 1, `${c} no tiene repasos`);
    }
    for (const p of pasosEvaluables(m)) {
      if (p.concepto) assert.ok(CATALOGO.conceptos[p.concepto], `${p.id} usa el concepto inexistente ${p.concepto}`);
    }
  }
});

test('cada concepto del catálogo se enseña en alguna misión', () => {
  const ensenados = new Set(misiones.flatMap((m) => m.conceptos ?? []));
  for (const id of Object.keys(CATALOGO.conceptos)) assert.ok(ensenados.has(id), `${id} no se enseña en ninguna misión`);
});

test('los requisitos apuntan a misiones existentes y no hay ciclos', () => {
  const visitar = (id, camino = []) => {
    assert.ok(CATALOGO.misiones[id], `requisito inexistente: ${id}`);
    assert.ok(!camino.includes(id), `ciclo: ${[...camino, id].join(' → ')}`);
    for (const r of CATALOGO.misiones[id].requiere ?? []) visitar(r, [...camino, id]);
  };
  for (const m of misiones) visitar(m.id);
});

test('las misiones duran entre 5 y 13 minutos (incluido su jefe del día) y el jefe del capítulo es más largo', () => {
  for (const m of misiones) {
    const minutos = Number(m.duracion.match(/\d+/)[0]);
    if (m.tipo === 'jefe') assert.ok(minutos >= 15, m.id);
    else assert.ok(minutos >= 5 && minutos <= 13, `${m.id}: ${m.duracion}`);
  }
});

test('las respuestas de quizzes y del test de nivel tienen índices válidos', () => {
  const quizzes = [
    ...misiones.flatMap((m) => pasosEvaluables(m).filter((p) => p.tipo === 'quiz')),
    ...Object.values(CATALOGO.conceptos).flatMap((c) => c.repasos.filter((r) => r.tipo === 'opcion')),
    ...CATALOGO.diagnostico.banco,
  ];
  for (const q of quizzes) {
    assert.ok(Number.isInteger(q.correcta) && q.correcta >= 0 && q.correcta < q.opciones.length, q.pregunta);
    assert.equal(new Set(q.opciones).size, q.opciones.length, `opciones repetidas en: ${q.pregunta}`);
  }
});

test('los repasos de completar aceptan su propia respuesta', () => {
  for (const [id, c] of Object.entries(CATALOGO.conceptos)) {
    for (const r of c.repasos.filter((x) => x.tipo === 'completar')) {
      const ok = validarRespuestaEscrita(String(r.respuesta), r.respuesta, { tipo: r.tipoRespuesta, alternativas: r.alternativas });
      assert.ok(ok.ok, `${id}: ${r.pregunta}`);
    }
  }
});

test('el test de nivel tiene niveles 1..N consecutivos que coinciden con las misiones', () => {
  for (const area of ['python', 'sql']) {
    const niveles = CATALOGO.diagnostico.banco
      .filter((p) => p.area === area)
      .map((p) => p.nivel)
      .sort((a, b) => a - b);
    const deMisiones = misiones
      .filter((m) => m.lenguaje === area)
      .map((m) => m.nivelDiagnostico)
      .sort((a, b) => a - b);
    assert.deepEqual(niveles, deMisiones, area);
  }
});

test('los datos reales usados en el contenido coinciden con los CSV del repositorio', () => {
  const macro = leerCSV(leerDato(ARCHIVOS_DATOS.macro));
  const col = (n) => macro.encabezado.indexOf(n);
  const tbill = macro.filas.filter((f) => (f[0] === '2007' && f[1] === '4') || ['2008', '2009'].includes(f[0])).map((f) => Number(f[col('tbilrate')]));
  const py03 = CATALOGO.misiones['py-03'].pasos.find((p) => p.id === 'py-03-e1');
  assert.ok(py03.inicial.includes(`[${tbill.join(', ')}]`), `tasas esperadas: ${tbill.join(', ')}`);

  const g = leerCSV(leerDato(ARCHIVOS_DATOS.grunfeld));
  const gi = (n) => g.encabezado.indexOf(n);
  const ibm = g.filas.filter((f) => f[gi('firm')] === 'IBM' && Number(f[gi('year')]) >= 1947).map((f) => Number(f[gi('value')]));
  const py04 = CATALOGO.misiones['py-04'].pasos.find((p) => p.id === 'py-04-e1');
  const enContenido = py04.inicial
    .match(/ibm_value = \[(.+?)\]/)[1]
    .split(',')
    .map(Number);
  assert.deepEqual(enContenido, ibm);
});

test('los precios de compra del jefe coinciden con la tabla trades', () => {
  const ops = generarOperaciones();
  const precio = (id) => ops.find((o) => o[0] === id)[6];
  const f5 = CATALOGO.misiones['jefe-cap1'].fases[4].paso.inicial;
  assert.ok(f5.includes(`"CND": (${precio(1)}, 100)`));
  assert.ok(f5.includes(`"QTZ": (${precio(6)}, 300)`));
});

// ---- Ejecución real de cada ejercicio ----

let motores;
test.before(async () => {
  motores = await crearMotores();
});

for (const { donde, paso, repaso } of todosLosEjercicios()) {
  test(`ejercicio ${donde}`, async () => {
    // Reglas de docs/guia-contenido.md: explicación obligatoria y 3 pistas (2 en repasos).
    const problemas = await auditarEjercicio(paso, motores, { minimoPistas: repaso ? 2 : 3 });
    assert.deepEqual(problemas, [], problemas.join('\n'));
  });
}

test('el código de las lecciones se ejecuta sin errores', async () => {
  for (const m of misiones) {
    for (const p of m.pasos ?? []) {
      if (p.tipo !== 'leccion' || !p.codigo) continue;
      if (p.lenguaje === 'python') {
        const r = await motores.python(p.codigo, [], '');
        assert.equal(r.error, null, `${m.id} / ${p.titulo}: ${JSON.stringify(r.error)}`);
      } else if (p.lenguaje === 'sql') {
        const r = await motores.sql(p.db ?? 'fondo', p.codigo);
        assert.equal(r.ok, true, `${m.id} / ${p.titulo}: ${JSON.stringify(r.error)}`);
      }
    }
  }
});
