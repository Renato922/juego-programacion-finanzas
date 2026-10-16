// Pantalla de misión: recorre los pasos en orden. Un ejercicio no se puede
// saltar: se avanza al resolverlo (con pistas que escalan). Se puede pausar
// en cualquier momento y continuar después en el mismo paso.

import { h, vaciar, llenar } from '../dom.js';
import { renderPaso } from '../pasos.js';
import { completarMision, siguientePaso } from '../../core/progreso.js';
import { NOMBRE_LENGUAJE } from '../../contenido/conceptos.js';
import { mostrarRecompensas } from '../recompensas.js';
import { abrirMision } from './oficina.js';

export function render(ctx, { id }) {
  const mision = ctx.catalogo.misiones[id];
  const guardado = ctx.estado().enCurso?.misionId === id ? ctx.estado().enCurso : null;
  let indice = guardado?.paso ?? 0;
  let desempeno = guardado?.desempeno ?? [];
  let borradores = guardado?.borradores ?? {};

  const progreso = h('div.pasos-progreso', { 'aria-label': 'Progreso de la misión' });
  const area = h('div');
  const raiz = h(
    'div.contenedor',
    {},
    h(
      'div.mision-cabecera',
      {},
      h('span.chip.' + mision.lenguaje, {}, NOMBRE_LENGUAJE[mision.lenguaje]),
      h('h2', { estilo: { margin: 0 } }, mision.titulo),
      progreso,
      h('button.pequeno', { onclick: pausar, title: 'Tu avance queda guardado' }, '⏸ Pausar y salir'),
    ),
    area,
  );

  function guardarAvance() {
    const e = structuredClone(ctx.estado());
    e.enCurso = { misionId: id, paso: indice, desempeno, borradores };
    ctx.actualizar(e);
  }

  function pausar() {
    guardarAvance();
    ctx.ir('oficina');
  }

  function pintarProgreso() {
    llenar(progreso, ...mision.pasos.map((_, i) => h('i' + (i < indice ? '.hecho' : i === indice ? '.actual' : ''))));
  }

  function mostrar() {
    pintarProgreso();
    const paso = mision.pasos[indice];
    llenar(
      area,
      renderPaso(paso, ctx, {
        modo: 'mision',
        borrador: borradores[indice],
        alCambiarBorrador: (v) => {
          borradores[indice] = v;
        },
        alCompletar: (d) => {
          if (paso.tipo === 'ejercicio' || paso.tipo === 'quiz') desempeno.push(d);
          delete borradores[indice];
          indice++;
          if (indice >= mision.pasos.length) return finalizar();
          guardarAvance();
          mostrar();
          window.scrollTo?.(0, 0);
          raiz.parentElement?.scrollTo?.(0, 0);
        },
      }),
    );
  }

  function finalizar() {
    const ahora = ctx.ahora();
    const { estado, recompensas } = completarMision(ctx.estado(), mision, { ejercicios: desempeno }, ahora, ctx.catalogo);
    ctx.actualizar(estado, { inmediato: true });
    pintarProgreso();
    const prox = siguientePaso(estado, ctx.catalogo, ahora);
    const siguiente =
      prox.misionId && prox.misionId !== id
        ? { texto: `Siguiente: ${prox.texto} ▸`, accion: () => abrirMision(ctx, prox.misionId) }
        : prox.tipo === 'repaso'
          ? { texto: 'Repasar en la Sala de trading ▸', accion: () => ctx.ir('entrenamiento', { rondas: prox.cantidad }) }
          : null;
    llenar(area, h('div.panel.resaltado', {}, h('h2', {}, '¡Misión completada!'), h('p', {}, mision.resumen)));
    mostrarRecompensas(ctx, { titulo: `Misión completada: ${mision.titulo}`, recompensas, siguiente });
  }

  if (!guardado) guardarAvance();
  mostrar();
  return raiz;
}
