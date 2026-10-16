// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-05: Agrupar por sector

export default {
  id: 'sql-05',
  titulo: 'Agrupar por sector',
  resumen: 'GROUP BY y HAVING, con datos reales de Grunfeld.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '9 min',
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
        '`GROUP BY columna` forma un grupo por cada valor distinto y aplica las agregaciones a cada grupo.\n\n`WHERE` filtra **filas antes** de agrupar; `HAVING` filtra **grupos después** de agrupar.\n\nOrden de las cláusulas: `SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT`.',
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
      },
      pistas: ['SELECT sector, COUNT(*) AS n_assets FROM assets ...', 'Agrega GROUP BY sector al final.'],
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
      },
      pistas: [
        'GROUP BY firm y luego ORDER BY avg_invest DESC.',
        'SELECT firm, ROUND(AVG(invest), 1) AS avg_invest FROM grunfeld GROUP BY ____ ORDER BY __________ DESC;',
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
          },
        ],
      },
      pistas: [
        'Agrupa por client_id.',
        'Después de GROUP BY: HAVING COUNT(*) > 3',
        'SELECT client_id, COUNT(*) AS n_trades FROM trades GROUP BY client_id HAVING ________ > 3;',
      ],
      incorrectas: ['SELECT client_id, COUNT(*) AS n_trades FROM trades GROUP BY client_id;'],
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
      },
      pistas: [
        'Puedes agrupar por un alias: GROUP BY decade.',
        'SELECT (year / 10) * 10 AS decade, ROUND(AVG(unemp), 2) AS avg_unemp FROM us_macro ...',
        '... GROUP BY decade ORDER BY ______;',
      ],
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
