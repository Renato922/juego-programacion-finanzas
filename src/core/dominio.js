// Barra de dominio de una misión (inspirada en ALEKS).
//
// Cada ejercicio o quiz de la misión es un segmento de la barra. Resolverlo
// llena su segmento. Equivocarse en un paso hace que la barra retroceda un
// segmento y agrega un ejercicio de refuerzo del mismo concepto, que se juega
// antes del jefe del día. Solo se cobra un retroceso por paso, y los errores
// dentro de un refuerzo no agregan más refuerzos: así no hay espirales.
//
// Nunca se pierde capital, XP ni misiones completadas: el retroceso solo pide
// demostrar el tema otra vez. En modo poca energía la barra no retrocede.

function indicesEvaluables(mision) {
  return mision.pasos.map((p, i) => (p.tipo === 'ejercicio' || p.tipo === 'quiz' ? i : -1)).filter((i) => i >= 0);
}

// hastaIndice permite reconstruir la barra de una misión ya empezada.
export function crearDominio(mision, hastaIndice = 0) {
  const evaluables = indicesEvaluables(mision);
  return {
    total: evaluables.length,
    resueltos: evaluables.filter((i) => i < hastaIndice),
    conError: [],
    pendientes: [],
    usados: {},
  };
}

// Primer error en un paso: la barra retrocede y se agenda un refuerzo.
export function registrarError(dominioOriginal, indice, concepto) {
  if (dominioOriginal.conError.includes(indice) || !concepto) return { dominio: dominioOriginal, retrocedio: false };
  const dominio = structuredClone(dominioOriginal);
  dominio.conError.push(indice);
  dominio.pendientes.push({ concepto });
  return { dominio, retrocedio: true };
}

export function registrarResuelto(dominioOriginal, indice) {
  if (dominioOriginal.resueltos.includes(indice)) return dominioOriginal;
  const dominio = structuredClone(dominioOriginal);
  dominio.resueltos.push(indice);
  return dominio;
}

// Segmentos llenos de la barra (0..total).
export function nivelDominio(dominio) {
  return Math.max(0, Math.min(dominio.total, dominio.resueltos.length - dominio.pendientes.length));
}

export function dominioCompleto(dominio) {
  return dominio.pendientes.length === 0 && dominio.resueltos.length >= dominio.total;
}

// Siguiente refuerzo pendiente: un repaso del concepto, rotando entre los
// disponibles para no repetir el mismo si se falla.
export function refuerzoActual(dominio, conceptos) {
  const pendiente = dominio.pendientes[0];
  if (!pendiente) return null;
  const repasos = conceptos[pendiente.concepto]?.repasos ?? [];
  if (!repasos.length) return null;
  const vez = dominio.usados[pendiente.concepto] ?? 0;
  return { paso: { ...repasos[vez % repasos.length], concepto: pendiente.concepto }, concepto: pendiente.concepto, quedan: dominio.pendientes.length };
}

// recuperado: el refuerzo se resolvió bien. Si no, se intenta con otro
// repaso del mismo concepto.
export function resolverRefuerzo(dominioOriginal, recuperado) {
  const dominio = structuredClone(dominioOriginal);
  const pendiente = dominio.pendientes[0];
  if (!pendiente) return dominio;
  dominio.usados[pendiente.concepto] = (dominio.usados[pendiente.concepto] ?? 0) + 1;
  if (recuperado) dominio.pendientes.shift();
  return dominio;
}

// Quita refuerzos de conceptos sin repasos (no debería pasar: las pruebas de
// contenido exigen repasos para cada concepto).
export function limpiarPendientes(dominioOriginal, conceptos) {
  const pendientes = dominioOriginal.pendientes.filter((p) => conceptos[p.concepto]?.repasos?.length);
  if (pendientes.length === dominioOriginal.pendientes.length) return dominioOriginal;
  return { ...structuredClone(dominioOriginal), pendientes };
}
