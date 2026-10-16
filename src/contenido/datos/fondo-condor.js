// Base de datos del fondo "Cóndor Capital".
//
// Mezcla:
//  - Datos inventados pero realistas de la empresa (activos, precios,
//    clientes y operaciones). Los precios se generan con una semilla fija,
//    así son siempre los mismos.
//  - Datos reales de dominio público (ver datos/FUENTES.md):
//      us_macro  -> macroeconomía de EE. UU. 1959-2009 (FRED / BLS)
//      grunfeld  -> inversión de 11 empresas de EE. UU. 1935-1954
//
// Se construye a partir del texto de los CSV para que funcione igual en el
// juego (fetch) y en las pruebas (lectura de archivo).

import { crearRng } from '../../core/rng.js';

export const ARCHIVOS_DATOS = {
  macro: 'datos/macro_eeuu_fred_1959_2009.csv',
  grunfeld: 'datos/grunfeld_inversion_1935_1954.csv',
};

export const ACTIVOS = [
  ['CND', 'Cóndor Minera', 'Mining', 'Peru', 'stock'],
  ['AND', 'Andes Energía', 'Energy', 'Chile', 'stock'],
  ['PAC', 'Banco Pacífico', 'Banking', 'Colombia', 'stock'],
  ['LLM', 'Llama Retail', 'Retail', 'Peru', 'stock'],
  ['QTZ', 'Quetzal Tech', 'Technology', 'Mexico', 'stock'],
  ['PMP', 'Pampa Agro', 'Agriculture', 'Argentina', 'stock'],
  ['CAF', 'Café Altura', 'Agriculture', 'Colombia', 'stock'],
  ['SOL', 'Sol Utilities', 'Energy', 'Mexico', 'stock'],
  ['BTP', 'Bono Tesoro 2030', 'Government Bonds', 'Peru', 'bond'],
  ['LTM', 'LatAm 40 ETF', 'Diversified', 'Regional', 'etf'],
];

// [precio inicial, retorno medio mensual, volatilidad mensual]
const DINAMICA = {
  CND: [42, 0.012, 0.08],
  AND: [18.5, 0.006, 0.05],
  PAC: [63, 0.008, 0.04],
  LLM: [12.8, -0.004, 0.07],
  QTZ: [95, 0.02, 0.1],
  PMP: [7.4, 0.003, 0.09],
  CAF: [22, 0.005, 0.06],
  SOL: [31, 0.004, 0.03],
  BTP: [98.5, 0.002, 0.006],
  LTM: [54, 0.007, 0.035],
};

export const CLIENTES = [
  [1, 'Lucía Fernández', 'Peru', 'moderate', '2023-03-14'],
  [2, 'Inversiones Ríos SAC', 'Peru', 'aggressive', '2022-11-02'],
  [3, 'Mateo Quispe', 'Bolivia', 'conservative', '2024-01-20'],
  [4, 'Fundación Andina', 'Chile', 'conservative', '2021-06-30'],
  [5, 'Carla Méndez', 'Colombia', 'moderate', '2024-05-08'],
  [6, 'Diego Paredes', null, 'aggressive', '2024-09-15'],
  [7, 'Pensiones del Sur', 'Argentina', 'conservative', '2020-02-11'],
  [8, 'Sofía Rojas', 'Mexico', 'moderate', '2025-10-01'],
];

// [fecha, cliente, ticker, lado, cantidad]
const OPERACIONES = [
  ['2025-01-15', 1, 'CND', 'buy', 100],
  ['2025-01-20', 2, 'PAC', 'buy', 500],
  ['2025-02-03', 3, 'LLM', 'buy', 200],
  ['2025-02-14', 1, 'AND', 'buy', 150],
  ['2025-02-27', 4, 'BTP', 'buy', 1000],
  ['2025-03-05', 2, 'QTZ', 'buy', 300],
  ['2025-03-18', 5, 'CAF', 'buy', 250],
  ['2025-03-28', 1, 'CND', 'sell', 50],
  ['2025-04-08', 6, 'PMP', 'buy', 400],
  ['2025-04-22', 2, 'PAC', 'sell', 200],
  ['2025-05-06', 7, 'LTM', 'buy', 800],
  ['2025-05-19', 3, 'QTZ', 'buy', 120],
  ['2025-05-30', 4, 'SOL', 'buy', 600],
  ['2025-06-10', 2, 'CND', 'buy', 350],
  ['2025-06-24', 1, 'QTZ', 'buy', 80],
  ['2025-07-02', 5, 'CAF', 'sell', 100],
  ['2025-07-15', 7, 'BTP', 'buy', 1500],
  ['2025-07-29', 2, 'AND', 'buy', 220],
  ['2025-08-12', 6, 'PMP', 'sell', 150],
  ['2025-08-26', 1, 'LLM', 'buy', 300],
  ['2025-09-09', 4, 'LTM', 'buy', 500],
  ['2025-09-23', 3, 'LLM', 'sell', 100],
  ['2025-10-07', 2, 'SOL', 'buy', 450],
  ['2025-10-21', 7, 'QTZ', 'buy', 260],
  ['2025-11-04', 1, 'AND', 'sell', 75],
  ['2025-11-18', 5, 'PAC', 'buy', 330],
  ['2025-12-02', 2, 'QTZ', 'sell', 150],
  ['2025-12-16', 4, 'CND', 'buy', 280],
];

const MESES = ['01-31', '02-28', '03-31', '04-30', '05-31', '06-30', '07-31', '08-31', '09-30', '10-31', '11-30', '12-31'].map((d) => `2025-${d}`);

// Precios de cierre mensuales de 2025 (fijos gracias a la semilla).
export function generarPrecios() {
  const rng = crearRng(20250101);
  const precios = [];
  for (const [ticker] of ACTIVOS) {
    const [inicial, media, vol] = DINAMICA[ticker];
    let p = inicial;
    for (const fecha of MESES) {
      p = p * (1 + media + vol * Math.max(-2.5, Math.min(2.5, rng.normal())));
      precios.push([ticker, fecha, Math.round(p * 100) / 100]);
    }
  }
  return precios;
}

export function generarOperaciones(precios = generarPrecios()) {
  const cierre = new Map(precios.map(([t, f, c]) => [`${t}|${f.slice(0, 7)}`, c]));
  return OPERACIONES.map(([fecha, cliente, ticker, lado, cantidad], i) => [
    i + 1,
    fecha,
    cliente,
    ticker,
    lado,
    cantidad,
    cierre.get(`${ticker}|${fecha.slice(0, 7)}`),
  ]);
}

// Lector de CSV mínimo (los archivos de datos no tienen comas dentro de campos).
export function leerCSV(texto) {
  const lineas = texto.trim().split(/\r?\n/);
  const encabezado = lineas[0].split(',').map((c) => c.replace(/"/g, '').trim());
  const filas = lineas.slice(1).map((l) => l.split(',').map((c) => c.replace(/"/g, '').trim()));
  return { encabezado, filas };
}

function sqlValor(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

function insertar(tabla, filas) {
  if (!filas.length) return '';
  return `INSERT INTO ${tabla} VALUES\n${filas.map((f) => `(${f.map(sqlValor).join(', ')})`).join(',\n')};\n`;
}

export function construirSemillaFondo({ macroCSV, grunfeldCSV }) {
  const precios = generarPrecios();
  const operaciones = generarOperaciones(precios);
  let sql = `
CREATE TABLE assets (ticker TEXT PRIMARY KEY, name TEXT, sector TEXT, country TEXT, asset_type TEXT);
CREATE TABLE prices (ticker TEXT, date TEXT, close REAL);
CREATE TABLE clients (client_id INTEGER PRIMARY KEY, name TEXT, country TEXT, risk_profile TEXT, joined TEXT);
CREATE TABLE trades (trade_id INTEGER PRIMARY KEY, trade_date TEXT, client_id INTEGER, ticker TEXT, side TEXT, quantity INTEGER, price REAL);
CREATE TABLE us_macro (year INTEGER, quarter INTEGER, realgdp REAL, realcons REAL, realinv REAL, realgovt REAL, realdpi REAL, cpi REAL, m1 REAL, tbilrate REAL, unemp REAL, pop REAL, infl REAL, realint REAL);
CREATE TABLE grunfeld (firm TEXT, year INTEGER, invest REAL, value REAL, capital REAL);
`;
  sql += insertar('assets', ACTIVOS);
  sql += insertar('prices', precios);
  sql += insertar('clients', CLIENTES);
  sql += insertar('trades', operaciones);

  const macro = leerCSV(macroCSV);
  sql += insertar(
    'us_macro',
    macro.filas.map((f) => f.map(Number)),
  );

  const g = leerCSV(grunfeldCSV);
  const idx = (c) => g.encabezado.indexOf(c);
  sql += insertar(
    'grunfeld',
    g.filas.map((f) => [f[idx('firm')], Number(f[idx('year')]), Number(f[idx('invest')]), Number(f[idx('value')]), Number(f[idx('capital')])]),
  );
  return sql;
}

// Descripción de tablas para el panel de esquema (en español).
export const DESCRIPCION_TABLAS = {
  assets: 'Activos que maneja el fondo (inventado).',
  prices: 'Precios de cierre mensuales de 2025 (inventado).',
  clients: 'Clientes del fondo (inventado).',
  trades: 'Operaciones de compra (buy) y venta (sell) de 2025 (inventado).',
  us_macro: 'Datos reales: macroeconomía de EE. UU. por trimestre, 1959-2009 (FRED/BLS, dominio público).',
  grunfeld: 'Datos reales: inversión y valor de mercado de 11 empresas de EE. UU., 1935-1954 (dominio público).',
};
