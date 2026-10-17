// Test de nivel adaptativo.

import { h, vaciar, llenar } from '../dom.js';
import { crearTest, siguientePregunta, responder, saltarArea, resultadoTest } from '../../core/diagnostico.js';
import { convalidarMisiones } from '../../core/progreso.js';
import { formatoDinero } from '../../core/economia.js';

export function render(ctx) {
  const { banco, areas } = ctx.catalogo.diagnostico;
  let test = crearTest(
    banco,
    areas.map((a) => a.id),
  );
  let areaPresentada = null;
  const raiz = h('div.contenedor.columna', { estilo: { maxWidth: '860px' } });

  function siguiente() {
    const p = siguientePregunta(test, banco);
    if (!p) return terminar();
    if (p.area !== areaPresentada) return presentarArea(p.area);
    mostrarPregunta(p);
  }

  function presentarArea(id) {
    areaPresentada = id;
    const area = areas.find((a) => a.id === id);
    llenar(
      raiz,
      h(
        'div.panel.columna',
        {},
        h('h2', {}, `Test de nivel · ${area.nombre}`),
        h('p', {}, area.descripcion),
        h(
          'div.fila',
          {},
          h('button.primario', { onclick: siguiente }, 'Lo he usado: preguntar'),
          h(
            'button',
            {
              onclick: () => {
                test = saltarArea(test, id);
                siguiente();
              },
            },
            'Nunca lo he usado: saltar',
          ),
        ),
      ),
    );
  }

  function mostrarPregunta(p) {
    const hechas = test.respuestas.filter((r) => r.area === p.area).length;
    llenar(
      raiz,
      h(
        'div.panel.columna',
        {},
        h('div.fila', {}, h('span.chip', {}, areas.find((a) => a.id === p.area).nombre), h('span.tenue', {}, `Nivel ${p.nivel} · pregunta ${hechas + 1}`)),
        h('p', {}, p.pregunta),
        p.codigo ? h('pre.codigo-muestra', {}, p.codigo) : null,
        h(
          'div.opciones',
          {},
          p.opciones.map((o, i) => h('button', { onclick: () => elegir(p, i) }, h('span.tenue', {}, String.fromCharCode(65 + i) + ') '), o)),
          h('button', { onclick: () => elegir(p, null), estilo: { borderStyle: 'dashed' } }, 'No lo sé'),
        ),
      ),
    );
  }

  function elegir(p, i) {
    ctx.sonido.clic();
    test = responder(test, p, i).test;
    siguiente();
  }

  function terminar() {
    const r = resultadoTest(test, ctx.catalogo.misiones);
    const ahora = ctx.ahora();
    let estado = structuredClone(ctx.estado());
    const conv = convalidarMisiones(estado, r.convalidadas, ahora, ctx.catalogo);
    estado = conv.estado;
    estado.diagnostico = { hecho: true, niveles: r.niveles, convalidadas: r.convalidadas };
    ctx.actualizar(estado, { inmediato: true });
    const nombres = r.convalidadas.map((id) => ctx.catalogo.misiones[id].titulo);
    llenar(
      raiz,
      h(
        'div.panel.resaltado.columna',
        {},
        h('h2', {}, 'Resultado del test'),
        areas.map((a) => h('p', {}, `${a.nombre}: nivel ${r.niveles[a.id] ?? 0}`)),
        nombres.length
          ? h(
              'div',
              {},
              h('p', {}, `Convalidamos ${nombres.length} misión(es) y te pagamos ${formatoDinero(conv.recompensas.capital)} por ellas:`),
              h(
                'ul',
                {},
                nombres.map((n) => h('li', {}, n)),
              ),
              h(
                'p.tenue',
                {},
                'Sus conceptos aparecerán pronto en la Sala de trading, para confirmar que los recuerdas. Puedes jugarlas igual cuando quieras.',
              ),
            )
          : h('p', {}, 'Empiezas desde el principio. Es el mejor lugar: las primeras misiones son cortas y se sienten bien.'),
        h('button.primario', { onclick: () => ctx.ir('oficina') }, 'Ir a mi oficina ▸'),
      ),
    );
  }

  siguiente();
  return raiz;
}
