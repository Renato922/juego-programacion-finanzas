// Editor de código: CodeMirror 5 si está disponible; si no, un textarea.

import { h } from './dom.js';

export function crearEditor({ valor = '', lenguaje = 'python', alEjecutar, alComprobar, soloLectura = false }) {
  const caja = h('div.editor-caja');
  const CM = window.CodeMirror;
  if (CM) {
    const cm = CM(caja, {
      value: valor,
      mode: lenguaje === 'sql' ? 'text/x-sqlite' : 'python',
      theme: 'terminal',
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      matchBrackets: true,
      autoCloseBrackets: true,
      readOnly: soloLectura,
      viewportMargin: Infinity,
      extraKeys: {
        Tab: (ed) => (ed.somethingSelected() ? ed.indentSelection('add') : ed.replaceSelection('    ', 'end')),
        'Shift-Tab': (ed) => ed.indentSelection('subtract'),
        'Ctrl-Enter': () => alComprobar?.(),
        'Cmd-Enter': () => alComprobar?.(),
        'Shift-Enter': () => alEjecutar?.(),
      },
    });
    let marca = null;
    return {
      elemento: caja,
      valor: () => cm.getValue(),
      fijar: (v) => cm.setValue(v),
      alCambiar: (fn) => cm.on('change', () => fn(cm.getValue())),
      refrescar: () => setTimeout(() => cm.refresh(), 0),
      enfocar: () => cm.focus(),
      marcarLinea(linea) {
        if (marca != null) cm.removeLineClass(marca, 'background', 'linea-error');
        marca = null;
        if (linea && linea <= cm.lineCount()) {
          marca = linea - 1;
          cm.addLineClass(marca, 'background', 'linea-error');
        }
      },
    };
  }
  const area = h('textarea.respaldo', { spellcheck: false });
  area.value = valor;
  area.readOnly = soloLectura;
  area.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const i = area.selectionStart;
      area.setRangeText('    ', i, area.selectionEnd, 'end');
    }
    if (e.key === 'Enter' && e.ctrlKey) alComprobar?.();
  });
  caja.append(area);
  return {
    elemento: caja,
    valor: () => area.value,
    fijar: (v) => (area.value = v),
    alCambiar: (fn) => area.addEventListener('input', () => fn(area.value)),
    refrescar() {},
    enfocar: () => area.focus(),
    marcarLinea() {},
  };
}
