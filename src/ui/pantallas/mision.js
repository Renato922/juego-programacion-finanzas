// Pantalla de misión: recorre los pasos en orden. Un ejercicio no se puede
// saltar: se avanza al resolverlo (con pistas que escalan). Se puede pausar
// en cualquier momento y continuar después en el mismo paso.
//
// Barra de dominio (estilo ALEKS, ver core/dominio.js): equivocarse hace que
// la barra retroceda un segmento y agrega un ejercicio de refuerzo del mismo
// tema, que se juega antes del jefe del día. El jefe del día es un reto final
// de una fase con 3 vidas; sin vidas, se reintenta al instante.
// En modo poca energía no hay retrocesos ni vidas.

import { h, llenar, plantilla, toast } from '../dom.js';
import { renderPaso } from '../pasos.js';
import { retrato } from '../pixel.js';
import { completarMision, siguientePaso } from '../../core/progreso.js';
import { VIDAS_JUGADOR } from '../../core/batalla.js';
import { crearDominio, registrarError, registrarResuelto, nivelDominio, refuerzoActual, resolverRefuerzo, limpiarPendientes } from '../../core/dominio.js';
import { NOMBRE_LENGUAJE } from '../../contenido/conceptos.js';
import { mostrarRecompensas } from '../recompensas.js';
import { abrirMision } from './oficina.js';

export function corazones(vidas, total = VIDAS_JUGADOR) {
  return h(
    'span.corazones',
    { 'aria-label': `${vidas} de ${total} vidas`, title: `${vidas} de ${total} vidas` },
    Array.from({ length: total }, (_, i) => h('i' + (i < vidas ? '.lleno' : ''), {}, i < vidas ? '♥' : '♡')),
  );
}

export function render(ctx, { id }) {
  const mision = ctx.catalogo.misiones[id];
  const guardado = ctx.estado().enCurso?.misionId === id ? ctx.estado().enCurso : null;
  let indice = guardado?.paso ?? 0;
  let desempeno = guardado?.desempeno ?? [];
  let borradores = guardado?.borradores ?? {};
  let dominio = limpiarPendientes(guardado?.dominio ?? crearDominio(mision, indice), ctx.catalogo.conceptos);
  let vidasJefe = guardado?.vidasJefe ?? VIDAS_JUGADOR;
  const sinPresion = () => Boolean(ctx.estado().ajustes.energiaBaja);

  const progreso = h('div.pasos-progreso', { 'aria-label': 'Progreso de la misión' });
  const barraDominio = h('div.dominio', { title: 'Barra de dominio: se llena al resolver y retrocede un paso con cada error' });
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
    barraDominio,
    area,
  );

  function guardarAvance() {
    const e = structuredClone(ctx.estado());
    e.enCurso = { misionId: id, paso: indice, desempeno, borradores, dominio, vidasJefe };
    ctx.actualizar(e);
  }

  function pausar() {
    guardarAvance();
    ctx.ir('oficina');
  }

  function pintarProgreso() {
    llenar(progreso, ...mision.pasos.map((_, i) => h('i' + (i < indice ? '.hecho' : i === indice ? '.actual' : ''))));
    const llenos = nivelDominio(dominio);
    const pendientes = dominio.pendientes.length;
    llenar(
      barraDominio,
      h('span.etiqueta', {}, 'Dominio'),
      h(
        'div.dominio-segmentos',
        { role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': dominio.total, 'aria-valuenow': llenos },
        Array.from({ length: dominio.total }, (_, i) => h('i' + (i < llenos ? '.lleno' : i < llenos + pendientes ? '.refuerzo' : ''))),
      ),
      h(
        'span.tenue',
        {},
        pendientes ? `${pendientes} refuerzo${pendientes > 1 ? 's' : ''} pendiente${pendientes > 1 ? 's' : ''}` : `${llenos}/${dominio.total}`,
      ),
    );
  }

  // Primer error en un paso normal: la barra retrocede.
  function alFallarPaso(paso) {
    return () => {
      if (sinPresion()) return null;
      const r = registrarError(dominio, indice, paso.concepto);
      if (!r.retrocedio) return null;
      dominio = r.dominio;
      pintarProgreso();
      guardarAvance();
      const tema = ctx.catalogo.conceptos[paso.concepto]?.nombre ?? 'este tema';
      return `La barra de dominio retrocedió un paso. Antes del jefe del día harás un ejercicio de refuerzo de ${tema}.`;
    };
  }

  function mostrar() {
    pintarProgreso();
    const paso = mision.pasos[indice];
    if (paso.tipo === 'jefeDia') {
      if (dominio.pendientes.length && !sinPresion()) return mostrarRefuerzo();
      return mostrarJefeDia(paso);
    }
    llenar(
      area,
      renderPaso(paso, ctx, {
        modo: 'mision',
        borrador: borradores[indice],
        alCambiarBorrador: (v) => {
          borradores[indice] = v;
        },
        alFallar: paso.tipo === 'ejercicio' || paso.tipo === 'quiz' ? alFallarPaso(paso) : undefined,
        alCompletar: (d) => {
          if (paso.tipo === 'ejercicio' || paso.tipo === 'quiz') {
            desempeno.push(d);
            dominio = registrarResuelto(dominio, indice);
          }
          avanzar();
        },
      }),
    );
  }

  function avanzar() {
    delete borradores[indice];
    indice++;
    if (indice >= mision.pasos.length) return finalizar();
    guardarAvance();
    mostrar();
    window.scrollTo?.(0, 0);
    raiz.parentElement?.scrollTo?.(0, 0);
  }

  function mostrarRefuerzo() {
    const r = refuerzoActual(dominio, ctx.catalogo.conceptos);
    if (!r) {
      dominio = { ...dominio, pendientes: [] };
      return mostrar();
    }
    const tema = ctx.catalogo.conceptos[r.concepto]?.nombre ?? r.concepto;
    llenar(
      area,
      h(
        'div.panel.refuerzo-aviso',
        {},
        h('strong.ambar-t', {}, `Refuerzo de dominio: ${tema}`),
        h('span.tenue', {}, ` · ${r.quedan === 1 ? 'último refuerzo' : `quedan ${r.quedan}`} antes del jefe del día`),
      ),
      renderPaso(r.paso, ctx, {
        modo: 'mision',
        alCompletar: (d) => {
          const recuperado = d.correcto && (d.intentosFallidos === 0 || r.paso.tipo === 'ejercicio');
          dominio = resolverRefuerzo(dominio, recuperado);
          if (recuperado) toast('¡Segmento recuperado!');
          else toast('Casi: probemos con otro ejercicio del mismo tema.');
          guardarAvance();
          mostrar();
        },
      }),
    );
  }

  function mostrarJefeDia(paso) {
    const jefe = paso.jefe;
    const conVidas = !sinPresion();
    const vidasEl = h('span');
    const barraVida = h('span', { estilo: { width: '100%' } });
    const pintarVidas = () => llenar(vidasEl, conVidas ? corazones(vidasJefe) : h('span.tenue', {}, 'Modo poca energía: sin vidas'));
    pintarVidas();
    const cabecera = h(
      'div.jefe-cabecera.jefe-dia',
      {},
      retrato(jefe.sprite),
      h(
        'div',
        {},
        h('div.fila', {}, h('h2', { estilo: { margin: 0 } }, `⚔ ${jefe.nombre}`), h('span.chip.jefe', {}, 'Jefe del día'), vidasEl),
        h('div.barra.vida-jefe', { role: 'progressbar', 'aria-label': 'Vida del jefe' }, barraVida),
        h('p', { estilo: { margin: '6px 0 0' } }, `"${plantilla(jefe.provocacion, ctx.estado())}"`),
      ),
    );

    function sinVidas() {
      ctx.sonido.error();
      llenar(
        area,
        cabecera,
        h(
          'div.panel.columna',
          {},
          h('h2.rojo', {}, 'Te quedaste sin vidas'),
          h('p', {}, `${jefe.nombre} gana esta ronda. No pierdes capital, XP ni lo que ya resolviste: el reto vuelve a empezar con 3 vidas.`),
          h('p.tenue', {}, 'Consejo: usa ▶ Ejecutar para probar tu código antes de ✔ Comprobar. Ejecutar y abrir pistas no cuestan vidas.'),
          h(
            'button.primario',
            {
              onclick: () => {
                vidasJefe = VIDAS_JUGADOR;
                delete borradores[indice];
                guardarAvance();
                mostrar();
              },
            },
            'Reintentar ▸',
          ),
        ),
      );
    }

    // Partida guardada justo al perder la última vida.
    if (conVidas && vidasJefe === 0) return sinVidas();

    llenar(
      area,
      cabecera,
      renderPaso(paso.paso, ctx, {
        modo: 'jefe',
        borrador: borradores[indice],
        alCambiarBorrador: (v) => {
          borradores[indice] = v;
        },
        alFallar: () => {
          if (!conVidas || vidasJefe === 0) return null;
          vidasJefe -= 1;
          pintarVidas();
          cabecera.classList.remove('temblor');
          void cabecera.offsetWidth;
          cabecera.classList.add('temblor');
          guardarAvance();
          if (vidasJefe === 0) {
            setTimeout(sinVidas, 900);
            return 'Perdiste tu última vida.';
          }
          return `Perdiste una vida: te quedan ${vidasJefe}.`;
        },
        alCompletar: (d) => {
          desempeno.push(d);
          vidasJefe = VIDAS_JUGADOR;
          barraVida.style.width = '0%';
          ctx.sonido.golpe();
          llenar(
            area,
            cabecera,
            h(
              'div.panel.resaltado.columna',
              {},
              h('h2.verde', {}, `¡Venciste a ${jefe.nombre}!`),
              h('p', {}, plantilla(jefe.derrota, ctx.estado())),
              h('button.primario', { onclick: avanzar }, 'Continuar ▸'),
            ),
          );
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
