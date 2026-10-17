// Punto de entrada de la interfaz: estado, guardado, HUD y navegación.

import { h, vaciar, modal } from './dom.js';
import { CATALOGO } from '../contenido/index.js';
import { crearEstadoInicial, deserializar, serializar } from '../core/estado.js';
import { rangoDeEstado, metaSemanal } from '../core/progreso.js';
import { tarjetasVencidas, repartirAtrasadas } from '../core/srs.js';
import { aum, formatoDinero } from '../core/economia.js';
import { mensajeDeRegreso } from '../core/regreso.js';
import { plataforma, RANURAS } from '../plataforma/index.js';
import { crearMotores } from '../runtimes/motores.js';
import { sonido, configurarSonido } from './sonido.js';
import { iconoLenguaje } from './pixel.js';

import * as menu from './pantallas/menu.js';
import * as inicio from './pantallas/inicio.js';
import * as diagnostico from './pantallas/diagnostico.js';
import * as oficina from './pantallas/oficina.js';
import * as mapa from './pantallas/mapa.js';
import * as mision from './pantallas/mision.js';
import * as jefe from './pantallas/jefe.js';
import * as entrenamiento from './pantallas/entrenamiento.js';
import * as fondo from './pantallas/fondo.js';
import * as coleccion from './pantallas/coleccion.js';
import * as herramientas from './pantallas/herramientas.js';
import * as ajustes from './pantallas/ajustes.js';

const PANTALLAS = { menu, inicio, diagnostico, oficina, mapa, mision, jefe, entrenamiento, fondo, coleccion, herramientas, ajustes };
const NAV = [
  ['oficina', 'Oficina'],
  ['mapa', 'Carrera'],
  ['entrenamiento', 'Trading'],
  ['fondo', 'Fondo'],
  ['coleccion', 'Cartas'],
  ['herramientas', 'Herramientas'],
  ['ajustes', 'Ajustes'],
];

let estado = null;
let ranura = null; // ranura de partida en uso (1..RANURAS)
let pantallaActual = null;
let temporizadorGuardado = null;
const raiz = document.getElementById('app');
const hud = h('header.hud');
const contenido = h('main.pantalla');

const ctx = {
  catalogo: CATALOGO,
  plataforma,
  sonido,
  motores: crearMotores({ alCambiarEstado: () => {} }),
  estado: () => estado,
  ahora: () => Date.now(),
  // Reemplaza el estado y guarda (con una pequeña espera para agrupar cambios).
  actualizar(nuevo, { inmediato = false } = {}) {
    estado = nuevo;
    aplicarAjustes();
    pintarHUD();
    clearTimeout(temporizadorGuardado);
    if (inmediato) guardar();
    else temporizadorGuardado = setTimeout(guardar, 400);
  },
  ir(nombre, params = {}) {
    pantallaActual = nombre;
    vaciar(contenido);
    contenido.scrollTop = 0;
    const p = PANTALLAS[nombre];
    contenido.append(p.render(ctx, params));
    pintarHUD();
  },
  async reiniciarPartida() {
    estado = crearEstadoInicial(Date.now());
    await guardar();
    ctx.ir('inicio');
  },

  // ---- Menú principal y ranuras de partida ----
  ranuraActual: () => ranura,
  async leerRanuras() {
    const ahora = Date.now();
    const lista = [];
    for (let n = 1; n <= RANURAS; n++) {
      const texto = await plataforma.leerPartida(n);
      const e = texto ? deserializar(texto, ahora) : null;
      lista.push({ ranura: n, estado: e?.jugador?.nombre ? e : null });
    }
    return lista;
  },
  async irAlMenu() {
    clearTimeout(temporizadorGuardado);
    await guardar();
    ctx.ir('menu');
  },
  async nuevaPartida(n) {
    ranura = n;
    estado = crearEstadoInicial(Date.now());
    aplicarAjustes();
    await guardar();
    ctx.ir('inicio');
  },
  // e: estado ya leído de la ranura (o de un respaldo importado).
  async abrirPartida(n, e) {
    ranura = n;
    const ahora = Date.now();
    if (!e?.jugador?.nombre) return ctx.nuevaPartida(n);
    // Si volvió después de mucho, se reparte la pila de repasos (nada se pierde).
    const vencidas = tarjetasVencidas(e.tarjetas, ahora).length;
    const mensaje = mensajeDeRegreso(e, ahora, { vencidas });
    estado = { ...e, tarjetas: repartirAtrasadas(e.tarjetas, ahora, e.ajustes.energiaBaja ? 3 : 8), ultimaVisita: ahora };
    aplicarAjustes();
    ctx.ir('oficina');
    await guardar();
    if (mensaje) mostrarRegreso(mensaje);
  },
  async borrarPartida(n) {
    if (n === ranura) {
      ranura = null;
      estado = null;
    }
    await plataforma.borrarPartida(n);
  },
};

async function guardar() {
  if (!estado || !ranura) return;
  await plataforma.guardarPartida(ranura, serializar(estado));
}

function aplicarAjustes() {
  if (!estado) return;
  configurarSonido(estado.ajustes.sonido);
  document.body.classList.toggle('sin-animaciones', !estado.ajustes.animaciones);
}

function pintarHUD() {
  vaciar(hud);
  if (!estado || pantallaActual === 'menu' || pantallaActual === 'inicio' || pantallaActual === 'diagnostico') {
    hud.append(h('div.logo', {}, iconoLenguaje('finanzas'), 'CÓNDOR CAPITAL'));
    return;
  }
  const rango = rangoDeEstado(estado, CATALOGO.rangos);
  const semana = metaSemanal(estado, Date.now());
  const vencidas = tarjetasVencidas(estado.tarjetas, Date.now()).length;
  const barra = h(
    'div.barra',
    { title: rango.esperaJefe ? 'Vence al jefe del capítulo para ascender' : '' },
    h('span', { estilo: { width: `${Math.round(rango.progreso * 100)}%` } }),
  );
  const piezas = [
    h(
      'div.logo',
      { onclick: () => ctx.ir('oficina'), title: 'Ir a la oficina' },
      Object.assign(iconoLenguaje('finanzas'), { style: 'width:24px;height:24px' }),
      'CÓNDOR',
    ),
    h(
      'div.dato',
      { estilo: { minWidth: '170px' } },
      h('span.etiqueta', {}, rango.actual.nombre),
      barra,
      h(
        'span.tenue',
        { estilo: { fontSize: '15px' } },
        rango.siguiente ? (rango.esperaJefe ? 'Listo para ascender: vence al jefe' : `${estado.xp} / ${rango.siguiente.xp} XP`) : `${estado.xp} XP`,
      ),
    ),
    h('div.dato', {}, h('span.etiqueta', {}, 'Capital'), h('span.valor', {}, formatoDinero(estado.capital))),
    h('div.dato', {}, h('span.etiqueta', {}, 'AUM'), h('span.valor', {}, formatoDinero(aum(estado)))),
    h(
      'div.dato',
      { title: `Meta semanal flexible: ${semana.meta} días. Nunca se pierde nada por no llegar.` },
      h('span.etiqueta', {}, 'Semana'),
      h(
        'div.puntos-semana',
        {},
        Array.from({ length: semana.meta }, (_, i) => h('i' + (i < semana.hechos ? '.lleno' : ''))),
      ),
    ),
    vencidas ? h('div.dato', {}, h('span.etiqueta', {}, 'Repasos'), h('span.valor.ambar-t', {}, `${vencidas} ×2`)) : null,
    h('div.espaciador'),
    h(
      'nav',
      { 'aria-label': 'Secciones' },
      NAV.map(([id, texto]) => h('button' + (pantallaActual === id ? '.activa' : ''), { onclick: () => (sonido.clic(), ctx.ir(id)) }, texto)),
      h('button', { onclick: () => (sonido.clic(), ctx.irAlMenu()), title: 'Guardar y volver al menú principal' }, '☰ Menú'),
    ),
  ];
  hud.append(...piezas.filter(Boolean));
}

async function arrancar() {
  raiz.textContent = '';
  raiz.append(hud, contenido);
  ctx.ir('menu');
}

function mostrarRegreso(mensaje) {
  const m = modal(
    h(
      'div.columna',
      {},
      h('h2', {}, mensaje.compromiso ? 'Tu motivo sigue aquí' : 'Hola de nuevo'),
      mensaje.lineas.map((l) => h('p', {}, l)),
      h(
        'div.fila',
        {},
        h(
          'button.primario',
          {
            onclick: () => {
              m.cerrar();
              oficina.ejecutarAccion(ctx, mensaje.accion.tipo);
            },
          },
          mensaje.accion.texto,
        ),
        h('button', { onclick: () => m.cerrar() }, 'Solo mirar la oficina'),
      ),
    ),
  );
}

window.addEventListener('beforeunload', () => {
  if (estado && ranura) plataforma.guardarPartida(ranura, serializar(estado));
});

arrancar().catch((e) => {
  console.error(e);
  raiz.textContent = `No se pudo iniciar el juego: ${e.message}`;
});
