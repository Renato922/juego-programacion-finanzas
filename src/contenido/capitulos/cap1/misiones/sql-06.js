// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-06: Unir las piezas

export default {
  id: 'sql-06',
  titulo: 'Unir las piezas',
  resumen: 'INNER JOIN, alias de tablas y LEFT JOIN para encontrar faltantes.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '10 min',
  requiere: ['sql-05'],
  nivelDiagnostico: 6,
  conceptos: ['sql.join', 'sql.left_join'],
  recompensa: {
    capital: 2200,
    xp: 90,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto:
            'trades dice "cliente 2 compró PAC". Pero el comité quiere ver "Inversiones Ríos SAC compró Banco Pacífico". Los nombres están en otras tablas.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'JOIN',
      texto:
        '`JOIN` combina filas de dos tablas que coinciden en una columna (`ON`). Los alias de tabla (`trades t`) ahorran escritura: `t.ticker` es la columna ticker de trades.\n\n`JOIN` (o `INNER JOIN`) solo deja las filas con coincidencia en ambas tablas.',
      codigo: 'SELECT t.trade_id, t.ticker, a.name, a.sector\nFROM trades t\nJOIN assets a ON t.ticker = a.ticker;',
      lenguaje: 'sql',
      db: 'fondo',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-06-e1',
      concepto: 'sql.join',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Muestra `trade_id`, el **nombre del cliente** (`clients.name`) y el `ticker` de cada operación.',
      inicial: '',
      solucion: 'SELECT t.trade_id, c.name, t.ticker FROM trades t JOIN clients c ON t.client_id = c.client_id;',
      opciones: {
        verificar: [
          {
            tipo: 'codigoIncluye',
            patron: '\\bJOIN\\b',
            banderas: 'i',
            mensaje: 'Usa JOIN para unir trades con clients.',
          },
        ],
      },
      pistas: [
        'Une trades y clients por client_id.',
        'FROM trades t JOIN clients c ON t.client_id = c.client_id',
        'SELECT t.trade_id, c.____, t.ticker FROM trades t JOIN clients c ON t.client_id = c.________;',
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'sql-06-e2',
      concepto: 'sql.join',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Muestra cada `sector` y el monto total negociado (`SUM(t.quantity * t.price) AS total`), uniendo `trades` con `assets`.',
      inicial: '',
      solucion: 'SELECT a.sector, SUM(t.quantity * t.price) AS total FROM trades t JOIN assets a ON t.ticker = a.ticker GROUP BY a.sector;',
      opciones: {
        tol: {
          abs: 0.01,
          rel: 1e-9,
        },
      },
      pistas: [
        'Primero el JOIN por ticker, luego GROUP BY a.sector.',
        'FROM trades t JOIN assets a ON t.ticker = a.ticker GROUP BY a.sector',
        'SELECT a.sector, SUM(t.quantity * t.price) AS total FROM trades t JOIN assets a ON t.ticker = a.ticker GROUP BY _________;',
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'LEFT JOIN',
      texto:
        '`LEFT JOIN` conserva **todas** las filas de la tabla de la izquierda, aunque no tengan pareja. Donde no hay pareja, las columnas de la derecha quedan en `NULL`.\n\nTruco clásico: `LEFT JOIN` + `WHERE derecha.columna IS NULL` encuentra lo que **falta** (por ejemplo, clientes sin operaciones). Se escribe `IS NULL`, no `= NULL`.',
      codigo: 'SELECT c.name, t.trade_id\nFROM clients c\nLEFT JOIN trades t ON c.client_id = t.client_id;',
      lenguaje: 'sql',
      db: 'fondo',
    },
    {
      tipo: 'quiz',
      id: 'sql-06-q1',
      concepto: 'sql.left_join',
      pregunta: 'Si un cliente no tiene operaciones, ¿aparece en `clients c JOIN trades t ON ...`?',
      opciones: ['Sí, con NULL', 'No: el JOIN interno solo deja filas con coincidencia', 'Sí, duplicado', 'Da error'],
      correcta: 1,
      explicacion: 'JOIN (INNER) descarta filas sin pareja. Para conservarlas se usa LEFT JOIN.',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-06-e3',
      concepto: 'sql.left_join',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Encuentra el `name` de los clientes que **no tienen ninguna operación**.',
      inicial: '',
      solucion: 'SELECT c.name FROM clients c LEFT JOIN trades t ON c.client_id = t.client_id WHERE t.trade_id IS NULL;',
      opciones: {},
      pistas: [
        'LEFT JOIN de clients hacia trades.',
        'Quédate con las filas donde t.trade_id IS NULL.',
        'SELECT c.name FROM clients c LEFT JOIN trades t ON c.client_id = t.client_id WHERE t.trade_id IS ____;',
      ],
      alternativas: ['SELECT name FROM clients WHERE client_id NOT IN (SELECT client_id FROM trades);'],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: 'Sofía Rojas: cliente nueva, sin operaciones. Ese es un dato que vale oro para el equipo comercial.',
        },
        {
          quien: 'bruno',
          texto: 'Okay, admito que vas rápido. El viernes llega la auditora Valdivia. Prepárate.',
        },
      ],
    },
  ],
};
