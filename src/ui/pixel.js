// Pixel art dibujado por código: retratos 16×16, íconos y la oficina.
// Todo se dibuja en lienzos de baja resolución y se escala con CSS
// (image-rendering: pixelated) para el look retro.

const RETRATOS = {
  jugador: { piel: '#e0ac69', pelo: '#2b1d14', estilo: 'corto', ropa: '#2f6f8f', detalle: '#9fd3e6', accesorio: 'audifonos' },
  marta: { piel: '#c68642', pelo: '#3b2314', estilo: 'largo', ropa: '#8c3b2f', detalle: '#f6ad55', accesorio: 'collar' },
  bruno: { piel: '#f1c27d', pelo: '#7a4a1e', estilo: 'peinado', ropa: '#1f3b73', detalle: '#63b3ed', accesorio: 'corbata' },
  aurelio: { piel: '#d9a066', pelo: '#d8d8d8', estilo: 'canoso', ropa: '#3c2a5a', detalle: '#d6bcfa', accesorio: 'corbata' },
  valdivia: { piel: '#e8b88a', pelo: '#111111', estilo: 'mono', ropa: '#4a1020', detalle: '#fc8181', accesorio: 'lentes' },
  becario: { piel: '#a8754f', pelo: '#1a1a1a', estilo: 'corto', ropa: '#3f6e3a', detalle: '#b5e3a1', accesorio: null },
};

function lienzo(ancho, alto) {
  const c = document.createElement('canvas');
  c.width = ancho;
  c.height = alto;
  c.className = 'pixel';
  return c;
}

function rect(ctx, color, x, y, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function dibujarRetrato(ctx, id, ox = 0, oy = 0, { parpadeo = false, boca = 0 } = {}) {
  const p = RETRATOS[id] ?? RETRATOS.jugador;
  const r = (c, x, y, w, h) => rect(ctx, c, ox + x, oy + y, w, h);
  // Torso
  r(p.ropa, 2, 12, 12, 4);
  r(p.ropa, 3, 11, 10, 1);
  r(p.piel, 7, 11, 2, 1); // cuello
  r(p.detalle, 6, 12, 1, 1);
  r(p.detalle, 9, 12, 1, 1);
  if (p.accesorio === 'corbata') {
    r(p.detalle, 7, 12, 2, 1);
    r(p.detalle, 7, 13, 2, 3);
  }
  if (p.accesorio === 'collar') r('#ffd36e', 6, 12, 4, 1);
  // Cabeza
  r(p.piel, 4, 4, 8, 7);
  r(p.piel, 5, 3, 6, 1);
  r(p.piel, 3, 6, 1, 3); // orejas
  r(p.piel, 12, 6, 1, 3);
  // Pelo según estilo
  const pelo = p.pelo;
  if (p.estilo === 'corto' || p.estilo === 'peinado') {
    r(pelo, 4, 2, 8, 2);
    r(pelo, 4, 4, 1, 2);
    r(pelo, 11, 4, 1, 2);
    if (p.estilo === 'peinado') r(pelo, 8, 1, 4, 1);
  } else if (p.estilo === 'largo') {
    r(pelo, 4, 2, 8, 2);
    r(pelo, 3, 3, 2, 9);
    r(pelo, 11, 3, 2, 9);
  } else if (p.estilo === 'canoso') {
    r(pelo, 3, 4, 2, 3);
    r(pelo, 11, 4, 2, 3);
    r(pelo, 5, 2, 6, 1);
    r('#b9b9b9', 6, 9, 4, 1); // bigote
  } else if (p.estilo === 'mono') {
    r(pelo, 4, 2, 8, 2);
    r(pelo, 4, 4, 1, 2);
    r(pelo, 11, 4, 1, 2);
    r(pelo, 6, 0, 4, 2); // moño
  }
  // Ojos
  if (!parpadeo) {
    r('#1a1a2e', 6, 7, 1, 1);
    r('#1a1a2e', 9, 7, 1, 1);
  } else {
    r('#00000055', 6, 7, 1, 1);
    r('#00000055', 9, 7, 1, 1);
  }
  if (p.accesorio === 'lentes') {
    r('#fc8181', 5, 6, 3, 1);
    r('#fc8181', 8, 6, 3, 1);
    r('#fc8181', 5, 7, 1, 1);
    r('#fc8181', 10, 7, 1, 1);
  }
  if (p.accesorio === 'audifonos') {
    r('#444c66', 3, 5, 1, 3);
    r('#444c66', 12, 5, 1, 3);
    r('#444c66', 4, 1, 8, 1);
  }
  // Boca
  r('#8a3b3b', 7, 9, 2, boca ? 1 : 1);
  if (boca) r('#5a1f1f', 7, 10, 2, 1);
}

export function retrato(id, { animado = true } = {}) {
  const c = lienzo(16, 16);
  const ctx = c.getContext('2d');
  dibujarRetrato(ctx, id);
  if (animado) {
    let t = 0;
    const intervalo = setInterval(() => {
      if (!c.isConnected) return clearInterval(intervalo);
      t++;
      ctx.clearRect(0, 0, 16, 16);
      dibujarRetrato(ctx, id, 0, 0, { parpadeo: t % 25 === 0 });
    }, 160);
  }
  return c;
}

// Íconos 16×16 por lenguaje para cartas y chips.
export function iconoLenguaje(lenguaje) {
  const c = lienzo(16, 16);
  const ctx = c.getContext('2d');
  const r = (col, x, y, w = 1, hh = 1) => rect(ctx, col, x, y, w, hh);
  if (lenguaje === 'python') {
    r('#3d7ab8', 3, 2, 6, 6);
    r('#ffd43b', 7, 8, 6, 6);
    r('#3d7ab8', 3, 8, 4, 2);
    r('#ffd43b', 9, 6, 4, 2);
    r('#fff', 5, 3, 1, 1);
    r('#fff', 10, 12, 1, 1);
  } else if (lenguaje === 'sql') {
    r('#cc7d26', 3, 3, 10, 2);
    r('#ffc773', 3, 5, 10, 8);
    r('#cc7d26', 3, 7, 10, 1);
    r('#cc7d26', 3, 10, 10, 1);
    r('#cc7d26', 3, 13, 10, 1);
  } else {
    r('#b8860b', 4, 2, 8, 12);
    r('#b8860b', 2, 4, 12, 8);
    r('#ffd36e', 5, 3, 6, 10);
    r('#ffd36e', 3, 5, 10, 6);
    r('#b8860b', 7, 4, 2, 8);
    r('#b8860b', 6, 5, 4, 1);
    r('#b8860b', 6, 10, 4, 1);
  }
  return c;
}

// Cofre de la caja de dividendos (cerrado / abierto).
export function cofre(abierto = false) {
  const c = lienzo(16, 16);
  const ctx = c.getContext('2d');
  const r = (col, x, y, w = 1, hh = 1) => rect(ctx, col, x, y, w, hh);
  r('#6b3f1d', 2, 7, 12, 7);
  r('#8b5a2b', 3, 8, 10, 5);
  r('#ffd36e', 7, 9, 2, 2);
  if (abierto) {
    r('#6b3f1d', 2, 3, 12, 3);
    r('#ffe08a', 4, 5, 8, 2);
    r('#fff6c8', 6, 4, 1, 1);
    r('#fff6c8', 9, 3, 1, 1);
  } else {
    r('#6b3f1d', 2, 5, 12, 3);
    r('#a06a35', 3, 5, 10, 1);
  }
  return c;
}

// ---------- Oficina ----------

const ANCHO = 192;
const ALTO = 108;

export function crearEscenaOficina(estado, { animado = true } = {}) {
  const c = lienzo(ANCHO, ALTO);
  c.classList.add('escena');
  const ctx = c.getContext('2d');
  let t = 0;
  const dibujar = () => dibujarOficina(ctx, estado, t);
  dibujar();
  if (animado) {
    const intervalo = setInterval(() => {
      if (!c.isConnected) return clearInterval(intervalo);
      t++;
      dibujar();
    }, 200);
  }
  c.setAttribute('role', 'img');
  c.setAttribute('aria-label', 'Tu oficina en Cóndor Capital');
  return c;
}

function dibujarOficina(ctx, estado, t) {
  const m = estado.mejoras ?? {};
  const nivelOficina = m.oficina ?? 0;
  const r = (col, x, y, w = 1, hh = 1) => rect(ctx, col, x, y, w, hh);
  // Pared y piso
  const paredes = ['#1b2440', '#23304f', '#2a2342', '#14233a'];
  r(paredes[nivelOficina], 0, 0, ANCHO, 72);
  for (let x = 0; x < ANCHO; x += 8) {
    for (let y = 72; y < ALTO; y += 8) r(((x + y) / 8) % 2 ? '#3a2f2a' : '#433630', x, y, 8, 8);
  }
  r('#0e1428', 0, 70, ANCHO, 2);

  // Ventanas: más grandes con cada expansión
  const ventanas = [
    [12, 10, 40, 34],
    [12, 8, 70, 40],
    [8, 6, 110, 46],
    [6, 4, 180, 52],
  ][nivelOficina];
  const [vx, vy, vw, vh] = ventanas;
  r('#0b0f20', vx - 2, vy - 2, vw + 4, vh + 4);
  r(nivelOficina >= 3 ? '#1d1840' : '#28406e', vx, vy, vw, vh);
  // Estrellas / sol
  r('#ffe08a', vx + vw - 10, vy + 4, 3, 3);
  // Ciudad
  for (let i = 0; i < vw; i += 6) {
    const alto = 8 + ((i * 37) % 19);
    r('#0f1730', vx + i, vy + vh - alto, 5, alto);
    if ((i + t) % 7 === 0) r('#ffd36e', vx + i + 2, vy + vh - alto + 3, 1, 1);
    else r('#3b4f7a', vx + i + 2, vy + vh - alto + 3, 1, 1);
  }
  // Marco
  r('#4a5a85', vx + Math.floor(vw / 2), vy, 1, vh);

  // Terminal grande en la pared
  if ((m.terminal ?? 0) > 0) {
    const tx = 120;
    r('#05080f', tx, 10, 60, 32);
    r('#2a3a63', tx - 1, 9, 62, 1);
    const historial = estado.fondo?.historial ?? [];
    const valores = historial.slice(-28).map((p) => p.valor);
    if (valores.length > 1) {
      const min = Math.min(...valores);
      const max = Math.max(...valores);
      valores.forEach((v, i) => {
        const y = 38 - Math.round(((v - min) / (max - min || 1)) * 24);
        r('#21a571', tx + 2 + i * 2, y, 2, 1);
      });
    } else {
      for (let i = 0; i < 28; i++) r('#21a571', tx + 2 + i * 2, 26 + Math.round(Math.sin((i + t) / 3) * 6), 2, 1);
    }
    r(t % 2 ? '#7cffb2' : '#05080f', tx + 56, 38, 2, 2);
  }

  // Pizarra de la mesa de riesgo
  if ((m['mesa-riesgo'] ?? 0) > 0) {
    r('#d9dde8', 66, 14, 34, 24);
    r('#8a8f9c', 65, 13, 36, 1);
    r('#cc3b3b', 69, 30, 8, 1);
    r('#cc3b3b', 77, 24, 6, 1);
    r('#2e6bd6', 83, 20, 8, 1);
    r('#2e6bd6', 70, 18, 1, 14);
    r('#2e6bd6', 70, 32, 26, 1);
  }

  // Escritorio y monitores
  r('#5b3b24', 54, 62, 84, 6);
  r('#3f2818', 58, 68, 4, 18);
  r('#3f2818', 130, 68, 4, 18);
  const monitores = 1 + (m.monitor ?? 0);
  for (let i = 0; i < monitores; i++) {
    const mx = 78 + (i - (monitores - 1) / 2) * 24;
    r('#0c0f1a', mx - 9, 44, 20, 15);
    r('#14304a', mx - 8, 45, 18, 12);
    for (let k = 0; k < 4; k++) r('#7cffb2', mx - 6, 47 + k * 2, 3 + ((k * 5 + t + i * 3) % 10), 1);
    r('#2a2f40', mx, 59, 2, 3);
  }
  // Jugador (de espaldas) en la silla
  r('#222a3f', 92, 66, 16, 20);
  r('#2f6f8f', 94, 60, 12, 10);
  r('#2b1d14', 96, 52, 8, 8);
  r('#444c66', 95, 54, 1, 3);
  r('#444c66', 104, 54, 1, 3);

  // Cafetera
  if ((m.cafetera ?? 0) > 0) {
    r('#3f2818', 150, 64, 22, 4);
    r('#20232e', 155, 52, 10, 12);
    r('#c0392b', 157, 55, 6, 2);
    if (t % 4 < 2) {
      r('#c8d0e0', 159, 48 - (t % 3), 1, 2);
      r('#c8d0e0', 161, 46 - (t % 2), 1, 2);
    }
  }

  // Practicante en otro escritorio
  if ((m.becario ?? 0) > 0) {
    r('#5b3b24', 8, 74, 36, 4);
    dibujarRetrato(ctx, 'becario', 18, 58, { parpadeo: t % 20 === 0 });
    r('#0c0f1a', 30, 64, 12, 9);
    r('#14304a', 31, 65, 10, 6);
  }

  // Plantas
  for (let i = 0; i < (m.planta ?? 0); i++) {
    const px = 176 - i * 14;
    r('#7a4a2a', px, 80, 8, 6);
    r('#2f8f4e', px + 1, 72, 6, 8);
    r('#3fbf6a', px + 3, 69, 2, 4);
  }

  // Título del nivel de oficina
  const nombres = ['Cubículo', 'Oficina privada', 'Piso ejecutivo', 'Penthouse'];
  ctx.fillStyle = '#0b1020cc';
  ctx.fillRect(2, ALTO - 12, 80, 10);
  ctx.fillStyle = '#a9b8d6';
  ctx.font = '8px monospace';
  ctx.fillText(nombres[nivelOficina], 5, ALTO - 4);
}
