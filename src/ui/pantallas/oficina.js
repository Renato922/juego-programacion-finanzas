// La oficina: el centro del juego. Muestra tu escritorio (que crece con las
// mejoras), el siguiente paso recomendado y el estado del fondo.

import { h } from '../dom.js';
import { crearEscenaOficina } from '../pixel.js';
import { graficoLinea } from '../grafico.js';
import { siguientePaso, estadoMision, metaSemanal, rangoDeEstado } from '../../core/progreso.js';
import { tarjetasVencidas } from '../../core/srs.js';
import { aum, formatoDinero, PERFILES_RIESGO } from '../../core/economia.js';
import { NOMBRE_LENGUAJE } from '../../contenido/conceptos.js';
import { generarPrecios } from '../../contenido/datos/fondo-condor.js';

export function ejecutarAccion(ctx, tipo) {
  const estado = ctx.estado();
  const paso = siguientePaso(estado, ctx.catalogo, ctx.ahora());
  if (tipo === 'continuar' && estado.enCurso) return abrirMision(ctx, estado.enCurso.misionId);
  if (tipo === 'repaso') return ctx.ir('entrenamiento', { rondas: 3, rapido: true });
  if (paso.tipo === 'repaso') return ctx.ir('entrenamiento', { rondas: paso.cantidad, rapido: estado.ajustes.energiaBaja });
  if (paso.tipo === 'entrenamiento') return ctx.ir('entrenamiento', {});
  return abrirMision(ctx, paso.misionId);
}

export function abrirMision(ctx, id) {
  const m = ctx.catalogo.misiones[id];
  ctx.ir(m.tipo === 'jefe' ? 'jefe' : 'mision', { id });
}

export function render(ctx) {
  const estado = ctx.estado();
  const ahora = ctx.ahora();
  const paso = siguientePaso(estado, ctx.catalogo, ahora);
  const vencidas = tarjetasVencidas(estado.tarjetas, ahora).length;
  const semana = metaSemanal(estado, ahora);
  const rango = rangoDeEstado(estado, ctx.catalogo.rangos);

  const izquierda = h('div.columna');
  izquierda.append(
    crearEscenaOficina(estado, { animado: estado.ajustes.animaciones }),
    h('div.cinta', { 'aria-hidden': 'true' }, h('span', {}, textoCinta(estado))),
  );

  const etiquetaTipo = { continuar: 'Continuar', mision: 'Siguiente misión', jefe: '¡Jefe del capítulo!', repaso: 'Repaso', entrenamiento: 'Entrenamiento' };
  const misionSugerida = paso.misionId ? ctx.catalogo.misiones[paso.misionId] : null;
  izquierda.append(
    h(
      'div.panel.resaltado.siguiente-paso',
      {},
      h(
        'div',
        {},
        h('div.titulo', {}, etiquetaTipo[paso.tipo] ?? 'Siguiente'),
        h('div', { estilo: { fontSize: '26px' } }, paso.texto),
        misionSugerida
          ? h(
              'div.fila',
              { estilo: { marginTop: '6px' } },
              chipLenguaje(misionSugerida),
              h('span.tenue', {}, `${misionSugerida.duracion} · ${misionSugerida.resumen}`),
            )
          : null,
      ),
      h(
        'button.primario.grande',
        { onclick: () => (ctx.sonido.clic(), ejecutarAccion(ctx, paso.tipo === 'continuar' ? 'continuar' : 'siguiente')) },
        'Jugar ▸',
      ),
    ),
  );

  const disponibles = ctx.catalogo.capitulos
    .filter((c) => c.disponible)
    .flatMap((c) => [...c.misiones, c.jefe])
    .map((id) => ctx.catalogo.misiones[id])
    .filter((m) => ['disponible', 'en-curso'].includes(estadoMision(m, estado)) && m.id !== paso.misionId);
  if (disponibles.length) {
    izquierda.append(
      h(
        'div.panel',
        {},
        h('h3', {}, 'También puedes elegir'),
        disponibles
          .slice(0, 3)
          .map((m) =>
            h(
              'button.nodo.disponible',
              { onclick: () => abrirMision(ctx, m.id) },
              h('span.icono-estado', {}, m.tipo === 'jefe' ? '☠' : '▸'),
              chipLenguaje(m),
              h('span', {}, m.titulo),
              h('span.tenue', {}, m.duracion),
            ),
          ),
      ),
    );
  }

  const derecha = h('div.columna');
  const historial = estado.fondo.historial ?? [];
  const grafico = graficoLinea({
    puntos: historial.map((p) => p.valor),
    alto: 150,
    formato: (v) => formatoDinero(v),
    etiquetaX: (i) => `actividad ${i + 1}`,
    referencia: estado.fondo.valor > 0 ? estado.fondo.invertido : null,
    titulo: 'Valor del fondo por actividad',
  });
  const ganancia = estado.fondo.valor - estado.fondo.invertido;
  derecha.append(
    h(
      'div.terminal',
      {},
      h('h3.verde', {}, '> TERMINAL CÓNDOR'),
      linea('Rango', rango.actual.nombre),
      linea('Capital disponible', formatoDinero(estado.capital)),
      linea('Fondo invertido', estado.fondo.valor > 0 ? formatoDinero(estado.fondo.valor) : '—'),
      linea('Resultado del fondo', estado.fondo.valor > 0 ? `${ganancia >= 0 ? '▲ +' : '▼ '}${formatoDinero(ganancia)}` : '—'),
      linea('Perfil de riesgo', PERFILES_RIESGO[estado.fondo.riesgo]?.nombre ?? '—'),
      linea('AUM total', formatoDinero(aum(estado))),
      linea('Días activos (total)', String(estado.estadisticas.totalDiasActivos)),
    ),
    h(
      'div.panel',
      {},
      h('h3', {}, 'Valor del fondo'),
      estado.fondo.valor > 0
        ? grafico.elemento
        : h(
            'p.tenue',
            {},
            'Todavía no invertiste en el fondo. En la sección Fondo puedes invertir tu capital: rinde con cada actividad que completes, nunca por el paso del tiempo.',
          ),
    ),
    h(
      'div.panel.columna',
      {},
      h('h3', {}, 'Esta semana'),
      h(
        'div.fila',
        {},
        h(
          'div.puntos-semana',
          {},
          Array.from({ length: semana.meta }, (_, i) => h('i' + (i < semana.hechos ? '.lleno' : ''))),
        ),
        h('span', {}, `${semana.hechos} de ${semana.meta} días`),
      ),
      h(
        'p.tenue',
        {},
        semana.cumplida
          ? '¡Meta semanal cumplida! Todo lo que hagas ahora es extra.'
          : 'Meta flexible: los días no tienen que ser seguidos y no se pierde nada si no llegas.',
      ),
      vencidas
        ? h(
            'button.ambar',
            { onclick: () => ctx.ir('entrenamiento', { rondas: Math.min(5, vencidas) }) },
            `Repasar ${Math.min(vencidas, 5)} conceptos (pagan doble)`,
          )
        : h('p.tenue', {}, 'No hay repasos pendientes hoy.'),
      h('button', { onclick: () => ctx.ir('entrenamiento', { rondas: 3, rapido: true }) }, '🔋 Poca energía: 2 minutos'),
    ),
  );

  return h('div.contenedor', {}, h('div.oficina', {}, izquierda, derecha));
}

function linea(etiqueta, valor) {
  return h('div.linea', {}, h('span.tenue', {}, etiqueta), h('span', {}, valor));
}

function chipLenguaje(m) {
  const leng = m.tipo === 'jefe' ? 'jefe' : m.lenguaje;
  return h('span.chip.' + leng, {}, m.tipo === 'jefe' ? 'JEFE' : (NOMBRE_LENGUAJE[m.lenguaje] ?? m.lenguaje));
}

function textoCinta(estado) {
  const precios = generarPrecios();
  const tickers = [...new Set(precios.map((p) => p[0]))];
  const cotizaciones = tickers.map((t) => {
    const serie = precios.filter((p) => p[0] === t).map((p) => p[2]);
    const [antes, ahora] = serie.slice(-2);
    return `${t} ${ahora.toFixed(2)} ${ahora >= antes ? '▲' : '▼'}`;
  });
  const datos = [
    ...cotizaciones,
    'DATO REAL: desempleo EE. UU. 2009T3 = 9.6% (BLS)',
    'DATO REAL: inflación EE. UU. 1980T1 = 14.6% anualizada (FRED)',
    'DATO REAL: T-bill a 3 meses 2008T4 = 0.12% (FRED)',
    `TU FONDO: ${formatoDinero(estado.fondo.valor)}`,
  ];
  return datos.join('   ·   ');
}
