import { MISIONES_PYTHON } from './misiones-python.js';
import { MISIONES_SQL } from './misiones-sql.js';
import { JEFE_CAP1 } from './jefe.js';

export const CAPITULO_1 = {
  id: 'cap1',
  numero: 1,
  titulo: 'Primer mes en Cóndor Capital',
  subtitulo: 'Python y SQL desde cero',
  lenguajes: ['python', 'sql'],
  disponible: true,
  intro: [
    {
      quien: 'aurelio',
      texto: '{nombre}, te damos la bienvenida a Cóndor Capital. Empiezas como Analista Junior. Algún día, si sigues así, este fondo podría ser tuyo.',
    },
    {
      quien: 'marta',
      texto: 'Tienes dos pistas de trabajo: Python conmigo y SQL con Bruno. Puedes alternarlas como quieras. A fin de mes llega la auditoría.',
    },
  ],
  misiones: [...MISIONES_PYTHON, ...MISIONES_SQL].map((m) => m.id),
  jefe: JEFE_CAP1.id,
  todas: [...MISIONES_PYTHON, ...MISIONES_SQL, JEFE_CAP1],
};
