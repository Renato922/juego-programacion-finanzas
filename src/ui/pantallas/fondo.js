// El fondo (parte tycoon): invertir capital, elegir el perfil de riesgo
// y comprar mejoras para la oficina.

import { h, toast } from '../dom.js';
import { graficoLinea } from '../grafico.js';
import { crearEscenaOficina } from '../pixel.js';
import { invertir, retirar, puedeComprar, costoMejora, perfilDisponible, PERFILES_RIESGO, formatoDinero, aum } from '../../core/economia.js';

export function render(ctx) {
  const estado = ctx.estado();
  const raiz = h('div.contenedor.columna');
  raiz.append(
    h('h1', {}, 'El fondo'),
    h(
      'p.secundario',
      {},
      'Tu capital puede quedarse en caja, invertirse en el fondo o gastarse en mejoras. El fondo rinde con cada actividad que completas, nunca por el paso del tiempo: no ganas ni pierdes nada por estar ausente.',
    ),
  );

  // --- Inversión ---
  const monto = h('input', { type: 'number', min: 0, step: 100, 'aria-label': 'Monto' });
  monto.value = Math.floor(estado.capital / 2);
  const mover = (fn, texto) => {
    const m = Math.max(0, Number(monto.value) || 0);
    const e = structuredClone(ctx.estado());
    const r = fn(e.fondo, e.capital, m);
    e.capital = r.capital;
    e.fondo = r.fondo;
    if (!e.fondo.historial.length && e.fondo.valor > 0) e.fondo.historial = [{ t: ctx.ahora(), valor: e.fondo.valor }];
    ctx.actualizar(e, { inmediato: true });
    ctx.sonido.moneda();
    toast(texto);
    ctx.ir('fondo');
  };
  const ganancia = estado.fondo.valor - estado.fondo.invertido;
  const grafico = graficoLinea({
    puntos: (estado.fondo.historial ?? []).map((p) => p.valor),
    alto: 200,
    formato: (v) => formatoDinero(v),
    etiquetaX: (i) => `actividad ${i + 1}`,
    referencia: estado.fondo.valor > 0 ? estado.fondo.invertido : null,
    titulo: 'Valor del fondo',
  });
  raiz.append(
    h(
      'div.rejilla-2',
      {},
      h(
        'div.panel.columna',
        {},
        h('h2', {}, 'Invertir'),
        h(
          'div.terminal',
          {},
          fila('Capital en caja', formatoDinero(estado.capital)),
          fila('Valor del fondo', formatoDinero(estado.fondo.valor)),
          fila('Ganancia acumulada', `${ganancia >= 0 ? '▲ +' : '▼ '}${formatoDinero(ganancia)}`),
          fila('AUM total', formatoDinero(aum(estado))),
        ),
        h(
          'div.fila',
          {},
          monto,
          h('button.primario', { onclick: () => mover(invertir, 'Capital invertido en el fondo') }, 'Invertir'),
          h('button', { onclick: () => mover(retirar, 'Capital retirado del fondo') }, 'Retirar'),
        ),
        h(
          'div.fila',
          {},
          [0.25, 0.5, 1].map((p) => h('button.pequeno', { onclick: () => (monto.value = Math.floor(estado.capital * p)) }, `${p * 100}% de la caja`)),
        ),
      ),
      h(
        'div.panel',
        {},
        h('h2', {}, 'Valor del fondo'),
        h('p.tenue', {}, 'La línea punteada es lo que invertiste. Cada punto es una actividad completada.'),
        grafico.elemento,
      ),
    ),
  );

  // --- Perfil de riesgo ---
  raiz.append(
    h(
      'div.panel.columna',
      {},
      h('h2', {}, 'Perfil de riesgo'),
      h('p.tenue', {}, 'Más retorno esperado viene con más volatilidad: es la idea central de las finanzas. Por actividad completada:'),
      h(
        'div.rejilla-3',
        {},
        Object.entries(PERFILES_RIESGO).map(([id, p]) => {
          const disponible = perfilDisponible(id, estado.mejoras);
          const activo = estado.fondo.riesgo === id;
          return h(
            'button.panel' + (activo ? '.resaltado' : ''),
            {
              disabled: !disponible,
              onclick: () => {
                const e = structuredClone(ctx.estado());
                e.fondo.riesgo = id;
                ctx.actualizar(e, { inmediato: true });
                ctx.ir('fondo');
              },
            },
            h('div', {}, `${p.nombre}${activo ? ' (actual)' : ''}`),
            h('div.tenue', {}, `Retorno medio ${(p.media * 100).toFixed(1)}% · volatilidad ${(p.desvio * 100).toFixed(1)}%`),
            !disponible ? h('div.ambar-t', {}, 'Requiere la Mesa de riesgo') : null,
          );
        }),
      ),
    ),
  );

  // --- Mejoras ---
  const lista = h('div.rejilla-3');
  for (const mejora of ctx.catalogo.mejoras) {
    const nivel = estado.mejoras[mejora.id] ?? 0;
    const chequeo = puedeComprar(mejora, nivel, estado.capital, estado.mejoras);
    const costo = costoMejora(mejora, nivel);
    lista.append(
      h(
        'div.panel.columna',
        {},
        h('div.fila', {}, h('strong', {}, mejora.nombre), h('span.chip', {}, `Nivel ${nivel}/${mejora.nivelMax}`)),
        h('p.secundario', {}, mejora.descripcion),
        h(
          'button' + (chequeo.ok ? '.primario' : ''),
          {
            disabled: !chequeo.ok,
            onclick: () => {
              const e = structuredClone(ctx.estado());
              const c = puedeComprar(mejora, e.mejoras[mejora.id] ?? 0, e.capital, e.mejoras);
              if (!c.ok) return;
              e.capital -= c.costo;
              e.mejoras[mejora.id] = (e.mejoras[mejora.id] ?? 0) + 1;
              ctx.actualizar(e, { inmediato: true });
              ctx.sonido.ascenso();
              toast(`${mejora.nombre}: nivel ${e.mejoras[mejora.id]}`);
              ctx.ir('fondo');
            },
          },
          nivel >= mejora.nivelMax ? 'Nivel máximo' : `Comprar · ${formatoDinero(costo)}`,
        ),
        !chequeo.ok && nivel < mejora.nivelMax ? h('span.tenue', {}, chequeo.motivo) : null,
      ),
    );
  }
  raiz.append(
    h(
      'div.panel',
      {},
      h('h2', {}, 'Mejoras de la oficina'),
      crearEscenaOficina(estado, { animado: false }),
      h('div', { estilo: { marginTop: '14px' } }, lista),
    ),
  );
  return raiz;
}

function fila(a, b) {
  return h('div.linea', {}, h('span.tenue', {}, a), h('span', {}, b));
}
