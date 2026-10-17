// Menú principal: continuar, nueva partida, cargar partida, importar un
// respaldo y salir. Hay 3 ranuras de partida; cada una guarda un progreso
// independiente (por ejemplo, para que juegue otra persona en la misma PC).

import { h, llenar, toast, confirmar } from '../dom.js';
import { crearEscenaOficina, iconoLenguaje } from '../pixel.js';
import { crearEstadoInicial, deserializar } from '../../core/estado.js';
import { rangoDeEstado, misionTerminada } from '../../core/progreso.js';
import { formatoDinero } from '../../core/economia.js';

function fecha(ms) {
  try {
    return new Date(ms).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

function resumen(ctx, e) {
  const rango = rangoDeEstado(e, ctx.catalogo.rangos);
  const misiones = Object.values(ctx.catalogo.misiones).filter((m) => misionTerminada(e, m.id)).length;
  const total = Object.keys(ctx.catalogo.misiones).length;
  return `${rango.actual.nombre} · ${formatoDinero(e.capital)} · ${misiones}/${total} misiones · ${fecha(e.ultimaVisita)}`;
}

export function render(ctx) {
  const raiz = h('div.contenedor.columna.menu-principal', { estilo: { maxWidth: '760px', gap: '18px' } });
  const botones = h('div.columna.menu-botones');
  const panelRanuras = h('div.columna');

  raiz.append(
    h(
      'div.panel.resaltado.columna',
      { estilo: { alignItems: 'center', textAlign: 'center' } },
      Object.assign(iconoLenguaje('finanzas'), { style: 'width:64px;height:64px' }),
      h('h1.verde', {}, 'CÓNDOR CAPITAL'),
      h('p.secundario', {}, 'De analista junior a dueño del fondo. Aprende Python, SQL, R, Power BI y Excel/VBA resolviendo casos reales de finanzas.'),
      crearEscenaOficina(ctx.estado() ?? crearEstadoInicial()),
    ),
    botones,
    panelRanuras,
  );

  let ranuras = [];

  async function cargarLista() {
    ranuras = await ctx.leerRanuras();
    pintarBotones();
  }

  function pintarBotones() {
    const ocupadas = ranuras.filter((r) => r.estado);
    const ultima = ocupadas.sort((a, b) => (b.estado.ultimaVisita ?? 0) - (a.estado.ultimaVisita ?? 0))[0];
    llenar(
      botones,
      ultima
        ? h('button.primario.grande', { onclick: () => ctx.abrirPartida(ultima.ranura, ultima.estado) }, `▶ Continuar: ${ultima.estado.jugador.nombre}`)
        : null,
      h('button.grande' + (ultima ? '' : '.primario'), { onclick: () => elegirRanura('nueva') }, '✚ Nueva partida'),
      ocupadas.length ? h('button.grande', { onclick: () => elegirRanura('cargar') }, '📂 Cargar partida') : null,
      h('button', { onclick: importar }, 'Importar respaldo'),
      ctx.plataforma.puedeSalir ? h('button', { onclick: () => ctx.plataforma.salir() }, 'Salir') : null,
    );
  }

  function elegirRanura(modo) {
    const titulo = modo === 'nueva' ? 'Nueva partida: elige una ranura' : 'Cargar partida';
    llenar(
      panelRanuras,
      h(
        'div.panel.columna',
        {},
        h('h2', {}, titulo),
        ranuras
          .filter((r) => modo === 'nueva' || r.estado)
          .map((r) =>
            h(
              'div.ranura',
              {},
              h(
                'div.columna',
                { estilo: { gap: '2px' } },
                h('strong', {}, `Ranura ${r.ranura}: ${r.estado ? r.estado.jugador.nombre : 'vacía'}`),
                h('span.tenue', {}, r.estado ? resumen(ctx, r.estado) : 'Sin partida guardada'),
              ),
              h('span.espaciador'),
              modo === 'cargar'
                ? h('button.primario', { onclick: () => ctx.abrirPartida(r.ranura, r.estado) }, 'Cargar')
                : h('button.primario', { onclick: () => nueva(r) }, r.estado ? 'Usar (reemplaza)' : 'Empezar aquí'),
              r.estado ? h('button.pequeno.peligro', { onclick: () => borrar(r) }, 'Borrar') : null,
            ),
          ),
        h('button.pequeno', { onclick: () => llenar(panelRanuras) }, 'Cerrar'),
      ),
    );
  }

  async function nueva(r) {
    if (
      r.estado &&
      !(await confirmar(`La ranura ${r.ranura} tiene la partida de ${r.estado.jugador.nombre}. ¿Reemplazarla por una nueva?`, { si: 'Sí, reemplazar' }))
    )
      return;
    if (r.estado) await ctx.borrarPartida(r.ranura);
    await ctx.nuevaPartida(r.ranura);
  }

  async function borrar(r) {
    if (!(await confirmar(`¿Borrar la partida de ${r.estado.jugador.nombre} (ranura ${r.ranura})?`, { si: 'Sí, borrar' }))) return;
    await ctx.borrarPartida(r.ranura);
    toast('Partida borrada');
    llenar(panelRanuras);
    await cargarLista();
  }

  async function importar() {
    const archivo = await ctx.plataforma.importarArchivo(['json']);
    if (!archivo) return;
    const e = deserializar(archivo.contenido, ctx.ahora());
    if (!e?.jugador?.nombre) return toast('Ese archivo no es un respaldo válido');
    const libre = ranuras.find((r) => !r.estado);
    if (libre) return ctx.abrirPartida(libre.ranura, e);
    toast('Las 3 ranuras están ocupadas: borra una para importar el respaldo.');
    elegirRanura('cargar');
  }

  cargarLista();
  return raiz;
}
