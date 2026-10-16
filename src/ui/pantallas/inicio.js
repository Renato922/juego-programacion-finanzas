// Pantalla de título y creación de partida.

import { h, vaciar, llenar } from '../dom.js';
import { crearEscenaOficina, iconoLenguaje } from '../pixel.js';
import { renderDialogo } from '../pasos.js';

export function render(ctx) {
  const raiz = h('div.contenedor.columna', { estilo: { maxWidth: '860px', gap: '18px' } });
  const estado = ctx.estado();

  raiz.append(
    h(
      'div.panel.resaltado.columna',
      { estilo: { alignItems: 'center', textAlign: 'center' } },
      Object.assign(iconoLenguaje('finanzas'), { style: 'width:64px;height:64px' }),
      h('h1.verde', {}, 'CÓNDOR CAPITAL'),
      h('p.secundario', {}, 'De analista junior a dueño del fondo. Aprende Python, SQL, R, Power BI y Excel/VBA resolviendo casos reales de finanzas.'),
      crearEscenaOficina(estado),
    ),
  );

  const formulario = h('div.panel.columna');
  const nombre = h('input', { type: 'text', maxlength: 24, placeholder: 'Tu nombre o apodo', 'aria-label': 'Tu nombre o apodo' });
  nombre.value = estado.jugador.nombre ?? '';
  const energia = h('input', { type: 'checkbox' });
  energia.checked = estado.ajustes.energiaBaja;
  const empezar = h('button.primario.grande', { onclick: crear }, 'Empezar mi primer día ▸');
  formulario.append(
    h('h2', {}, 'Nueva partida'),
    h('label', {}, '¿Cómo te llamamos en la oficina?'),
    nombre,
    h('label.interruptor', {}, energia, 'Hoy tengo poca energía (sesiones más cortas, sin temporizadores ni presión)'),
    h('p.tenue', {}, 'Tu progreso se guarda solo, en tu computadora. No hay cuentas ni servidores, y no se pierde nada por dejar de jugar unos días.'),
    empezar,
  );
  raiz.append(formulario);
  setTimeout(() => nombre.focus(), 50);
  nombre.addEventListener('keydown', (e) => e.key === 'Enter' && crear());

  function crear() {
    const n = nombre.value.trim() || 'Analista';
    const nuevo = structuredClone(ctx.estado());
    nuevo.jugador.nombre = n;
    nuevo.ajustes.energiaBaja = energia.checked;
    ctx.actualizar(nuevo, { inmediato: true });
    llenar(
      raiz,
      h('h2', {}, 'Capítulo 1 · Primer mes en Cóndor Capital'),
      renderDialogo(ctx.catalogo.capitulos[0].intro, ctx, { alCompletar: ofrecerDiagnostico, textoBoton: 'Empezar' }),
    );
  }

  function ofrecerDiagnostico() {
    llenar(
      raiz,
      h(
        'div.panel.columna',
        {},
        h('h2', {}, '¿Hacemos un test rápido?'),
        h('p', {}, 'Son unas preguntas cortas (unos 5 minutos). Si ya sabes algo de Python o SQL, el juego te salta esas misiones y te da su capital.'),
        h('p.tenue', {}, 'Si dudas, elige "No lo sé": no hay castigo y te ubica mejor que adivinar.'),
        h(
          'div.fila',
          {},
          h('button.primario', { onclick: () => ctx.ir('diagnostico') }, 'Sí, hacer el test'),
          h(
            'button',
            {
              onclick: () => {
                const e = structuredClone(ctx.estado());
                e.diagnostico.hecho = true;
                ctx.actualizar(e, { inmediato: true });
                ctx.ir('oficina');
              },
            },
            'Empiezo desde cero',
          ),
        ),
      ),
    );
  }

  return raiz;
}
