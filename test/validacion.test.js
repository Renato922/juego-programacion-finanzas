import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compararValores,
  validarPython,
  validarSQL,
  parsearNumero,
  validarRespuestaEscrita,
  construirSondas,
  quitarComentarios,
  formatearValor,
} from '../src/core/validacion.js';
import { traducirErrorPython, traducirErrorSQL } from '../src/core/errores.js';
import { evaluarEjercicio } from '../src/core/evaluador.js';
import { crearMotores } from './motores-node.js';

const num = (v) => ({ t: Number.isInteger(v) ? 'int' : 'float', v });
const str = (v) => ({ t: 'str', v });
const lista = (...v) => ({ t: 'list', v });

test('compararValores: números con tolerancia, int y float equivalentes', () => {
  assert.equal(compararValores(num(0.1 + 0.2), num(0.3)), null);
  assert.equal(compararValores({ t: 'float', v: 30000 }, { t: 'int', v: 30000 }), null);
  assert.match(compararValores(num(100), num(101)), /mayor/);
  assert.equal(compararValores(num(8954.24), num(8954.238), { tol: 0.005 }), null);
});

test('compararValores: tipos distintos dan un mensaje útil', () => {
  const m = compararValores(num(30000), str('30000'));
  assert.match(m, /texto/);
  assert.match(m, /comillas/);
});

test('compararValores: listas, tuplas y diccionarios', () => {
  assert.equal(compararValores(lista(num(1), num(2)), { t: 'tuple', v: [num(1), num(2)] }), null);
  assert.match(compararValores(lista(num(1), num(2)), lista(num(1))), /cantidad de elementos/);
  const d1 = {
    t: 'dict',
    v: [
      [str('A'), num(0.5)],
      [str('B'), num(0.5)],
    ],
  };
  const d2 = {
    t: 'dict',
    v: [
      [str('B'), num(0.5)],
      [str('A'), num(0.5)],
    ],
  };
  assert.equal(compararValores(d1, d2), null);
  const d3 = {
    t: 'dict',
    v: [
      [str('A'), num(0.5)],
      [str('C'), num(0.5)],
    ],
  };
  assert.match(compararValores(d1, d3), /falta la clave 'B'/);
});

test('formatearValor imita la representación de Python', () => {
  assert.equal(formatearValor({ t: 'float', v: 3000 }), '3000.0');
  assert.equal(formatearValor(lista(str('low'), { t: 'bool', v: true })), "['low', True]");
});

test('validarPython: detecta variable faltante, error de ejecución y verificación de código', () => {
  const verificar = [
    { tipo: 'variable', nombre: 'x' },
    { tipo: 'codigoIncluye', patron: '\\bfor\\b', mensaje: 'Usa for.' },
  ];
  const ref = { stdout: '', error: null, sondas: { 'var:x': { ok: true, valor: num(3) } } };
  const sinVariable = validarPython({
    verificar,
    codigo: 'y = 3',
    resUsuario: { stdout: '', error: null, sondas: { 'var:x': { ok: false, falta: true } } },
    resReferencia: ref,
  });
  assert.equal(sinVariable.ok, false);
  assert.match(sinVariable.fallas[0].mensaje, /No encontré la variable x/);
  assert.equal(sinVariable.fallas[1].mensaje, 'Usa for.');
  const conError = validarPython({
    verificar,
    codigo: 'x = y',
    resUsuario: { stdout: '', error: { tipo: 'NameError', mensaje: "name 'y' is not defined", linea: 1 }, sondas: {} },
    resReferencia: ref,
  });
  assert.equal(conError.ok, false);
  assert.equal(conError.error.titulo, 'Nombre no definido');
  // Un "for" dentro de un comentario no cuenta.
  const comentario = validarPython({ verificar, codigo: 'x = 3  # sin for', resUsuario: ref, resReferencia: ref });
  assert.equal(comentario.ok, false);
});

test('quitarComentarios en Python y SQL', () => {
  assert.equal(quitarComentarios('x = 1  # for', 'python').trim(), 'x = 1');
  assert.equal(quitarComentarios('SELECT 1 -- JOIN', 'sql').trim(), 'SELECT 1');
});

test('validarSQL: columnas, filas, orden y tolerancia', () => {
  const ref = {
    ok: true,
    columnas: ['side', 'total'],
    filas: [
      ['buy', 10.0],
      ['sell', 2.5],
    ],
  };
  const igualOtroOrden = {
    ok: true,
    columnas: ['side', 'SUM(x)'],
    filas: [
      ['sell', 2.5],
      ['buy', 10],
    ],
  };
  assert.equal(validarSQL({ resUsuario: igualOtroOrden, resReferencia: ref }).ok, true);
  const conOrden = validarSQL({ resUsuario: igualOtroOrden, resReferencia: ref, opciones: { ordenImporta: true } });
  assert.equal(conOrden.ok, false);
  assert.match(conOrden.fallas[0].mensaje, /el orden no/);
  const nombres = validarSQL({ resUsuario: igualOtroOrden, resReferencia: ref, opciones: { nombresColumnas: true } });
  assert.equal(nombres.ok, false);
  const menosCols = validarSQL({ resUsuario: { ok: true, columnas: ['side'], filas: [['buy'], ['sell']] }, resReferencia: ref });
  assert.match(menosCols.fallas[0].mensaje, /1 columna/);
  const redondeo = { ok: true, columnas: ['a'], filas: [[5.88]] };
  assert.equal(validarSQL({ resUsuario: { ok: true, columnas: ['a'], filas: [[5.8812]] }, resReferencia: redondeo, opciones: { tol: 0.005 } }).ok, true);
  const err = validarSQL({ resUsuario: { ok: false, error: { mensaje: 'no such column: sid' } }, resReferencia: ref });
  assert.equal(err.error.titulo, 'Columna inexistente');
});

test('parsearNumero entiende formatos en español e inglés', () => {
  assert.equal(parsearNumero('1,234.56'), 1234.56);
  assert.equal(parsearNumero('1.234,56'), 1234.56);
  assert.equal(parsearNumero('12,5'), 12.5);
  assert.equal(parsearNumero('0,05'), 0.05);
  assert.equal(parsearNumero('$ 3 000'), 3000);
  assert.equal(parsearNumero('12%'), 0.12);
  assert.equal(parsearNumero('-0.5'), -0.5);
  assert.ok(Number.isNaN(parsearNumero('hola')));
});

test('validarRespuestaEscrita: número con ambigüedad de coma, escala y texto', () => {
  assert.equal(validarRespuestaEscrita('2205', 2205).ok, true);
  assert.equal(validarRespuestaEscrita('2.205,00', 2205).ok, true);
  assert.equal(validarRespuestaEscrita('1,234', 1.234, { tipo: 'numero' }).ok, true); // leído como decimal
  assert.equal(validarRespuestaEscrita('1,234', 1234, { tipo: 'numero' }).ok, true); // leído como miles
  const escala = validarRespuestaEscrita('12.5', 0.125, { tipo: 'numero' });
  assert.equal(escala.ok, false);
  assert.match(escala.mensaje, /escala/);
  assert.equal(validarRespuestaEscrita(' as ', 'AS').ok, true);
  assert.equal(validarRespuestaEscrita('len(prices)-3:', '-3:', { alternativas: ['len(prices)-3:'] }).ok, true);
});

test('traducción de errores con pistas específicas', () => {
  const xor = traducirErrorPython({ tipo: 'TypeError', mensaje: "unsupported operand type(s) for ^: 'float' and 'int'" });
  assert.match(xor.consejo, /\*\*/);
  assert.match(traducirErrorPython({ tipo: 'NameError', mensaje: "name 'rate' is not defined" }).consejo, /"rate"/);
  assert.equal(traducirErrorSQL({ mensaje: 'near "FORM": syntax error' }).titulo, 'Error de sintaxis');
  assert.equal(traducirErrorPython({ tipo: 'Timeout', mensaje: '' }).titulo, 'Tu código tardó demasiado');
});

test('construirSondas genera una sonda por variable, expresión y caso de función', () => {
  const s = construirSondas([{ tipo: 'variable', nombre: 'a' }, { tipo: 'funcion', nombre: 'f', casos: [[1], [2]] }, { tipo: 'salida' }]);
  assert.deepEqual(
    s.map((x) => x.clave),
    ['var:a', 'var:f', 'f:f:0', 'f:f:1'],
  );
});

// Integración con los motores reales (Pyodide y sql.js en Node).
test('integración: el arnés de Python acepta soluciones distintas pero correctas', async () => {
  const motores = await crearMotores();
  const paso = {
    lenguaje: 'python',
    solucion: 'def pv(fv, r, n):\n    return fv / (1 + r) ** n',
    verificar: [
      {
        tipo: 'funcion',
        nombre: 'pv',
        casos: [
          [1000, 0.1, 1],
          [500, 0.05, 2],
        ],
      },
    ],
  };
  const otra = await evaluarEjercicio(paso, 'def pv(fv, r, n):\n    factor = (1 + r) ** n\n    return fv * (1 / factor)', motores);
  assert.equal(otra.ok, true, JSON.stringify(otra.fallas));
  const sinReturn = await evaluarEjercicio(paso, 'def pv(fv, r, n):\n    x = fv / (1 + r) ** n', motores);
  assert.equal(sinReturn.ok, false);
  assert.match(sinReturn.fallas[0].mensaje, /return/);
  const sintaxis = await evaluarEjercicio(paso, 'def pv(fv, r, n)\n    return 1', motores);
  assert.equal(sintaxis.error.tipo ?? sintaxis.error.titulo, 'Error de sintaxis');
  const input = await evaluarEjercicio(paso, 'x = input("?")', motores);
  assert.equal(input.ok, false);
});

test('integración: la salida impresa se captura y se compara', async () => {
  const motores = await crearMotores();
  const paso = { lenguaje: 'python', solucion: 'r = 0.125\nprint(f"Rendimiento: {r:.2%}")', verificar: [{ tipo: 'salida', modo: 'exacta' }] };
  assert.equal((await evaluarEjercicio(paso, 'print("Rendimiento: 12.50%")', motores)).ok, true);
  const mal = await evaluarEjercicio(paso, 'print("Rendimiento: 12.5%")', motores);
  assert.equal(mal.ok, false);
  assert.equal(mal.fallas[0].esperado, 'Rendimiento: 12.50%');
});

test('integración: SQL compara contra la consulta de referencia sobre la base del fondo', async () => {
  const motores = await crearMotores({ python: false });
  const paso = { lenguaje: 'sql', db: 'fondo', solucion: "SELECT COUNT(*) FROM trades WHERE side = 'sell';", opciones: {} };
  assert.equal((await evaluarEjercicio(paso, "select count(trade_id) from trades where side='sell'", motores)).ok, true);
  assert.equal((await evaluarEjercicio(paso, 'SELECT COUNT(*) FROM trades', motores)).ok, false);
  const destructivo = await evaluarEjercicio(paso, 'DROP TABLE trades;', motores);
  assert.equal(destructivo.ok, false);
  // La base se recrea en cada ejecución: el DROP anterior no afecta.
  assert.equal((await evaluarEjercicio(paso, "SELECT COUNT(*) FROM trades WHERE side = 'sell'", motores)).ok, true);
});
