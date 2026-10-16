// Batallas contra jefes.
//
// El jefe tiene una barra de vida; cada fase resuelta le quita vida. No hay
// vida del jugador: fallar no te hace perder nada, solo no avanzas hasta
// resolver bien (con pistas que escalan). Lo que cambia es la nota final
// (S, A, B, C), que invita a una revancha para mejorarla.

export function crearBatalla(jefe) {
  const vidaMax = jefe.fases.reduce((s, f) => s + f.dano, 0);
  return { jefeId: jefe.id, vida: vidaMax, vidaMax, fase: 0, combo: 0, resultados: [] };
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
