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
      opciones: {},
      pistas: ['Agrega una línea WHERE con la condición.', "WHERE side = 'sell'", "SELECT * FROM trades WHERE side = '____';"],
      incorrectas: ['SELECT * FROM trades;', "SELECT * FROM trades WHERE side = 'buy';"],
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
          },
        ],
      },
      pistas: [
        'IN recibe una lista entre paréntesis.',
        "WHERE sector IN ('Energy', 'Banking')",
        "SELECT ticker, name FROM assets WHERE sector IN ('______', '_______');",
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
      opciones: {},
      pistas: ['La columna de desempleo es unemp y está en %.', 'WHERE unemp > 9', 'SELECT year, quarter, unemp FROM us_macro WHERE _____ > 9;'],
      incorrectas: ['SELECT year, quarter, unemp FROM us_macro WHERE unemp > 8;', 'SELECT year, unemp FROM us_macro WHERE unemp > 9;'],
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
          },
        ],
      },
      pistas: [
        'Las fechas se guardan como texto con formato AAAA-MM-DD, así que se comparan bien.',
        "WHERE trade_date BETWEEN '2025-01-01' AND '2025-03-31'",
        "SELECT trade_id, trade_date, ticker FROM trades WHERE trade_date BETWEEN '__________' AND '__________';",
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
