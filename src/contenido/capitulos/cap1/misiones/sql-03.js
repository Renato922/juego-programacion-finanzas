// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-03: El ranking del mes

export default {
  id: 'sql-03',
  titulo: 'El ranking del mes',
  resumen: 'ORDER BY, DESC, LIMIT y DISTINCT.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '7 min',
  requiere: ['sql-02'],
  nivelDiagnostico: 3,
  conceptos: ['sql.orderby'],
  recompensa: {
    capital: 1500,
    xp: 70,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: 'Marta quiere las operaciones más grandes del año en su escritorio. Ordenadas, y solo las primeras.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'ORDER BY, LIMIT y DISTINCT',
      texto:
        '`ORDER BY columna` ordena de menor a mayor (ASC, por defecto); con `DESC`, de mayor a menor. `LIMIT n` se queda con las primeras n filas y va al final.\n\n`SELECT DISTINCT columna` muestra cada valor una sola vez.\n\nSin ORDER BY, el orden de las filas **no está garantizado**.',
      codigo: "SELECT ticker, close\nFROM prices\nWHERE date = '2025-12-31'\nORDER BY close DESC\nLIMIT 3;",
      lenguaje: 'sql',
      db: 'fondo',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-03-e1',
      concepto: 'sql.orderby',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Muestra `trade_id`, `ticker` y el monto (`quantity * price AS amount`) de las **5 operaciones más grandes**, de mayor a menor.',
      inicial: '',
      solucion: 'SELECT trade_id, ticker, quantity * price AS amount FROM trades ORDER BY amount DESC LIMIT 5;',
      opciones: {
        ordenImporta: true,
      },
      pistas: [
        'Puedes ordenar por el alias: ORDER BY amount DESC',
        'LIMIT va al final.',
        'SELECT trade_id, ticker, quantity * price AS amount FROM trades ORDER BY ______ DESC LIMIT _;',
      ],
      incorrectas: ['SELECT trade_id, ticker, quantity * price AS amount FROM trades ORDER BY amount LIMIT 5;'],
    },
    {
      tipo: 'ejercicio',
      id: 'sql-03-e2',
      concepto: 'sql.orderby',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Muestra la lista de **sectores distintos** de la tabla `assets`, en orden alfabético.',
      inicial: '',
      solucion: 'SELECT DISTINCT sector FROM assets ORDER BY sector;',
      opciones: {
        ordenImporta: true,
      },
      pistas: ['DISTINCT va justo después de SELECT.', 'SELECT DISTINCT sector FROM assets ...', 'SELECT DISTINCT sector FROM assets ORDER BY ______;'],
      incorrectas: ['SELECT sector FROM assets ORDER BY sector;'],
    },
    {
      tipo: 'quiz',
      id: 'sql-03-q1',
      concepto: 'sql.orderby',
      pregunta: '¿Dónde va LIMIT?',
      opciones: ['Antes de SELECT', 'Entre FROM y WHERE', 'Al final de la consulta', 'Donde sea'],
      correcta: 2,
      explicacion: 'LIMIT es lo último: SELECT … FROM … WHERE … ORDER BY … LIMIT n.',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-03-e3',
      concepto: 'sql.orderby',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Datos reales: muestra `year`, `quarter` e `infl` (inflación anualizada, %) de los **3 trimestres con mayor inflación** en `us_macro`.',
      inicial: '',
      solucion: 'SELECT year, quarter, infl FROM us_macro ORDER BY infl DESC LIMIT 3;',
      opciones: {
        ordenImporta: true,
      },
      pistas: ['Ordena por infl de mayor a menor.', 'ORDER BY infl DESC LIMIT 3'],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: 'Fines de 1979 y comienzos de 1980: inflación cerca de 15% anualizada. Por eso la Reserva Federal subió las tasas con fuerza en esos años.',
        },
      ],
    },
  ],
};
