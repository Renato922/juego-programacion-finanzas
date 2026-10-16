import test from 'node:test';
import assert from 'node:assert/strict';
import {
  recompensaMision,
  recompensaRepaso,
  costoMejora,
  puedeComprar,
  efectosDeMejoras,
  invertir,
  retirar,
  tickMercado,
  abrirCajaDividendos,
  perfilDisponible,
  PERFILES_RIESGO,
} from '../src/core/economia.js';
import { crearRng } from '../src/core/rng.js';
import { MEJORAS } from '../src/contenido/mejoras.js';

const recompensa = { capital: 1000, xp: 50 };

test('la recompensa base no se reduce por usar pistas; el bono limpio suma hasta 25%', () => {
  const conPistas = recompensaMision({ recompensa, ejercicios: [{ limpio: false }, { limpio: false }] });
  const limpia = recompensaMision({ recompensa, ejercicios: [{ limpio: true }, { limpio: true }] });
  const mitad = recompensaMision({ recompensa, ejercicios: [{ limpio: true }, { limpio: false }] });
  assert.equal(conPistas.capital, 1000);
  assert.equal(limpia.capital, 1250);
  assert.equal(mitad.capital, 1125);
  assert.equal(conPistas.xp, 50);
});

test('rejugar paga 25% y convalidar 50% (sin bono)', () => {
  assert.equal(recompensaMision({ recompensa, ejercicios: [{ limpio: true }], modo: 'repeticion' }).capital, 313);
  assert.equal(recompensaMision({ recompensa, modo: 'convalidada' }).capital, 500);
  assert.equal(recompensaMision({ recompensa, modo: 'convalidada' }).xp, 25);
});

test('los efectos de las mejoras multiplican capital y XP', () => {
  const efectos = efectosDeMejoras({ monitor: 2, cafetera: 1 }, MEJORAS);
  assert.ok(Math.abs(efectos.multiplicadorCapital - 0.2) < 1e-12);
  assert.ok(Math.abs(efectos.multiplicadorXP - 0.05) < 1e-12);
  const r = recompensaMision({ recompensa, ejercicios: [{ limpio: false }], efectos });
  assert.equal(r.capital, 1200);
  assert.equal(r.xp, 53);
});

test('el costo de las mejoras crece geométricamente y respeta el nivel máximo', () => {
  const monitor = MEJORAS.find((m) => m.id === 'monitor');
  assert.equal(costoMejora(monitor, 0), 1500);
  assert.equal(costoMejora(monitor, 1), 3000);
  assert.equal(costoMejora(monitor, 2), 6000);
  assert.equal(costoMejora(monitor, 3), Infinity);
  assert.equal(puedeComprar(monitor, 3, 1e9).ok, false);
  assert.equal(puedeComprar(monitor, 0, 1499).ok, false);
  assert.deepEqual(puedeComprar(monitor, 0, 1500), { ok: true, costo: 1500 });
});

test('los perfiles de riesgo se desbloquean con la mesa de riesgo', () => {
  assert.equal(perfilDisponible('conservador', {}), true);
  assert.equal(perfilDisponible('balanceado', {}), false);
  assert.equal(perfilDisponible('balanceado', { 'mesa-riesgo': 1 }), true);
  assert.equal(perfilDisponible('agresivo', { 'mesa-riesgo': 1 }), false);
  assert.equal(perfilDisponible('agresivo', { 'mesa-riesgo': 2 }), true);
});

test('invertir y retirar conservan el total (capital + fondo)', () => {
  const fondo0 = { invertido: 0, valor: 0, riesgo: 'conservador', historial: [] };
  const a = invertir(fondo0, 5000, 3000);
  assert.equal(a.capital, 2000);
  assert.equal(a.fondo.valor, 3000);
  const b = invertir(a.fondo, a.capital, 99999); // no puede invertir más de lo que tiene
  assert.equal(b.capital, 0);
  assert.equal(b.fondo.valor, 5000);
  const c = retirar(b.fondo, b.capital, 1000);
  assert.equal(c.capital + c.fondo.valor, 5000);
  assert.equal(c.fondo.invertido, 4000);
});

test('tickMercado: el retorno promedio se acerca a la media del perfil y nunca excede ±3 desvíos', () => {
  const rng = crearRng(42);
  for (const [id, perfil] of Object.entries(PERFILES_RIESGO)) {
    let fondo = { invertido: 1000, valor: 1000, riesgo: id, historial: [] };
    let suma = 0;
    const n = 4000;
    for (let i = 0; i < n; i++) {
      const r = tickMercado(fondo, rng, {}, i);
      assert.ok(r.retorno <= perfil.media + 3 * perfil.desvio + 1e-12);
      assert.ok(r.retorno >= perfil.media - 3 * perfil.desvio - 1e-12);
      suma += r.retorno;
      fondo = { ...r.fondo, valor: 1000 };
    }
    const promedio = suma / n;
    assert.ok(Math.abs(promedio - perfil.media) < perfil.desvio * 0.1, `${id}: promedio ${promedio}`);
    assert.ok(fondo.historial.length <= 200);
  }
});

test('el perfil conservador casi nunca pierde y el agresivo es más volátil', () => {
  const rng = crearRng(7);
  const perdidas = {};
  for (const id of Object.keys(PERFILES_RIESGO)) {
    let n = 0;
    for (let i = 0; i < 2000; i++) {
      if (tickMercado({ invertido: 1, valor: 1, riesgo: id, historial: [] }, rng).retorno < 0) n++;
    }
    perdidas[id] = n / 2000;
  }
  assert.ok(perdidas.conservador < 0.2);
  assert.ok(perdidas.agresivo > perdidas.conservador);
});

test('la caja de dividendos siempre da algo positivo', () => {
  const rng = crearRng(123);
  const tipos = new Set();
  for (let i = 0; i < 500; i++) {
    const caja = abrirCajaDividendos(rng, 1000);
    tipos.add(caja.tipo);
    if (caja.tipo === 'capital') assert.ok(caja.monto >= 100 && caja.monto <= 1000);
  }
  assert.deepEqual([...tipos].sort(), ['capital', 'carta-brillante']);
});

test('los repasos vencidos pagan el doble y un error no quita capital', () => {
  assert.equal(recompensaRepaso({ correcto: true, vencida: false }).capital, 120);
  assert.equal(recompensaRepaso({ correcto: true, vencida: true }).capital, 240);
  assert.equal(recompensaRepaso({ correcto: false, vencida: true }).capital, 0);
});
