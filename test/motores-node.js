// Motores de ejecución para las pruebas: los mismos que usa el juego
// (Pyodide y sql.js), pero cargados en Node desde node_modules.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs from 'sql.js';
import { CODIGO_HARNESS, ejecutarConPyodide } from '../src/core/harness-python.js';
import { crearPlantillaBD, ejecutarSQL } from '../src/core/ejecutor-sql.js';
import { construirSemillaFondo, ARCHIVOS_DATOS } from '../src/contenido/datos/fondo-condor.js';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function leerDato(relativo) {
  return fs.readFileSync(path.join(RAIZ, relativo), 'utf8');
}

let motoresSQL = null;
export async function crearMotorSQL() {
  if (motoresSQL) return motoresSQL;
  const SQL = await initSqlJs();
  const semilla = construirSemillaFondo({
    macroCSV: leerDato(ARCHIVOS_DATOS.macro),
    grunfeldCSV: leerDato(ARCHIVOS_DATOS.grunfeld),
  });
  const plantillas = { fondo: crearPlantillaBD(SQL, semilla) };
  motoresSQL = async (db, consulta) => ejecutarSQL(SQL, plantillas[db], consulta);
  return motoresSQL;
}

let motorPython = null;
export async function crearMotorPython() {
  if (motorPython) return motorPython;
  const { loadPyodide } = await import('pyodide');
  const pyodide = await loadPyodide();
  pyodide.runPython(CODIGO_HARNESS);
  motorPython = async (codigo, sondas, preludio) => ejecutarConPyodide(pyodide, codigo, sondas, preludio);
  return motorPython;
}

export async function crearMotores({ python = true } = {}) {
  return {
    sql: await crearMotorSQL(),
    python: python ? await crearMotorPython() : null,
  };
}
