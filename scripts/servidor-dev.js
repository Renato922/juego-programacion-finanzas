// Servidor de desarrollo: abre el juego en un navegador común
// (http://localhost:5178). Sirve exactamente las mismas rutas que Electron.
// Pyodide se sirve desde node_modules/pyodide (instalado con npm install),
// así no hace falta descargarlo del CDN.
//
// Uso: npm run web

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolverRuta, tipoMime } from '../electron/rutas.js';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUERTO = Number(process.env.PUERTO ?? 5178);

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const ruta = resolverRuta(RAIZ, decodeURIComponent(url.pathname));
  let archivo = ruta?.archivo;
  if (ruta?.runtime === 'pyodide') archivo = path.join(RAIZ, 'node_modules', 'pyodide', ruta.relativo);
  if (!archivo) {
    res.writeHead(404).end('No encontrado');
    return;
  }
  try {
    const datos = await fs.promises.readFile(archivo);
    res.writeHead(200, { 'content-type': tipoMime(archivo), 'cache-control': 'no-store' }).end(datos);
  } catch {
    res.writeHead(404).end('No encontrado');
  }
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log(`Cóndor Capital (modo navegador): http://localhost:${PUERTO}`);
});
