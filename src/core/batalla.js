// Batallas contra jefes.
//
// El jefe tiene una barra de vida; cada fase resuelta le quita vida.
//
// El jugador tiene 3 vidas (como en los últimos niveles de ALEKS): cada
// comprobación fallida cuesta una. Ejecutar el código y abrir pistas no cuesta
// vidas. Sin vidas, la batalla se reinicia al instante, sin esperas y sin
// perder capital, XP ni misiones. En modo poca energía no hay vidas.
// La nota final (S, A, B, C) invita a una revancha para mejorarla.

export const VIDAS_JUGADOR = 3;

export function crearBatalla(jefe) {
  const vidaMax = jefe.fases.reduce((s, f) => s + f.dano, 0);
  return { jefeId: jefe.id, vida: vidaMax, vidaMax, fase: 0, combo: 0, resultados: [], vidas: VIDAS_JUGADOR };
}

// Una comprobación fallida. Las partidas guardadas antes de que existieran
// las vidas empiezan con las 3.
export function perderVida(batallaOriginal) {
  const batalla = structuredClone(batallaOriginal);
  batalla.vidas = Math.max(0, (batalla.vidas ?? VIDAS_JUGADOR) - 1);
  return { batalla, sinVidas: batalla.vidas === 0 };
}

// desempeno: { correcto, intentosFallidos, pistas, pistaFinal }
export function resolverFase(batallaOriginal, jefe, desempeno) {
  const batalla = structuredClone(batallaOriginal);
  const fase = jefe.fases[batalla.fase];
  const limpio = desempeno.correcto && !desempeno.intentosFallidos && !desempeno.pistas;
  batalla.combo = limpio ? batalla.combo + 1 : 0;
  const critico = limpio && batalla.combo >= 2;
  const dano = fase.dano;
  batalla.vida = Math.max(0, batalla.vida - dano);
  batalla.resultados.push({ ...desempeno, limpio, concepto: fase.paso.concepto });
  batalla.fase += 1;
  const terminado = batalla.fase >= jefe.fases.length;
  if (terminado) batalla.vida = 0;
  return { batalla, dano, critico, terminado };
}

export function notaBatalla(resultados) {
  if (!resultados.length) return 'C';
  const limpios = resultados.filter((r) => r.limpio).length / resultados.length;
  const pistaFinal = resultados.some((r) => r.pistaFinal);
  if (limpios === 1) return 'S';
  if (limpios >= 0.7 && !pistaFinal) return 'A';
  if (limpios >= 0.4) return 'B';
  return 'C';
}

const ORDEN_NOTAS = ['C', 'B', 'A', 'S'];
export function mejorNota(a, b) {
  if (!a) return b;
  if (!b) return a;
  return ORDEN_NOTAS.indexOf(a) >= ORDEN_NOTAS.indexOf(b) ? a : b;
}
