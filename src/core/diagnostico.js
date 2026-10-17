// Test de nivel adaptativo.
//
// Por cada área (python, sql, ...) las preguntas están ordenadas por nivel.
// Se empieza por el nivel 1 y se sube mientras aciertas. El primer error
// (o "No lo sé") cierra el área: tu nivel es el último que acertaste.
// Las misiones con nivelDiagnostico <= tu nivel se convalidan.

export function crearTest(banco, areas) {
  return {
    areas: areas.filter((a) => banco.some((p) => p.area === a)),
    indiceArea: 0,
    nivelActual: {},
    respuestas: [],
    cerradas: [],
  };
}

function preguntasDeArea(banco, area) {
  return banco.filter((p) => p.area === area).sort((a, b) => a.nivel - b.nivel);
}

export function siguientePregunta(test, banco) {
  while (test.indiceArea < test.areas.length) {
    const area = test.areas[test.indiceArea];
    if (!test.cerradas.includes(area)) {
      const nivel = test.nivelActual[area] ?? 0;
      const p = preguntasDeArea(banco, area).find((q) => q.nivel > nivel);
      if (p) return p;
    }
    test.indiceArea += 1;
  }
  return null;
}

// respuesta: índice de opción elegida, o null para "No lo sé".
export function responder(testOriginal, pregunta, respuesta) {
  const test = structuredClone(testOriginal);
  const correcta = respuesta !== null && respuesta === pregunta.correcta;
  test.respuestas.push({ id: pregunta.id, area: pregunta.area, nivel: pregunta.nivel, correcta });
  if (correcta) {
    test.nivelActual[pregunta.area] = pregunta.nivel;
  } else {
    test.cerradas.push(pregunta.area);
  }
  return { test, correcta };
}

// Saltar un área completa ("nunca lo he usado"): nivel 0 sin preguntar.
export function saltarArea(testOriginal, area) {
  const test = structuredClone(testOriginal);
  if (!test.cerradas.includes(area)) test.cerradas.push(area);
  test.nivelActual[area] = test.nivelActual[area] ?? 0;
  return test;
}

export function resultadoTest(test, misiones) {
  const niveles = {};
  for (const area of test.areas) niveles[area] = test.nivelActual[area] ?? 0;
  const convalidadas = Object.values(misiones)
    .filter((m) => m.nivelDiagnostico != null && m.tipo !== 'jefe')
    .filter((m) => (niveles[m.lenguaje] ?? 0) >= m.nivelDiagnostico)
    .map((m) => m.id);
  return { niveles, convalidadas };
}
