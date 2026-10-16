// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-02: Filtrar el ruido

export default {
  id: 'sql-02',
  titulo: 'Filtrar el ruido',
  resumen: 'WHERE, AND, OR, IN y BETWEEN.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '8 min',
  requiere: ['sql-01'],
  nivelDiagnostico: 2,
  conceptos: ['sql.where'],
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
          texto: 'Casi nunca quieres todas las filas. Quieres las que importan. Para eso existe WHERE.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'WHERE',
      texto:
        "`WHERE` filtra filas con una condición. Los textos van entre **comillas simples**: `'buy'`.\n\nComparadores: `=`, `<>` (distinto), `>`, `>=`, `<`, `<=`. Se combinan con `AND` y `OR`.\n\n`IN ('a', 'b')` acepta una lista de valores y `BETWEEN x AND y` un rango (incluye los extremos).",
      codigo: "SELECT trade_id, ticker, quantity\nFROM trades\nWHERE side = 'buy' AND quantity >= 300;",
      lenguaje: 'sql',
      db: 'fondo',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-02-e1',
      concepto: 'sql.where',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: "Muestra todas las columnas de las operaciones de **venta** (`side = 'sell'`).",
      inicial: 'SELECT *\nFROM trades\n',
      solucion: "SELECT * FROM trades WHERE side = 'sell';",
      opciones: {
        ayuda: "Filtra con WHERE side = 'sell' (el texto entre comillas simples) para quedarte solo con las ventas.",
      },
      pistas: ['Agrega una línea WHERE con la condición.', "WHERE side = 'sell'", "SELECT * FROM trades WHERE side = '____';"],
      incorrectas: [
        {
          codigo: 'SELECT * FROM trades;',
          retro: 'se esperaban 7',
        },
        {
          codigo: "SELECT * FROM trades WHERE side = 'buy';",
          retro: "side = 'sell'",
        },
        {
          codigo: 'SELECT * FROM trades WHERE side = sell;',
          retro: 'comillas simples',
        },
      ],
      explicacion:
        "`WHERE side = 'sell'` deja solo las filas cuya columna side vale 'sell': las 7 ventas de las 28 operaciones. El texto va entre comillas simples; sin comillas, SQL buscaría una columna llamada sell.\n\nEl `;` va al final de toda la consulta, después del WHERE.",
    },
    {
      tipo: 'ejercicio',
      id: 'sql-02-e2',
      concepto: 'sql.where',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: "Muestra `ticker` y `name` de los activos de los sectores `'Energy'` o `'Banking'`. Usa `IN`.",
      inicial: '',
      solucion: "SELECT ticker, name FROM assets WHERE sector IN ('Energy', 'Banking');",
      opciones: {
        verificar: [
          {
            tipo: 'codigoIncluye',
            patron: '\\bIN\\s*\\(',
            banderas: 'i',
            mensaje: 'Usa IN (...) para la lista de sectores.',
            ayuda: "Escribe la lista de sectores con IN: WHERE sector IN ('Energy', 'Banking').",
          },
        ],
        ayuda: "Escribe los sectores tal como están en la tabla, con mayúscula inicial y entre comillas simples: 'Energy' y 'Banking'.",
      },
      pistas: [
        'IN recibe una lista entre paréntesis.',
        "WHERE sector IN ('Energy', 'Banking')",
        "SELECT ticker, name FROM assets WHERE sector IN ('______', '_______');",
      ],
      explicacion:
        "`IN ('Energy', 'Banking')` es una forma corta de escribir `sector = 'Energy' OR sector = 'Banking'`: acepta cualquiera de los valores de la lista. Cada texto va entre comillas simples, separados por comas.\n\nLos textos deben coincidir exactamente con los de la tabla, incluidas las mayúsculas: 'energy' no encuentra 'Energy'.",
      alternativas: ["SELECT ticker, name FROM assets WHERE sector IN ('Banking', 'Energy');"],
      incorrectas: [
        {
          codigo: "SELECT ticker, name FROM assets WHERE sector IN ('energy', 'banking');",
          retro: 'mayúscula inicial',
        },
        {
          codigo: "SELECT ticker, name FROM assets WHERE sector IN ('Energy');",
          retro: "'Banking'",
        },
      ],
    },
    {
      tipo: 'quiz',
      id: 'sql-02-q1',
      concepto: 'sql.where',
      pregunta: '¿Por qué falla `WHERE side = buy`?',
      opciones: ['Porque WHERE no acepta =', 'Porque sin comillas, SQL cree que buy es una columna', 'Porque buy está en minúsculas', 'No falla'],
      correcta: 1,
      explicacion: "Sin comillas, buy se interpreta como nombre de columna (y no existe). Los textos van entre comillas simples: 'buy'.",
    },
    {
      tipo: 'ejercicio',
      id: 'sql-02-e3',
      concepto: 'sql.where',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Datos reales: muestra `year`, `quarter` y `unemp` de los trimestres en que el desempleo de EE. UU. fue **mayor a 9%**.',
      inicial: '',
      solucion: 'SELECT year, quarter, unemp FROM us_macro WHERE unemp > 9;',
      opciones: {
        ayuda: 'Filtra con WHERE unemp > 9. La columna unemp ya está en porcentaje: se escribe 9, no 0.09.',
      },
      pistas: ['La columna de desempleo es unemp y está en %.', 'WHERE unemp > 9', 'SELECT year, quarter, unemp FROM us_macro WHERE _____ > 9;'],
      incorrectas: [
        {
          codigo: 'SELECT year, quarter, unemp FROM us_macro WHERE unemp > 8;',
          retro: 'unemp > 9',
        },
        {
          codigo: 'SELECT year, unemp FROM us_macro WHERE unemp > 9;',
          retro: 'year, quarter, unemp',
        },
        {
          codigo: 'SELECT year, quarter, unemp FROM us_macro WHERE unemp > 0.09;',
          retro: 'no 0.09',
        },
      ],
      explicacion:
        '`WHERE unemp > 9` compara cada trimestre con 9: la columna ya está en %, así que se escribe 9 y no 0.09. Aparecen 8 trimestres: seis de 1982-1983 y dos de 2009.\n\nSe usa `>` porque el enunciado dice "mayor a 9%". Con `>=` entraría además cualquier trimestre con exactamente 9.0 (en estos datos no hay ninguno).',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-02-e4',
      concepto: 'sql.where',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado:
        "Muestra `trade_id`, `trade_date` y `ticker` de las operaciones del **primer trimestre de 2025** (`trade_date` entre `'2025-01-01'` y `'2025-03-31'`). Usa `BETWEEN`.",
      inicial: '',
      solucion: "SELECT trade_id, trade_date, ticker FROM trades WHERE trade_date BETWEEN '2025-01-01' AND '2025-03-31';",
      opciones: {
        verificar: [
          {
            tipo: 'codigoIncluye',
            patron: '\\bBETWEEN\\b',
            banderas: 'i',
            mensaje: 'Usa BETWEEN ... AND ...',
            ayuda: 'El rango se escribe con BETWEEN inicio AND fin.',
          },
        ],
        ayuda: "Las fechas van entre comillas simples y con formato AAAA-MM-DD: desde '2025-01-01' hasta '2025-03-31'.",
      },
      pistas: [
        'Las fechas se guardan como texto con formato AAAA-MM-DD, así que se comparan bien.',
        "WHERE trade_date BETWEEN '2025-01-01' AND '2025-03-31'",
        "SELECT trade_id, trade_date, ticker FROM trades WHERE trade_date BETWEEN '__________' AND '__________';",
      ],
      explicacion:
        "`BETWEEN '2025-01-01' AND '2025-03-31'` incluye los dos extremos, así que entran el 1 de enero y el 31 de marzo. Como las fechas están guardadas como texto AAAA-MM-DD, el orden alfabético coincide con el cronológico y la comparación funciona. Son 8 operaciones.\n\nEl error típico es olvidar las comillas: sin ellas, 2025-01-01 se lee como una resta (2025 − 1 − 1 = 2023).",
      incorrectas: [
        {
          codigo: 'SELECT trade_id, trade_date, ticker FROM trades WHERE trade_date BETWEEN 2025-01-01 AND 2025-03-31;',
          retro: 'entre comillas simples',
        },
        {
          codigo: "SELECT trade_id, trade_date, ticker FROM trades WHERE trade_date BETWEEN '2025-01-01' AND '2025-03-01';",
          retro: "'2025-03-31'",
        },
      ],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: '1982-83 y 2009: los dos peores momentos del empleo en esos 50 años. Lo encontraste con una línea.',
        },
      ],
    },
  ],
};
