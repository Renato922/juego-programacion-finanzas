import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO } from '../src/contenido/index.js';
import { crearEstadoInicial, migrar, serializar, deserializar } from '../src/core/estado.js';
import {
  completarMision,
  convalidarMisiones,
  estadoMision,
  siguientePaso,
  rangoDeEstado,
  metaSemanal,
  aplicarRepaso,
  capituloCompleto,
} from '../src/core/progreso.js';
import { crearTest, siguientePregunta, responder, saltarArea, resultadoTest } from '../src/core/diagnostico.js';
import { crearBatalla, resolverFase, notaBatalla } from '../src/core/batalla.js';
import { crearSesion, generarOpciones, resolverOperacion, elegirPotenciador, sesionTerminada, resumenSesion } from '../src/core/entrenamiento.js';
import { mensajeDeRegreso } from '../src/core/regreso.js';
import { crearRng } from '../src/core/rng.js';
import { MS_DIA } from '../src/core/fechas.js';

const T0 = new Date(2026, 9, 12, 10).getTime(); // lunes 12 de octubre de 2026
const limpio = (concepto) => ({ concepto, correcto: true, intentosFallidos: 0, pistas: 0 });

function jugar(estado, id, ahora = T0, desempeno = null) {
  const m = CATALOGO.misiones[id];
  const ejercicios = desempeno ?? (m.tipo === 'jefe' ? m.fases.map((f) => f.paso) : m.pasos).filter((p) => p.concepto).map((p) => limpio(p.concepto));
  return completarMision(estado, m, { ejercicios }, ahora, CATALOGO);
}

test('al inicio solo están disponibles las primeras misiones de cada pista', () => {
  const e = crearEstadoInicial(T0, 1);
  const disponibles = Object.values(CATALOGO.misiones)
    .filter((m) => estadoMision(m, e) === 'disponible')
    .map((m) => m.id);
  assert.deepEqual(disponibles.sort(), ['py-01', 'sql-01']);
});

test('el estado inicial ya tiene progreso dotado (no empieza en cero)', () => {
  const e = crearEstadoInicial(T0, 1);
  assert.ok(e.xp > 0 && e.capital > 0);
});

test('completar una misión paga, crea tarjetas de repaso y desbloquea la siguiente', () => {
  const e0 = crearEstadoInicial(T0, 1);
  const { estado: e1, recompensas } = jugar(e0, 'py-01');
  assert.ok(recompensas.capital >= 1200 * 1.25); // limpia: base + 25% (+ caja)
  assert.equal(e1.xp, e0.xp + 60);
  assert.ok(e1.tarjetas['py.variables'] && e1.tarjetas['py.aritmetica']);
  assert.equal(e1.tarjetas['py.variables'].vence, T0 + MS_DIA);
  assert.equal(estadoMision(CATALOGO.misiones['py-02'], e1), 'disponible');
  assert.equal(e1.estadisticas.totalDiasActivos, 1);
  assert.equal(e0.xp, crearEstadoInicial(T0, 1).xp, 'el estado original no se modifica');
});

test('rejugar paga menos, no abre caja y califica las tarjetas', () => {
  const { estado: e1 } = jugar(crearEstadoInicial(T0, 1), 'py-01');
  const despues = T0 + 2 * MS_DIA;
  const { estado: e2, recompensas } = jugar(e1, 'py-01', despues);
  assert.equal(recompensas.modo, 'repeticion');
  assert.equal(recompensas.caja, null);
  assert.equal(recompensas.capital, Math.round(1200 * 0.25 * 1.25));
  assert.equal(e2.tarjetas['py.variables'].repeticiones, 2);
  assert.equal(e2.misiones['py-01'].veces, 2);
});

test('el jefe exige todas las misiones y su victoria asciende a Analista', () => {
  let e = crearEstadoInicial(T0, 3);
  const jefe = CATALOGO.misiones['jefe-cap1'];
  const orden = ['py-01', 'sql-01', 'py-02', 'sql-02', 'py-03', 'sql-03', 'py-04', 'sql-04', 'py-05', 'sql-05', 'py-06', 'sql-06', 'py-07'];
  for (const id of orden) {
    assert.equal(estadoMision(jefe, e), 'bloqueada', `jefe disponible antes de ${id}`);
    e = jugar(e, id).estado;
  }
  assert.equal(estadoMision(jefe, e), 'disponible');
  assert.equal(rangoDeEstado(e, CATALOGO.rangos).actual.id, 'junior');
  assert.equal(rangoDeEstado(e, CATALOGO.rangos).esperaJefe, true);
  const { estado, recompensas } = jugar(e, 'jefe-cap1');
  assert.equal(recompensas.subioRango?.id, 'analista');
  assert.equal(estado.estadisticas.jefesDerrotados, 1);
  assert.equal(capituloCompleto(CATALOGO.capitulos[0], estado), true);
});

test('el test de nivel salta lo que ya sabes y para en el primer error', () => {
  const { banco, areas } = CATALOGO.diagnostico;
  let t = crearTest(
    banco,
    areas.map((a) => a.id),
  );
  // Python: acierta niveles 1-3 y falla el 4. SQL: lo salta entero. Finanzas: "No lo sé".
  let p;
  while ((p = siguientePregunta(t, banco))) {
    if (p.area === 'python') t = responder(t, p, p.nivel <= 3 ? p.correcta : (p.correcta + 1) % p.opciones.length).test;
    else if (p.area === 'sql') t = saltarArea(t, 'sql');
    else t = responder(t, p, null).test;
  }
  const r = resultadoTest(t, CATALOGO.misiones);
  assert.deepEqual(r.niveles, { python: 3, sql: 0, finanzas: 0 });
  assert.deepEqual(r.convalidadas.sort(), ['py-01', 'py-02', 'py-03']);
  assert.ok(t.respuestas.length <= 6, 'el test es corto');

  const { estado, recompensas } = convalidarMisiones(crearEstadoInicial(T0, 1), r.convalidadas, T0, CATALOGO);
  assert.equal(estadoMision(CATALOGO.misiones['py-04'], estado), 'disponible');
  assert.equal(estado.misiones['py-02'].estado, 'convalidada');
  assert.equal(recompensas.capital, (1200 + 1500 + 1500) / 2);
  assert.equal(estado.tarjetas['py.listas'].vence, T0 + 2 * MS_DIA, 'lo convalidado se repasa pronto');
});

test('siguientePaso: continúa lo pendiente, alterna pistas y propone repaso con poca energía', () => {
  let e = crearEstadoInicial(T0, 1);
  assert.equal(siguientePaso(e, CATALOGO, T0).tipo, 'mision');
  e = jugar(e, 'py-01').estado;
  const paso = siguientePaso(e, CATALOGO, T0);
  assert.equal(paso.misionId, 'sql-01', 'después de Python sugiere SQL');
  e.enCurso = { misionId: 'py-02', paso: 2 };
  assert.equal(siguientePaso(e, CATALOGO, T0).tipo, 'continuar');
  e.enCurso = null;
  e.ajustes.energiaBaja = true;
  assert.equal(siguientePaso(e, CATALOGO, T0 + 2 * MS_DIA).tipo, 'repaso');
});

test('meta semanal cuenta días distintos de la semana actual', () => {
  let e = crearEstadoInicial(T0, 1);
  e = aplicarRepaso(e, 'py.variables', limpio('py.variables'), T0).estado;
  e = aplicarRepaso(e, 'py.variables', limpio('py.variables'), T0 + 1000).estado;
  e = aplicarRepaso(e, 'py.variables', limpio('py.variables'), T0 + MS_DIA).estado;
  assert.deepEqual(metaSemanal(e, T0 + MS_DIA), { hechos: 2, meta: 3, cumplida: false });
  assert.equal(metaSemanal(e, T0 + 7 * MS_DIA).hechos, 0);
  assert.equal(e.estadisticas.totalDiasActivos, 2, 'el total nunca se reinicia');
});

test('batalla: la vida baja por fase y la nota depende de jugar limpio', () => {
  const jefe = CATALOGO.misiones['jefe-cap1'];
  let b = crearBatalla(jefe);
  assert.equal(b.vida, 100);
  const r1 = resolverFase(b, jefe, { correcto: true });
  assert.equal(r1.batalla.vida, 85);
  b = r1.batalla;
  for (let i = 1; i < jefe.fases.length; i++) {
    const r = resolverFase(b, jefe, i === 2 ? { correcto: true, pistas: 1 } : { correcto: true });
    b = r.batalla;
    if (i === jefe.fases.length - 1) assert.equal(r.terminado, true);
  }
  assert.equal(b.vida, 0);
  assert.equal(notaBatalla(b.resultados), 'A');
  assert.equal(notaBatalla(b.resultados.map((x) => ({ ...x, limpio: true }))), 'S');
  assert.equal(notaBatalla(b.resultados.map((x) => ({ ...x, limpio: false }))), 'C');
});

test('entrenamiento: ofrece temas de lenguajes distintos, el combo sube y fallar no quita P&L', () => {
  let e = crearEstadoInicial(T0, 1);
  e = jugar(e, 'py-01').estado;
  e = jugar(e, 'sql-01').estado;
  const rng = crearRng(9);
  let s = crearSesion({ rondas: 4 });
  const ops = generarOpciones(s, e.tarjetas, CATALOGO.conceptos, T0 + 2 * MS_DIA, rng);
  assert.equal(ops.length, 3);
  assert.ok(new Set(ops.map((o) => o.lenguaje)).size >= 2, 'intercala lenguajes');
  assert.ok(
    ops.every((o) => o.vencida && o.valor >= 200),
    'lo vencido paga doble',
  );

  let r = resolverOperacion(s, ops[0], true);
  s = r.sesion;
  const pl1 = s.pl;
  assert.equal(s.combo, 1.5);
  r = resolverOperacion(s, ops[1], true);
  s = r.sesion;
  assert.deepEqual(s.ofertaPotenciador, ['alcista', 'cobertura', 'informacion']);
  s = elegirPotenciador(s, 'cobertura');
  r = resolverOperacion(s, ops[2], false);
  s = r.sesion;
  assert.ok(s.pl >= pl1, 'fallar no resta');
  assert.equal(s.combo, 2, 'la cobertura protege el combo');
  assert.deepEqual(s.revancha, [ops[2].concepto]);
  s = resolverOperacion(s, ops[0], false).sesion;
  assert.equal(s.combo, 1);
  assert.equal(sesionTerminada(s), true);
  assert.equal(resumenSesion(s).aciertos, 2);
});

test('mensaje de regreso: nunca culpa, y el modo compromiso es opcional y se apaga con poca energía', () => {
  const e = crearEstadoInicial(T0, 1);
  e.jugador.nombre = 'Renato';
  assert.equal(mensajeDeRegreso(e, T0 + 1000), null);
  const tras30 = mensajeDeRegreso(e, T0 + 30 * MS_DIA, { vencidas: 9 });
  const texto = tras30.lineas.join(' ');
  assert.match(texto, /Nada se perdió/);
  assert.doesNotMatch(texto, /abandon|decepcion|fallaste|perdiste|culpa/i);
  assert.equal(tras30.compromiso, false);
  assert.equal(tras30.accion.tipo, 'repaso');

  e.ajustes.modoCompromiso = true;
  e.ajustes.motivoPersonal = 'Quiero un mejor trabajo en finanzas';
  const conMotivo = mensajeDeRegreso(e, T0 + 5 * MS_DIA);
  assert.equal(conMotivo.compromiso, true);
  assert.match(conMotivo.lineas.join(' '), /Quiero un mejor trabajo/);
  e.ajustes.energiaBaja = true;
  assert.equal(mensajeDeRegreso(e, T0 + 5 * MS_DIA).compromiso, false);
});

test('el guardado sobrevive serializar/deserializar y migrar completa campos nuevos', () => {
  const { estado } = jugar(crearEstadoInicial(T0, 1), 'py-01');
  const copia = deserializar(serializar(estado), T0);
  assert.deepEqual(copia, estado);
  const viejo = { xp: 500, capital: 10, misiones: { 'py-01': { estado: 'completada' } }, ajustes: { sonido: false } };
  const m = migrar(viejo, T0);
  assert.equal(m.xp, 500);
  assert.equal(m.ajustes.sonido, false);
  assert.equal(m.ajustes.metaSemanal, 3);
  assert.ok(Array.isArray(m.estadisticas.diasActivos));
  assert.equal(deserializar('{no es json', T0), null);
});
