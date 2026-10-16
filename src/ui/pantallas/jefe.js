// Batalla contra el jefe del capítulo: fases que mezclan lo aprendido.
// Cada fase resuelta le quita vida al jefe. No hay vida del jugador: si
// algo falla, se corrige y se sigue. La nota final invita a la revancha.

import { h, vaciar, llenar, plantilla } from '../dom.js';
import { renderPaso, renderDialogo } from '../pasos.js';
import { retrato } from '../pixel.js';
import { crearBatalla, resolverFase, notaBatalla, mejorNota } from '../../core/batalla.js';
import { completarMision } from '../../core/progreso.js';
import { mostrarRecompensas } from '../recompensas.js';

export function render(ctx, { id }) {
  const jefe = ctx.catalogo.misiones[id];
  const guardado = ctx.estado().enCurso?.misionId === id ? ctx.estado().enCurso : null;
  let batalla = guardado?.batalla ?? crearBatalla(jefe);
  let borradores = guardado?.borradores ?? {};

  const barraVida = h('span', { estilo: { width: '100%' } });
  const textoVida = h('span.tenue');
  const provocacion = h('p', { estilo: { margin: '6px 0 0' } });
  const cabecera = h(
    'div.jefe-cabecera',
    {},
    retrato(jefe.jefe.sprite),
    h(
      'div',
      { estilo: { position: 'relative' } },
      h('div.fila', {}, h('h2', { estilo: { margin: 0 } }, `☠ ${jefe.jefe.nombre}`), h('span.chip.jefe', {}, jefe.titulo), textoVida),
      h('div.barra.vida-jefe', { role: 'progressbar', 'aria-label': 'Vida del jefe' }, barraVida),
      provocacion,
    ),
  );
  const area = h('div');
  const raiz = h(
    'div.contenedor',
    {},
    h('div.fila', { estilo: { justifyContent: 'flex-end' } }, h('button.pequeno', { onclick: pausar }, '⏸ Pausar y salir')),
    cabecera,
    area,
  );

  function guardarAvance() {
    const e = structuredClone(ctx.estado());
    e.enCurso = { misionId: id, paso: batalla.fase, batalla, borradores };
    ctx.actualizar(e);
  }

  function pausar() {
    guardarAvance();
    ctx.ir('oficina');
  }

  function pintarVida() {
    barraVida.style.width = `${(batalla.vida / batalla.vidaMax) * 100}%`;
    textoVida.textContent = `Vida ${batalla.vida}/${batalla.vidaMax} · Fase ${Math.min(batalla.fase + 1, jefe.fases.length)}/${jefe.fases.length}`;
  }

  function mostrarFase() {
    pintarVida();
    const fase = jefe.fases[batalla.fase];
    provocacion.textContent = `"${plantilla(fase.provocacion, ctx.estado())}"`;
    llenar(
      area,
      renderPaso(fase.paso, ctx, {
        modo: 'jefe',
        borrador: borradores[batalla.fase],
        alCambiarBorrador: (v) => (borradores[batalla.fase] = v),
        alCompletar: (d) => golpe(d),
      }),
    );
  }

  function golpe(desempeno) {
    const r = resolverFase(batalla, jefe, desempeno);
    batalla = r.batalla;
    delete borradores[batalla.fase - 1];
    ctx.sonido.golpe();
    cabecera.classList.remove('temblor');
    void cabecera.offsetWidth;
    cabecera.classList.add('temblor');
    const flotante = h(
      'div.dano-flotante' + (r.critico ? '.critico' : ''),
      { estilo: { left: `${55 + Math.round(Math.random() * 25)}%`, top: '18px' } },
      r.critico ? `¡CRÍTICO! -${r.dano}` : `-${r.dano}`,
    );
    cabecera.lastChild.append(flotante);
    setTimeout(() => flotante.remove(), 1300);
    pintarVida();
    if (r.terminado) return victoria();
    guardarAvance();
    mostrarFase();
  }

  function victoria() {
    const nota = notaBatalla(batalla.resultados);
    provocacion.textContent = '';
    ctx.sonido.victoria();
    llenar(
      area,
      h('h2.verde', {}, `¡Victoria! Nota: ${nota}`),
      renderDialogo(jefe.victoria, ctx, {
        textoBoton: 'Cobrar',
        alCompletar: () => {
          const anterior = ctx.estado().misiones[id]?.nota;
          const { estado, recompensas } = completarMision(
            ctx.estado(),
            jefe,
            { ejercicios: batalla.resultados, nota: mejorNota(anterior, nota) },
            ctx.ahora(),
            ctx.catalogo,
          );
          ctx.actualizar(estado, { inmediato: true });
          mostrarRecompensas(ctx, {
            titulo: `Jefe derrotado: ${jefe.titulo}`,
            recompensas,
            nota,
            siguiente: { texto: 'Ver el mapa de la carrera ▸', accion: () => ctx.ir('mapa') },
          });
        },
      }),
    );
  }

  if (guardado) {
    mostrarFase();
  } else {
    pintarVida();
    llenar(
      area,
      renderDialogo(jefe.intro, ctx, {
        textoBoton: '¡Que empiece la auditoría!',
        alCompletar: () => {
          guardarAvance();
          mostrarFase();
        },
      }),
    );
  }
  return raiz;
}
