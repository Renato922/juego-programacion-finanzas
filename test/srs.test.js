import test from 'node:test';
import assert from 'node:assert/strict';
import {
  tarjetaNueva,
  calificar,
  calidadDesdeDesempeno,
  seleccionarRepaso,
  repartirAtrasadas,
  tarjetasVencidas,
  nivelDominio,
  intercalar,
  FACILIDAD_MINIMA,
} from '../src/core/srs.js';
import { MS_DIA } from '../src/core/fechas.js';

const T0 = Date.UTC(2026, 0, 1, 12);

test('los intervalos crecen con respuestas correctas (1, 3, luego × facilidad)', () => {
  let t = tarjetaNueva('py.listas', T0, { intervaloInicial: 0 });
  t = calificar(t, 5, T0);
  assert.equal(t.intervalo, 1);
  t = calificar(t, 5, T0 + MS_DIA);
  assert.equal(t.intervalo, 3);
  const facilidad = t.facilidad;
  t = calificar(t, 5, T0 + 4 * MS_DIA);
  assert.equal(t.intervalo, Math.round(3 * facilidad));
  assert.equal(t.vence, T0 + 4 * MS_DIA + t.intervalo * MS_DIA);
});

test('un fallo reinicia las repeticiones a 0 e intervalo a 1 día, sin bajar de la facilidad mínima', () => {
  let t = tarjetaNueva('sql.join', T0);
  for (let i = 0; i < 3; i++) t = calificar(t, 5, T0);
  assert.equal(t.repeticiones, 3);
  for (let i = 0; i < 10; i++) t = calificar(t, 1, T0);
  assert.equal(t.repeticiones, 0);
  assert.equal(t.intervalo, 1);
  assert.ok(t.facilidad >= FACILIDAD_MINIMA);
  assert.equal(t.fallos, 10);
});

test('la colección nunca baja de nivel: el dominio usa la mejor racha', () => {
  let t = tarjetaNueva('py.for', T0);
  for (let i = 0; i < 5; i++) t = calificar(t, 5, T0);
  assert.equal(nivelDominio(t), 4);
  t = calificar(t, 0, T0);
  assert.equal(nivelDominio(t), 4);
});

test('calidad desde el desempeño', () => {
  assert.equal(calidadDesdeDesempeno({ correcto: true }), 5);
  assert.equal(calidadDesdeDesempeno({ correcto: true, intentosFallidos: 1 }), 4);
  assert.equal(calidadDesdeDesempeno({ correcto: true, intentosFallidos: 3, pistas: 2 }), 3);
  assert.equal(calidadDesdeDesempeno({ correcto: true, pistaFinal: true }), 2);
  assert.equal(calidadDesdeDesempeno({ correcto: false }), 1);
});

test('no jugar no reduce nada: una tarjeta vencida conserva intervalo y facilidad', () => {
  let t = tarjetaNueva('py.funciones', T0);
  t = calificar(calificar(t, 5, T0), 5, T0);
  const antes = { ...t };
  const muchoDespues = T0 + 400 * MS_DIA;
  assert.equal(tarjetasVencidas({ a: t }, muchoDespues).length, 1);
  assert.deepEqual(t, antes);
});

test('seleccionarRepaso respeta el tope y prioriza las más atrasadas', () => {
  const tarjetas = {};
  for (let i = 0; i < 10; i++) {
    tarjetas[`c${i}`] = { ...tarjetaNueva(`c${i}`, T0), vence: T0 + i * MS_DIA, intervalo: 1 };
  }
  const ahora = T0 + 20 * MS_DIA;
  const sel = seleccionarRepaso(tarjetas, ahora, 3);
  assert.equal(sel.length, 3);
  assert.deepEqual(sel.map((t) => t.concepto).sort(), ['c0', 'c1', 'c2']);
});

test('seleccionarRepaso completa con las más débiles si hay pocas vencidas', () => {
  const tarjetas = {
    a: { ...tarjetaNueva('a', T0), vence: T0 - 1 },
    b: { ...tarjetaNueva('b', T0), vence: T0 + 9 * MS_DIA, facilidad: 1.4 },
    c: { ...tarjetaNueva('c', T0), vence: T0 + 9 * MS_DIA, facilidad: 2.6 },
  };
  const sel = seleccionarRepaso(tarjetas, T0, 2).map((t) => t.concepto);
  assert.deepEqual(sel.sort(), ['a', 'b']);
});

test('intercalar evita dos del mismo lenguaje seguidas cuando se puede', () => {
  const items = ['py1', 'py2', 'py3', 'sql1', 'sql2', 'fin1'].map((id) => ({ id }));
  const grupo = (x) => x.id.replace(/\d/, '');
  const r = intercalar(items, grupo);
  assert.equal(r.length, items.length);
  for (let i = 1; i < r.length; i++) assert.notEqual(grupo(r[i]), grupo(r[i - 1]));
});

test('repartirAtrasadas reparte la pila en varios días sin tocar la fuerza', () => {
  const tarjetas = {};
  for (let i = 0; i < 12; i++) tarjetas[`c${i}`] = { ...tarjetaNueva(`c${i}`, T0), vence: T0 };
  const ahora = T0 + 30 * MS_DIA;
  const r = repartirAtrasadas(tarjetas, ahora, 5);
  assert.equal(tarjetasVencidas(r, ahora).length, 5);
  assert.equal(tarjetasVencidas(r, ahora + MS_DIA).length, 10);
  assert.equal(tarjetasVencidas(r, ahora + 2 * MS_DIA).length, 12);
  for (const id of Object.keys(tarjetas)) {
    assert.equal(r[id].facilidad, tarjetas[id].facilidad);
    assert.equal(r[id].intervalo, tarjetas[id].intervalo);
  }
});
