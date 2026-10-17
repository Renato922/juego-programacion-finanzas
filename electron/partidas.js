// Ranuras de partida en el disco (escritorio). Cada ranura es un archivo
// JSON en la carpeta de datos del juego, con copia .bak de la versión
// anterior. La partida guardada antes de existir las ranuras
// (partida/progreso.json) se lee como ranura 1, así que nadie pierde nada.

import fs from 'node:fs';
import path from 'node:path';

export const RANURAS = 3;
const MAXIMO_BYTES = 20_000_000;

export function numeroValido(n) {
  return Number.isInteger(n) && n >= 1 && n <= RANURAS;
}

export function archivoRanura(carpeta, n) {
  if (!numeroValido(n)) throw new Error(`Ranura inválida: ${n}`);
  return path.join(carpeta, `ranura-${n}.json`);
}

async function leerPrimero(archivos) {
  for (const a of archivos) {
    try {
      return await fs.promises.readFile(a, 'utf8');
    } catch {
      // Sigue con el siguiente.
    }
  }
  return null;
}

export async function leerRanura(carpeta, n) {
  const archivo = archivoRanura(carpeta, n);
  const candidatos = [archivo, archivo + '.bak'];
  if (n === 1) candidatos.push(path.join(carpeta, 'progreso.json'), path.join(carpeta, 'progreso.json.bak'));
  return leerPrimero(candidatos);
}

// Escribe en un temporal y lo renombra: un corte de luz no deja el archivo a medias.
export async function escribirSeguro(archivo, texto) {
  await fs.promises.mkdir(path.dirname(archivo), { recursive: true });
  const temporal = archivo + '.tmp';
  await fs.promises.writeFile(temporal, texto, 'utf8');
  try {
    await fs.promises.copyFile(archivo, archivo + '.bak');
  } catch {
    // Primera vez: no hay copia anterior.
  }
  await fs.promises.rename(temporal, archivo);
}

export async function guardarRanura(carpeta, n, texto) {
  if (typeof texto !== 'string' || texto.length > MAXIMO_BYTES) return false;
  await escribirSeguro(archivoRanura(carpeta, n), texto);
  return true;
}

// Borrar no destruye: la partida se mueve a ranura-N.borrada.json (se puede
// recuperar a mano) y deja de aparecer en el juego.
export async function borrarRanura(carpeta, n) {
  const archivo = archivoRanura(carpeta, n);
  const extras = [archivo + '.bak'];
  if (n === 1) extras.push(path.join(carpeta, 'progreso.json'), path.join(carpeta, 'progreso.json.bak'));
  try {
    await fs.promises.rename(archivo, path.join(carpeta, `ranura-${n}.borrada.json`));
  } catch {
    // No existía.
  }
  for (const e of extras) await fs.promises.rm(e, { force: true });
  return true;
}
