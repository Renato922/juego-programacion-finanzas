// Colección de cartas: una por concepto. Las estrellas muestran el dominio
// según el repaso espaciado y nunca bajan.

import { h, modal } from '../dom.js';
import { iconoLenguaje } from '../pixel.js';
import { nivelDominio } from '../../core/srs.js';
import { NOMBRE_LENGUAJE } from '../../contenido/conceptos.js';

const NIVELES = ['Sin descubrir', 'Aprendida', 'Practicada', 'Sólida', 'Dominada'];

export function render(ctx) {
  const estado = ctx.estado();
  const conceptos = Object.entries(ctx.catalogo.conceptos);
  const obtenidas = conceptos.filter(([id]) => estado.tarjetas[id]).length;
  const raiz = h('div.contenedor.columna');
  raiz.append(
    h('h1', {}, 'Colección de cartas'),
    h(
      'p.secundario',
      {},
      `${obtenidas} de ${conceptos.length} cartas. Cada repaso correcto en la Sala de trading sube las estrellas. Las cartas brillantes salen de las cajas de dividendos.`,
    ),
  );
  for (const lenguaje of ['python', 'sql', 'finanzas']) {
    const grupo = conceptos.filter(([, c]) => c.lenguaje === lenguaje);
    raiz.append(
      h('h2', {}, NOMBRE_LENGUAJE[lenguaje]),
      h(
        'div.cartas',
        {},
        grupo.map(([id, c]) => {
          const tarjeta = estado.tarjetas[id];
          const nivel = nivelDominio(tarjeta);
          const brillante = estado.coleccion.brillantes.includes(id);
          return h(
            'button.carta' + (tarjeta ? '' : '.bloqueada') + (brillante ? '.brillante' : ''),
            {
              onclick: () =>
                tarjeta &&
                modal(
                  h(
                    'div.columna',
                    {},
                    h('h2', {}, c.nombre),
                    h('p', {}, c.resumen),
                    h(
                      'p.tenue',
                      {},
                      `${NIVELES[nivel]} · repasos correctos seguidos: ${tarjeta.repeticiones} · próximo repaso: ${new Date(tarjeta.vence).toLocaleDateString('es')}`,
                    ),
                  ),
                ),
            },
            iconoLenguaje(lenguaje),
            h('div.nombre', {}, tarjeta ? c.nombre : '???'),
            h('div.estrellas', { 'aria-label': `${nivel} de 4 estrellas` }, '★'.repeat(nivel) + '☆'.repeat(4 - nivel)),
            h('div.tenue', {}, tarjeta ? NIVELES[nivel] : 'Aprende este concepto en una misión'),
            brillante ? h('div.ambar-t', {}, '✨ Brillante') : null,
          );
        }),
      ),
    );
  }
  return raiz;
}
