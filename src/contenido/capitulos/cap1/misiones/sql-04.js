// Capítulo 1 — Pista de SQL. Consultas sobre la base "fondo" (tablas inventadas y datos reales).
// Misión sql-04: Cuadrar el libro

export default {
  id: 'sql-04',
  titulo: 'Cuadrar el libro',
  resumen: 'COUNT, SUM, AVG, MIN, MAX y ROUND.',
  pista: 'sql',
  lenguaje: 'sql',
  duracion: '8 min',
  requiere: ['sql-03'],
  nivelDiagnostico: 4,
  conceptos: ['sql.agregados'],
  recompensa: {
    capital: 1800,
    xp: 80,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'Contabilidad pregunta cuánto compramos este año. No quieren 28 filas: quieren un número.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Funciones de agregación',
      texto:
        'Las **agregaciones** resumen muchas filas en un valor: `COUNT(*)` cuenta filas, `SUM()` suma, `AVG()` promedia, `MIN()` y `MAX()` buscan extremos. `ROUND(x, 2)` redondea.\n\n`COUNT(columna)` **no cuenta los NULL** (valores vacíos); `COUNT(*)` cuenta todas las filas.',
      codigo: "SELECT COUNT(*) AS n, SUM(quantity) AS units, ROUND(AVG(price), 2) AS avg_price\nFROM trades\nWHERE side = 'buy';",
      lenguaje: 'sql',
      db: 'fondo',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-04-e1',
      concepto: 'sql.agregados',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: '¿Cuántas operaciones hay en total en `trades`?',
      inicial: '',
      solucion: 'SELECT COUNT(*) FROM trades;',
      opciones: {
        ayuda: 'Cuenta las filas con una agregación: COUNT(*) devuelve un solo número, sin filtros.',
      },
      pistas: ['Una agregación resume todas las filas en un solo número.', 'COUNT(*) cuenta todas las filas de una tabla.', 'SELECT COUNT(*) FROM ______;'],
      explicacion:
        '`COUNT(*)` cuenta todas las filas de la tabla y devuelve un solo número: 28 operaciones. A diferencia de `SELECT *`, no muestra las filas: las resume.\n\n`COUNT(trade_id)` también da 28, porque trade_id nunca está vacío; pero si una columna tuviera NULL, `COUNT(columna)` no los contaría.',
      alternativas: ['SELECT COUNT(trade_id) FROM trades;'],
      incorrectas: [
        {
          codigo: 'SELECT * FROM trades;',
          retro: 'COUNT(*)',
        },
        {
          codigo: "SELECT COUNT(*) FROM trades WHERE side = 'buy';",
          retro: 'sin filtros',
        },
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'sql-04-e2',
      concepto: 'sql.agregados',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: "Calcula el **monto total comprado**: la suma de `quantity * price` de las operaciones con `side = 'buy'`.",
      inicial: '',
      solucion: "SELECT SUM(quantity * price) FROM trades WHERE side = 'buy';",
      opciones: {
        tol: {
          abs: 0.01,
          rel: 1e-9,
        },
        ayuda: "Suma el monto de cada compra: SUM(quantity * price), con el filtro WHERE side = 'buy'.",
      },
      pistas: [
        'SUM puede recibir una expresión: SUM(quantity * price).',
        "No olvides el filtro WHERE side = 'buy'.",
        "SELECT SUM(quantity * price) FROM trades WHERE side = '___';",
      ],
      incorrectas: [
        {
          codigo: 'SELECT SUM(quantity * price) FROM trades;',
          retro: "WHERE side = 'buy'",
        },
        {
          codigo: "SELECT SUM(quantity) * SUM(price) FROM trades WHERE side = 'buy';",
          retro: 'SUM(quantity * price)',
        },
      ],
      explicacion:
        '`SUM(quantity * price)` calcula el monto de cada fila y suma todos los montos, y `WHERE side = \'buy\'` deja solo las compras **antes** de sumar. El total comprado es 559231.8.\n\nSin el WHERE sumarías también las ventas, y el número ya no sería "cuánto compramos".',
    },
    {
      tipo: 'quiz',
      id: 'sql-04-q1',
      concepto: 'sql.agregados',
      pregunta: '`clients` tiene 8 filas y un cliente tiene `country` en NULL. ¿Qué da `SELECT COUNT(country) FROM clients`?',
      opciones: ['8', '7', '1', 'NULL'],
      correcta: 1,
      explicacion: 'COUNT(columna) ignora los NULL. Si quieres contar filas, usa COUNT(*).',
    },
    {
      tipo: 'ejercicio',
      id: 'sql-04-e3',
      concepto: 'sql.agregados',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado:
        'Datos reales: en `us_macro`, muestra el desempleo **promedio redondeado a 2 decimales**, el **mínimo** y el **máximo** de 1959 a 2009 (en ese orden).',
      inicial: '',
      solucion: 'SELECT ROUND(AVG(unemp), 2), MIN(unemp), MAX(unemp) FROM us_macro;',
      opciones: {
        tol: 0.005,
        ayuda: 'Tres agregaciones en este orden, separadas por comas: el promedio redondeado, el mínimo y el máximo de unemp.',
      },
      pistas: [
        'Tres agregaciones en el mismo SELECT, separadas por comas.',
        'ROUND(AVG(unemp), 2), MIN(unemp), MAX(unemp)',
        'SELECT ROUND(AVG(unemp), _), MIN(_____), MAX(_____) FROM us_macro;',
      ],
      explicacion:
        'Se pueden poner varias agregaciones en el mismo SELECT, separadas por comas. `ROUND(AVG(unemp), 2)` primero promedia y después redondea: 5.88%. El mínimo es 3.4% y el máximo, 10.7%.\n\nLas columnas deben salir en el orden pedido (promedio, mínimo, máximo): el resultado se compara columna por columna.',
      incorrectas: [
        {
          codigo: 'SELECT MIN(unemp), MAX(unemp), ROUND(AVG(unemp), 2) FROM us_macro;',
          retro: 'en este orden',
        },
        {
          codigo: 'SELECT MIN(unemp), MAX(unemp) FROM us_macro;',
          retro: 'se esperaban 3',
        },
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'sql-04-e4',
      concepto: 'sql.agregados',
      lenguaje: 'sql',
      db: 'fondo',
      enunciado: 'Datos reales: calcula la tasa promedio de las Letras del Tesoro (`tbilrate`) entre **1980 y 1989**, redondeada a 2 decimales.',
      inicial: '',
      solucion: 'SELECT ROUND(AVG(tbilrate), 2) FROM us_macro WHERE year BETWEEN 1980 AND 1989;',
      opciones: {
        tol: 0.005,
        ayuda: 'Filtra los años con WHERE year BETWEEN 1980 AND 1989 (los dos extremos se incluyen) y promedia con ROUND(AVG(tbilrate), 2).',
      },
      pistas: [
        'Combina AVG con un WHERE por año.',
        'WHERE year BETWEEN 1980 AND 1989',
        'SELECT ROUND(AVG(tbilrate), 2) FROM us_macro WHERE year BETWEEN ____ AND ____;',
      ],
      explicacion:
        '`WHERE year BETWEEN 1980 AND 1989` deja los 40 trimestres de esa década (los años son números, así que van sin comillas) y `ROUND(AVG(tbilrate), 2)` promedia la tasa y la redondea: 8.79%.\n\nEl WHERE filtra las filas **antes** de calcular el promedio: por eso el resultado es solo de los 80.',
      incorrectas: [
        {
          codigo: 'SELECT ROUND(AVG(tbilrate), 2) FROM us_macro WHERE year BETWEEN 1980 AND 1990;',
          retro: '1989',
        },
        {
          codigo: 'SELECT ROUND(AVG(tbilrate), 2) FROM us_macro;',
          retro: 'WHERE year BETWEEN',
        },
      ],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'Una tasa promedio cercana a 9% en los 80. Hoy suena exagerado, pero así eran las tasas en EE. UU. en esa década.',
        },
      ],
    },
  ],
};
