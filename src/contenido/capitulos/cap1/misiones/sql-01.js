// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-01: El almacén de datos

export default {
  id: 'sql-01',
  titulo: 'El almacén de datos',
  resumen: 'SELECT, FROM, columnas calculadas y AS.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '6 min',
  requiere: [],
  nivelDiagnostico: 1,
  conceptos: ['sql.select', 'sql.alias'],
  recompensa: {
    capital: 1200,
    xp: 60,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: 'Todo lo que pasa en el fondo queda guardado en una base de datos. Quien sabe SQL nunca se queda sin datos.',
        },
        {
          quien: 'bruno',
          texto: 'A la derecha tienes el esquema: tablas y columnas. Algunas son de la empresa; us_macro y grunfeld son datos históricos reales.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'SELECT y FROM',
      texto:
        'Una consulta pide columnas (`SELECT`) de una tabla (`FROM`). `*` significa todas las columnas. El `;` marca el final.\n\nLas palabras clave de SQL se suelen escribir en MAYÚSCULAS para leerlas mejor, aunque no es obligatorio.',
      codigo: 'SELECT ticker, name, sector\nFROM assets;',
      lenguaje: 'sql',
      db: 'fondo',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-01-e1',
      concepto: 'sql.select',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Muestra el `ticker`, el `name` y el `country` de todos los activos (tabla `assets`).',
      inicial: '',
      solucion: 'SELECT ticker, name, country FROM assets;',
      opciones: {},
      pistas: [
        'La estructura es SELECT columnas FROM tabla;',
        'Separa las columnas con comas: SELECT ticker, name, country ...',
        'SELECT ticker, name, country FROM ______;',
      ],
      incorrectas: ['SELECT * FROM assets;', 'SELECT ticker, name FROM assets;'],
    },
    {
      tipo: 'quiz',
      id: 'sql-01-q1',
      concepto: 'sql.select',
      pregunta: '¿Qué significa el * en `SELECT * FROM trades`?',
      opciones: ['Multiplicar', 'Todas las columnas', 'Todas las tablas', 'La primera fila'],
      correcta: 1,
      explicacion: 'En SELECT, * significa "todas las columnas". En el trabajo conviene pedir solo las columnas que necesitas.',
    },
    {
      tipo: 'leccion',
      titulo: 'Columnas calculadas y AS',
      texto:
        'Puedes calcular en el SELECT: `quantity * price` da el monto de cada operación. Con `AS` le pones nombre (alias) a la columna.\n\nEsto **no cambia** la tabla: solo el resultado de la consulta.',
      codigo: 'SELECT trade_id, quantity * price AS amount\nFROM trades;',
      lenguaje: 'sql',
      db: 'fondo',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-01-e2',
      concepto: 'sql.alias',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Para cada operación de `trades`, muestra `trade_id`, `ticker` y el monto (`quantity * price`) con el nombre `amount`.',
      inicial: '',
      solucion: 'SELECT trade_id, ticker, quantity * price AS amount FROM trades;',
      opciones: {
        nombresColumnas: true,
      },
      pistas: [
        'El monto es quantity * price.',
        'Para nombrar la columna: quantity * price AS amount',
        'SELECT trade_id, ticker, quantity * price AS ______ FROM trades;',
      ],
      incorrectas: ['SELECT trade_id, ticker, quantity * price FROM trades;'],
    },
    {
      tipo: 'ejercicio',
      id: 'sql-01-e3',
      concepto: 'sql.select',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado:
        'Datos reales: muestra `year`, `quarter` y `unemp` (tasa de desempleo de EE. UU., en %) de la tabla `us_macro`. Son 203 trimestres, de 1959 a 2009.',
      inicial: '',
      solucion: 'SELECT year, quarter, unemp FROM us_macro;',
      opciones: {},
      pistas: ['Igual que antes, pero con la tabla us_macro.', 'SELECT year, quarter, unemp FROM ...;'],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: 'Bien. Ahora mira el desempleo de 1982 y de 2009. Vas a entender por qué los economistas hablan de esos años.',
        },
      ],
    },
  ],
};
