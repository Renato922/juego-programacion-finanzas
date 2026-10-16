// Mensajes al volver al juego.
//
// Decisión de la investigación (docs/investigacion/02-psicologia.md):
//  - Nunca se culpa ni se avergüenza por haberse ausentado.
//  - La "culpa" solo existe de forma opcional (modo compromiso), en su
//    versión sana: recordar el propio motivo que el jugador escribió y
//    ofrecer de inmediato una acción pequeña y reparable.
//  - Si el jugador marcó "poca energía", no se usa ni siquiera esa versión.

import { diasEntre } from './fechas.js';

export function mensajeDeRegreso(estado, ahora, { vencidas = 0 } = {}) {
  const dias = diasEntre(estado.ultimaVisita ?? ahora, ahora);
  const nombre = estado.jugador.nombre || 'analista';
  const lineas = [];
  let accion = null;

  if (dias < 0.25) return null; // misma sesión o pocas horas: sin mensaje.

  if (dias < 2) {
    lineas.push(`Hola de nuevo, ${nombre}. Tu escritorio está tal como lo dejaste.`);
  } else if (dias < 14) {
    lineas.push(`¡${nombre}! Qué bueno verte. Todo tu progreso y tu capital siguen aquí, intactos.`);
  } else {
    lineas.push(`Qué bueno tenerte de vuelta, ${nombre}. Nada se perdió: tu fondo, tu rango y tus cartas te esperaban.`);
    lineas.push('Volver ya es la parte difícil, y la acabas de hacer.');
  }

  if (estado.enCurso) {
    accion = { tipo: 'continuar', texto: 'Terminar la misión que dejaste a medias' };
  } else if (vencidas > 0) {
    accion = { tipo: 'repaso', texto: `Repaso de 2 minutos (${Math.min(vencidas, 3)} conceptos, pagan doble)` };
  } else {
    accion = { tipo: 'siguiente', texto: 'Siguiente misión' };
  }

  const usarCompromiso = estado.ajustes.modoCompromiso && !estado.ajustes.energiaBaja && estado.ajustes.motivoPersonal?.trim() && dias >= 2;
  if (usarCompromiso) {
    lineas.push(`Tú escribiste: "${estado.ajustes.motivoPersonal.trim()}".`);
    lineas.push('Ese motivo sigue en pie. Con 5 minutos hoy ya avanzas hacia él.');
  }

  return { lineas, accion, compromiso: Boolean(usarCompromiso) };
}
