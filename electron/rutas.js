// Traduce las rutas del juego (app://juego/...) a archivos del disco.
// Lo comparten el proceso principal de Electron y el servidor de desarrollo
// (scripts/servidor-dev.js), para que ambos sirvan exactamente lo mismo.

import path from 'node:path';

const MONTAJES = [
  ['/vendor/codemirror/', 'node_modules/codemirror/'],
  ['/vendor/sql.js/', 'node_modules/sql.js/dist/'],
  ['/vendor/fuentes/press-start-2p/', 'node_modules/@fontsource/press-start-2p/files/'],
  ['/vendor/fuentes/vt323/', 'node_modules/@fontsource/vt323/files/'],
  ['/datos/', 'datos/'],
];

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.wasm': 'application/wasm',
  '.zip': 'application/zip',
  '.whl': 'application/zip',
  '.tar': 'application/x-tar',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

export function tipoMime(archivo) {
  return TIPOS[path.extname(archivo).toLowerCase()] ?? 'application/octet-stream';
}

// Une base + relativo sin permitir salir de la base (../).
function dentroDe(carpeta, relativo) {
  const base = path.resolve(carpeta);
  const destino = path.resolve(base, '.' + path.posix.normalize('/' + relativo));
  return destino === base || destino.startsWith(base + path.sep) ? destino : null;
}

// Devuelve { archivo } o { runtime, relativo } o null.
export function resolverRuta(raiz, pathname) {
  let p = pathname || '/';
  if (p === '/' || p === '/index.html') return { archivo: path.join(raiz, 'src', 'index.html') };
  if (p.startsWith('/runtime/pyodide/')) {
    const relativo = path.posix.normalize(p.slice('/runtime/pyodide/'.length));
    if (relativo.startsWith('..') || relativo.includes('\0')) return null;
    return { runtime: 'pyodide', relativo };
  }
  for (const [prefijo, carpeta] of MONTAJES) {
    if (p.startsWith(prefijo)) {
      const archivo = dentroDe(path.join(raiz, carpeta), p.slice(prefijo.length));
      return archivo ? { archivo } : null;
    }
  }
  const archivo = dentroDe(path.join(raiz, 'src'), p);
  return archivo ? { archivo } : null;
}
