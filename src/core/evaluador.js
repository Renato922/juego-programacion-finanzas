// Evalúa un ejercicio: ejecuta la solución de referencia y el código del
// jugador con los mismos "motores" y compara. Lo usan el juego y las pruebas.
//
// motores = {
//   python: async (codigo, sondas, preludio) => { stdout, error, sondas },
//   sql:    async (db, consulta) => { ok, columnas, filas, error },
// }

import { construirSondas, validarPython, validarSQL } from './validacion.js';

const cacheReferencia = new Map();

async function referencia(clave, calcular) {
  if (!cacheReferencia.has(clave)) {
    const resultado = await calcular();
    // No se guarda en caché un fallo (por ejemplo, un timeout al cargar).
    if (resultado?.error || resultado?.ok === false) return resultado;
    cacheReferencia.set(clave, resultado);
  }
  return cacheReferencia.get(clave);
}

export function limpiarCacheReferencia() {
  cacheReferencia.clear();
}

export async function evaluarEjercicio(paso, codigo, motores) {
  if (paso.lenguaje === 'python') {
    const sondas = construirSondas(paso.verificar);
    const clave = `py|${paso.preludio ?? ''}|${paso.solucion}|${JSON.stringify(sondas)}`;
    const resReferencia = await referencia(clave, () => motores.python(paso.solucion, sondas, paso.preludio ?? ''));
    const resUsuario = await motores.python(codigo, sondas, paso.preludio ?? '');
    const v = validarPython({ verificar: paso.verificar, codigo, resUsuario, resReferencia });
    return { ...v, salida: resUsuario.stdout ?? '', lenguaje: 'python' };
  }
  if (paso.lenguaje === 'sql') {
    const db = paso.db ?? 'fondo';
    const clave = `sql|${db}|${paso.solucion}`;
    const resReferencia = await referencia(clave, () => motores.sql(db, paso.solucion));
    const resUsuario = await motores.sql(db, codigo);
    const v = validarSQL({ resUsuario, resReferencia, opciones: paso.opciones ?? {}, codigo });
    return { ...v, tabla: resUsuario.ok ? resUsuario : null, lenguaje: 'sql' };
  }
  throw new Error(`Lenguaje no soportado todavía: ${paso.lenguaje}`);
}

// Ejecuta sin validar (botón "Ejecutar" en lecciones y en el editor).
export async function ejecutarLibre(lenguaje, codigo, motores, db = 'fondo') {
  if (lenguaje === 'python') return { lenguaje, ...(await motores.python(codigo, [], '')) };
  if (lenguaje === 'sql') return { lenguaje, ...(await motores.sql(db, codigo)) };
  throw new Error(`Lenguaje no soportado todavía: ${lenguaje}`);
}
