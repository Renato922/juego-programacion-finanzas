// Ajustes: energía, meta semanal, modo compromiso (opcional), sonido,
// animaciones y respaldo del progreso.

import { h, toast, confirmar } from '../dom.js';
import { serializar, deserializar } from '../../core/estado.js';

export function render(ctx) {
  const estado = ctx.estado();
  const cambiar = (fn) => {
    const e = structuredClone(ctx.estado());
    fn(e);
    ctx.actualizar(e);
  };
  const interruptor = (clave, texto, ayuda) => {
    const c = h('input', { type: 'checkbox' });
    c.checked = Boolean(estado.ajustes[clave]);
    c.addEventListener('change', () => cambiar((e) => (e.ajustes[clave] = c.checked)));
    return h('div', {}, h('label.interruptor', {}, c, texto), ayuda ? h('p.tenue', { estilo: { marginLeft: '30px' } }, ayuda) : null);
  };

  const nombre = h('input', { type: 'text', maxlength: 24 });
  nombre.value = estado.jugador.nombre;
  nombre.addEventListener('change', () => cambiar((e) => (e.jugador.nombre = nombre.value.trim() || 'Analista')));

  const meta = h(
    'select',
    { 'aria-label': 'Meta semanal' },
    [1, 2, 3, 4, 5, 6, 7].map((n) => h('option', { value: n }, `${n} día${n > 1 ? 's' : ''} por semana`)),
  );
  meta.value = estado.ajustes.metaSemanal;
  meta.addEventListener('change', () => cambiar((e) => (e.ajustes.metaSemanal = Number(meta.value))));

  const motivo = h('textarea', {
    rows: 2,
    maxlength: 160,
    placeholder: 'Ejemplo: Quiero conseguir un trabajo de analista financiero este año.',
    estilo: { width: '100%' },
  });
  motivo.value = estado.ajustes.motivoPersonal;
  motivo.addEventListener('change', () => cambiar((e) => (e.ajustes.motivoPersonal = motivo.value)));

  return h(
    'div.contenedor.columna',
    { estilo: { maxWidth: '860px' } },
    h('h1', {}, 'Ajustes'),
    h('div.panel.columna', {}, h('h2', {}, 'Tú'), h('label', {}, 'Nombre en la oficina'), nombre),
    h(
      'div.panel.columna',
      {},
      h('h2', {}, 'Ritmo y energía'),
      interruptor(
        'energiaBaja',
        'Modo poca energía',
        'Sesiones de repaso de 3 preguntas cortas, sin ejercicios de código en el repaso y sin mensajes de compromiso. Puedes activarlo y desactivarlo cuando quieras.',
      ),
      h('label', {}, 'Meta semanal flexible'),
      meta,
      h('p.tenue', {}, 'Los días no tienen que ser seguidos. No llegar a la meta no quita nada: no hay rachas que se rompan.'),
      h(
        'p.tenue',
        {},
        'Si te sientes mal de forma persistente, este juego no reemplaza la ayuda de un profesional de salud mental. Buscarla también es avanzar.',
      ),
    ),
    h(
      'div.panel.columna',
      {},
      h('h2', {}, 'Modo compromiso (opcional)'),
      interruptor(
        'modoCompromiso',
        'Recordarme mi motivo cuando vuelva después de unos días',
        'Desactivado por defecto. Si lo activas, al volver verás la frase que escribas aquí junto a una tarea corta para retomar. Nunca habrá reproches ni pérdidas. Se apaga solo en modo poca energía.',
      ),
      h('label', {}, '¿Por qué quieres aprender esto?'),
      motivo,
    ),
    h(
      'div.panel.columna',
      {},
      h('h2', {}, 'Presentación'),
      interruptor('sonido', 'Sonidos'),
      interruptor('animaciones', 'Animaciones'),
      interruptor('textoRapido', 'Mostrar los diálogos completos al instante'),
    ),
    h(
      'div.panel.columna',
      {},
      h('h2', {}, 'Tu progreso'),
      h('p.tenue', {}, 'Se guarda automáticamente en tu computadora. Puedes hacer una copia de respaldo o pasarla a otra PC.'),
      h(
        'div.fila',
        {},
        h(
          'button',
          {
            onclick: async () => {
              const ok = await ctx.plataforma.exportarArchivo(
                `condor-capital-respaldo-${new Date().toISOString().slice(0, 10)}.json`,
                serializar(ctx.estado()),
              );
              if (ok) toast('Respaldo guardado');
            },
          },
          'Exportar respaldo',
        ),
        h(
          'button',
          {
            onclick: async () => {
              const archivo = await ctx.plataforma.importarArchivo(['json']);
              if (!archivo) return;
              const nuevo = deserializar(archivo.contenido, ctx.ahora());
              if (!nuevo) return toast('Ese archivo no es un respaldo válido');
              if (await confirmar('¿Reemplazar tu partida actual por la del respaldo?')) {
                ctx.actualizar(nuevo, { inmediato: true });
                ctx.ir('oficina');
                toast('Respaldo cargado');
              }
            },
          },
          'Importar respaldo',
        ),
        h(
          'button',
          {
            estilo: { borderColor: 'var(--peligro)', color: 'var(--peligro)' },
            onclick: async () => {
              if (!(await confirmar('Esto borra toda tu partida. ¿Seguro?', { si: 'Sí, borrar' }))) return;
              if (!(await confirmar('Última confirmación: no se puede deshacer (salvo que tengas un respaldo).', { si: 'Borrar todo' }))) return;
              await ctx.reiniciarPartida();
            },
          },
          'Borrar partida',
        ),
      ),
    ),
  );
}
