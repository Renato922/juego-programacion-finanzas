// Estado de la partida: forma inicial y migraciones entre versiones.
// Se guarda localmente (archivo en Electron, localStorage en navegador).

export const VERSION_ESTADO = 1;

// Efecto de progreso dotado (Nunes y Drèze, 2006): se empieza con un pequeño
// avance real (bono de contratación) en lugar de una barra en cero.
export const XP_INICIAL = 60;
export const CAPITAL_INICIAL = 800;

export function crearEstadoInicial(ahora = Date.now(), semilla = Math.floor(Math.random() * 2 ** 31)) {
  return {
    version: VERSION_ESTADO,
    creado: ahora,
    ultimaVisita: ahora,
    jugador: { nombre: '' },
    ajustes: {
      sonido: true,
      animaciones: true,
      energiaBaja: false,
      metaSemanal: 3,
      modoCompromiso: false,
      motivoPersonal: '',
      textoRapido: false,
    },
    diagnostico: { hecho: false, niveles: {}, convalidadas: [] },
    xp: XP_INICIAL,
    capital: CAPITAL_INICIAL,
    fondo: { invertido: 0, valor: 0, riesgo: 'conservador', historial: [] },
    mejoras: {},
    misiones: {},
    enCurso: null,
    tarjetas: {},
    coleccion: { brillantes: [] },
    historia: { vistos: [] },
    herramientas: {},
    estadisticas: {
      diasActivos: [],
      totalDiasActivos: 0,
      ejerciciosResueltos: 0,
      resueltosALaPrimera: 0,
      repasosHechos: 0,
      sesionesEntrenamiento: 0,
      jefesDerrotados: 0,
      mejorPLEntrenamiento: 0,
    },
    semilla,
  };
}

// Completa campos que falten (partidas guardadas con versiones anteriores
// del juego) sin borrar nada de lo que el jugador ya tiene.
export function migrar(guardado, ahora = Date.now()) {
  if (!guardado || typeof guardado !== 'object') return crearEstadoInicial(ahora);
  const base = crearEstadoInicial(ahora, guardado.semilla ?? 1);
  const estado = { ...base, ...guardado };
  for (const clave of ['jugador', 'ajustes', 'diagnostico', 'fondo', 'coleccion', 'historia', 'herramientas', 'estadisticas']) {
    estado[clave] = { ...base[clave], ...(guardado[clave] ?? {}) };
  }
  estado.version = VERSION_ESTADO;
  return estado;
}

export function serializar(estado) {
  return JSON.stringify(estado);
}

export function deserializar(texto, ahora = Date.now()) {
  try {
    return migrar(JSON.parse(texto), ahora);
  } catch {
    return null;
  }
}
