// Utilidades de fechas. Todo se maneja en milisegundos (Date.now()).

export const MS_DIA = 24 * 60 * 60 * 1000;

export function sumarDias(ms, dias) {
  return ms + dias * MS_DIA;
}

// Clave de día local, por ejemplo "2026-10-16".
export function claveDia(ms) {
  const d = new Date(ms);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Lunes de la semana del día dado (clave), para la meta semanal.
export function claveSemana(ms) {
  const d = new Date(ms);
  const diaSemana = (d.getDay() + 6) % 7; // lunes = 0
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - diaSemana);
  return claveDia(d.getTime());
}

export function diasEntre(desdeMs, hastaMs) {
  return (hastaMs - desdeMs) / MS_DIA;
}
