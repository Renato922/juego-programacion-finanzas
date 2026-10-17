// Modo entrenamiento: "Sala de trading".
//
// Cada ronda ofrece 3 "operaciones" (tarjetas de repaso de temas distintos)
// y eliges una. Si aciertas, tu P&L sube según el valor y el combo. Si
// fallas, el combo vuelve a x1 y el concepto queda para una revancha al
// final, pero nunca pierdes capital. Entre rondas aparecen potenciadores
// para elegir (al estilo de Slay the Spire).

import { estaVencida } from './srs.js';

export const POTENCIADORES = {
  alcista: { id: 'alcista', nombre: 'Mercado alcista', descripcion: 'La próxima operación vale el doble.' },
  cobertura: { id: 'cobertura', nombre: 'Cobertura', descripcion: 'Si fallas la próxima, no pierdes el combo.' },
  informacion: { id: 'informacion', nombre: 'Análisis previo', descripcion: 'En la próxima pregunta de opciones se descarta una incorrecta.' },
};

const VALOR_POR_TIPO = { opcion: 100, completar: 140, ejercicio: 200 };

export function crearSesion({ rondas = 5, comodines = 0 } = {}) {
  return {
    rondas,
    ronda: 0,
    pl: 0,
    combo: 1,
    curva: [0],
    potenciador: null,
    ofertaPotenciador: null,
    comodines,
    revancha: [],
    resultados: [],
    usados: [],
  };
}

// Arma las 3 opciones de la ronda.
//  conceptos: catálogo de conceptos { id: { lenguaje, nombre, repasos: [...] } }
export function generarOpciones(sesion, tarjetas, conceptos, ahora, rng, { soloRapidas = false, cantidad = 3 } = {}) {
  const aprendidos = Object.values(tarjetas).filter((t) => conceptos[t.concepto]?.repasos?.length);
  if (!aprendidos.length) return [];
  const prioridad = (t) => {
    let p = rng.siguiente() * 0.5;
    if (estaVencida(t, ahora)) p += 2;
    p += Math.max(0, 2.5 - t.facilidad);
    if (sesion.usados.includes(t.concepto)) p -= 3;
    return p;
  };
  const ordenados = aprendidos.map((t) => ({ t, p: prioridad(t) })).sort((a, b) => b.p - a.p);
  const elegidos = [];
  const lenguajes = new Set();
  // Primero intenta lenguajes distintos (intercalado), luego completa.
  for (const { t } of ordenados) {
    if (elegidos.length >= cantidad) break;
    const leng = conceptos[t.concepto].lenguaje;
    if (!lenguajes.has(leng)) {
      elegidos.push(t);
      lenguajes.add(leng);
    }
  }
  for (const { t } of ordenados) {
    if (elegidos.length >= cantidad) break;
    if (!elegidos.includes(t)) elegidos.push(t);
  }
  return elegidos.map((t) => {
    const concepto = conceptos[t.concepto];
    let repasos = concepto.repasos;
    if (soloRapidas) repasos = repasos.filter((r) => r.tipo !== 'ejercicio');
    if (!repasos.length) repasos = concepto.repasos;
    const item = rng.elegir(repasos);
    const vencida = estaVencida(t, ahora);
    const valor = (VALOR_POR_TIPO[item.tipo] ?? 100) * (vencida ? 2 : 1);
    return { concepto: t.concepto, nombre: concepto.nombre, lenguaje: concepto.lenguaje, item, vencida, valor };
  });
}

export function resolverOperacion(sesionOriginal, opcion, correcto) {
  const sesion = structuredClone(sesionOriginal);
  let ganancia = 0;
  const pot = sesion.potenciador;
  if (correcto) {
    ganancia = opcion.valor * sesion.combo * (pot === 'alcista' ? 2 : 1);
    sesion.pl += ganancia;
    sesion.combo = Math.min(3, sesion.combo + 0.5);
  } else {
    if (pot !== 'cobertura') sesion.combo = 1;
    sesion.revancha.push(opcion.concepto);
  }
  sesion.potenciador = null;
  sesion.usados.push(opcion.concepto);
  sesion.curva.push(sesion.pl);
  sesion.resultados.push({ concepto: opcion.concepto, correcto, ganancia, vencida: opcion.vencida });
  sesion.ronda += 1;
  // Cada dos aciertos seguidos se ofrece un potenciador.
  const ultimos = sesion.resultados.slice(-2);
  sesion.ofertaPotenciador =
    ultimos.length === 2 && ultimos.every((r) => r.correcto) && sesion.ronda < sesion.rondas ? ['alcista', 'cobertura', 'informacion'] : null;
  return { sesion, ganancia };
}

export function elegirPotenciador(sesionOriginal, id) {
  const sesion = structuredClone(sesionOriginal);
  if (POTENCIADORES[id]) sesion.potenciador = id;
  sesion.ofertaPotenciador = null;
  return sesion;
}

// Un comodín salta la ronda sin efecto en el combo.
export function usarComodin(sesionOriginal) {
  const sesion = structuredClone(sesionOriginal);
  if (sesion.comodines <= 0) return sesion;
  sesion.comodines -= 1;
  sesion.ronda += 1;
  sesion.curva.push(sesion.pl);
  return sesion;
}

export function sesionTerminada(sesion) {
  return sesion.ronda >= sesion.rondas;
}

export function resumenSesion(sesion) {
  const aciertos = sesion.resultados.filter((r) => r.correcto).length;
  return {
    aciertos,
    total: sesion.resultados.length,
    pl: Math.round(sesion.pl),
    revancha: [...new Set(sesion.revancha)],
  };
}
