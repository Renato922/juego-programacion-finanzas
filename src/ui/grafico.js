// Gráfico de línea en vivo (una serie) con estilo de terminal.
// Línea de 2px, rejilla tenue, etiqueta directa en el último punto,
// cruz + tooltip al pasar el mouse y una línea de referencia opcional.

import { h } from './dom.js';

const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

export function graficoLinea({ puntos = [], alto = 180, formato = (v) => v.toFixed(0), etiquetaX = (i) => `#${i}`, referencia = null, titulo = '' }) {
  const lienzo = h('canvas', { role: 'img', 'aria-label': titulo });
  const tip = h('div.tooltip.oculto');
  const contenedor = h('div.grafico', {}, lienzo, tip);
  let datos = puntos;
  let hover = null;

  function dibujar() {
    const ancho = contenedor.clientWidth || 600;
    const dpr = window.devicePixelRatio || 1;
    lienzo.width = Math.round(ancho * dpr);
    lienzo.height = Math.round(alto * dpr);
    lienzo.style.height = alto + 'px';
    const ctx = lienzo.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, ancho, alto);
    const margen = { izq: 64, der: 70, arr: 12, aba: 22 };
    const w = ancho - margen.izq - margen.der;
    const hh = alto - margen.arr - margen.aba;
    ctx.font = '16px VT323, monospace';
    if (datos.length < 2) {
      ctx.fillStyle = css('--texto-3');
      ctx.fillText('Aún no hay suficientes datos. Completa actividades para ver la curva.', margen.izq, alto / 2);
      return;
    }
    let min = Math.min(...datos, referencia ?? Infinity);
    let max = Math.max(...datos, referencia ?? -Infinity);
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const pad = (max - min) * 0.08;
    min -= pad;
    max += pad;
    const x = (i) => margen.izq + (i / (datos.length - 1)) * w;
    const y = (v) => margen.arr + (1 - (v - min) / (max - min)) * hh;

    // Rejilla y eje Y (tenues)
    ctx.strokeStyle = css('--rejilla');
    ctx.lineWidth = 1;
    ctx.fillStyle = css('--texto-3');
    for (let k = 0; k <= 4; k++) {
      const v = min + ((max - min) * k) / 4;
      const yy = Math.round(y(v)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(margen.izq, yy);
      ctx.lineTo(margen.izq + w, yy);
      ctx.stroke();
      ctx.fillText(formato(v), 4, yy + 5);
    }
    ctx.fillText(etiquetaX(0), margen.izq, alto - 4);
    const etFin = etiquetaX(datos.length - 1);
    ctx.fillText(etFin, margen.izq + w - ctx.measureText(etFin).width, alto - 4);

    // Línea de referencia (por ejemplo, lo invertido)
    if (referencia != null) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = css('--texto-3');
      ctx.beginPath();
      ctx.moveTo(margen.izq, y(referencia));
      ctx.lineTo(margen.izq + w, y(referencia));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Serie
    ctx.strokeStyle = css('--serie-1');
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    datos.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
    ctx.stroke();

    // Último punto con etiqueta directa
    const ult = datos.length - 1;
    ctx.fillStyle = css('--serie-1');
    ctx.strokeStyle = css('--panel');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x(ult), y(datos[ult]), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = css('--texto');
    ctx.fillText(formato(datos[ult]), x(ult) + 8, y(datos[ult]) + 5);

    // Cruz de hover
    if (hover != null) {
      const hx = x(hover);
      ctx.strokeStyle = css('--borde-fuerte');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, margen.arr);
      ctx.lineTo(hx, margen.arr + hh);
      ctx.stroke();
      ctx.fillStyle = css('--serie-1');
      ctx.beginPath();
      ctx.arc(hx, y(datos[hover]), 4, 0, Math.PI * 2);
      ctx.fill();
      tip.classList.remove('oculto');
      tip.textContent = `${etiquetaX(hover)} · ${formato(datos[hover])}`;
      tip.style.left = hx + 'px';
      tip.style.top = y(datos[hover]) + 'px';
    } else {
      tip.classList.add('oculto');
    }
    lienzo._escala = { x, margen, w };
  }

  lienzo.addEventListener('mousemove', (e) => {
    if (datos.length < 2 || !lienzo._escala) return;
    const rect = lienzo.getBoundingClientRect();
    const { margen, w } = lienzo._escala;
    const rel = (e.clientX - rect.left - margen.izq) / w;
    hover = Math.max(0, Math.min(datos.length - 1, Math.round(rel * (datos.length - 1))));
    dibujar();
  });
  lienzo.addEventListener('mouseleave', () => {
    hover = null;
    dibujar();
  });

  const observador = new ResizeObserver(() => dibujar());
  observador.observe(contenedor);
  requestAnimationFrame(dibujar);

  return {
    elemento: contenedor,
    actualizar(nuevos, nuevaReferencia = referencia) {
      datos = nuevos;
      referencia = nuevaReferencia;
      dibujar();
    },
  };
}
