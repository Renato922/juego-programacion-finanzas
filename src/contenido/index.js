// Catálogo central de contenido. Para agregar un capítulo nuevo:
//  1. Crea src/contenido/capitulos/capN/ con sus misiones y su jefe.
//  2. Agrega sus conceptos en conceptos.js.
//  3. Regístralo en CAPITULOS (con disponible: true).
// Ver docs/roadmap.md.

import { CAPITULO_1 } from './capitulos/cap1/index.js';
import { CONCEPTOS } from './conceptos.js';
import { MEJORAS } from './mejoras.js';
import { RANGOS } from './rangos.js';
import { PERSONAJES } from './personajes.js';
import { BANCO_DIAGNOSTICO, AREAS_DIAGNOSTICO } from './diagnostico.js';

// Capítulos futuros: se muestran en el mapa como "próximamente".
const PROXIMOS = [
  {
    id: 'cap2',
    numero: 2,
    titulo: 'Riesgo y volatilidad',
    subtitulo: 'Python (numpy, pandas) + R (tidyverse)',
    lenguajes: ['python', 'r'],
    disponible: false,
    herramientaReal: 'RStudio',
  },
  {
    id: 'cap3',
    numero: 3,
    titulo: 'Los estados financieros',
    subtitulo: 'Excel (fórmulas, tablas dinámicas) + SQL intermedio',
    lenguajes: ['excel', 'sql'],
    disponible: false,
    herramientaReal: 'Excel',
  },
  {
    id: 'cap4',
    numero: 4,
    titulo: 'Valuación: DCF y bonos',
    subtitulo: 'Excel/VBA + Python (VAN, TIR, duración)',
    lenguajes: ['excel', 'python'],
    disponible: false,
    herramientaReal: 'Excel + VBA',
  },
  {
    id: 'cap5',
    numero: 5,
    titulo: 'El reporte del directorio',
    subtitulo: 'Power BI (Power Query, DAX) + SQL avanzado',
    lenguajes: ['powerbi', 'sql'],
    disponible: false,
    herramientaReal: 'Power BI Desktop',
  },
  {
    id: 'cap6',
    numero: 6,
    titulo: 'Portafolios y CAPM',
    subtitulo: 'Python (Markowitz) + R (regresiones)',
    lenguajes: ['python', 'r'],
    disponible: false,
    herramientaReal: 'RStudio',
  },
  {
    id: 'cap7',
    numero: 7,
    titulo: 'Riesgo de mercado',
    subtitulo: 'VaR, Monte Carlo y derivados en Python y R',
    lenguajes: ['python', 'r'],
    disponible: false,
  },
  {
    id: 'cap8',
    numero: 8,
    titulo: 'El fondo es tuyo',
    subtitulo: 'Backtesting y machine learning básico',
    lenguajes: ['python', 'sql', 'powerbi'],
    disponible: false,
  },
];

export const CAPITULOS = [CAPITULO_1, ...PROXIMOS];

const misiones = {};
for (const c of CAPITULOS) {
  for (const m of c.todas ?? []) misiones[m.id] = { ...m, capitulo: c.id };
}

export const CATALOGO = {
  capitulos: CAPITULOS,
  misiones,
  conceptos: CONCEPTOS,
  mejoras: MEJORAS,
  rangos: RANGOS,
  personajes: PERSONAJES,
  diagnostico: { banco: BANCO_DIAGNOSTICO, areas: AREAS_DIAGNOSTICO },
};

// Todos los pasos evaluables (ejercicios y quizzes) de una misión o jefe.
export function pasosEvaluables(mision) {
  if (mision.tipo === 'jefe') return mision.fases.map((f) => f.paso);
  return mision.pasos.filter((p) => p.tipo === 'ejercicio' || p.tipo === 'quiz');
}
