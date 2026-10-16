// Mapa de la carrera: capítulos, pistas de cada lenguaje y jefes.

import { h } from '../dom.js';
import { estadoMision } from '../../core/progreso.js';
import { NOMBRE_LENGUAJE } from '../../contenido/conceptos.js';
import { abrirMision } from './oficina.js';

const ICONOS = { completada: '✔', convalidada: '★', disponible: '▸', 'en-curso': '…', bloqueada: '🔒' };
const TEXTOS = {
  completada: 'Completada',
  convalidada: 'Convalidada por el test',
  disponible: 'Disponible',
  'en-curso': 'A medio camino',
  bloqueada: 'Bloqueada',
};

export function render(ctx) {
  const estado = ctx.estado();
  const raiz = h('div.contenedor');
  raiz.append(
    h('h1', {}, 'Tu carrera'),
    h('p.secundario', {}, 'Elige cualquier misión disponible. Las dos pistas avanzan en paralelo: alterna cuando quieras.'),
  );

  for (const cap of ctx.catalogo.capitulos) {
    const bloque = h('section.capitulo.panel' + (cap.disponible ? '' : '.bloqueado'));
    bloque.append(
      h('h2', {}, `Capítulo ${cap.numero} · ${cap.titulo}`),
      h('p.secundario', {}, cap.subtitulo, cap.herramientaReal ? ` · Jefe final en ${cap.herramientaReal} real` : ''),
    );
    if (!cap.disponible) {
      bloque.append(h('p.tenue', {}, 'Próximamente. Mira docs/roadmap.md para ver qué traerá.'));
      raiz.append(bloque);
      continue;
    }
    const pistas = {};
    for (const id of cap.misiones) {
      const m = ctx.catalogo.misiones[id];
      (pistas[m.pista] ??= []).push(m);
    }
    const columnas = h('div.pistas');
    for (const [pista, misiones] of Object.entries(pistas)) {
      columnas.append(
        h(
          'div.pista',
          {},
          h('h3', {}, `Pista de ${NOMBRE_LENGUAJE[pista] ?? pista}`),
          misiones.map((m) => nodo(ctx, m, estado)),
        ),
      );
    }
    bloque.append(columnas);
    if (cap.jefe) {
      const jefe = ctx.catalogo.misiones[cap.jefe];
      bloque.append(h('h3', { estilo: { marginTop: '12px' } }, 'Jefe del capítulo'), nodo(ctx, jefe, estado, true));
    }
    raiz.append(bloque);
  }
  return raiz;
}

function nodo(ctx, m, estado, esJefe = false) {
  const e = estadoMision(m, estado);
  const registro = estado.misiones[m.id];
  return h(
    'button.nodo.' + e + (esJefe ? '.jefe' : ''),
    {
      onclick: () => e !== 'bloqueada' && abrirMision(ctx, m.id),
      'aria-disabled': e === 'bloqueada',
      title: TEXTOS[e],
    },
    h('span.icono-estado', {}, esJefe && e !== 'completada' ? '☠' : ICONOS[e]),
    h('span', { estilo: { flex: '1' } }, h('div', {}, m.titulo), h('div.tenue', { estilo: { fontSize: '17px' } }, m.resumen)),
    h('span.tenue', {}, registro?.nota ? `Nota ${registro.nota}` : m.duracion),
  );
}
