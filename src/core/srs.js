// Repaso espaciado (variante de SM-2).
//
// Cada concepto aprendido es una "tarjeta". Cuando el jugador la repasa,
// la calidad de su respuesta (0 a 5) decide cuándo vuelve a aparecer.
// Reglas de diseño (ver docs/diseno.md):
//  - Nunca se quita progreso por no jugar: una tarjeta vencida solo queda
//    "lista para repasar" y paga un bono; su fuerza no baja con el tiempo.
//  - Las sesiones tienen tope de tarjetas para no abrumar al volver.
//  - Se intercalan lenguajes y temas (práctica intercalada).

import { MS_DIA, sumarDias } from './fechas.js';

export const FACILIDAD_INICIAL = 2.5;
export const FACILIDAD_MINIMA = 1.3;

export function tarjetaNueva(conceptoId, ahora, opciones = {}) {
  const intervalo = opciones.intervaloInicial ?? 1;
  return {
    concepto: conceptoId,
    facilidad: FACILIDAD_INICIAL,
    intervalo, // días
    repeticiones: opciones.repeticiones ?? 0,
    fallos: 0,
    mejorRacha: opciones.repeticiones ?? 0,
    vence: sumarDias(ahora, intervalo),
    ultima: ahora,
  };
}

// Convierte el desempeño en una calidad SM-2 de 0 a 5.
//  correcto: si terminó bien el ejercicio
//  intentosFallidos: ejecuciones con error o resultado incorrecto antes de acertar
//  pistas: pistas abiertas
//  pistaFinal: si llegó a abrir la última pista (casi la solución)
export function calidadDesdeDesempeno({ correcto, intentosFallidos = 0, pistas = 0, pistaFinal = false }) {
  if (!correcto) return 1;
  if (pistaFinal) return 2;
  if (intentosFallidos === 0 && pistas === 0) return 5;
  if (intentosFallidos <= 1 && pistas <= 1) return 4;
  return 3;
}

export function calificar(tarjeta, calidad, ahora) {
  const t = { ...tarjeta };
  const q = Math.max(0, Math.min(5, Math.round(calidad)));
  if (q < 3) {
    t.repeticiones = 0;
    t.fallos += 1;
    t.intervalo = 1;
  } else {
    t.repeticiones += 1;
    if (t.repeticiones === 1) t.intervalo = 1;
    else if (t.repeticiones === 2) t.intervalo = 3;
    else t.intervalo = Math.round(t.intervalo * t.facilidad);
  }
  // Fórmula de facilidad de SM-2.
  t.facilidad = t.facilidad + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (t.facilidad < FACILIDAD_MINIMA) t.facilidad = FACILIDAD_MINIMA;
  t.intervalo = Math.min(t.intervalo, 365);
  t.mejorRacha = Math.max(t.mejorRacha ?? 0, t.repeticiones);
  t.vence = sumarDias(ahora, t.intervalo);
  t.ultima = ahora;
  return t;
}

export function estaVencida(tarjeta, ahora) {
  return tarjeta.vence <= ahora;
}

// Qué tan atrasada está, relativo a su intervalo (1 = venció hace un intervalo).
export function atraso(tarjeta, ahora) {
  return (ahora - tarjeta.vence) / (Math.max(tarjeta.intervalo, 1) * MS_DIA);
}

export function tarjetasVencidas(tarjetas, ahora) {
  return Object.values(tarjetas)
    .filter((t) => estaVencida(t, ahora))
    .sort((a, b) => atraso(b, ahora) - atraso(a, ahora));
}

// Elige hasta `n` tarjetas para una sesión.
// 1) vencidas, las más atrasadas primero; 2) si faltan, las más débiles.
// Después intercala por grupo (lenguaje) para no repetir el mismo tema seguido.
export function seleccionarRepaso(tarjetas, ahora, n, grupoDe = () => 'general') {
  const vencidas = tarjetasVencidas(tarjetas, ahora);
  let elegidas = vencidas.slice(0, n);
  if (elegidas.length < n) {
    const ids = new Set(elegidas.map((t) => t.concepto));
    const debiles = Object.values(tarjetas)
      .filter((t) => !ids.has(t.concepto))
      .sort((a, b) => a.facilidad - b.facilidad || a.vence - b.vence);
    elegidas = elegidas.concat(debiles.slice(0, n - elegidas.length));
  }
  return intercalar(elegidas, grupoDe);
}

// Reordena para que dos tarjetas seguidas no sean del mismo grupo cuando se pueda.
export function intercalar(lista, grupoDe) {
  const porGrupo = new Map();
  for (const item of lista) {
    const g = grupoDe(item);
    if (!porGrupo.has(g)) porGrupo.set(g, []);
    porGrupo.get(g).push(item);
  }
  const resultado = [];
  let ultimo = null;
  while (resultado.length < lista.length) {
    const grupos = [...porGrupo.entries()].filter(([, items]) => items.length > 0).sort((a, b) => b[1].length - a[1].length);
    const candidato = grupos.find(([g]) => g !== ultimo) ?? grupos[0];
    resultado.push(candidato[1].shift());
    ultimo = candidato[0];
  }
  return resultado;
}

// Al volver después de mucho tiempo, reparte las tarjetas vencidas en varios
// días para que la pila no se vea como una deuda. No cambia la fuerza de
// ninguna tarjeta: solo mueve la fecha en que se ofrecen.
export function repartirAtrasadas(tarjetas, ahora, maxPorDia) {
  const vencidas = tarjetasVencidas(tarjetas, ahora);
  if (vencidas.length <= maxPorDia) return tarjetas;
  const nuevas = { ...tarjetas };
  vencidas.forEach((t, i) => {
    const dia = Math.floor(i / maxPorDia);
    if (dia > 0) nuevas[t.concepto] = { ...t, vence: sumarDias(ahora, dia) };
  });
  return nuevas;
}

// Nivel de dominio para la colección (0 a 4). Solo sube; nunca baja por ausencia.
export function nivelDominio(tarjeta) {
  if (!tarjeta) return 0;
  const r = Math.max(tarjeta.mejorRacha ?? 0, tarjeta.repeticiones);
  if (r >= 5) return 4;
  if (r >= 3) return 3;
  if (r >= 1) return 2;
  return 1;
}
