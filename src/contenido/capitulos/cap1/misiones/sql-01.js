// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-01: El almacén de datos

export default {
  id: 'sql-01',
  titulo: 'El almacén de datos',
  resumen: 'SELECT, FROM, columnas calculadas y AS.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '9 min',
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
      opciones: {
        ayuda: 'Pide exactamente tres columnas, separadas por comas: ticker, name y country, de la tabla assets.',
      },
      pistas: [
        'La estructura es SELECT columnas FROM tabla;',
        'Separa las columnas con comas: SELECT ticker, name, country ...',
        'SELECT ticker, name, country FROM ______;',
      ],
      incorrectas: [
        {
          codigo: 'SELECT * FROM assets;',
          retro: 'se esperaban 3',
        },
        {
          codigo: 'SELECT ticker, name FROM assets;',
          retro: 'ticker, name, country',
        },
        {
          codigo: 'SELECT ticker name, country FROM assets;',
          retro: 'separadas por comas',
        },
      ],
      explicacion:
        '`SELECT` lista las columnas que quieres, separadas por comas, y `FROM` indica la tabla: `SELECT ticker, name, country FROM assets;`. Las columnas salen en el orden en que las escribes.\n\n`SELECT *` traería **todas** las columnas de assets, no solo las tres pedidas. Y ojo con las comas: `SELECT ticker name` no da error, porque SQL lo lee como la columna ticker renombrada como name.',
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
        ayuda: 'El monto es quantity * price (multiplicar), y la columna se nombra con AS: quantity * price AS amount.',
      },
      pistas: [
        'El monto es quantity * price.',
        'Para nombrar la columna: quantity * price AS amount',
        'SELECT trade_id, ticker, quantity * price AS ______ FROM trades;',
      ],
      incorrectas: [
        {
          codigo: 'SELECT trade_id, ticker, quantity * price FROM trades;',
          retro: 'Usa AS',
        },
        {
          codigo: 'SELECT trade_id, ticker, quantity + price AS amount FROM trades;',
          retro: 'multiplicar',
        },
      ],
      explicacion:
        '`quantity * price` calcula el monto fila por fila, y `AS amount` le da ese nombre a la columna del resultado. Sin `AS`, la columna se llamaría literalmente `quantity * price`.\n\nEl alias solo existe en el resultado de la consulta: la tabla `trades` no cambia.',
      alternativas: ['SELECT trade_id, ticker, price * quantity AS amount FROM trades;'],
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
      opciones: {
        ayuda: 'Pide las tres columnas de la tabla us_macro, separadas por comas: year, quarter y unemp.',
      },
      pistas: ['Igual que antes, pero con la tabla us_macro.', 'SELECT year, quarter, unemp FROM ...;', 'SELECT year, quarter, unemp FROM ________;'],
      explicacion:
        'Es la misma estructura con otra tabla: `SELECT year, quarter, unemp FROM us_macro;`. Cada fila es un trimestre, por eso el resultado tiene 203 filas.\n\n`us_macro` tiene más columnas (inflación, tasas y otras), pero conviene pedir solo las que necesitas.',
      incorrectas: [
        {
          codigo: 'SELECT * FROM us_macro;',
          retro: 'se esperaban 3',
        },
        {
          codigo: 'SELECT year, unemp FROM us_macro;',
          retro: 'year, quarter, unemp',
        },
      ],
    },
    {
      tipo: 'jefeDia',
      id: 'sql-01-jefe',
      jefe: {
        nombre: 'Rita Ledesma',
        sprite: 'ledesma',
        provocacion: 'Soy Rita Ledesma, jefa de datos del Banco Andino. Nuestros reportes incluyen la comisión. ¿Los suyos también?',
        derrota: 'Cinco columnas, bien nombradas y con la comisión incluida. Nada mal para tu primera semana.',
      },
      paso: {
        tipo: 'ejercicio',
        id: 'sql-01-jefe-e1',
        concepto: 'sql.alias',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado:
          'Muestra `trade_id`, `ticker`, `quantity`, `price` y el monto con una comisión de 1% incluida: `quantity * price * 1.01`, con el nombre `amount_with_fee`.',
        inicial: '',
        solucion: 'SELECT trade_id, ticker, quantity, price, quantity * price * 1.01 AS amount_with_fee FROM trades;',
        opciones: {
          nombresColumnas: true,
          tol: {
            abs: 0.001,
            rel: 1e-9,
          },
          ayuda: 'Son 5 columnas separadas por comas; la última es quantity * price * 1.01 AS amount_with_fee (multiplicar por 1.01 suma el 1%).',
        },
        explicacion:
          'Multiplicar por 1.01 es sumar el 1%: el monto más su comisión. `AS amount_with_fee` le pone el nombre pedido a esa columna calculada, y las otras cuatro salen tal cual de `trades`.\n\nEl error típico es multiplicar por 0.01: eso da solo la comisión, no el monto con la comisión.',
        pistas: [
          'Es un SELECT con cinco columnas: cuatro de la tabla y una calculada con alias.',
          'La columna calculada es quantity * price * 1.01 y se nombra con AS.',
          'SELECT trade_id, ticker, quantity, price, quantity * price * ____ AS _______________ FROM trades;',
        ],
        alternativas: ['SELECT trade_id, ticker, quantity, price, (quantity * price) * 1.01 AS amount_with_fee FROM trades;'],
        incorrectas: [
          {
            codigo: 'SELECT trade_id, ticker, quantity, price, quantity * price * 1.01 FROM trades;',
            retro: 'Usa AS',
          },
          {
            codigo: 'SELECT trade_id, ticker, quantity, price, quantity * price * 0.01 AS amount_with_fee FROM trades;',
            retro: 'multiplicar por 1.01',
          },
          {
            codigo: 'SELECT trade_id, ticker, quantity * price * 1.01 AS amount_with_fee FROM trades;',
            retro: 'Son 5 columnas',
          },
        ],
      },
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
