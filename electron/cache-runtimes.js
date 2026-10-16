// Caché de los lenguajes que se descargan (Pyodide).
// La primera vez que el juego pide un archivo, se descarga del CDN y se
// guarda en la carpeta de datos de la app; las siguientes veces se lee del
// disco, así que funciona sin conexión después de la primera descarga.

import fs from 'node:fs';
import path from 'node:path';

export function crearCacheRuntime({ carpeta, cdns, descargar, carpetaLocal = null }) {
  const enCurso = new Map();

  async function obtener(relativo) {
    const destino = path.join(carpeta, relativo);
    if (!destino.startsWith(path.resolve(carpeta))) throw new Error('Ruta inválida');
    try {
      return { datos: await fs.promises.readFile(destino), origen: 'cache' };
    } catch {
      // No está en caché todavía.
    }
    if (carpetaLocal) {
      try {
        return { datos: await fs.promises.readFile(path.join(carpetaLocal, relativo)), origen: 'local' };
      } catch {
        // Tampoco hay copia local: se descarga.
      }
    }
    if (!enCurso.has(relativo)) {
      enCurso.set(
        relativo,
        (async () => {
          let ultimoError = null;
          for (const base of cdns) {
            try {
              const r = await descargar(base + relativo);
              if (!r.ok) {
                ultimoError = new Error(`HTTP ${r.status} en ${base}`);
                continue;
              }
              const datos = Buffer.from(await r.arrayBuffer());
              await fs.promises.mkdir(path.dirname(destino), { recursive: true });
              const temporal = `${destino}.${process.pid}.descarga`;
              await fs.promises.writeFile(temporal, datos);
              await fs.promises.rename(temporal, destino);
              return { datos, origen: base };
            } catch (e) {
              ultimoError = e;
            }
          }
          throw ultimoError ?? new Error('Sin CDN disponible');
        })().finally(() => enCurso.delete(relativo)),
      );
    }
    return enCurso.get(relativo);
  }

  return { obtener };
}
