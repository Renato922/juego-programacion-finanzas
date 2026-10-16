// Economía del fondo (la parte "tycoon" del juego).
//
// - Capital: efectivo que ganas resolviendo retos. Se gasta en mejoras o se
//   invierte en el fondo.
// - Fondo: el dinero invertido rinde con cada actividad completada (no con el
//   paso del tiempo). Así nada se gana ni se pierde por estar ausente.
// - Perfil de riesgo: el jugador elige; enseña la relación retorno-riesgo.
//
// Todas las funciones son puras: reciben datos y devuelven resultados nuevos.

export const PERFILES_RIESGO = {
  conservador: { nombre: 'Conservador', media: 0.004, desvio: 0.004, requiere: null },
  balanceado: { nombre: 'Balanceado', media: 0.008, desvio: 0.012, requiere: { mejora: 'mesa-riesgo', nivel: 1 } },
  agresivo: { nombre: 'Agresivo', media: 0.012, desvio: 0.03, requiere: { mejora: 'mesa-riesgo', nivel: 2 } },
};

export const BONO_LIMPIO = 0.25; // extra si resuelves sin pistas ni errores
export const FACTOR_REPETICION = 0.25; // rejugar una misión ya completada
export const FACTOR_CONVALIDADA = 0.5; // misión saltada por el test de nivel
export const BONO_REPASO_VENCIDO = 1.0; // +100% al repasar algo que ya tocaba

// Suma los efectos de las mejoras compradas.
export function efectosDeMejoras(mejorasCompradas, catalogo) {
  const efectos = { multiplicadorCapital: 0, multiplicadorXP: 0, retornoExtra: 0, comodines: 0 };
  for (const mejora of catalogo) {
    const nivel = mejorasCompradas[mejora.id] ?? 0;
    if (!nivel || !mejora.efecto) continue;
    const { tipo, valor } = mejora.efecto;
    if (tipo in efectos) efectos[tipo] += valor * nivel;
  }
  return efectos;
}

// Costo del siguiente nivel de una mejora (crece geométricamente).
export function costoMejora(mejora, nivelActual) {
  if (nivelActual >= mejora.nivelMax) return Infinity;
  return Math.round(mejora.costo * Math.pow(mejora.crecimiento ?? 1.8, nivelActual));
}

export function puedeComprar(mejora, nivelActual, capital, mejorasCompradas = {}) {
  if (nivelActual >= mejora.nivelMax) return { ok: false, motivo: 'Nivel máximo alcanzado' };
  if (mejora.requiere) {
    const nivelReq = mejorasCompradas[mejora.requiere.mejora] ?? 0;
    if (nivelReq < mejora.requiere.nivel) return { ok: false, motivo: 'Requiere otra mejora antes' };
  }
  const costo = costoMejora(mejora, nivelActual);
  if (capital < costo) return { ok: false, motivo: `Te faltan ${formatoDinero(costo - capital)}` };
  return { ok: true, costo };
}

// Recompensa al terminar una misión.
//  recompensa: { capital, xp } de la misión
//  ejercicios: lista de { limpio: bool } (uno por ejercicio resuelto)
//  modo: 'normal' | 'repeticion' | 'convalidada'
export function recompensaMision({ recompensa, ejercicios = [], modo = 'normal', efectos = {} }) {
  const total = ejercicios.length || 1;
  const limpios = ejercicios.filter((e) => e.limpio).length;
  const fraccionLimpia = ejercicios.length ? limpios / total : 0;
  let factor = 1;
  if (modo === 'repeticion') factor = FACTOR_REPETICION;
  if (modo === 'convalidada') factor = FACTOR_CONVALIDADA;
  const multCapital = 1 + (efectos.multiplicadorCapital ?? 0);
  const multXP = 1 + (efectos.multiplicadorXP ?? 0);
  const bono = modo === 'convalidada' ? 0 : BONO_LIMPIO * fraccionLimpia;
  return {
    capital: Math.round(recompensa.capital * factor * multCapital * (1 + bono)),
    xp: Math.round(recompensa.xp * factor * multXP),
    bonoLimpio: bono > 0 ? Math.round(recompensa.capital * factor * multCapital * bono) : 0,
  };
}

// Pago por una tarjeta de repaso.
export function recompensaRepaso({ correcto, vencida, combo = 1, base = 120, efectos = {} }) {
  if (!correcto) return { capital: 0, xp: 2 };
  const mult = (1 + (efectos.multiplicadorCapital ?? 0)) * (vencida ? 1 + BONO_REPASO_VENCIDO : 1);
  return { capital: Math.round(base * mult * combo), xp: vencida ? 10 : 5 };
}

// "Caja de dividendos": recompensa variable al cerrar una misión.
// Siempre da algo positivo. No se compra con dinero real.
export function abrirCajaDividendos(rng, pagoMision) {
  const x = rng.siguiente();
  if (x < 0.6) {
    const pct = 0.1 + rng.siguiente() * 0.2; // 10% a 30%
    return { tipo: 'capital', monto: Math.round(pagoMision * pct), texto: 'Dividendo ordinario' };
  }
  if (x < 0.85) {
    return { tipo: 'carta-brillante', texto: 'Carta brillante para tu colección' };
  }
  return { tipo: 'capital', monto: Math.round(pagoMision), texto: '¡Dividendo extraordinario! (x2)' };
}

export function invertir(fondo, capital, monto) {
  const m = Math.max(0, Math.min(monto, capital));
  return {
    capital: capital - m,
    fondo: { ...fondo, invertido: fondo.invertido + m, valor: fondo.valor + m },
  };
}

export function retirar(fondo, capital, monto) {
  const m = Math.max(0, Math.min(monto, fondo.valor));
  const proporcion = fondo.valor > 0 ? m / fondo.valor : 0;
  return {
    capital: capital + m,
    fondo: {
      ...fondo,
      invertido: fondo.invertido * (1 - proporcion),
      valor: fondo.valor - m,
    },
  };
}

// Un "tick" de mercado: ocurre al completar una actividad (no por tiempo).
export function tickMercado(fondo, rng, efectos = {}, ahora = Date.now()) {
  const perfil = PERFILES_RIESGO[fondo.riesgo] ?? PERFILES_RIESGO.conservador;
  const media = perfil.media + (efectos.retornoExtra ?? 0);
  // Se recorta a ±3 desvíos para evitar extremos que se sientan injustos.
  let r = rng.normal(media, perfil.desvio);
  r = Math.max(media - 3 * perfil.desvio, Math.min(media + 3 * perfil.desvio, r));
  const valorNuevo = fondo.valor * (1 + r);
  const historial = [...(fondo.historial ?? []), { t: ahora, valor: Math.round(valorNuevo * 100) / 100 }];
  return {
    fondo: { ...fondo, valor: valorNuevo, historial: historial.slice(-200) },
    retorno: r,
    ganancia: valorNuevo - fondo.valor,
  };
}

export function perfilDisponible(idPerfil, mejorasCompradas) {
  const perfil = PERFILES_RIESGO[idPerfil];
  if (!perfil) return false;
  if (!perfil.requiere) return true;
  return (mejorasCompradas[perfil.requiere.mejora] ?? 0) >= perfil.requiere.nivel;
}

// Patrimonio total que se muestra como "Activos bajo gestión" (AUM).
export function aum(estado) {
  return estado.capital + (estado.fondo?.valor ?? 0);
}

export function formatoDinero(n) {
  const signo = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs >= 1e6) return `${signo}$${(abs / 1e6).toFixed(2)}M`;
  return `${signo}$${Math.round(abs).toLocaleString('en-US')}`;
}
