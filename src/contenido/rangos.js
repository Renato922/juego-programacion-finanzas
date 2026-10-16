// Rangos de la carrera: de analista junior a dueño del fondo.
// Cada ascenso pide XP y, en los hitos de la historia, vencer al jefe del capítulo.

export const RANGOS = [
  { id: 'junior', nombre: 'Analista Junior', xp: 0 },
  { id: 'analista', nombre: 'Analista', xp: 800, jefe: 'jefe-cap1' },
  { id: 'senior', nombre: 'Analista Senior', xp: 2000, jefe: 'jefe-cap2' },
  { id: 'asociado', nombre: 'Asociado', xp: 3500, jefe: 'jefe-cap3' },
  { id: 'vp', nombre: 'Vicepresidente', xp: 5500, jefe: 'jefe-cap4' },
  { id: 'director', nombre: 'Director de Inversiones', xp: 8000, jefe: 'jefe-cap5' },
  { id: 'pm', nombre: 'Portfolio Manager', xp: 11000, jefe: 'jefe-cap6' },
  { id: 'socio', nombre: 'Socio', xp: 15000, jefe: 'jefe-cap7' },
  { id: 'dueno', nombre: 'Dueño del fondo', xp: 20000, jefe: 'jefe-cap8' },
];
