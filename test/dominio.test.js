// Barra de dominio de las misiones (estilo ALEKS) y vidas de los jefes.

import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO } from '../src/contenido/index.js';
import {
  crearDominio,
  registrarError,
  registrarResuelto,
  nivelDominio,
  dominioCompleto,
  refuerzoActual,
  resolverRefuerzo,
  limpiarPendientes,
} from '../src/core/dominio.js';
import { crearBatalla, perderVida, VIDAS_JUGADOR } from '../src/core/batalla.js';

const mision = CATALOGO.misiones['py-03'];
const evaluables = mision.pasos.map((p, i) => (p.tipo === 'ejercicio' || p.tipo === 'quiz' ? i : -1)).filter((i) => i >= 0);

test('dominio: un segmento por ejercicio o quiz; el jefe del día no cuenta', () => {
  const d = crearDominio(mision);
  assert.equal(d.total, evaluables.length);
  assert.equal(nivelDominio(d), 0);
  assert.ok(mision.pasos.some((p) => p.tipo === 'jefeDia'));
});

test('dominio: equivocarse retrocede un segmento una sola vez por paso y agenda un refuerzo', () => {
  let d = crearDominio(mision);
  d = registrarResuelto(d, evaluables[0]);
  assert.equal(nivelDominio(d), 1);
  const r1 = registrarError(d, evaluables[1], 'py.listas');
  assert.equal(r1.retrocedio, true);
  assert.equal(nivelDominio(r1.dominio), 0, 'la barra retrocede');
  const r2 = registrarError(r1.dominio, evaluables[1], 'py.listas');
  assert.equal(r2.retrocedio, false, 'el mismo paso no cobra dos veces');
  d = registrarResuelto(r2.dominio, evaluables[1]);
  assert.equal(nivelDominio(d), 1);
  assert.equal(d.pendientes.length, 1);
});

test('dominio: el refuerzo es un repaso del mismo concepto y rota si se falla', () => {
  let d = registrarError(crearDominio(mision), evaluables[0], 'py.listas').dominio;
  const repasos = CATALOGO.conceptos['py.listas'].repasos;
  const r1 = refuerzoActual(d, CATALOGO.conceptos);
  assert.equal(r1.concepto, 'py.listas');
  assert.deepEqual({ ...r1.paso, concepto: undefined }, { ...repasos[0], concepto: undefined });
  d = resolverRefuerzo(d, false);
  assert.equal(d.pendientes.length, 1, 'fallar el refuerzo no lo quita');
  const r2 = refuerzoActual(d, CATALOGO.conceptos);
  assert.notDeepEqual(r2.paso, r1.paso, 'se ofrece otro repaso del mismo tema');
  d = resolverRefuerzo(d, true);
  assert.equal(d.pendientes.length, 0);
  assert.equal(refuerzoActual(d, CATALOGO.conceptos), null);
});

test('dominio: completo solo con todos los pasos resueltos y sin refuerzos pendientes', () => {
  let d = crearDominio(mision);
  for (const i of evaluables) d = registrarResuelto(d, i);
  assert.equal(dominioCompleto(d), true);
  d = registrarError(d, evaluables[0], 'py.listas').dominio;
  assert.equal(dominioCompleto(d), false);
  assert.equal(nivelDominio(d), d.total - 1);
  d = resolverRefuerzo(d, true);
  assert.equal(dominioCompleto(d), true);
});

test('dominio: una misión empezada antes de existir la barra se reconstruye desde el paso guardado', () => {
  const d = crearDominio(mision, evaluables[2]);
  assert.equal(nivelDominio(d), 2);
});

test('dominio: los refuerzos de conceptos sin repasos se descartan', () => {
  const d = registrarError(crearDominio(mision), evaluables[0], 'concepto.inexistente').dominio;
  assert.equal(limpiarPendientes(d, CATALOGO.conceptos).pendientes.length, 0);
});

test('cada misión del capítulo 1 tiene un jefe del día de una fase con un rival y textos', () => {
  for (const m of Object.values(CATALOGO.misiones).filter((x) => x.tipo !== 'jefe')) {
    const jefes = m.pasos.filter((p) => p.tipo === 'jefeDia');
    assert.equal(jefes.length, 1, m.id);
    const j = jefes[0];
    assert.equal(j.paso.tipo, 'ejercicio', m.id);
    for (const campo of ['nombre', 'sprite', 'provocacion', 'derrota']) assert.ok(j.jefe[campo], `${m.id}: falta jefe.${campo}`);
    assert.ok(m.pasos.indexOf(j) >= m.pasos.length - 2, `${m.id}: el jefe del día va al final`);
  }
});

test('vidas: el jefe empieza con 3 y cada comprobación fallida cuesta una', () => {
  const jefe = CATALOGO.misiones['jefe-cap1'];
  let b = crearBatalla(jefe);
  assert.equal(b.vidas, VIDAS_JUGADOR);
  assert.equal(VIDAS_JUGADOR, 3);
  let r = perderVida(b);
  assert.equal(r.batalla.vidas, 2);
  assert.equal(b.vidas, 3, 'no muta la batalla original');
  r = perderVida(perderVida(r.batalla).batalla);
  assert.equal(r.sinVidas, true);
  assert.equal(perderVida(r.batalla).batalla.vidas, 0, 'no baja de 0');
  const antigua = { ...crearBatalla(jefe) };
  delete antigua.vidas;
  assert.equal(perderVida(antigua).batalla.vidas, 2, 'las partidas guardadas sin vidas empiezan con 3');
});
