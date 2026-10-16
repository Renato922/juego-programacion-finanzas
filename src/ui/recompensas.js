// Ventana de recompensas al cerrar una misión o jefe.

import { h, modal, animarNumero } from './dom.js';
import { cofre } from './pixel.js';
import { formatoDinero } from '../core/economia.js';

export function mostrarRecompensas(ctx, { titulo, recompensas, nota = null, siguiente = null }) {
  const valorCapital = h('span.valor', {}, '$0');
  const valorXP = h('span.valor', {}, '0');
  const contenido = h(
    'div.columna',
    {},
    h('h2', {}, titulo),
    nota ? h('div.recompensa-linea', {}, h('span', {}, 'Nota'), h('span.valor', {}, nota)) : null,
    h('div.recompensa-linea', {}, h('span', {}, 'Capital ganado'), valorCapital),
    h('div.recompensa-linea', {}, h('span', {}, 'Experiencia'), valorXP),
    recompensas.bonoLimpio
      ? h('div.recompensa-linea', {}, h('span', {}, 'Incluye bono por ejercicios limpios'), h('span.valor', {}, '+' + formatoDinero(recompensas.bonoLimpio)))
      : null,
    recompensas.modo === 'repeticion' ? h('p.tenue', {}, 'Repetición: paga 25%, pero refuerza la memoria de estos conceptos.') : null,
  );

  if (recompensas.caja) {
    const lienzo = cofre(false);
    const texto = h('div', {}, 'Caja de dividendos: haz clic para abrirla');
    const caja = h('div.caja-dividendos', { role: 'button', tabindex: 0 }, lienzo, texto);
    const abrir = () => {
      if (caja.classList.contains('abierta')) return;
      caja.classList.add('abierta');
      lienzo.replaceWith(cofre(true));
      ctx.sonido.moneda();
      const c = recompensas.caja;
      texto.textContent =
        c.tipo === 'capital' ? `${c.texto}: +${formatoDinero(c.monto)} (ya sumado)` : `${c.texto}: ${ctx.catalogo.conceptos[c.concepto]?.nombre ?? ''} ✨`;
    };
    caja.addEventListener('click', abrir);
    caja.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && abrir());
    contenido.append(caja);
  }

  if (recompensas.tick) {
    const r = recompensas.tick.retorno;
    contenido.append(
      h(
        'div.recompensa-linea',
        {},
        h('span', {}, 'Tu fondo en esta actividad'),
        h('span.valor', {}, `${r >= 0 ? '▲ +' : '▼ '}${(r * 100).toFixed(2)}% (${formatoDinero(recompensas.tick.ganancia)})`),
      ),
    );
  }

  if (recompensas.subioRango) {
    contenido.append(h('div.panel.ambar', {}, h('h2', {}, '¡Ascenso!'), h('p', {}, `Ahora eres ${recompensas.subioRango.nombre}.`)));
  }

  const botones = h('div.fila');
  let m;
  if (siguiente) {
    botones.append(
      h(
        'button.primario',
        {
          onclick: () => {
            m.cerrar();
            siguiente.accion();
          },
        },
        siguiente.texto,
      ),
    );
  }
  botones.append(
    h(
      'button',
      {
        onclick: () => {
          m.cerrar();
          ctx.ir('oficina');
        },
      },
      'Volver a la oficina',
    ),
  );
  contenido.append(botones);
  m = modal(contenido, { cerrable: false });
  ctx.sonido[recompensas.subioRango ? 'ascenso' : 'moneda']();
  const ms = ctx.estado().ajustes.animaciones ? 900 : 0;
  animarNumero(valorCapital, 0, recompensas.capital, (v) => '+' + formatoDinero(v), ms);
  animarNumero(valorXP, 0, recompensas.xp, (v) => '+' + Math.round(v) + ' XP', ms);
  botones.querySelector('button')?.focus();
  return m;
}
