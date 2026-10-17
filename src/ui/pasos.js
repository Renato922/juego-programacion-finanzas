// Componentes de cada tipo de paso: diálogo, lección, ejercicio de código,
// quiz de opción múltiple y "completar". Los usan misiones, jefes y la
// Sala de trading.
//
// renderPaso(paso, ctx, { modo, alCompletar, alFallar, borrador, alCambiarBorrador })
//   modo: 'mision' | 'jefe' | 'repaso'
//   alCompletar(desempeno) se llama cuando el paso queda resuelto.
//   alFallar(desempeno) se llama en cada respuesta equivocada (no en errores
//   internos del motor). Si devuelve un texto, se muestra en la
//   retroalimentación: por ejemplo "Perdiste una vida" o "La barra de dominio
//   bajó un paso".

import { h, markdown, plantilla, vaciar, llenar } from './dom.js';
import { retrato } from './pixel.js';
import { crearEditor } from './editor.js';
import { evaluarEjercicio, ejecutarLibre } from '../core/evaluador.js';
import { traducirErrorPython, traducirErrorSQL } from '../core/errores.js';
import { validarRespuestaEscrita } from '../core/validacion.js';
import { DESCRIPCION_TABLAS } from '../contenido/datos/fondo-condor.js';
import { NOMBRE_LENGUAJE } from '../contenido/conceptos.js';
import { TAMANO_APROX_PYODIDE_MB } from '../runtimes/versiones.js';

const ELOGIOS = [
  '¡Exacto!',
  '¡Impecable!',
  'Así se hace.',
  '¡Cuadra perfecto!',
  'Marta estaría orgullosa.',
  '¡Directo al informe!',
  'Eso es trabajo de senior.',
];

export function renderPaso(paso, ctx, opciones = {}) {
  switch (paso.tipo) {
    case 'dialogo':
      return renderDialogo(paso.lineas, ctx, opciones);
    case 'leccion':
      return renderLeccion(paso, ctx, opciones);
    case 'ejercicio':
      return renderEjercicio(paso, ctx, opciones);
    case 'quiz':
    case 'opcion':
      return renderQuiz(paso, ctx, opciones);
    case 'completar':
      return renderCompletar(paso, ctx, opciones);
    default:
      return h('p', {}, `Paso desconocido: ${paso.tipo}`);
  }
}

// ---------- Diálogo ----------

export function renderDialogo(lineas, ctx, { alCompletar, textoBoton = 'Continuar' }) {
  const contenedor = h('div.columna');
  let i = 0;
  let escribiendo = null;
  const caja = h('div.panel.dialogo');
  const boton = h('button.primario', { onclick: avanzar }, 'Siguiente ▸');
  const saltar = h('button.pequeno', { onclick: () => terminar() }, 'Saltar diálogo');
  contenedor.append(caja, h('div.fila', {}, boton, saltar, h('span.tenue', {}, 'Enter o clic para avanzar')));

  function mostrar() {
    const linea = lineas[i];
    const persona = ctx.catalogo.personajes[linea.quien] ?? { nombre: linea.quien, cargo: '' };
    const texto = plantilla(linea.texto, ctx.estado());
    const parrafo = h('p');
    llenar(
      caja,
      h('div.retrato', {}, Object.assign(retrato(persona.sprite ?? linea.quien), { style: 'width:100%;height:100%' })),
      h(
        'div.burbuja',
        {},
        h('div.quien', { estilo: { color: persona.color } }, plantilla(persona.nombre, ctx.estado())),
        h('div.cargo', {}, persona.cargo),
        parrafo,
      ),
    );
    clearInterval(escribiendo);
    if (ctx.estado().ajustes.textoRapido || !ctx.estado().ajustes.animaciones) {
      parrafo.textContent = texto;
    } else {
      let n = 0;
      escribiendo = setInterval(() => {
        n += 2;
        parrafo.textContent = texto.slice(0, n);
        if (n >= texto.length) clearInterval(escribiendo);
      }, 18);
      parrafo.dataset.completo = texto;
    }
    boton.textContent = i === lineas.length - 1 ? `${textoBoton} ▸` : 'Siguiente ▸';
    boton.focus();
  }

  function avanzar() {
    const p = caja.querySelector('p');
    if (p?.dataset.completo && p.textContent.length < p.dataset.completo.length) {
      clearInterval(escribiendo);
      p.textContent = p.dataset.completo;
      return;
    }
    ctx.sonido.clic();
    if (i < lineas.length - 1) {
      i++;
      mostrar();
    } else terminar();
  }

  function terminar() {
    clearInterval(escribiendo);
    document.removeEventListener('keydown', tecla);
    alCompletar?.({});
  }

  function tecla(e) {
    if (!contenedor.isConnected) return document.removeEventListener('keydown', tecla);
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('input,textarea,.CodeMirror')) {
      e.preventDefault();
      avanzar();
    }
  }
  document.addEventListener('keydown', tecla);
  caja.addEventListener('click', avanzar);
  mostrar();
  return contenedor;
}

// ---------- Lección ----------

function renderLeccion(paso, ctx, { alCompletar }) {
  const salida = h('div.consola.oculto');
  const izquierda = h(
    'div.panel.texto-leccion',
    {},
    h('h2', {}, paso.titulo),
    h('div', { html: markdown(plantilla(paso.texto, ctx.estado())) }),
    h('button.primario', { onclick: () => alCompletar?.({}) }, 'Entendido ▸'),
  );
  if (!paso.codigo) return h('div', {}, izquierda);
  const ejecutar = async () => {
    salida.classList.remove('oculto');
    llenar(salida, h('span.tenue', {}, mensajeCarga(ctx, paso.lenguaje)));
    try {
      const r = await ejecutarLibre(paso.lenguaje, paso.codigo, ctx.motores, paso.db);
      mostrarResultado(salida, r, paso.lenguaje);
    } catch (e) {
      mostrarFalloMotor(salida, e, paso.lenguaje);
    }
  };
  const derecha = h(
    'div.columna',
    {},
    h('div.fila', {}, h('span.chip.' + paso.lenguaje, {}, NOMBRE_LENGUAJE[paso.lenguaje]), h('span.tenue', {}, 'Ejemplo resuelto')),
    h('pre.codigo-muestra', {}, paso.codigo),
    h('div.fila', {}, h('button', { onclick: ejecutar }, '▶ Ejecutar ejemplo')),
    salida,
  );
  ctx.motores.precargar(paso.lenguaje);
  return h('div.area-mision', {}, izquierda, derecha);
}

function mensajeCarga(ctx, lenguaje) {
  if (lenguaje === 'python' && ctx.motores.estado('python') !== 'listo') {
    return `Preparando Python… La primera vez se descargan unos ${TAMANO_APROX_PYODIDE_MB} MB; después queda guardado y abre rápido.`;
  }
  return 'Ejecutando…';
}

function mostrarFalloMotor(salida, e, lenguaje) {
  llenar(
    salida,
    h('div.error', {}, `No se pudo iniciar ${NOMBRE_LENGUAJE[lenguaje]}: ${e.message}`),
    h(
      'div.tenue',
      {},
      lenguaje === 'python' ? 'La primera vez se necesita internet para descargar Python. Revisa tu conexión y vuelve a intentar.' : 'Vuelve a intentar.',
    ),
  );
}

function tablaResultado(res, max = 60) {
  if (!res.columnas?.length) return h('div.tenue', {}, res.vacia ? 'La consulta no devolvió una tabla.' : 'Sin filas.');
  return h(
    'div',
    {},
    h(
      'table.tabla-resultado',
      {},
      h(
        'thead',
        {},
        h(
          'tr',
          {},
          res.columnas.map((c) => h('th', {}, c)),
        ),
      ),
      h(
        'tbody',
        {},
        res.filas.slice(0, max).map((f) =>
          h(
            'tr',
            {},
            f.map((v) => h('td', {}, v === null ? 'NULL' : typeof v === 'number' ? String(Math.round(v * 1e6) / 1e6) : String(v))),
          ),
        ),
      ),
    ),
    h('div.tenue', {}, `${res.filas.length} fila(s)${res.filas.length > max ? ` · se muestran ${max}` : ''}`),
  );
}

function mostrarResultado(salida, r, lenguaje) {
  vaciar(salida);
  if (lenguaje === 'python') {
    if (r.stdout) salida.append(h('div', {}, r.stdout));
    if (r.error) {
      const e = traducirErrorPython(r.error);
      salida.append(h('div.error', {}, `${e.original}${e.linea ? ` (línea ${e.linea})` : ''}`));
    }
    if (!r.stdout && !r.error) salida.append(h('span.tenue', {}, 'Se ejecutó sin imprimir nada. Usa print() para ver valores.'));
  } else {
    if (!r.ok) salida.append(h('div.error', {}, traducirErrorSQL(r.error).original));
    else salida.append(tablaResultado(r));
  }
}

// ---------- Ejercicio de código ----------

function renderEjercicio(paso, ctx, { alCompletar, alFallar, borrador, alCambiarBorrador, modo = 'mision' }) {
  const desempeno = { concepto: paso.concepto, correcto: false, intentosFallidos: 0, pistas: 0, pistaFinal: false };
  let resuelto = false;
  const pistas = paso.pistas ?? [];

  const consola = h(
    'div.consola',
    {},
    h('span.tenue', {}, paso.lenguaje === 'sql' ? 'Aquí verás la tabla de resultados.' : 'Aquí verás lo que imprime tu código.'),
  );
  const retro = h('div');
  const listaPistas = h('div.pistas-lista');
  const estadoMotor = h('div.estado-motor');
  const editor = crearEditor({
    valor: borrador ?? paso.inicial ?? '',
    lenguaje: paso.lenguaje,
    alEjecutar: ejecutar,
    alComprobar: comprobar,
  });
  editor.alCambiar((v) => alCambiarBorrador?.(v));

  const botonPista = h('button.ambar', { onclick: abrirPista }, textoPista());
  const botonEjecutar = h('button', { onclick: ejecutar, title: 'Shift + Enter' }, '▶ Ejecutar');
  const botonComprobar = h('button.primario', { onclick: comprobar, title: 'Ctrl + Enter' }, '✔ Comprobar');
  const botonReiniciar = h(
    'button.pequeno',
    {
      onclick: () => {
        editor.fijar(paso.inicial ?? '');
        editor.enfocar();
      },
    },
    'Reiniciar código',
  );
  const botonRendirse =
    modo === 'repaso'
      ? h(
          'button.pequeno',
          {
            onclick: () => {
              editor.fijar(paso.solucion);
              resuelto = true;
              llenar(
                retro,
                h(
                  'div.retro.mal',
                  {},
                  h('div.titulo.ambar-t', {}, 'Así se resolvía'),
                  bloqueExplicacion(),
                  h('button.primario', { onclick: () => terminar(false) }, 'Continuar ▸'),
                ),
              );
              ocupado(true);
            },
          },
          'Ver solución y seguir',
        )
      : null;

  function textoPista() {
    return pistas.length ? `💡 Pista (${desempeno.pistas}/${pistas.length})` : 'Sin pistas';
  }

  function abrirPista() {
    if (desempeno.pistas >= pistas.length) return;
    const texto = pistas[desempeno.pistas];
    desempeno.pistas++;
    if (desempeno.pistas === pistas.length) desempeno.pistaFinal = pistas.length >= 3;
    const esCodigo = /\n|=|\(/.test(texto) && desempeno.pistas === pistas.length;
    listaPistas.append(
      h('div.pista-item', {}, h('div.tenue', {}, `Pista ${desempeno.pistas}`), esCodigo ? h('pre', {}, texto) : h('div', { html: markdown(texto) })),
    );
    botonPista.textContent = textoPista();
    botonPista.disabled = desempeno.pistas >= pistas.length;
    botonPista.style.animation = '';
  }

  function actualizarMotor() {
    const e = ctx.motores.estado(paso.lenguaje);
    estadoMotor.className = 'estado-motor ' + e;
    const textos = {
      apagado: `${NOMBRE_LENGUAJE[paso.lenguaje]}: se inicia al ejecutar`,
      cargando:
        paso.lenguaje === 'python' ? `Python: preparando (la primera vez descarga ~${TAMANO_APROX_PYODIDE_MB} MB)…` : 'SQL: preparando la base de datos…',
      listo: `${NOMBRE_LENGUAJE[paso.lenguaje]}: listo`,
      error: `${NOMBRE_LENGUAJE[paso.lenguaje]}: error al iniciar (¿sin internet la primera vez?)`,
    };
    llenar(estadoMotor, h('span.punto'), textos[e] ?? e);
  }
  const intervaloMotor = setInterval(() => {
    if (!estadoMotor.isConnected) return clearInterval(intervaloMotor);
    actualizarMotor();
  }, 500);
  actualizarMotor();
  ctx.motores.precargar(paso.lenguaje);

  function ocupado(si) {
    for (const b of [botonEjecutar, botonComprobar]) b.disabled = si || resuelto;
  }

  async function ejecutar() {
    if (resuelto) return;
    ocupado(true);
    llenar(consola, h('span.tenue', {}, mensajeCarga(ctx, paso.lenguaje)));
    try {
      const r = await ejecutarLibre(paso.lenguaje, editor.valor(), ctx.motores, paso.db);
      mostrarResultado(consola, r, paso.lenguaje);
      editor.marcarLinea(r.error?.linea);
    } catch (e) {
      mostrarFalloMotor(consola, e, paso.lenguaje);
    }
    ocupado(false);
  }

  async function comprobar() {
    if (resuelto) return;
    ocupado(true);
    llenar(consola, h('span.tenue', {}, mensajeCarga(ctx, paso.lenguaje)));
    let v;
    try {
      v = await evaluarEjercicio(paso, editor.valor(), ctx.motores);
    } catch (e) {
      mostrarFalloMotor(consola, e, paso.lenguaje);
      ocupado(false);
      return;
    }
    vaciar(consola);
    if (paso.lenguaje === 'python') {
      consola.append(v.salida ? h('div', {}, v.salida) : h('span.tenue', {}, '(sin salida)'));
    } else if (v.tabla) {
      consola.append(tablaResultado(v.tabla));
    }
    editor.marcarLinea(v.error?.linea);
    if (v.ok) {
      exito();
    } else {
      fallo(v);
    }
    ocupado(false);
  }

  // "Cómo se resuelve": la solución de referencia explicada (ejemplo resuelto
  // después de practicar). Se muestra al acertar y al pedir la solución.
  function bloqueExplicacion() {
    if (!paso.explicacion && !paso.solucion) return null;
    return h(
      'details.explicacion',
      { open: true },
      h('summary', {}, 'Cómo se resuelve'),
      paso.solucion ? h('pre.codigo-muestra', {}, paso.solucion) : null,
      paso.explicacion ? h('div', { html: markdown(plantilla(paso.explicacion, ctx.estado())) }) : null,
      h('p.tenue', {}, 'Si tu solución es distinta pero el juego la aceptó, también está bien: hay varias formas correctas.'),
    );
  }

  function exito() {
    resuelto = true;
    desempeno.correcto = true;
    const limpio = desempeno.intentosFallidos === 0 && desempeno.pistas === 0;
    ctx.sonido.acierto();
    const elogio = ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)];
    llenar(
      retro,
      h(
        'div.retro.ok',
        {},
        h('div.titulo.verde', {}, elogio),
        h(
          'p',
          {},
          limpio
            ? 'Resuelto a la primera y sin pistas: suma al bono de ejercicio limpio.'
            : 'Resuelto. Cada error que corregiste también cuenta como práctica.',
        ),
        bloqueExplicacion(),
        h('button.primario', { onclick: () => terminar(true) }, 'Continuar ▸'),
      ),
    );
    retro.querySelector('button.primario').focus();
    botonPista.disabled = true;
    botonReiniciar.disabled = true;
    if (botonRendirse) botonRendirse.disabled = true;
  }

  function fallo(v) {
    desempeno.intentosFallidos++;
    ctx.sonido.error();
    const aviso = v.interno ? null : alFallar?.(desempeno);
    const caja = h('div.retro.mal');
    const mostrarEsperado = desempeno.intentosFallidos >= 2;
    if (v.interno) {
      caja.append(h('div.titulo.rojo', {}, 'Problema interno'), h('p', {}, v.fallas[0]?.mensaje));
    } else if (v.error) {
      const e = v.error;
      caja.append(
        h('div.titulo.rojo', {}, e.titulo + (e.linea ? ` · línea ${e.linea}` : '')),
        h('p', {}, e.explicacion),
        h('p', {}, h('strong', {}, 'Consejo: '), e.consejo),
        h('code', {}, e.original),
      );
    } else if (v.verificaciones?.length > 1) {
      // Lista de verificaciones: deja claro qué parte ya está bien y qué falta.
      caja.append(
        h('div.titulo.ambar-t', {}, 'Todavía no: vas bien en parte'),
        h(
          'ul.verificaciones',
          {},
          v.verificaciones.map((c) =>
            c.ok
              ? h('li.ok', {}, h('span.verde', {}, '✔ '), `Correcto: ${c.etiqueta}`)
              : h(
                  'li.mal',
                  {},
                  h('span.rojo', {}, '✘ '),
                  c.mensaje,
                  c.ayuda ? h('div', {}, h('strong', {}, 'Consejo: '), c.ayuda) : null,
                  mostrarEsperado && c.esperado ? h('div.tenue', {}, `Esperado: ${c.esperado}`) : null,
                ),
          ),
        ),
      );
    } else {
      caja.append(
        h('div.titulo.ambar-t', {}, 'Todavía no'),
        h(
          'ul',
          {},
          v.fallas.map((f) =>
            h(
              'li',
              {},
              f.mensaje,
              f.ayuda ? h('div', {}, h('strong', {}, 'Consejo: '), f.ayuda) : null,
              mostrarEsperado && f.esperado ? h('div.tenue', {}, `Esperado: ${f.esperado}`) : null,
            ),
          ),
        ),
      );
    }
    if (aviso) caja.prepend(h('p.aviso-fallo', {}, aviso));
    if (desempeno.intentosFallidos >= 2 && desempeno.pistas < pistas.length) {
      caja.append(h('p.tenue', {}, '¿Abrimos una pista? Las pistas no cuestan vidas ni capital; solo el bono de ejercicio limpio.'));
      botonPista.style.animation = 'latido 1.2s ease-in-out infinite';
    } else if (!aviso) {
      caja.append(h('p.tenue', {}, 'Corrige y vuelve a comprobar: solo avanzas cuando funcione.'));
    }
    llenar(retro, caja);
  }

  function terminar(correcto) {
    clearInterval(intervaloMotor);
    desempeno.correcto = correcto;
    alCompletar?.(desempeno);
  }

  const izquierda = h(
    'div.columna',
    {},
    h(
      'div.panel',
      {},
      h(
        'div.fila',
        {},
        h('span.chip.' + paso.lenguaje, {}, NOMBRE_LENGUAJE[paso.lenguaje]),
        paso.concepto ? h('span.tenue', {}, ctx.catalogo.conceptos[paso.concepto]?.nombre) : null,
      ),
      h('div', { html: markdown(plantilla(paso.enunciado, ctx.estado())), estilo: { marginTop: '8px' } }),
    ),
    retro,
    listaPistas,
    paso.lenguaje === 'sql' ? panelEsquema(ctx, paso.db ?? 'fondo') : null,
  );
  const derecha = h(
    'div.columna',
    {},
    h(
      'div',
      {},
      editor.elemento,
      h('div.barra-acciones', {}, botonEjecutar, botonComprobar, botonPista, botonReiniciar, botonRendirse, h('span.espaciador'), estadoMotor),
    ),
    consola,
    h('div.tenue', {}, 'Atajos: Ctrl+Enter comprueba · Shift+Enter ejecuta · Tab inserta 4 espacios'),
  );
  const raiz = h('div.area-mision', {}, izquierda, derecha);
  setTimeout(() => {
    editor.refrescar();
    editor.enfocar();
  }, 30);
  return raiz;
}

function panelEsquema(ctx, db) {
  const panel = h('div.panel.esquema', {}, h('h3', {}, 'Esquema de la base de datos'), h('span.tenue', {}, 'Cargando…'));
  ctx.motores
    .esquema(db)
    .then((tablas) => {
      panel.lastChild.remove();
      for (const t of tablas ?? []) {
        panel.append(
          h(
            'details',
            {},
            h('summary', {}, `${t.nombre} `, h('span.tenue', {}, `(${t.filas} filas)`)),
            h('div.tenue', { estilo: { paddingLeft: '18px', fontSize: '17px' } }, DESCRIPCION_TABLAS[t.nombre] ?? ''),
            t.columnas.map((c) => h('div.col', {}, `${c.nombre}  ${c.tipo}`)),
          ),
        );
      }
    })
    .catch(() => {
      panel.lastChild.textContent = 'No se pudo cargar el esquema.';
    });
  return panel;
}

// ---------- Quiz de opción múltiple ----------

function renderQuiz(paso, ctx, { alCompletar, alFallar, modo = 'mision', descartar = false }) {
  const desempeno = { concepto: paso.concepto, correcto: false, intentosFallidos: 0, pistas: 0 };
  const explicacion = h('div');
  const unSoloIntento = modo === 'repaso';
  let terminado = false;
  const botones = paso.opciones.map((texto, i) => h('button', { onclick: () => elegir(i) }, h('span.tenue', {}, String.fromCharCode(65 + i) + ') '), texto));
  if (descartar) {
    const incorrectas = botones.map((_, i) => i).filter((i) => i !== paso.correcta);
    const quitar = incorrectas[Math.floor(Math.random() * incorrectas.length)];
    botones[quitar].disabled = true;
    botones[quitar].classList.add('incorrecta');
  }

  function elegir(i) {
    if (terminado) return;
    if (i === paso.correcta) {
      terminado = true;
      desempeno.correcto = !unSoloIntento || desempeno.intentosFallidos === 0;
      botones[i].classList.add('correcta');
      botones.forEach((b) => (b.disabled = true));
      ctx.sonido.acierto();
      mostrarExplicacion(true);
    } else {
      desempeno.intentosFallidos++;
      botones[i].classList.add('incorrecta');
      botones[i].disabled = true;
      ctx.sonido.error();
      const aviso = alFallar?.(desempeno);
      if (unSoloIntento) {
        terminado = true;
        botones[paso.correcta].classList.add('correcta');
        botones.forEach((b) => (b.disabled = true));
        mostrarExplicacion(false);
      } else {
        llenar(explicacion, h('div.retro.mal', {}, h('p', {}, 'No es esa. Piénsalo otra vez.'), aviso ? h('p.aviso-fallo', {}, aviso) : null));
      }
    }
  }

  function mostrarExplicacion(ok) {
    llenar(
      explicacion,
      h(
        'div.retro.' + (ok ? 'ok' : 'mal'),
        {},
        h('div.titulo.' + (ok ? 'verde' : 'rojo'), {}, ok ? ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)] : 'Era otra'),
        paso.explicacion ? h('div', { html: markdown(paso.explicacion) }) : null,
        h('button.primario', { onclick: () => alCompletar?.(desempeno) }, 'Continuar ▸'),
      ),
    );
    explicacion.querySelector('button').focus();
  }

  return h(
    'div.area-mision.una-columna',
    {},
    h(
      'div.panel.columna',
      {},
      paso.concepto ? h('span.tenue', {}, ctx.catalogo.conceptos[paso.concepto]?.nombre ?? '') : null,
      h('div', { html: markdown(paso.pregunta) }),
      paso.codigo ? h('pre.codigo-muestra', {}, paso.codigo) : null,
      h('div.opciones', {}, botones),
      explicacion,
    ),
  );
}

// ---------- Completar (repasos) ----------

function renderCompletar(paso, ctx, { alCompletar, alFallar }) {
  const desempeno = { concepto: paso.concepto, correcto: false, intentosFallidos: 0, pistas: 0 };
  const entrada = h('input', { type: 'text', 'aria-label': 'Tu respuesta', autocomplete: 'off', spellcheck: false });
  const resultado = h('div');
  let terminado = false;
  const comprobar = () => {
    if (terminado || !entrada.value.trim()) return;
    terminado = true;
    const r = validarRespuestaEscrita(entrada.value, paso.respuesta, { tipo: paso.tipoRespuesta, alternativas: paso.alternativas });
    desempeno.correcto = r.ok;
    entrada.disabled = true;
    if (r.ok) ctx.sonido.acierto();
    else ctx.sonido.error();
    if (!r.ok) desempeno.intentosFallidos = 1;
    const aviso = r.ok ? null : alFallar?.(desempeno);
    llenar(
      resultado,
      h(
        'div.retro.' + (r.ok ? 'ok' : 'mal'),
        {},
        h('div.titulo.' + (r.ok ? 'verde' : 'rojo'), {}, r.ok ? '¡Correcto!' : `Respuesta: ${paso.respuesta}`),
        !r.ok && r.mensaje ? h('p', {}, r.mensaje) : null,
        aviso ? h('p.aviso-fallo', {}, aviso) : null,
        paso.explicacion ? h('p', {}, paso.explicacion) : null,
        h('button.primario', { onclick: () => alCompletar?.(desempeno) }, 'Continuar ▸'),
      ),
    );
    resultado.querySelector('button').focus();
  };
  entrada.addEventListener('keydown', (e) => e.key === 'Enter' && comprobar());
  setTimeout(() => entrada.focus(), 30);
  return h(
    'div.area-mision.una-columna',
    {},
    h(
      'div.panel.columna',
      {},
      h('div', { html: markdown(paso.pregunta) }),
      paso.codigo ? h('pre.codigo-muestra', {}, paso.codigo) : null,
      h('div.fila', {}, entrada, h('button.primario', { onclick: comprobar }, 'Comprobar')),
      resultado,
    ),
  );
}
