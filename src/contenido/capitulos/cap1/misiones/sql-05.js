// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-05: Agrupar por sector

export default {
  id: 'sql-05',
  titulo: 'Agrupar por sector',
  resumen: 'GROUP BY y HAVING, con datos reales de Grunfeld.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '12 min',
  requiere: ['sql-04'],
  nivelDiagnostico: 5,
  conceptos: ['sql.groupby', 'sql.having'],
  recompensa: {
    capital: 1800,
    xp: 80,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: 'Un total está bien, pero el comité quiere el total POR sector, POR cliente, POR año. Eso es GROUP BY.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'GROUP BY y HAVING',
      texto:
        '`GROUP BY columna` forma un grupo por cada valor distinto y aplica las agregaciones a cada grupo.\n\n`WHERE` filtra **filas antes** de agrupar; `HAVING` filtra **grupos después** de agrupar.\n\nOrden de las cláusulas: `SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT`.\n\nSQLite, el motor del juego, permite agrupar u ordenar por un alias del SELECT (`GROUP BY decade`). Algunos motores, como SQL Server, no aceptan el alias en GROUP BY y piden repetir la expresión completa.',
      codigo: 'SELECT ticker, COUNT(*) AS n_trades\nFROM trades\nGROUP BY ticker\nHAVING COUNT(*) >= 3\nORDER BY n_trades DESC;',
      lenguaje: 'sql',
      db: 'fondo',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-05-e1',
      concepto: 'sql.groupby',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Muestra cada `sector` de `assets` y cuántos activos tiene, con el nombre `n_assets`.',
      inicial: '',
      solucion: 'SELECT sector, COUNT(*) AS n_assets FROM assets GROUP BY sector;',
      opciones: {
        nombresColumnas: true,
        ayuda: 'Agrupa con GROUP BY sector para obtener una fila por sector, y nombra el conteo con AS n_assets.',
      },
      pistas: [
        'SELECT sector, COUNT(*) AS n_assets FROM assets ...',
        'Agrega GROUP BY sector al final.',
        'SELECT sector, COUNT(*) AS n_assets FROM assets GROUP BY ______;',
      ],
      explicacion:
        '`GROUP BY sector` forma un grupo por cada sector distinto y `COUNT(*)` cuenta las filas **de cada grupo**: Agriculture y Energy tienen 2 activos, y los demás sectores, 1. `AS n_assets` le pone nombre a la columna del conteo.\n\nSin GROUP BY, `COUNT(*)` contaría toda la tabla y devolvería una sola fila.',
      incorrectas: [
        {
          codigo: 'SELECT sector, COUNT(*) AS n_assets FROM assets;',
          retro: 'GROUP BY sector',
        },
        {
          codigo: 'SELECT sector, COUNT(*) FROM assets GROUP BY sector;',
          retro: 'n_assets',
        },
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'sql-05-e2',
      concepto: 'sql.groupby',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado:
        'Datos reales (Grunfeld, 1935-1954): muestra cada empresa (`firm`) y su inversión promedio anual redondeada a 1 decimal (`ROUND(AVG(invest), 1) AS avg_invest`), de mayor a menor.',
      inicial: '',
      solucion: 'SELECT firm, ROUND(AVG(invest), 1) AS avg_invest FROM grunfeld GROUP BY firm ORDER BY avg_invest DESC;',
      opciones: {
        ordenImporta: true,
        tol: 0.05,
        ayuda: 'Agrupa por firm para tener una fila por empresa, y ordena de mayor a menor con ORDER BY avg_invest DESC.',
      },
      pistas: [
        'Una fila por empresa: agrupa por firm. Después ordena por el promedio.',
        'GROUP BY firm y luego ORDER BY avg_invest DESC.',
        'SELECT firm, ROUND(AVG(invest), 1) AS avg_invest FROM grunfeld GROUP BY ____ ORDER BY __________ DESC;',
      ],
      explicacion:
        '`GROUP BY firm` arma un grupo por empresa y `AVG(invest)` promedia sus 20 años; `ROUND(..., 1)` lo deja con 1 decimal. `ORDER BY avg_invest DESC` pone primero a la que más invirtió: General Motors, con 608.0 en promedio.\n\nPuedes ordenar por el alias `avg_invest` porque ORDER BY se aplica después de calcular el SELECT.',
      incorrectas: [
        {
          codigo: 'SELECT firm, ROUND(AVG(invest), 1) AS avg_invest FROM grunfeld GROUP BY firm ORDER BY avg_invest;',
          retro: 'DESC',
        },
        {
          codigo: 'SELECT firm, ROUND(AVG(invest), 1) AS avg_invest FROM grunfeld ORDER BY avg_invest DESC;',
          retro: 'Agrupa por firm',
        },
      ],
    },
    {
      tipo: 'quiz',
      id: 'sql-05-q1',
      concepto: 'sql.having',
      pregunta: 'Quieres los clientes cuyo total comprado supera 50000. ¿Dónde va `SUM(quantity * price) > 50000`?',
      opciones: ['En WHERE', 'En HAVING', 'En ORDER BY', 'En SELECT'],
      correcta: 1,
      explicacion: 'Es una condición sobre un agregado, que solo existe después de agrupar: va en HAVING.',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-05-e3',
      concepto: 'sql.having',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Muestra `client_id` y la cantidad de operaciones (`COUNT(*) AS n_trades`) de los clientes con **más de 3** operaciones.',
      inicial: '',
      solucion: 'SELECT client_id, COUNT(*) AS n_trades FROM trades GROUP BY client_id HAVING COUNT(*) > 3;',
      opciones: {
        verificar: [
          {
            tipo: 'codigoIncluye',
            patron: '\\bHAVING\\b',
            banderas: 'i',
            mensaje: 'Filtra los grupos con HAVING.',
            ayuda: 'La condición sobre el conteo va en HAVING, después de GROUP BY client_id: HAVING COUNT(*) > 3.',
          },
        ],
        ayuda: 'Filtra los grupos después de agruparlos con HAVING COUNT(*) > 3. «Más de 3» es > 3, no >= 3.',
      },
      pistas: [
        'Agrupa por client_id.',
        'Después de GROUP BY: HAVING COUNT(*) > 3',
        'SELECT client_id, COUNT(*) AS n_trades FROM trades GROUP BY client_id HAVING ________ > 3;',
      ],
      incorrectas: [
        {
          codigo: 'SELECT client_id, COUNT(*) AS n_trades FROM trades GROUP BY client_id;',
          retro: 'HAVING',
        },
        {
          codigo: 'SELECT client_id, COUNT(*) AS n_trades FROM trades GROUP BY client_id HAVING COUNT(*) >= 3;',
          retro: 'no >= 3',
        },
        {
          codigo: 'SELECT client_id, COUNT(*) AS n_trades FROM trades WHERE COUNT(*) > 3 GROUP BY client_id;',
          retro: 'usa HAVING',
        },
      ],
      explicacion:
        '`GROUP BY client_id` cuenta las operaciones de cada cliente y `HAVING COUNT(*) > 3` descarta los grupos con 3 o menos. Quedan los clientes 1 (6 operaciones), 2 (7) y 4 (4).\n\nNo se puede usar `WHERE COUNT(*) > 3`: WHERE filtra filas antes de agrupar, cuando el conteo todavía no existe. Por eso HAVING va después de GROUP BY.',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-05-e4',
      concepto: 'sql.groupby',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado:
        'Reto con datos reales: muestra el desempleo promedio de EE. UU. **por década**. La década se calcula como `(year / 10) * 10 AS decade` (en SQLite, dividir dos enteros da un entero). Redondea a 2 decimales (`AS avg_unemp`) y ordena por década.',
      inicial: '',
      solucion: 'SELECT (year / 10) * 10 AS decade, ROUND(AVG(unemp), 2) AS avg_unemp FROM us_macro GROUP BY decade ORDER BY decade;',
      opciones: {
        ordenImporta: true,
        tol: 0.005,
        ayuda: 'La década se calcula con (year / 10) * 10 (división entera, sin decimales). Agrupa con GROUP BY decade y ordena con ORDER BY decade.',
      },
      pistas: [
        'Puedes agrupar por un alias: GROUP BY decade.',
        'SELECT (year / 10) * 10 AS decade, ROUND(AVG(unemp), 2) AS avg_unemp FROM us_macro ...',
        '... GROUP BY decade ORDER BY ______;',
      ],
      explicacion:
        '`year / 10` divide entre enteros y descarta los decimales (1987 / 10 = 198); al multiplicar por 10 obtienes la década: 1980. `GROUP BY decade` forma un grupo por década, `ROUND(AVG(unemp), 2)` promedia cada una y `ORDER BY decade` las ordena. La década de 1980 es la más alta: 7.28%.\n\nLa década de 1950 solo tiene los trimestres de 1959, porque la serie empieza ese año. Si escribieras `year / 10.0`, la división daría decimales y cada año quedaría en su propio grupo.',
      incorrectas: [
        {
          codigo: 'SELECT (year / 10.0) * 10 AS decade, ROUND(AVG(unemp), 2) AS avg_unemp FROM us_macro GROUP BY decade ORDER BY decade;',
          retro: 'sin decimales',
        },
        {
          codigo: 'SELECT (year / 10) * 10 AS decade, ROUND(AVG(unemp), 2) AS avg_unemp FROM us_macro GROUP BY decade ORDER BY decade DESC;',
          retro: 'Revisa tu ORDER BY',
        },
      ],
    },
    {
      tipo: 'jefeDia',
      id: 'sql-05-jefe',
      jefe: {
        nombre: 'Rita Ledesma',
        sprite: 'ledesma',
        provocacion: 'El comité quiere saber en qué activos el fondo compró fuerte. Más de 400 unidades. Agrupado, filtrado y ordenado.',
        derrota: 'Siete activos, y PMP con 400 justas queda fuera. Ese detalle del "más de" lo pierde mucha gente.',
      },
      paso: {
        tipo: 'ejercicio',
        id: 'sql-05-jefe-e1',
        concepto: 'sql.having',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado:
          "Para cada `ticker`, muestra las unidades **compradas** (`side = 'buy'`) con `SUM(quantity) AS units`. Quédate solo con los tickers que suman **más de 400** unidades y ordénalos de mayor a menor.",
        inicial: '',
        solucion: "SELECT ticker, SUM(quantity) AS units FROM trades WHERE side = 'buy' GROUP BY ticker HAVING SUM(quantity) > 400 ORDER BY units DESC;",
        opciones: {
          ordenImporta: true,
          verificar: [
            {
              tipo: 'codigoIncluye',
              patron: '\\bHAVING\\b',
              banderas: 'i',
              mensaje: 'Filtra los grupos con HAVING.',
            },
          ],
          ayuda: "WHERE side = 'buy' filtra filas antes de agrupar; HAVING SUM(quantity) > 400 filtra grupos después. «Más de 400» es > 400, no >= 400.",
        },
        explicacion:
          "`WHERE side = 'buy'` deja solo las compras; `GROUP BY ticker` suma las unidades de cada activo; `HAVING SUM(quantity) > 400` descarta los grupos chicos y `ORDER BY units DESC` ordena. Quedan 7 activos, de BTP (2500) a LLM (500).\n\nPMP suma exactamente 400: con `>= 400` se colaría. Y la condición sobre la suma va en HAVING porque en WHERE la suma todavía no existe.",
        pistas: [
          'Usa todo lo de la misión: WHERE, GROUP BY, HAVING y ORDER BY, en ese orden.',
          "WHERE side = 'buy' GROUP BY ticker HAVING SUM(quantity) > 400 ORDER BY units DESC",
          "SELECT ticker, SUM(quantity) AS units FROM trades WHERE side = 'buy' GROUP BY ______ HAVING SUM(quantity) > ___ ORDER BY _____ DESC;",
        ],
        alternativas: ["SELECT ticker, SUM(quantity) AS units FROM trades WHERE side = 'buy' GROUP BY ticker HAVING units > 400 ORDER BY units DESC;"],
        incorrectas: [
          {
            codigo: "SELECT ticker, SUM(quantity) AS units FROM trades WHERE side = 'buy' GROUP BY ticker HAVING SUM(quantity) >= 400 ORDER BY units DESC;",
            retro: 'no >= 400',
          },
          {
            codigo: "SELECT ticker, SUM(quantity) AS units FROM trades WHERE side = 'buy' AND SUM(quantity) > 400 GROUP BY ticker ORDER BY units DESC;",
            retro: 'usa HAVING',
          },
          {
            codigo: 'SELECT ticker, SUM(quantity) AS units FROM trades GROUP BY ticker HAVING SUM(quantity) > 400 ORDER BY units DESC;',
            retro: "WHERE side = 'buy'",
          },
        ],
      },
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: 'Los 80 fueron la peor década para el empleo de la serie. Mañana: unir tablas. Ahí se separan los juniors de los seniors.',
        },
      ],
    },
  ],
};
