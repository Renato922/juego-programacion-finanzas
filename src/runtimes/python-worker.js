// Web Worker de Python (Pyodide). Corre fuera del hilo de la interfaz para
// que un bucle infinito no congele el juego: si tarda demasiado, la
// interfaz termina el worker y crea otro.

import { CODIGO_HARNESS, ejecutarConPyodide } from '../core/harness-python.js';

let pyodide = null;
let cargando = null;

async function cargar() {
  const base = new URL('/runtime/pyodide/', self.location.href).href;
  const { loadPyodide } = await import(base + 'pyodide.mjs');
  pyodide = await loadPyodide({ indexURL: base });
  pyodide.runPython(CODIGO_HARNESS);
}

self.onmessage = async (evento) => {
  const { id, tipo, codigo, sondas, preludio } = evento.data;
  try {
    if (!cargando) cargando = cargar();
    await cargando;
    if (tipo === 'cargar') {
      self.postMessage({ id, ok: true });
      return;
    }
    const resultado = ejecutarConPyodide(pyodide, codigo, sondas ?? [], preludio ?? '');
    self.postMessage({ id, ok: true, resultado });
  } catch (e) {
    if (!pyodide) cargando = null; // permite reintentar la carga
    self.postMessage({ id, ok: false, error: String(e?.message ?? e) });
  }
};
