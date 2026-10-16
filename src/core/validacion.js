// Validación de respuestas.
//
// Idea central: el resultado del jugador se compara con el resultado de la
// solución de referencia, ejecutada en el mismo motor y con los mismos datos.
// Así se acepta cualquier forma correcta de resolver (no se compara texto
// de código) y no hay que escribir a mano los valores esperados.

import { traducirErrorPython, traducirErrorSQL } from './errores.js';

const NOMBRES_TIPO = {
  int: 'un número entero (int)',
  float: 'un número decimal (float)',
  str: 'un texto (str)',
  bool: 'un booleano (bool)',
  none: 'None (vacío)',
  list: 'una lista (list)',
  tuple: 'una tupla (tuple)',
  dict: 'un diccionario (dict)',
  set: 'un conjunto (set)',
  func: 'una función',
  otro: 'otro tipo de objeto',
};

export const TOLERANCIA_DEFECTO = { abs: 1e-6, rel: 1e-6 };

function esNumero(v) {
  return v && (v.t === 'int' || v.t === 'float');
}

function aNumero(v) {
  if (v.v === 'nan') return NaN;
  if (v.v === 'inf') return Infinity;
  if (v.v === '-inf') return -Infinity;
  return Number(v.v);
}

export function numerosIguales(a, b, tol = TOLERANCIA_DEFECTO) {
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
  const dif = Math.abs(a - b);
  return dif <= Math.max(tol.abs ?? 0, (tol.rel ?? 0) * Math.max(Math.abs(a), Math.abs(b)));
}

export function normalizarTolerancia(tol) {
  if (tol == null) return TOLERANCIA_DEFECTO;
  if (typeof tol === 'number') return { abs: tol, rel: 0 };
  return { abs: tol.abs ?? 0, rel: tol.rel ?? 0 };
}

// Representación tipo Python de un valor serializado, para mostrar al jugador.
export function formatearValor(v, max = 120) {
  const txt = (() => {
    switch (v?.t) {
      case 'none':
        return 'None';
      case 'bool':
        return v.v ? 'True' : 'False';
      case 'int':
        return String(v.v);
      case 'float': {
        if (typeof v.v === 'string') return v.v;
        const n = Number(v.v);
        return Number.isInteger(n) ? n.toFixed(1) : String(n);
      }
      case 'str':
        return `'${v.v}'`;
      case 'list':
        return `[${v.v.map((x) => formatearValor(x, max)).join(', ')}]`;
      case 'tuple':
        return `(${v.v.map((x) => formatearValor(x, max)).join(', ')}${v.v.length === 1 ? ',' : ''})`;
      case 'set':
        return `{${v.v.map((x) => formatearValor(x, max)).join(', ')}}`;
      case 'dict':
        return `{${v.v.map(([k, x]) => `${formatearValor(k, max)}: ${formatearValor(x, max)}`).join(', ')}}`;
      case 'func':
        return `<función ${v.v}>`;
      default:
        return String(v?.v ?? '?');
    }
  })();
  return txt.length > max ? txt.slice(0, max - 1) + '…' : txt;
}

// Compara dos valores serializados. Devuelve null si son iguales o un
// mensaje en español que describe la primera diferencia.
export function compararValores(esperado, obtenido, opciones = {}, ruta = '') {
  const tol = normalizarTolerancia(opciones.tol);
  const donde = ruta ? ` en ${ruta}` : '';
  if (esNumero(esperado) && esNumero(obtenido)) {
    if (numerosIguales(aNumero(esperado), aNumero(obtenido), tol)) return null;
    const pista = aNumero(obtenido) > aNumero(esperado) ? 'es mayor' : 'es menor';
    return `El número${donde} no coincide: obtuviste ${formatearValor(obtenido)}, que ${pista} que lo esperado.`;
  }
  if (esperado.t !== obtenido.t) {
    const listaLike = (t) => t === 'list' || t === 'tuple';
    if (!(listaLike(esperado.t) && listaLike(obtenido.t))) {
      let msg = `Se esperaba ${NOMBRES_TIPO[esperado.t] ?? esperado.t}${donde}, pero obtuviste ${NOMBRES_TIPO[obtenido.t] ?? obtenido.t}: ${formatearValor(obtenido)}.`;
      if (esNumero(esperado) && obtenido.t === 'str') msg += ' Ojo: un número entre comillas es texto.';
      return msg;
    }
  }
  switch (esperado.t) {
    case 'none':
      return null;
    case 'bool':
      return esperado.v === obtenido.v ? null : `El valor${donde} debería ser ${esperado.v ? 'True' : 'False'}.`;
    case 'str': {
      let a = esperado.v;
      let b = obtenido.v;
      if (opciones.recortar !== false) {
        a = a.trim();
        b = b.trim();
      }
      if (opciones.ignorarMayusculas) {
        a = a.toLowerCase();
        b = b.toLowerCase();
      }
      return a === b ? null : `El texto${donde} no coincide: obtuviste ${formatearValor(obtenido)}.`;
    }
    case 'list':
    case 'tuple':
    case 'set': {
      if (esperado.v.length !== obtenido.v.length) {
        return `La cantidad de elementos${donde} no coincide: esperaba ${esperado.v.length} y tiene ${obtenido.v.length}.`;
      }
      for (let i = 0; i < esperado.v.length; i++) {
        const r = compararValores(esperado.v[i], obtenido.v[i], opciones, `${ruta || 'la lista'}[${i}]`);
        if (r) return r;
      }
      return null;
    }
    case 'dict': {
      const clave = (k) => JSON.stringify(k);
      const mapaObt = new Map(obtenido.v.map(([k, x]) => [clave(k), x]));
      if (esperado.v.length !== obtenido.v.length) {
        return `El diccionario${donde} debería tener ${esperado.v.length} claves y tiene ${obtenido.v.length}.`;
      }
      for (const [k, x] of esperado.v) {
        if (!mapaObt.has(clave(k))) return `Al diccionario${donde} le falta la clave ${formatearValor(k)}.`;
        const r = compararValores(x, mapaObt.get(clave(k)), opciones, `${ruta || 'el diccionario'}[${formatearValor(k)}]`);
        if (r) return r;
      }
      return null;
    }
    case 'func':
      return null;
    default:
      return esperado.v === obtenido.v ? null : `El valor${donde} no coincide: obtuviste ${formatearValor(obtenido)}.`;
  }
}

// ---------- Python ----------

// Convierte las verificaciones del ejercicio en "sondas" que el arnés de
// Python evalúa después de ejecutar el código.
export function construirSondas(verificar = []) {
  const sondas = [];
  for (const v of verificar) {
    if (v.tipo === 'variable') sondas.push({ clave: `var:${v.nombre}`, tipo: 'variable', nombre: v.nombre });
    if (v.tipo === 'expresion') sondas.push({ clave: `expr:${v.codigo}`, tipo: 'expr', codigo: v.codigo });
    if (v.tipo === 'funcion') {
      sondas.push({ clave: `var:${v.nombre}`, tipo: 'variable', nombre: v.nombre });
      v.casos.forEach((args, i) => {
        sondas.push({ clave: `f:${v.nombre}:${i}`, tipo: 'llamada', nombre: v.nombre, args });
      });
    }
  }
  return sondas;
}

function normalizarSalida(txt = '') {
  return txt
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

function extraerNumeros(txt) {
  return (txt.match(/-?\d[\d,]*\.?\d*(e-?\d+)?/gi) ?? []).map((s) => Number(s.replace(/,/g, '')));
}

const AYUDA_SIN_SALIDA =
  'Tu código no mostró nada en la consola. print() muestra lo que pongas dentro de los paréntesis: por ejemplo print(total) muestra el valor de la variable total. Un print() vacío solo imprime una línea en blanco.';

function recortarTexto(txt, max = 160) {
  const t = txt.replace(/\n/g, ' ⏎ ');
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

function verificarSalida(v, salidaUsuario, salidaReferencia) {
  const esperada = normalizarSalida(v.texto ?? salidaReferencia);
  const obtenida = normalizarSalida(salidaUsuario);
  const sinSalida = !obtenida.trim();
  const modo = v.modo ?? 'exacta';
  if (modo === 'exacta') {
    if (esperada === obtenida) return null;
    if (sinSalida) return { mensaje: AYUDA_SIN_SALIDA, esperado: esperada };
    if (esperada.toLowerCase() === obtenida.toLowerCase()) return { mensaje: 'Casi: revisa mayúsculas y minúsculas en lo que imprimes.', esperado: esperada };
    if (esperada.replace(/\s+/g, '') === obtenida.replace(/\s+/g, '')) return { mensaje: 'Casi: el texto es correcto pero sobran o faltan espacios.', esperado: esperada };
    return { mensaje: `Lo que imprimes no coincide con lo esperado. Tu código imprimió: «${recortarTexto(obtenida)}»`, esperado: esperada };
  }
  if (modo === 'contiene') {
    for (const linea of esperada.split('\n')) {
      if (linea && !obtenida.includes(linea.trim())) {
        if (sinSalida) return { mensaje: AYUDA_SIN_SALIDA, esperado: esperada };
        return { mensaje: `Lo que imprimes no incluye "${linea.trim()}". Tu código imprimió: «${recortarTexto(obtenida)}»`, esperado: esperada };
      }
    }
    return null;
  }
  if (modo === 'numeros') {
    const a = extraerNumeros(esperada);
    const b = extraerNumeros(obtenida);
    const tol = normalizarTolerancia(v.tol ?? { abs: 0.01, rel: 1e-6 });
    if (a.length !== b.length || a.some((x, i) => !numerosIguales(x, b[i], tol))) {
      if (sinSalida) return { mensaje: AYUDA_SIN_SALIDA, esperado: esperada };
      return { mensaje: `Los números que imprimes no coinciden con lo esperado. Tu código imprimió: «${recortarTexto(obtenida)}»`, esperado: esperada };
    }
    return null;
  }
  return null;
}

function verificarCodigo(v, codigo) {
  const re = new RegExp(v.patron, v.banderas ?? 'm');
  const encontrado = re.test(codigo);
  if (v.tipo === 'codigoIncluye' && !encontrado) return { mensaje: v.mensaje };
  if (v.tipo === 'codigoNoIncluye' && encontrado) return { mensaje: v.mensaje };
  return null;
}

// Quita comentarios de una línea en Python o SQL para que las verificaciones
// de código no se engañen con texto comentado.
export function quitarComentarios(codigo, lenguaje) {
  if (lenguaje === 'sql') return codigo.replace(/--.*$/gm, '');
  return codigo
    .split('\n')
    .map((l) => l.replace(/(^|\s)#.*$/, '$1'))
    .join('\n');
}

// Nombre legible de cada verificación, para mostrar una lista ✔/✘.
export function etiquetaVerificacion(v) {
  if (v.etiqueta) return v.etiqueta;
  if (v.tipo === 'variable') return `la variable ${v.nombre}`;
  if (v.tipo === 'expresion') return v.descripcion ?? v.codigo;
  if (v.tipo === 'funcion') return `la función ${v.nombre}`;
  if (v.tipo === 'salida') return 'lo que imprimes con print()';
  return 'cómo está escrito el código';
}

// Resultado: { ok, fallas: [{ mensaje, esperado?, ayuda? }], verificaciones: [{ etiqueta, ok, ... }], error? }
// Cada verificación puede traer "ayuda": un consejo específico del ejercicio
// que se muestra cuando esa verificación falla.
export function validarPython({ verificar = [], codigo = '', resUsuario, resReferencia }) {
  if (resReferencia?.error) {
    return {
      ok: false,
      fallas: [{ mensaje: 'Error interno: la solución de referencia falló. Avísale al desarrollador.' }],
      verificaciones: [],
      interno: true,
    };
  }
  if (resUsuario.error) {
    return { ok: false, error: traducirErrorPython(resUsuario.error), fallas: [], verificaciones: [] };
  }
  const fallas = [];
  const verificaciones = [];
  const codigoSinComentarios = quitarComentarios(codigo, 'python');
  for (const v of verificar) {
    let falla = null;
    if (v.tipo === 'variable') falla = verificarSonda(`var:${v.nombre}`, v, resUsuario, resReferencia, `la variable ${v.nombre}`);
    else if (v.tipo === 'expresion') falla = verificarSonda(`expr:${v.codigo}`, v, resUsuario, resReferencia, v.descripcion ?? v.codigo);
    else if (v.tipo === 'funcion') falla = verificarFuncion(v, resUsuario, resReferencia);
    else if (v.tipo === 'salida') falla = verificarSalida(v, resUsuario.stdout, resReferencia.stdout);
    else if (v.tipo === 'codigoIncluye' || v.tipo === 'codigoNoIncluye') falla = verificarCodigo(v, codigoSinComentarios);
    if (falla && v.ayuda) falla.ayuda = v.ayuda;
    if (falla) fallas.push(falla);
    verificaciones.push({ etiqueta: etiquetaVerificacion(v), ok: !falla, ...(falla ?? {}) });
  }
  return { ok: fallas.length === 0, fallas, verificaciones };
}

function verificarSonda(clave, v, resU, resR, descripcion) {
  const su = resU.sondas?.[clave];
  const sr = resR.sondas?.[clave];
  if (!sr?.ok) return { mensaje: 'Error interno al calcular el resultado esperado.' };
  if (!su || su.falta) {
    return { mensaje: `No encontré ${descripcion}. ¿La creaste con ese nombre exacto?` };
  }
  if (!su.ok) {
    const e = traducirErrorPython(su.error);
    return { mensaje: `Al evaluar ${descripcion} hubo un error: ${e.original}. ${e.consejo}` };
  }
  const dif = compararValores(sr.valor, su.valor, v);
  if (dif) return { mensaje: `${capitalizar(descripcion)}: ${dif}`, esperado: formatearValor(sr.valor) };
  return null;
}

function verificarFuncion(v, resU, resR) {
  const def = resU.sondas?.[`var:${v.nombre}`];
  if (!def || def.falta) return { mensaje: `No encontré la función ${v.nombre}. Defínela con def ${v.nombre}(...):` };
  if (def.ok && def.valor.t !== 'func') return { mensaje: `${v.nombre} existe pero no es una función.` };
  for (let i = 0; i < v.casos.length; i++) {
    const args = v.casos[i].map((a) => JSON.stringify(a)).join(', ');
    const llamada = `${v.nombre}(${args})`;
    const su = resU.sondas[`f:${v.nombre}:${i}`];
    const sr = resR.sondas[`f:${v.nombre}:${i}`];
    if (!sr?.ok) return { mensaje: 'Error interno al calcular el resultado esperado.' };
    if (!su?.ok) {
      const e = traducirErrorPython(su?.error ?? { tipo: 'Error', mensaje: 'sin resultado' });
      return { mensaje: `${llamada} produjo un error: ${e.original}. ${e.consejo}` };
    }
    if (su.valor.t === 'none' && sr.valor.t !== 'none') {
      return { mensaje: `${llamada} devolvió None. ¿Te falta el return?` };
    }
    const dif = compararValores(sr.valor, su.valor, v);
    if (dif) return { mensaje: `${llamada}: ${dif}`, esperado: formatearValor(sr.valor) };
  }
  return null;
}

function capitalizar(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- SQL ----------

function valorSQLIgual(a, b, tol) {
  if (typeof a === 'number' && typeof b === 'number') return numerosIguales(a, b, tol);
  if (a === null || b === null) return a === b;
  // SQLite puede devolver 3 o 3.0 según la operación: se compara como número si ambos lo parecen.
  if (typeof a === 'number' || typeof b === 'number') return numerosIguales(Number(a), Number(b), tol);
  return String(a) === String(b);
}

function filaIgual(fa, fb, tol) {
  return fa.length === fb.length && fa.every((x, i) => valorSQLIgual(x, fb[i], tol));
}

function formatearFila(fila) {
  return `(${fila.map((x) => (x === null ? 'NULL' : typeof x === 'string' ? `'${x}'` : String(x))).join(', ')})`;
}

// res: { ok, columnas, filas, error }
export function validarSQL({ resUsuario, resReferencia, opciones = {}, codigo = '' }) {
  if (!resReferencia?.ok) {
    return { ok: false, fallas: [{ mensaje: 'Error interno: la consulta de referencia falló.' }], interno: true };
  }
  if (!resUsuario.ok) return { ok: false, error: traducirErrorSQL(resUsuario.error), fallas: [] };
  const fallas = [];
  const tol = normalizarTolerancia(opciones.tol);
  const colsR = resReferencia.columnas;
  const colsU = resUsuario.columnas;
  const sinComentarios = quitarComentarios(codigo, 'sql');
  for (const v of opciones.verificar ?? []) {
    const f = verificarCodigo(v, sinComentarios);
    if (f && v.ayuda) f.ayuda = v.ayuda;
    if (f) fallas.push(f);
  }
  if (colsU.length !== colsR.length) {
    fallas.push({
      mensaje: `Tu consulta devuelve ${colsU.length} columna(s) y se esperaban ${colsR.length}: ${colsR.join(', ')}.`,
    });
    return { ok: false, fallas };
  }
  if (opciones.nombresColumnas) {
    const malas = colsR.filter((c, i) => c.toLowerCase() !== String(colsU[i]).toLowerCase());
    if (malas.length) {
      fallas.push({ mensaje: `Los nombres de columna deberían ser: ${colsR.join(', ')}. Usa AS para renombrar.` });
    }
  }
  const filasR = resReferencia.filas;
  const filasU = resUsuario.filas;
  if (filasU.length !== filasR.length) {
    fallas.push({
      mensaje: `Tu consulta devuelve ${filasU.length} fila(s) y se esperaban ${filasR.length}.`,
      esperado: `${filasR.length} filas`,
    });
    return { ok: false, fallas };
  }
  if (opciones.ordenImporta) {
    for (let i = 0; i < filasR.length; i++) {
      if (!filaIgual(filasR[i], filasU[i], tol)) {
        const mismoConjunto = coincidenSinOrden(filasR, filasU, tol);
        fallas.push({
          mensaje: mismoConjunto
            ? 'Las filas son correctas, pero el orden no. Revisa tu ORDER BY (ASC o DESC).'
            : `La fila ${i + 1} no coincide: obtuviste ${formatearFila(filasU[i])}.`,
          esperado: formatearFila(filasR[i]),
        });
        break;
      }
    }
  } else if (!coincidenSinOrden(filasR, filasU, tol)) {
    const sobrante = filasU.find((fu) => !filasR.some((fr) => filaIgual(fr, fu, tol)));
    fallas.push({
      mensaje: sobrante
        ? `Tu resultado tiene una fila que no debería estar: ${formatearFila(sobrante)}.`
        : 'Tu resultado tiene filas repetidas o le faltan filas.',
      esperado: filasR.slice(0, 3).map(formatearFila).join(' ') + (filasR.length > 3 ? ' …' : ''),
    });
  }
  return { ok: fallas.length === 0, fallas };
}

function coincidenSinOrden(filasR, filasU, tol) {
  const usadas = new Array(filasU.length).fill(false);
  for (const fr of filasR) {
    const j = filasU.findIndex((fu, k) => !usadas[k] && filaIgual(fr, fu, tol));
    if (j === -1) return false;
    usadas[j] = true;
  }
  return true;
}

// ---------- Respuestas escritas (herramientas reales, repasos) ----------

// Interpreta números escritos por personas: "1,234.56", "1.234,56", "12%",
// "$ 3 000", "-0,5". Devuelve NaN si no es un número.
export function parsearNumero(texto) {
  if (typeof texto === 'number') return texto;
  let s = String(texto ?? '').trim();
  if (!s) return NaN;
  const porcentaje = s.endsWith('%');
  s = s.replace(/[%$€\s]/g, '').replace(/^(USD|PEN|S\/)/i, '');
  const tieneComa = s.includes(',');
  const tienePunto = s.includes('.');
  if (tieneComa && tienePunto) {
    // El último separador es el decimal.
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (tieneComa) {
    const partes = s.split(',');
    // "1,234" o "12,345,678" se leen como miles; "12,5" o "0,05" como decimal.
    const pareceMiles = partes.length > 2 || (partes.length === 2 && partes[1].length === 3 && partes[0] !== '0' && partes[0] !== '-0');
    s = pareceMiles ? s.replace(/,/g, '') : s.replace(',', '.');
  }
  if (!/^-?\d*\.?\d+(e-?\d+)?$/i.test(s)) return NaN;
  const n = Number(s);
  return porcentaje ? n / 100 : n;
}

// "1,234" es ambiguo (mil doscientos o uno coma dos): devuelve ambas lecturas.
export function interpretacionesNumero(texto) {
  const principal = parsearNumero(texto);
  const lecturas = Number.isNaN(principal) ? [] : [principal];
  const s = String(texto ?? '').trim();
  if (/^-?\d{1,3},\d{3}%?$/.test(s)) {
    const alternativa = parsearNumero(s.replace(',', '.'));
    if (!Number.isNaN(alternativa) && alternativa !== principal) lecturas.push(alternativa);
  }
  return lecturas;
}

// Compara una respuesta escrita con la esperada.
// opciones: { tipo: 'numero' | 'texto', tol, alternativas, aceptaPorcentaje }
export function validarRespuestaEscrita(respuesta, esperado, opciones = {}) {
  if (opciones.tipo === 'numero' || typeof esperado === 'number') {
    const candidatos = interpretacionesNumero(respuesta);
    if (!candidatos.length) return { ok: false, mensaje: 'Escribe un número (por ejemplo 1234.56).' };
    const tol = normalizarTolerancia(opciones.tol ?? { abs: 0.005, rel: 1e-6 });
    if (candidatos.some((c) => numerosIguales(c, esperado, tol))) return { ok: true };
    const n = candidatos[0];
    // Si escribió 12.5 cuando se esperaba 0.125 (o al revés), se lo decimos.
    if (opciones.aceptaPorcentaje !== false && (numerosIguales(n / 100, esperado, tol) || numerosIguales(n * 100, esperado, tol))) {
      return { ok: false, mensaje: 'Casi: parece que es el mismo valor pero en otra escala (¿porcentaje vs. decimal?).' };
    }
    return { ok: false, mensaje: 'Ese no es el valor esperado.' };
  }
  const norm = (s) =>
    String(s ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/;$/, '');
  const aceptadas = [esperado, ...(opciones.alternativas ?? [])].map(norm);
  return aceptadas.includes(norm(respuesta)) ? { ok: true } : { ok: false, mensaje: 'Esa no es la respuesta.' };
}
