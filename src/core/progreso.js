// Progreso: XP y rangos de carrera, estado de misiones, desbloqueos,
// días activos y la recomendación de "siguiente paso".

import { claveDia, claveSemana } from './fechas.js';
import { tarjetaNueva, calificar, calidadDesdeDesempeno, tarjetasVencidas } from './srs.js';
import { recompensaMision, efectosDeMejoras, abrirCajaDividendos, tickMercado } from './economia.js';
import { crearRng } from './rng.js';

// ---------- Rangos ----------

// Un rango exige XP y, a veces, haber vencido a un jefe de la historia
// (así el ascenso ocurre en la escena del jefe y no a mitad del capítulo).
//  jefeVencido: función id => bool
export function rangoDesdeXP(xp, rangos, jefeVencido = () => true) {
  let indice = 0;
  for (let i = 0; i < rangos.length; i++) {
    const r = rangos[i];
    if (xp >= r.xp && (!r.jefe || jefeVencido(r.jefe))) indice = i;
    else break;
  }
  const actual = rangos[indice];
  const siguiente = rangos[indice + 1] ?? null;
  const progreso = siguiente ? (xp - actual.xp) / (siguiente.xp - actual.xp) : 1;
  const esperaJefe = Boolean(siguiente && xp >= siguiente.xp && siguiente.jefe && !jefeVencido(siguiente.jefe));
  return { indice, actual, siguiente, progreso: Math.max(0, Math.min(1, progreso)), esperaJefe };
}

export function rangoDeEstado(estado, rangos) {
  return rangoDesdeXP(estado.xp, rangos, (id) => misionTerminada(estado, id));
}

// ---------- Misiones ----------

export function estadoMision(mision, estado) {
  const registro = estado.misiones[mision.id];
  if (registro?.estado === 'completada') return 'completada';
  if (registro?.estado === 'convalidada') return 'convalidada';
  if (estado.enCurso?.misionId === mision.id) return 'en-curso';
  const requisitosOk = (mision.requiere ?? []).every((id) => {
    const r = estado.misiones[id]?.estado;
    return r === 'completada' || r === 'convalidada';
  });
  return requisitosOk ? 'disponible' : 'bloqueada';
}

export function misionTerminada(estado, id) {
  const e = estado.misiones[id]?.estado;
  return e === 'completada' || e === 'convalidada';
}

export function capituloCompleto(capitulo, estado) {
  return [...capitulo.misiones, capitulo.jefe].filter(Boolean).every((id) => misionTerminada(estado, id));
}

// Registra un día activo. Los contadores solo suben: no hay rachas que se rompan.
export function registrarActividad(estado, ahora) {
  const hoy = claveDia(ahora);
  const e = estado.estadisticas;
  if (!e.diasActivos.includes(hoy)) {
    e.diasActivos = [...e.diasActivos, hoy].slice(-400);
    e.totalDiasActivos += 1;
  }
  estado.ultimaVisita = ahora;
  return estado;
}

// Meta semanal flexible: días activos esta semana (lunes a domingo).
export function metaSemanal(estado, ahora) {
  const semana = claveSemana(ahora);
  const hechos = estado.estadisticas.diasActivos.filter((d) => claveSemana(new Date(d + 'T12:00:00').getTime()) === semana).length;
  const meta = estado.ajustes.metaSemanal ?? 3;
  return { hechos, meta, cumplida: hechos >= meta };
}

// Aplica el cierre de una misión o jefe.
//  desempeno.ejercicios: [{ concepto, correcto, intentosFallidos, pistas, pistaFinal }]
// Devuelve { estado, recompensas } sin modificar el estado original.
export function completarMision(estadoOriginal, mision, desempeno, ahora, catalogo) {
  const estado = structuredClone(estadoOriginal);
  const anterior = estado.misiones[mision.id];
  const modo = anterior?.estado === 'completada' ? 'repeticion' : 'normal';
  const efectos = efectosDeMejoras(estado.mejoras, catalogo.mejoras);
  const ejercicios = (desempeno.ejercicios ?? []).map((e) => ({
    ...e,
    limpio: e.correcto && !e.intentosFallidos && !e.pistas,
  }));
  const recompensas = recompensaMision({ recompensa: mision.recompensa, ejercicios, modo, efectos });

  const rng = crearRng(estado.semilla);
  estado.semilla = Math.floor(rng.siguiente() * 2 ** 31);

  let caja = null;
  if (modo === 'normal') {
    caja = abrirCajaDividendos(rng, recompensas.capital);
    if (caja.tipo === 'capital') recompensas.capital += caja.monto;
    if (caja.tipo === 'carta-brillante') {
      const candidatos = (mision.conceptos ?? []).filter((c) => !estado.coleccion.brillantes.includes(c));
      if (candidatos.length) {
        caja.concepto = rng.elegir(candidatos);
        estado.coleccion.brillantes.push(caja.concepto);
      } else {
        caja = { tipo: 'capital', monto: Math.round(recompensas.capital * 0.2), texto: 'Dividendo ordinario' };
        recompensas.capital += caja.monto;
      }
    }
  }

  const rangoAntes = rangoDeEstado(estado, catalogo.rangos);
  estado.capital += recompensas.capital;
  estado.xp += recompensas.xp;

  // Tarjetas de repaso: se crean al aprender; al rejugar se califican.
  const porConcepto = new Map();
  for (const e of ejercicios) {
    if (!e.concepto) continue;
    const peor = porConcepto.get(e.concepto);
    const q = calidadDesdeDesempeno(e);
    porConcepto.set(e.concepto, peor == null ? q : Math.min(peor, q));
  }
  for (const concepto of mision.conceptos ?? []) {
    const existente = estado.tarjetas[concepto];
    const q = porConcepto.get(concepto) ?? 4;
    if (!existente) {
      // Si costó mucho, vuelve antes (mañana); si salió limpio, también mañana
      // pero con más facilidad. El primer repaso siempre es al día siguiente.
      estado.tarjetas[concepto] = calificar(tarjetaNueva(concepto, ahora, { intervaloInicial: 1 }), q, ahora);
      estado.tarjetas[concepto].repeticiones = Math.min(estado.tarjetas[concepto].repeticiones, 1);
    } else if (modo === 'repeticion') {
      estado.tarjetas[concepto] = calificar(existente, q, ahora);
    }
  }

  estado.misiones[mision.id] = {
    estado: 'completada',
    completadaEn: anterior?.completadaEn ?? ahora,
    veces: (anterior?.veces ?? 0) + 1,
    mejorLimpios: Math.max(anterior?.mejorLimpios ?? 0, ejercicios.filter((e) => e.limpio).length),
    nota: desempeno.nota ?? anterior?.nota ?? null,
  };
  if (estado.enCurso?.misionId === mision.id) estado.enCurso = null;
  const rangoDespues = rangoDeEstado(estado, catalogo.rangos);

  const st = estado.estadisticas;
  st.ejerciciosResueltos += ejercicios.filter((e) => e.correcto).length;
  st.resueltosALaPrimera += ejercicios.filter((e) => e.limpio).length;
  if (mision.tipo === 'jefe' && modo === 'normal') st.jefesDerrotados += 1;

  // El fondo rinde por actividad completada, no por tiempo.
  let tick = null;
  if (estado.fondo.valor > 0) {
    const r = tickMercado(estado.fondo, rng, efectos, ahora);
    estado.fondo = r.fondo;
    tick = { retorno: r.retorno, ganancia: r.ganancia };
  }
  registrarActividad(estado, ahora);

  return {
    estado,
    recompensas: {
      ...recompensas,
      modo,
      caja,
      tick,
      subioRango: rangoDespues.indice > rangoAntes.indice ? rangoDespues.actual : null,
    },
  };
}

// Marca como convalidadas las misiones que el test de nivel mostró que ya
// dominas. Pagan la mitad y crean tarjetas que se repasan pronto, para
// confirmar con práctica de recuperación que de verdad se recuerdan.
export function convalidarMisiones(estadoOriginal, ids, ahora, catalogo) {
  const estado = structuredClone(estadoOriginal);
  const efectos = efectosDeMejoras(estado.mejoras, catalogo.mejoras);
  let capital = 0;
  let xp = 0;
  for (const id of ids) {
    const mision = catalogo.misiones[id];
    if (!mision || misionTerminada(estado, id)) continue;
    const r = recompensaMision({ recompensa: mision.recompensa, modo: 'convalidada', efectos });
    capital += r.capital;
    xp += r.xp;
    estado.misiones[id] = { estado: 'convalidada', completadaEn: ahora, veces: 0, mejorLimpios: 0 };
    for (const concepto of mision.conceptos ?? []) {
      if (!estado.tarjetas[concepto]) {
        estado.tarjetas[concepto] = tarjetaNueva(concepto, ahora, { intervaloInicial: 2 });
      }
    }
  }
  estado.capital += capital;
  estado.xp += xp;
  return { estado, recompensas: { capital, xp } };
}

// Aplica el resultado de una tarjeta de repaso.
export function aplicarRepaso(estadoOriginal, conceptoId, desempeno, ahora) {
  const estado = structuredClone(estadoOriginal);
  const tarjeta = estado.tarjetas[conceptoId] ?? tarjetaNueva(conceptoId, ahora);
  const vencida = tarjeta.vence <= ahora;
  estado.tarjetas[conceptoId] = calificar(tarjeta, calidadDesdeDesempeno(desempeno), ahora);
  estado.estadisticas.repasosHechos += 1;
  registrarActividad(estado, ahora);
  return { estado, vencida };
}

// ---------- Siguiente paso ----------

// Un solo botón grande que decide por ti (útil con poca energía).
export function siguientePaso(estado, catalogo, ahora) {
  if (estado.enCurso) {
    return { tipo: 'continuar', misionId: estado.enCurso.misionId, texto: 'Continuar donde quedaste' };
  }
  const vencidas = tarjetasVencidas(estado.tarjetas, ahora).length;
  if (estado.ajustes.energiaBaja && vencidas > 0) {
    return { tipo: 'repaso', cantidad: Math.min(3, vencidas), texto: 'Repaso cortito (2 min)' };
  }
  for (const capitulo of catalogo.capitulos) {
    if (!capitulo.disponible) continue;
    const candidatas = capitulo.misiones.map((id) => catalogo.misiones[id]).filter((m) => estadoMision(m, estado) === 'disponible');
    if (candidatas.length) {
      // Alterna entre pistas (Python / SQL) para intercalar lenguajes.
      const ultimaPista = ultimaPistaJugada(estado, catalogo);
      const otra = candidatas.find((m) => m.pista !== ultimaPista);
      const m = otra ?? candidatas[0];
      if (vencidas >= 4) {
        return { tipo: 'repaso', cantidad: 5, texto: `Repasar ${Math.min(vencidas, 5)} conceptos (bono x2)` };
      }
      return { tipo: 'mision', misionId: m.id, texto: m.titulo };
    }
    const jefe = capitulo.jefe && catalogo.misiones[capitulo.jefe];
    if (jefe && estadoMision(jefe, estado) === 'disponible') {
      return { tipo: 'jefe', misionId: jefe.id, texto: `Jefe: ${jefe.titulo}` };
    }
  }
  if (vencidas > 0) return { tipo: 'repaso', cantidad: Math.min(5, vencidas), texto: 'Repasar en la sala de trading' };
  return { tipo: 'entrenamiento', texto: 'Sala de trading (entrenamiento libre)' };
}

function ultimaPistaJugada(estado, catalogo) {
  let ultima = null;
  let t = -Infinity;
  for (const [id, r] of Object.entries(estado.misiones)) {
    if (r.completadaEn > t && catalogo.misiones[id]) {
      t = r.completadaEn;
      ultima = catalogo.misiones[id].pista;
    }
  }
  return ultima;
}
