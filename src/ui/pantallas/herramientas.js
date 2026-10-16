// Herramientas reales: guía para instalar R y RStudio (gratis) y cómo
// funcionarán los jefes en Power BI Desktop, Excel y RStudio.

import { h, toast } from '../dom.js';
import { formatoDinero } from '../../core/economia.js';

const RECOMPENSA_INSTALACION = 500;

const ENLACES = {
  cran: 'https://cran.r-project.org/bin/windows/base/',
  rstudio: 'https://posit.co/download/rstudio-desktop/',
  powerbi: 'https://www.microsoft.com/power-platform/products/power-bi/desktop',
};

export function verificarVersionR(texto) {
  const m = String(texto).match(/R version (\d+)\.(\d+)\.(\d+)/);
  if (!m) return { ok: false, mensaje: 'No encontré "R version x.y.z" en lo que pegaste. Copia toda la línea que imprime la consola.' };
  const version = `${m[1]}.${m[2]}.${m[3]}`;
  if (Number(m[1]) < 4) return { ok: false, mensaje: `Tienes R ${version}. Instala una versión 4.x o más reciente desde CRAN.` };
  return { ok: true, version };
}

export function render(ctx) {
  const estado = ctx.estado();
  const r = estado.herramientas?.r;
  const enlace = (texto, url) => h('button.enlace', { onclick: () => ctx.plataforma.abrirEnlace(url) }, texto);

  const entrada = h('textarea', {
    rows: 2,
    placeholder: '[1] "R version 4.x.x (AAAA-MM-DD)"',
    'aria-label': 'Resultado de R.version.string',
    estilo: { width: '100%' },
  });
  const resultado = h('div');
  const verificar = () => {
    const v = verificarVersionR(entrada.value);
    resultado.replaceChildren(h('div.retro.' + (v.ok ? 'ok' : 'mal'), {}, v.ok ? `¡Listo! R ${v.version} instalado.` : v.mensaje));
    if (!v.ok) return;
    const e = structuredClone(ctx.estado());
    const primeraVez = !e.herramientas?.r;
    e.herramientas = { ...(e.herramientas ?? {}), r: { version: v.version, fecha: ctx.ahora() } };
    if (primeraVez) e.capital += RECOMPENSA_INSTALACION;
    ctx.actualizar(e, { inmediato: true });
    ctx.sonido.moneda();
    if (primeraVez) toast(`+${formatoDinero(RECOMPENSA_INSTALACION)} por preparar tu estación de R`);
  };

  return h(
    'div.contenedor.columna',
    {},
    h('h1', {}, 'Herramientas reales'),
    h(
      'p.secundario',
      {},
      'Python y SQL se practican aquí mismo. Los jefes finales de R, Power BI y Excel/VBA se juegan en los programas reales, como en el trabajo: el juego te entrega los archivos del reto y valida tu resultado (pegando un valor o leyendo el archivo que exportes). Todo es gratis.',
    ),
    h(
      'div.panel.columna' + (r ? '.resaltado' : '.ambar'),
      {},
      h('h2', {}, `R y RStudio ${r ? `· instalado (R ${r.version})` : '· para el capítulo 2'}`),
      h('p', {}, 'R es gratis y de código abierto; RStudio Desktop también es gratis. Instala primero R y después RStudio.'),
      h(
        'ol',
        {},
        h(
          'li',
          {},
          'Descarga R para Windows desde CRAN: ',
          enlace('cran.r-project.org', ENLACES.cran),
          ' → "Download R-4.x.x for Windows". Instálalo con las opciones por defecto.',
        ),
        h(
          'li',
          {},
          'Descarga RStudio Desktop desde Posit: ',
          enlace('posit.co/download/rstudio-desktop', ENLACES.rstudio),
          '. Elige el instalador de Windows (el paso 1 de esa página es R, que ya instalaste).',
        ),
        h('li', {}, 'Abre RStudio. En el panel "Console" escribe ', h('code', {}, 'R.version.string'), ' y presiona Enter.'),
        h('li', {}, 'Copia la línea que aparece (algo como ', h('code', {}, '[1] "R version 4.x.x (…)"'), ') y pégala aquí abajo.'),
      ),
      entrada,
      h(
        'div.fila',
        {},
        h('button.primario', { onclick: verificar }, 'Verificar mi instalación'),
        r ? null : h('span.tenue', {}, `Recompensa: ${formatoDinero(RECOMPENSA_INSTALACION)}`),
      ),
      resultado,
      h(
        'p.tenue',
        {},
        'Si una de las páginas cambió de diseño, busca el botón de descarga para Windows: ambas descargas son gratuitas y no piden tarjeta ni cuenta.',
      ),
    ),
    h(
      'div.rejilla-2',
      {},
      h(
        'div.panel.columna',
        {},
        h('h2', {}, 'Excel de escritorio · capítulos 3 y 4'),
        h(
          'p',
          {},
          'Ya lo tienes instalado. Los jefes de Excel te darán un .xlsx con datos de una empresa; harás fórmulas financieras (VNA, TIR, PAGO), tablas dinámicas y una macro VBA, y pegarás el resultado aquí.',
        ),
        h('p.tenue', {}, 'Para las macros hay que mostrar la pestaña Programador: Archivo → Opciones → Personalizar cinta → marcar "Programador".'),
      ),
      h(
        'div.panel.columna',
        {},
        h('h2', {}, 'Power BI Desktop · capítulo 5'),
        h(
          'p',
          {},
          'Ya lo tienes instalado (es gratis; solo publicar en la nube pide licencia, y el juego no lo necesita). Harás Power Query, el modelo de datos y medidas DAX; el juego validará los valores de tus medidas.',
        ),
        h('p.tenue', {}, 'Referencia oficial: ', enlace('Power BI Desktop', ENLACES.powerbi)),
      ),
    ),
  );
}
