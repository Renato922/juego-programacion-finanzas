// Sala de trading: el modo entrenamiento con repaso espaciado.
// Cada ronda eliges 1 de 3 operaciones (conceptos ya aprendidos). Acertar
// sube tu P&L con combo; fallar no resta nada y deja una revancha.

import { h, vaciar, llenar } from '../dom.js';
import { renderPaso } from '../pasos.js';
import { graficoLinea } from '../grafico.js';
import { crearRng } from '../../core/rng.js';
import {
  crearSesion,
  generarOpciones,
  resolverOperacion,
  elegirPotenciador,
  usarComodin,
  sesionTerminada,
  resumenSesion,
  POTENCIADORES,
} from '../../core/entrenamiento.js';
import { aplicarRepaso } from '../../core/progreso.js';
import { efectosDeMejoras, formatoDinero } from '../../core/economia.js';
import { NOMBRE_LENGUAJE } from '../../contenido/conceptos.js';

export function render(ctx, { rondas = 5, rapido = false } = {}) {
  const raiz = h('div.contenedor.columna');
  const estado0 = ctx.estado();
  if (!Object.keys(estado0.tarjetas).length) {
    raiz.append(
      h(
        'div.panel.columna',
        {},
        h('h2', {}, 'Sala de trading'),
        h('p', {}, 'Aquí repasas lo que ya aprendiste, como en una mesa de operaciones. Completa tu primera misión y vuelve.'),
        h('button.primario', { onclick: () => ctx.ir('oficina') }, 'Ir a la oficina'),
      ),
    );
    return raiz;
  }

  const efectos = efectosDeMejoras(estado0.mejoras, ctx.catalogo.mejoras);
  const rng = crearRng((Date.now() ^ estado0.semilla) >>> 0);
  let sesion = crearSesion({ rondas, comodines: efectos.comodines });
  const soloRapidas = rapido || estado0.ajustes.energiaBaja;
  const grafico = graficoLinea({
    puntos: sesion.curva,
    alto: 140,
    formato: (v) => formatoDinero(v),
    etiquetaX: (i) => (i === 0 ? 'inicio' : `ronda ${i}`),
    titulo: 'P&L de la sesión',
  });
  const marcador = h('div.fila');
  const area = h('div');
  raiz.append(
    h(
      'div.fila',
      {},
      h('h1', { estilo: { margin: 0 } }, 'Sala de trading'),
      h('span.tenue', {}, soloRapidas ? 'Modo rápido: solo preguntas cortas' : 'Repaso espaciado e intercalado'),
    ),
    h('div.panel', {}, marcador, grafico.elemento),
    area,
  );

  function pintarMarcador() {
    llenar(
      marcador,
      h('span', {}, `Ronda ${Math.min(sesion.ronda + 1, sesion.rondas)}/${sesion.rondas}`),
      h('span.verde', {}, `P&L ${formatoDinero(sesion.pl)}`),
      h('span.ambar-t', {}, `Combo x${sesion.combo.toFixed(1)}`),
      sesion.potenciador ? h('span.chip.vencida', {}, POTENCIADORES[sesion.potenciador].nombre) : null,
      sesion.comodines ? h('span.tenue', {}, `Comodines: ${sesion.comodines}`) : null,
    );
    grafico.actualizar(sesion.curva);
  }

  function ronda() {
    pintarMarcador();
    if (sesionTerminada(sesion)) return cerrar();
    if (sesion.ofertaPotenciador) return ofrecerPotenciador();
    const opciones = generarOpciones(sesion, ctx.estado().tarjetas, ctx.catalogo.conceptos, ctx.ahora(), rng, { soloRapidas });
    llenar(
      area,
      h('h2', {}, 'Elige tu próxima operación'),
      h(
        'div.operaciones',
        {},
        opciones.map((op) =>
          h(
            'button.panel.operacion',
            { onclick: () => jugar(op) },
            h(
              'div.fila',
              {},
              h('span.chip.' + op.lenguaje, {}, NOMBRE_LENGUAJE[op.lenguaje]),
              op.vencida ? h('span.chip.vencida', {}, 'Toca repasar ×2') : null,
            ),
            h('div', {}, op.nombre),
            h('div.tenue', {}, { opcion: 'Pregunta rápida', completar: 'Completar', ejercicio: 'Escribir código' }[op.item.tipo]),
            h('div.valor', {}, `+${formatoDinero(op.valor * sesion.combo * (sesion.potenciador === 'alcista' ? 2 : 1))}`),
          ),
        ),
      ),
      sesion.comodines
        ? h(
            'button.pequeno',
            {
              onclick: () => {
                sesion = usarComodin(sesion);
                ronda();
              },
            },
            'Usar comodín (saltar ronda)',
          )
        : null,
    );
  }

  function ofrecerPotenciador() {
    llenar(
      area,
      h('h2', {}, '¡Dos aciertos seguidos! Elige un potenciador'),
      h(
        'div.operaciones',
        {},
        sesion.ofertaPotenciador.map((id) =>
          h(
            'button.panel.operacion',
            {
              onclick: () => {
                ctx.sonido.moneda();
                sesion = elegirPotenciador(sesion, id);
                ronda();
              },
            },
            h('div.valor', {}, POTENCIADORES[id].nombre),
            h('div', {}, POTENCIADORES[id].descripcion),
          ),
        ),
      ),
    );
  }

  function jugar(op) {
    ctx.sonido.clic();
    const paso = { ...op.item, concepto: op.concepto, tipo: op.item.tipo };
    llenar(
      area,
      h('h2', {}, op.nombre),
      renderPaso(paso, ctx, {
        modo: 'repaso',
        descartar: sesion.potenciador === 'informacion',
        alCompletar: (d) => {
          const correcto = Boolean(d.correcto) && (paso.tipo !== 'ejercicio' || (d.intentosFallidos <= 1 && !d.pistas));
          const r = resolverOperacion(sesion, op, correcto);
          sesion = r.sesion;
          const { estado } = aplicarRepaso(ctx.estado(), op.concepto, { ...d, correcto }, ctx.ahora());
          ctx.actualizar(estado);
          ronda();
        },
      }),
    );
  }

  function cerrar() {
    const resumen = resumenSesion(sesion);
    const capital = Math.round(resumen.pl * (1 + (efectos.multiplicadorCapital ?? 0)));
    const xp = resumen.aciertos * 8 + resumen.total * 2;
    const e = structuredClone(ctx.estado());
    e.capital += capital;
    e.xp += xp;
    e.estadisticas.sesionesEntrenamiento += 1;
    e.estadisticas.mejorPLEntrenamiento = Math.max(e.estadisticas.mejorPLEntrenamiento, capital);
    ctx.actualizar(e, { inmediato: true });
    ctx.sonido.victoria();
    llenar(
      area,
      h(
        'div.panel.resaltado.columna',
        {},
        h('h2', {}, 'Cierre de la sesión'),
        h('p', {}, `Aciertos: ${resumen.aciertos} de ${resumen.total}`),
        h('p.verde', {}, `Ganancia: +${formatoDinero(capital)} · +${xp} XP`),
        resumen.revancha.length
          ? h(
              'p.tenue',
              {},
              `Para la próxima: ${resumen.revancha.map((c) => ctx.catalogo.conceptos[c]?.nombre).join(', ')}. Volverán pronto, sin ningún castigo.`,
            )
          : h('p.tenue', {}, 'Sesión perfecta. Estos conceptos volverán en unos días para fijarlos todavía más.'),
        h(
          'div.fila',
          {},
          h('button.primario', { onclick: () => ctx.ir('entrenamiento', { rondas, rapido }) }, 'Otra sesión'),
          h('button', { onclick: () => ctx.ir('oficina') }, 'Volver a la oficina'),
        ),
      ),
    );
  }

  ronda();
  return raiz;
}
