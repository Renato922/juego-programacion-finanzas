// Genera el ícono del juego (pixel art de una moneda con un cóndor) como
// PNG 256×256 y como .ico para Windows, sin dependencias externas.
// Uso: npm run icono

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Dibujo de 16×16. Cada letra es un color de la paleta.
const DIBUJO = [
  '................',
  '.....oooooo.....',
  '...ooyyyyyyoo...',
  '..oyyyyyyyyyyo..',
  '..oyykkyyykkyo..',
  '.oyykkkkykkkkyo.',
  '.oykkkkkkkkkkko.',
  '.oyyyykwwkyyyyo.',
  '.oyyyykkkkyyyyo.',
  '.oyyyyykkyyyyyo.',
  '.oyyyykkkkyyyyo.',
  '..oyyykyykyyyo..',
  '..oyyyyyyyyyyo..',
  '...ooyyyyyyoo...',
  '.....oooooo.....',
  '................',
];
const PALETA = {
  '.': [0, 0, 0, 0],
  o: [120, 78, 18, 255],
  y: [255, 204, 102, 255],
  k: [26, 26, 46, 255],
  w: [245, 245, 245, 255],
};

function crc32(buf) {
  let c;
  const tabla =
    crc32.tabla ??
    (crc32.tabla = Array.from({ length: 256 }, (_, n) => {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      return c >>> 0;
    }));
  let crc = 0xffffffff;
  for (const b of buf) crc = tabla[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function trozo(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const td = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([largo, td, crc]);
}

function png(tamano) {
  const escala = tamano / 16;
  const filas = [];
  for (let y = 0; y < tamano; y++) {
    const fila = Buffer.alloc(1 + tamano * 4);
    for (let x = 0; x < tamano; x++) {
      const color = PALETA[DIBUJO[Math.floor(y / escala)][Math.floor(x / escala)]];
      Buffer.from(color).copy(fila, 1 + x * 4);
    }
    filas.push(fila);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(tamano, 0);
  ihdr.writeUInt32BE(tamano, 4);
  ihdr[8] = 8; // bits por canal
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo('IHDR', ihdr),
    trozo('IDAT', zlib.deflateSync(Buffer.concat(filas))),
    trozo('IEND', Buffer.alloc(0)),
  ]);
}

// ICO con imágenes PNG embebidas (válido desde Windows Vista).
function ico(tamanos) {
  const imagenes = tamanos.map(png);
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(imagenes.length, 4);
  let desplazamiento = 6 + 16 * imagenes.length;
  const entradas = imagenes.map((img, i) => {
    const e = Buffer.alloc(16);
    e[0] = tamanos[i] >= 256 ? 0 : tamanos[i];
    e[1] = tamanos[i] >= 256 ? 0 : tamanos[i];
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(img.length, 8);
    e.writeUInt32LE(desplazamiento, 12);
    desplazamiento += img.length;
    return e;
  });
  return Buffer.concat([cabecera, ...entradas, ...imagenes]);
}

fs.mkdirSync(path.join(RAIZ, 'build'), { recursive: true });
fs.mkdirSync(path.join(RAIZ, 'src', 'recursos'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'build', 'icon.png'), png(256));
fs.writeFileSync(path.join(RAIZ, 'build', 'icon.ico'), ico([16, 32, 48, 64, 128, 256]));
fs.writeFileSync(path.join(RAIZ, 'src', 'recursos', 'icono.png'), png(64));
console.log('Íconos generados en build/ y src/recursos/');
