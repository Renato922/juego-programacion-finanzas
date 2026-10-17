// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-06: Unir las piezas

export default {
  id: 'sql-06',
  titulo: 'Unir las piezas',
  resumen: 'INNER JOIN, alias de tablas y LEFT JOIN para encontrar faltantes.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '13 min',
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
            ayuda: 'Une las tablas con FROM trades t JOIN clients c ON ...',
          },
        ],
        ayuda: 'Une por la columna que comparten las dos tablas: ON t.client_id = c.client_id, y pide c.name para el nombre.',
      },
      pistas: [
        'Une trades y clients por client_id.',
        'FROM trades t JOIN clients c ON t.client_id = c.client_id',
        'SELECT t.trade_id, c.____, t.ticker FROM trades t JOIN clients c ON t.client_id = c.________;',
      ],
      explicacion:
        '`FROM trades t JOIN clients c ON t.client_id = c.client_id` le pega a cada operación los datos del cliente que tiene el mismo client_id. Con los alias `t` y `c` indicas de qué tabla sale cada columna: `t.trade_id`, `c.name`, `t.ticker`.\n\nEl `ON` es clave: sin él, SQL combinaría cada operación con cada cliente (28 × 8 = 224 filas).',
      alternativas: ['SELECT trades.trade_id, clients.name, trades.ticker FROM trades INNER JOIN clients ON trades.client_id = clients.client_id;'],
      incorrectas: [
        {
          codigo: 'SELECT t.trade_id, c.name, t.ticker FROM trades t JOIN clients c;',
          retro: 'ON t.client_id = c.client_id',
        },
        {
          codigo: 'SELECT t.trade_id, c.name, t.ticker FROM trades t JOIN clients c ON t.trade_id = c.client_id;',
          retro: 'la columna que comparten',
        },
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
        ayuda: 'Une trades con assets por ticker (ON t.ticker = a.ticker) y agrupa con GROUP BY a.sector.',
      },
      pistas: [
        'Primero el JOIN por ticker, luego GROUP BY a.sector.',
        'FROM trades t JOIN assets a ON t.ticker = a.ticker GROUP BY a.sector',
        'SELECT a.sector, SUM(t.quantity * t.price) AS total FROM trades t JOIN assets a ON t.ticker = a.ticker GROUP BY _________;',
      ],
      explicacion:
        'Primero el `JOIN` le agrega a cada operación el sector de su activo; después `GROUP BY a.sector` forma un grupo por sector y `SUM(t.quantity * t.price)` suma los montos de cada grupo.\n\nEl orden de las cláusulas es FROM → JOIN … ON → GROUP BY. El JOIN hace falta porque sector está en assets y no en trades.',
      alternativas: [
        'SELECT a.sector, SUM(t.quantity * t.price) AS total FROM trades t JOIN assets a ON t.ticker = a.ticker GROUP BY a.sector ORDER BY total DESC;',
      ],
      incorrectas: [
        {
          codigo: 'SELECT a.sector, SUM(t.quantity * t.price) AS total FROM trades t JOIN assets a ON t.ticker = a.ticker;',
          retro: 'GROUP BY a.sector',
        },
        {
          codigo: 'SELECT a.sector, SUM(t.quantity * t.price) AS total FROM trades t JOIN assets a GROUP BY a.sector;',
          retro: 'ON t.ticker = a.ticker',
        },
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
      opciones: {
        ayuda: 'Usa LEFT JOIN desde clients para conservar a todos los clientes, y quédate con los que no tienen pareja: WHERE t.trade_id IS NULL.',
      },
      pistas: [
        'LEFT JOIN de clients hacia trades.',
        'Quédate con las filas donde t.trade_id IS NULL.',
        'SELECT c.name FROM clients c LEFT JOIN trades t ON c.client_id = t.client_id WHERE t.trade_id IS ____;',
      ],
      alternativas: ['SELECT name FROM clients WHERE client_id NOT IN (SELECT client_id FROM trades);'],
      explicacion:
        '`LEFT JOIN` conserva a **todos** los clientes, aunque no tengan operaciones; para quienes no tienen pareja en trades, las columnas de `t` quedan en NULL. `WHERE t.trade_id IS NULL` se queda justo con esas filas: Sofía Rojas.\n\nSe escribe `IS NULL` y no `= NULL`: en SQL, comparar con NULL usando `=` nunca da verdadero, así que no deja pasar ninguna fila. Y con un JOIN normal, los clientes sin operaciones ni siquiera aparecerían.',
      incorrectas: [
        {
          codigo: 'SELECT c.name FROM clients c LEFT JOIN trades t ON c.client_id = t.client_id WHERE t.trade_id = NULL;',
          retro: 'IS NULL',
        },
        {
          codigo: 'SELECT c.name FROM clients c JOIN trades t ON c.client_id = t.client_id WHERE t.trade_id IS NULL;',
          retro: 'LEFT JOIN',
        },
      ],
    },
    {
      tipo: 'jefeDia',
      id: 'sql-06-jefe',
      jefe: {
        nombre: 'Rita Ledesma',
        sprite: 'ledesma',
        provocacion: 'Último reto de la semana: todos sus clientes con su número de operaciones. TODOS. Incluso los que no han operado.',
        derrota: 'Sofía Rojas con 0 operaciones, y no se perdió en el camino. LEFT JOIN y COUNT bien usados. Te respeto, {nombre}.',
      },
      paso: {
        tipo: 'ejercicio',
        id: 'sql-06-jefe-e1',
        concepto: 'sql.left_join',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado:
          'Lista **todos** los clientes con su número de operaciones: `c.name` y `COUNT(t.trade_id) AS n_trades`. Los clientes sin operaciones deben aparecer con **0**.',
        inicial: '',
        solucion: 'SELECT c.name, COUNT(t.trade_id) AS n_trades FROM clients c LEFT JOIN trades t ON c.client_id = t.client_id GROUP BY c.client_id;',
        opciones: {
          ayuda:
            'Para no perder a los clientes sin operaciones usa LEFT JOIN desde clients, y cuenta con COUNT(t.trade_id): COUNT(columna) no cuenta los NULL, así que da 0 para quien no operó.',
        },
        explicacion:
          '`LEFT JOIN` conserva a los 8 clientes; para Sofía Rojas, que no tiene operaciones, las columnas de `t` quedan en NULL. `GROUP BY c.client_id` arma un grupo por cliente y `COUNT(t.trade_id)` cuenta sus operaciones.\n\nLa clave está en contar una columna de `trades`: `COUNT(*)` contaría la fila de Sofía y daría 1 en lugar de 0. Con un `JOIN` normal, Sofía ni siquiera aparecería.',
        pistas: [
          'Junta dos ideas: LEFT JOIN (misión de hoy) y que COUNT(columna) no cuenta NULL (misión de agregados).',
          'FROM clients c LEFT JOIN trades t ON c.client_id = t.client_id GROUP BY c.client_id',
          'SELECT c.name, COUNT(t.________) AS n_trades FROM clients c ____ JOIN trades t ON c.client_id = t.client_id GROUP BY c.client_id;',
        ],
        alternativas: ['SELECT c.name, COUNT(t.trade_id) AS n_trades FROM clients c LEFT JOIN trades t ON c.client_id = t.client_id GROUP BY c.name;'],
        incorrectas: [
          {
            codigo: 'SELECT c.name, COUNT(t.trade_id) AS n_trades FROM clients c JOIN trades t ON c.client_id = t.client_id GROUP BY c.client_id;',
            retro: 'LEFT JOIN desde clients',
          },
          {
            codigo: 'SELECT c.name, COUNT(*) AS n_trades FROM clients c LEFT JOIN trades t ON c.client_id = t.client_id GROUP BY c.client_id;',
            retro: 'COUNT(t.trade_id)',
          },
        ],
      },
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
