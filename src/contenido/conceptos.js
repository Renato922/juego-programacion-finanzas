// Catálogo de conceptos. Cada concepto aprendido se vuelve una tarjeta de
// repaso espaciado y una carta de la colección. Los "repasos" son retos
// cortos (menos de un minuto) que usa la Sala de trading.
//
// Tipos de repaso:
//  - opcion:     pregunta de opción múltiple (puede incluir código para predecir)
//  - completar:  rellenar el hueco ___ con una respuesta corta
//  - ejercicio:  escribir código que se ejecuta y valida (igual que en misiones)

export const CONCEPTOS = {
  // ---------------- Python ----------------
  'py.variables': {
    nombre: 'Variables',
    lenguaje: 'python',
    icono: 'caja',
    resumen: 'Una variable guarda un dato con un nombre: rate = 0.05',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'cash = 100\ncash = cash - 30\nprint(cash)',
        opciones: ['100', '70', '-30', 'cash - 30'],
        correcta: 1,
        explicacion: 'cash - 30 usa el valor actual (100) y el resultado (70) se guarda de nuevo en cash.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Cuál es un nombre de variable válido en Python?',
        opciones: ['2nd_price', 'net-income', 'net_income', 'net income'],
        correcta: 2,
        explicacion: 'Los nombres no pueden empezar con número ni tener guiones o espacios. Se usa snake_case: net_income.',
      },
      {
        tipo: 'completar',
        pregunta: 'Completa para guardar 2500 en la variable salary:',
        codigo: 'salary ___ 2500',
        respuesta: '=',
        explicacion: 'Un solo = asigna. Dos (==) comparan.',
      },
    ],
  },
  'py.aritmetica': {
    nombre: 'Operadores aritméticos',
    lenguaje: 'python',
    icono: 'calculadora',
    resumen: '+ - * / // % para calcular comisiones, montos y unidades',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime print(7 // 2, 7 % 2)?',
        opciones: ['3.5 0', '3 1', '3 0.5', '4 1'],
        correcta: 1,
        explicacion: '// es división entera (3) y % es el resto (1).',
      },
      {
        tipo: 'opcion',
        pregunta: 'Una comisión de 0.75% sobre 40000 se calcula como:',
        opciones: ['40000 * 0.75', '40000 * 0.0075', '40000 / 0.75', '40000 * 75'],
        correcta: 1,
        explicacion: '0.75% = 0.75 / 100 = 0.0075.',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'python',
        enunciado: 'Con 5000 dólares y acciones a 37.5 cada una, guarda en `shares` cuántas acciones enteras puedes comprar.',
        inicial: 'cash = 5000\nprice = 37.5\n',
        solucion: 'cash = 5000\nprice = 37.5\nshares = cash // price',
        verificar: [{ tipo: 'variable', nombre: 'shares' }],
        pistas: ['Usa la división entera //.', 'shares = cash // price'],
        explicacion:
          '`cash // price` divide y descarta los decimales: 5000 / 37.5 = 133.33…, así que puedes comprar 133 acciones enteras. Como price tiene decimales, Python lo muestra como 133.0.\n\nCon una sola barra (`/`) obtendrías 133.33…, y no se puede comprar un tercio de acción.',
      },
    ],
  },
  'py.potencias': {
    nombre: 'Potencias y round()',
    lenguaje: 'python',
    icono: 'cohete',
    resumen: '(1 + r) ** n para capitalizar; round(x, 2) para redondear',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué operador eleva a una potencia en Python?',
        opciones: ['^', '**', 'pow^', '^^'],
        correcta: 1,
        explicacion: '** es potencia. ^ es XOR bit a bit: 2 ^ 3 da 1, no 8.',
      },
      {
        tipo: 'completar',
        pregunta: 'Completa para redondear a 2 decimales:',
        codigo: 'value = ___(1402.5517, 2)',
        respuesta: 'round',
        explicacion: 'round(numero, decimales).',
      },
    ],
  },
  'py.fstrings': {
    nombre: 'f-strings y formato',
    lenguaje: 'python',
    icono: 'pluma',
    resumen: 'f"{x:,.2f}" para montos y f"{r:.1%}" para porcentajes',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'r = 0.084\nprint(f"{r:.1%}")',
        opciones: ['0.084%', '8.4%', '0.1%', '84%'],
        correcta: 1,
        explicacion: 'El formato % multiplica por 100 y agrega el símbolo; .1 deja un decimal.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'x = 1234567.891\nprint(f"${x:,.2f}")',
        opciones: ['$1234567.89', '$1,234,567.89', '$1.234.567,89', '$1,234,567.891'],
        correcta: 1,
        explicacion: 'La coma agrega separadores de miles y .2f deja 2 decimales.',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'python',
        enunciado: 'Imprime exactamente `Margen: 35.0%` usando la variable margin y un f-string.',
        inicial: 'margin = 0.35\n',
        solucion: 'margin = 0.35\nprint(f"Margen: {margin:.1%}")',
        verificar: [
          { tipo: 'salida', modo: 'exacta' },
          { tipo: 'codigoIncluye', patron: 'f"|f\'', mensaje: 'Usa un f-string: f"..."' },
        ],
        pistas: ['El formato de porcentaje es {variable:.1%}', 'print(f"Margen: {margin:.1%}")'],
        explicacion:
          'Dentro de las llaves, `:.1%` multiplica por 100, agrega el signo % y deja 1 decimal: 0.35 se muestra como 35.0%. La `f` antes de las comillas es la que activa las llaves.\n\nNo multipliques por 100 a mano: el formato `%` ya lo hace, y saldría 3500.0%.',
      },
    ],
  },
  'py.import': {
    nombre: 'import y el módulo math',
    lenguaje: 'python',
    icono: 'libro',
    resumen: 'import math para usar math.log, math.sqrt, math.exp',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'Después de import math, ¿cómo se calcula el logaritmo natural de 2?',
        opciones: ['log(2)', 'math.log(2)', 'math(log, 2)', 'import log(2)'],
        correcta: 1,
        explicacion: 'Las funciones del módulo se usan con el prefijo math.',
      },
      {
        tipo: 'completar',
        pregunta: 'Completa la raíz cuadrada (útil para volatilidad):',
        codigo: 'import math\nvol_annual = 0.02 * math.___(252)',
        respuesta: 'sqrt',
        explicacion: 'math.sqrt calcula la raíz cuadrada. La volatilidad diaria se anualiza con √252 (días hábiles).',
      },
    ],
  },
  'py.listas': {
    nombre: 'Listas',
    lenguaje: 'python',
    icono: 'lista',
    resumen: 'prices = [..]; prices[0], prices[-1], len, sum, max, min, append',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'p = [10, 12, 9, 15]\nprint(p[-1] - p[0])',
        opciones: ['5', '-5', '3', 'Error'],
        correcta: 0,
        explicacion: 'p[-1] es el último (15) y p[0] el primero (10).',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Cómo se calcula el promedio de la lista rates?',
        opciones: ['avg(rates)', 'sum(rates) / len(rates)', 'rates.mean', 'mean[rates]'],
        correcta: 1,
        explicacion: 'Python básico no trae avg; se usa sum / len. (Con pandas o numpy existe .mean()).',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'python',
        enunciado: 'Agrega el precio 101.4 al final de la lista `prices` con .append() y guarda el máximo en `top`.',
        inicial: 'prices = [98.2, 99.5, 100.1]\n',
        solucion: 'prices = [98.2, 99.5, 100.1]\nprices.append(101.4)\ntop = max(prices)',
        verificar: [
          { tipo: 'variable', nombre: 'prices' },
          { tipo: 'variable', nombre: 'top' },
        ],
        pistas: ['prices.append(valor) agrega al final.', 'top = max(prices)'],
        explicacion:
          '`prices.append(101.4)` modifica la lista: le agrega 101.4 al final. Después, `max(prices)` recorre la lista ya actualizada y devuelve 101.4.\n\nEl orden importa: si calculas `top` antes del append, el máximo sería 100.1.',
      },
    ],
  },
  'py.slicing': {
    nombre: 'Rebanadas (slicing)',
    lenguaje: 'python',
    icono: 'tijera',
    resumen: 'lista[a:b] toma desde a hasta b-1; lista[-3:] los últimos 3',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'q = [1, 2, 3, 4, 5, 6]\nprint(q[1:4])',
        opciones: ['[1, 2, 3, 4]', '[2, 3, 4]', '[2, 3, 4, 5]', '[1, 4]'],
        correcta: 1,
        explicacion: 'Empieza en la posición 1 e incluye hasta la 3 (el 4 no se incluye).',
      },
      {
        tipo: 'completar',
        pregunta: 'Completa para obtener los últimos 3 precios:',
        codigo: 'last3 = prices[___]',
        respuesta: '-3:',
        alternativas: ['len(prices)-3:'],
        explicacion: 'Los índices negativos cuentan desde el final.',
      },
    ],
  },
  'py.for': {
    nombre: 'Bucles for',
    lenguaje: 'python',
    icono: 'bucle',
    resumen: 'for x in lista: ... y for i in range(1, len(lista)) para retornos',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Cuántas veces se ejecuta el print?',
        codigo: 'for i in range(1, 5):\n    print(i)',
        opciones: ['5', '4', '6', '1'],
        correcta: 1,
        explicacion: 'range(1, 5) produce 1, 2, 3 y 4.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'total = 0\nfor x in [100, 250, 50]:\n    total = total + x\nprint(total)',
        opciones: ['50', '400', '[100, 250, 50]', '0'],
        correcta: 1,
        explicacion: 'El patrón acumulador suma cada elemento a total.',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'python',
        enunciado: 'Con un bucle for, crea la lista `returns` con el retorno simple de cada periodo (precio / precio anterior - 1).',
        inicial: 'prices = [50, 55, 52.25]\nreturns = []\n',
        solucion: 'prices = [50, 55, 52.25]\nreturns = []\nfor i in range(1, len(prices)):\n    returns.append(prices[i] / prices[i - 1] - 1)',
        verificar: [
          { tipo: 'variable', nombre: 'returns' },
          { tipo: 'codigoIncluye', patron: '\\bfor\\b', mensaje: 'Usa un bucle for.' },
        ],
        pistas: ['Recorre i desde 1 hasta len(prices) - 1 con range(1, len(prices)).', 'returns.append(prices[i] / prices[i - 1] - 1)'],
        explicacion:
          '`range(1, len(prices))` recorre las posiciones 1 y 2: el primer precio no tiene anterior. En cada vuelta, `prices[i] / prices[i - 1] - 1` compara el precio con el anterior: 55 / 50 − 1 = 0.1 y 52.25 / 55 − 1 = −0.05.\n\nRestar (`prices[i] - prices[i - 1]`) daría la diferencia en dólares, no el retorno.',
      },
    ],
  },
  'py.condicionales': {
    nombre: 'Condicionales if / elif / else',
    lenguaje: 'python',
    icono: 'semaforo',
    resumen: 'if condición: ... elif ...: ... else: ... y operadores and / or',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'score = 650\nif score >= 700:\n    print("A")\nelif score >= 600:\n    print("B")\nelse:\n    print("C")',
        opciones: ['A', 'B', 'C', 'B y C'],
        correcta: 1,
        explicacion: '650 no es >= 700, pero sí >= 600. Solo se ejecuta la primera rama verdadera.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Cuánto vale True and (3 > 5)?',
        opciones: ['True', 'False', '3', 'Error'],
        correcta: 1,
        explicacion: 'and necesita que ambas partes sean verdaderas; 3 > 5 es False.',
      },
      {
        tipo: 'completar',
        pregunta: 'Completa el operador para comparar si son iguales:',
        codigo: 'if side ___ "buy":\n    print("Compra")',
        respuesta: '==',
        explicacion: 'Para comparar se usa ==.',
      },
    ],
  },
  'py.funciones': {
    nombre: 'Funciones (def y return)',
    lenguaje: 'python',
    icono: 'engranaje',
    resumen: 'def nombre(params): return resultado; parámetros con valor por defecto',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'def fee(amount, rate=0.01):\n    return amount * rate\n\nprint(fee(1000) + fee(1000, 0.02))',
        opciones: ['10.0', '20.0', '30.0', 'Error'],
        correcta: 2,
        explicacion: 'fee(1000) usa rate=0.01 (10.0) y fee(1000, 0.02) da 20.0. Suman 30.0.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Una función sin return devuelve...',
        opciones: ['0', 'None', 'El último valor calculado', 'Un error'],
        correcta: 1,
        explicacion: 'Si no hay return, la función devuelve None.',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'python',
        enunciado: 'Define `net_return(gross, fee)` que devuelva el retorno neto: gross - fee.',
        inicial: '# Define tu función aquí\n',
        solucion: 'def net_return(gross, fee):\n    return gross - fee',
        verificar: [
          {
            tipo: 'funcion',
            nombre: 'net_return',
            casos: [
              [0.1, 0.015],
              [0.05, 0.01],
              [-0.02, 0.01],
            ],
          },
        ],
        pistas: ['def net_return(gross, fee):', '    return gross - fee'],
        explicacion:
          'La función recibe `gross` y `fee` y **devuelve** la resta con `return`. El cuerpo va con 4 espacios de sangría.\n\nSi usaras `print` en lugar de `return`, la función mostraría el número pero devolvería None.',
      },
    ],
  },
  'py.diccionarios': {
    nombre: 'Diccionarios',
    lenguaje: 'python',
    icono: 'llave',
    resumen: '{"CND": 100}; d[clave]; d.get(clave, 0); for k, v in d.items()',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué imprime este código?',
        codigo: 'h = {"CND": 100, "PAC": 50}\nprint(h.get("QTZ", 0))',
        opciones: ['None', '0', 'KeyError', '150'],
        correcta: 1,
        explicacion: '.get devuelve el valor por defecto (0) si la clave no existe.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Cómo recorres claves y valores a la vez?',
        opciones: ['for k, v in d:', 'for k, v in d.items():', 'for d.items(k, v):', 'for k in d.values():'],
        correcta: 1,
        explicacion: '.items() entrega pares (clave, valor).',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'python',
        enunciado: 'Guarda en `total` la suma de los valores del diccionario `positions`.',
        inicial: 'positions = {"CND": 6506.0, "PAC": 3929.5, "BTP": 3168.9}\n',
        solucion: 'positions = {"CND": 6506.0, "PAC": 3929.5, "BTP": 3168.9}\ntotal = sum(positions.values())',
        verificar: [{ tipo: 'variable', nombre: 'total' }],
        pistas: ['positions.values() entrega solo los valores.', 'total = sum(positions.values())'],
        explicacion:
          '`positions.values()` entrega solo los valores del diccionario (6506.0, 3929.5 y 3168.9) y `sum()` los suma: 13604.4.\n\n`sum(positions)` no sirve: recorrer un diccionario entrega sus claves, que son textos.',
      },
    ],
  },

  // ---------------- SQL ----------------
  'sql.select': {
    nombre: 'SELECT y FROM',
    lenguaje: 'sql',
    icono: 'tabla',
    resumen: 'SELECT columnas FROM tabla;  * trae todas',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué hace SELECT * FROM clients?',
        opciones: ['Borra la tabla', 'Trae todas las columnas y filas de clients', 'Cuenta las filas', 'Trae solo la primera fila'],
        correcta: 1,
        explicacion: '* significa "todas las columnas".',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado: 'Muestra el nombre (name) y el perfil de riesgo (risk_profile) de todos los clientes.',
        inicial: '',
        solucion: 'SELECT name, risk_profile FROM clients;',
        opciones: {},
        pistas: ['SELECT columna1, columna2 FROM tabla;', 'SELECT name, risk_profile FROM clients;'],
        explicacion:
          '`SELECT name, risk_profile` pide las dos columnas, separadas por coma, y `FROM clients` indica la tabla. Sin WHERE, salen todos los clientes.',
      },
    ],
  },
  'sql.alias': {
    nombre: 'Columnas calculadas y AS',
    lenguaje: 'sql',
    icono: 'etiqueta',
    resumen: 'SELECT quantity * price AS amount',
    repasos: [
      {
        tipo: 'completar',
        pregunta: 'Completa para que la columna se llame amount:',
        codigo: 'SELECT quantity * price ___ amount FROM trades;',
        respuesta: 'AS',
        explicacion: 'AS pone un nombre (alias) a la columna.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué devuelve SELECT ticker, close * 2 AS doubled FROM prices?',
        opciones: ['Una columna', 'Dos columnas: ticker y doubled', 'Modifica los precios en la tabla', 'Un error'],
        correcta: 1,
        explicacion: 'Las columnas calculadas no modifican la tabla; solo aparecen en el resultado.',
      },
    ],
  },
  'sql.where': {
    nombre: 'Filtros con WHERE',
    lenguaje: 'sql',
    icono: 'embudo',
    resumen: "WHERE side = 'buy' AND quantity > 100; IN (...); BETWEEN a AND b",
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Cuál filtro trae activos de Perú o Chile?',
        opciones: [
          "WHERE country = 'Peru' AND country = 'Chile'",
          "WHERE country IN ('Peru', 'Chile')",
          'WHERE country = Peru OR Chile',
          "WHERE country BETWEEN 'Peru' AND 'Chile'",
        ],
        correcta: 1,
        explicacion: 'IN acepta una lista de valores. Con AND ninguna fila cumpliría las dos a la vez.',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado: 'Muestra trade_id y quantity de las operaciones con más de 400 unidades (quantity > 400).',
        inicial: '',
        solucion: 'SELECT trade_id, quantity FROM trades WHERE quantity > 400;',
        opciones: {},
        pistas: ['Usa WHERE quantity > 400', 'SELECT trade_id, quantity FROM trades WHERE quantity > 400;'],
        explicacion:
          '`WHERE quantity > 400` deja solo las operaciones con más de 400 unidades: son 7. Los números van sin comillas; las comillas son para textos.',
      },
      {
        tipo: 'completar',
        pregunta: 'Completa para filtrar textos (van entre comillas simples):',
        codigo: 'SELECT * FROM trades WHERE side = ___;',
        respuesta: "'sell'",
        explicacion: "En SQL los textos van entre comillas simples: 'sell'.",
      },
    ],
  },
  'sql.orderby': {
    nombre: 'ORDER BY, LIMIT y DISTINCT',
    lenguaje: 'sql',
    icono: 'podio',
    resumen: 'ORDER BY amount DESC LIMIT 5; SELECT DISTINCT sector',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Cómo obtienes las 3 operaciones de mayor cantidad?',
        opciones: ['ORDER BY quantity LIMIT 3', 'ORDER BY quantity DESC LIMIT 3', 'LIMIT 3 ORDER BY quantity DESC', 'TOP 3 quantity'],
        correcta: 1,
        explicacion: 'DESC ordena de mayor a menor y LIMIT va al final. (TOP existe en SQL Server, no en SQLite).',
      },
      {
        tipo: 'opcion',
        pregunta: 'Sin ASC ni DESC, ORDER BY ordena...',
        opciones: ['De mayor a menor', 'De menor a mayor (ASC)', 'Al azar', 'No ordena'],
        correcta: 1,
        explicacion: 'El orden por defecto es ascendente.',
      },
      {
        tipo: 'completar',
        pregunta: 'Completa para ver cada país una sola vez:',
        codigo: 'SELECT ___ country FROM clients;',
        respuesta: 'DISTINCT',
        explicacion: 'DISTINCT elimina filas repetidas.',
      },
    ],
  },
  'sql.agregados': {
    nombre: 'Funciones de agregación',
    lenguaje: 'sql',
    icono: 'sigma',
    resumen: 'COUNT, SUM, AVG, MIN, MAX y ROUND',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'La tabla clients tiene 8 filas y un country en NULL. ¿Qué devuelve SELECT COUNT(country) FROM clients?',
        opciones: ['8', '7', '1', 'NULL'],
        correcta: 1,
        explicacion: 'COUNT(columna) no cuenta los NULL; COUNT(*) cuenta todas las filas.',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado: 'Calcula el precio de cierre promedio (AVG) de QTZ en la tabla prices, redondeado a 2 decimales.',
        inicial: '',
        solucion: "SELECT ROUND(AVG(close), 2) FROM prices WHERE ticker = 'QTZ';",
        opciones: { tol: 0.005 },
        pistas: ["Filtra con WHERE ticker = 'QTZ'", "SELECT ROUND(AVG(close), 2) FROM prices WHERE ticker = 'QTZ';"],
        explicacion:
          "`WHERE ticker = 'QTZ'` deja los 12 cierres de QTZ, `AVG(close)` los promedia y `ROUND(..., 2)` redondea: 97.81. El WHERE se aplica antes de calcular el promedio.",
      },
    ],
  },
  'sql.groupby': {
    nombre: 'GROUP BY',
    lenguaje: 'sql',
    icono: 'cajas',
    resumen: 'Agrupa filas y calcula un agregado por grupo',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué devuelve SELECT side, COUNT(*) FROM trades GROUP BY side?',
        opciones: ['Una fila con el total', 'Una fila por cada valor de side con su cantidad', 'Todas las operaciones', 'Un error'],
        correcta: 1,
        explicacion: 'GROUP BY crea un grupo por cada valor distinto de side.',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado: 'Muestra cada país (country) de los activos y cuántos activos tiene.',
        inicial: '',
        solucion: 'SELECT country, COUNT(*) FROM assets GROUP BY country;',
        opciones: {},
        pistas: ['SELECT country, COUNT(*) FROM assets ...', 'Agrega GROUP BY country'],
        explicacion:
          '`GROUP BY country` forma un grupo por país y `COUNT(*)` cuenta los activos de cada uno: por ejemplo, Peru tiene 3.\n\nSin GROUP BY, `COUNT(*)` contaría toda la tabla en una sola fila.',
      },
    ],
  },
  'sql.having': {
    nombre: 'HAVING',
    lenguaje: 'sql',
    icono: 'filtro',
    resumen: 'Filtra grupos después de agregar: HAVING COUNT(*) > 3',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '¿Dónde se filtra por un agregado como SUM(quantity) > 1000?',
        opciones: ['En WHERE', 'En HAVING', 'En ORDER BY', 'En FROM'],
        correcta: 1,
        explicacion: 'WHERE filtra filas antes de agrupar; HAVING filtra grupos después.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Cuál es el orden correcto?',
        opciones: [
          'SELECT … FROM … GROUP BY … WHERE … HAVING …',
          'SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY …',
          'SELECT … HAVING … FROM … GROUP BY …',
          'FROM … SELECT … HAVING … WHERE …',
        ],
        correcta: 1,
        explicacion: 'SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.',
      },
    ],
  },
  'sql.join': {
    nombre: 'JOIN',
    lenguaje: 'sql',
    icono: 'cadena',
    resumen: 'FROM trades t JOIN assets a ON t.ticker = a.ticker',
    repasos: [
      {
        tipo: 'completar',
        pregunta: 'Completa la condición de unión:',
        codigo: 'SELECT * FROM trades t JOIN clients c ___ t.client_id = c.client_id;',
        respuesta: 'ON',
        explicacion: 'ON indica qué columnas conectan las tablas.',
      },
      {
        tipo: 'ejercicio',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado: 'Muestra trade_id y el sector del activo de cada operación (une trades con assets).',
        inicial: '',
        solucion: 'SELECT t.trade_id, a.sector FROM trades t JOIN assets a ON t.ticker = a.ticker;',
        opciones: {},
        pistas: ['FROM trades t JOIN assets a ON ...', 'ON t.ticker = a.ticker'],
        explicacion:
          '`JOIN assets a ON t.ticker = a.ticker` le pega a cada operación los datos de su activo, porque las dos tablas comparten la columna ticker. Así puedes pedir `a.sector` junto a `t.trade_id`.',
      },
    ],
  },
  'sql.left_join': {
    nombre: 'LEFT JOIN',
    lenguaje: 'sql',
    icono: 'cadena-rota',
    resumen: 'Conserva todas las filas de la izquierda; útil para encontrar faltantes',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'clients tiene 8 filas y un cliente no tiene operaciones. clients LEFT JOIN trades...',
        opciones: [
          'Pierde al cliente sin operaciones',
          'Conserva al cliente sin operaciones con NULL en las columnas de trades',
          'Duplica todos los clientes',
          'Da error',
        ],
        correcta: 1,
        explicacion: 'LEFT JOIN conserva todas las filas de la tabla izquierda.',
      },
      {
        tipo: 'completar',
        pregunta: 'Completa para quedarte con los clientes sin operaciones:',
        codigo: 'SELECT c.name FROM clients c LEFT JOIN trades t\n  ON c.client_id = t.client_id\nWHERE t.trade_id IS ___;',
        respuesta: 'NULL',
        explicacion: 'Si no hubo coincidencia, las columnas de trades quedan en NULL. Se compara con IS NULL, no con = NULL.',
      },
    ],
  },

  // ---------------- Finanzas ----------------
  'fin.interes_compuesto': {
    nombre: 'Interés compuesto',
    lenguaje: 'finanzas',
    icono: 'arbol',
    resumen: 'VF = VP × (1 + r)^n',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '1000 al 10% anual compuesto durante 2 años se convierten en:',
        opciones: ['1200', '1210', '1100', '2000'],
        correcta: 1,
        explicacion: '1000 × 1.1 × 1.1 = 1210. El interés del año 2 se calcula también sobre el interés del año 1.',
      },
      {
        tipo: 'completar',
        pregunta: '¿Cuánto vale 2000 × (1 + 0.05) ** 2? (escribe el número)',
        respuesta: 2205,
        tipoRespuesta: 'numero',
        explicacion: '2000 × 1.05 × 1.05 = 2205.',
      },
    ],
  },
  'fin.regla72': {
    nombre: 'Regla del 72',
    lenguaje: 'finanzas',
    icono: 'reloj',
    resumen: 'Años para duplicar ≈ 72 / tasa en %',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'Con 8% anual, ¿en cuántos años aproximadamente se duplica una inversión?',
        opciones: ['8', '9', '12', '72'],
        correcta: 1,
        explicacion: '72 / 8 = 9 años (la fórmula exacta da unos 9.01).',
      },
      {
        tipo: 'opcion',
        pregunta: 'Para duplicar en 6 años, ¿qué tasa anual se necesita aproximadamente?',
        opciones: ['6%', '12%', '18%', '36%'],
        correcta: 1,
        explicacion: '72 / 6 = 12%.',
      },
    ],
  },
  'fin.retornos': {
    nombre: 'Retorno simple',
    lenguaje: 'finanzas',
    icono: 'flecha',
    resumen: 'r = P_t / P_(t-1) − 1',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'Una acción pasa de 80 a 92. ¿Cuál es su retorno simple?',
        opciones: ['12%', '15%', '13%', '0.15%'],
        correcta: 1,
        explicacion: '92 / 80 − 1 = 0.15 = 15%.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Si una acción sube 10% y luego baja 10%, termina...',
        opciones: ['Igual que al inicio', '1% abajo', '1% arriba', '10% abajo'],
        correcta: 1,
        explicacion: '1.10 × 0.90 = 0.99: un 1% menos. Los retornos se componen, no se suman.',
      },
    ],
  },
  'fin.cagr': {
    nombre: 'CAGR (crecimiento anual compuesto)',
    lenguaje: 'finanzas',
    icono: 'escalera',
    resumen: 'CAGR = (final / inicial)^(1/años) − 1',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'Una inversión hace +50% y luego −50%. ¿Retorno total?',
        opciones: ['0%', '−25%', '+25%', '−50%'],
        correcta: 1,
        explicacion: '1.5 × 0.5 = 0.75. El promedio aritmético (0%) engaña; por eso se usa el CAGR.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Un valor pasa de 100 a 121 en 2 años. ¿CAGR?',
        opciones: ['21%', '10%', '10.5%', '11%'],
        correcta: 1,
        explicacion: '(121 / 100) ** (1/2) − 1 = 1.1 − 1 = 10%.',
      },
    ],
  },
  'fin.riesgo_credito': {
    nombre: 'Ratio de endeudamiento',
    lenguaje: 'finanzas',
    icono: 'balanza',
    resumen: 'deuda / activos: cuánto de la empresa está financiado con deuda',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'Una empresa tiene activos por 500 y deuda por 350. Su ratio deuda/activos es:',
        opciones: ['0.7', '1.43', '0.3', '150'],
        correcta: 0,
        explicacion: '350 / 500 = 0.7: el 70% de sus activos se financia con deuda.',
      },
      {
        tipo: 'opcion',
        pregunta: 'En general, un ratio deuda/activos más alto significa...',
        opciones: ['Menos riesgo para el acreedor', 'Más riesgo para el acreedor', 'Más liquidez', 'Más rentabilidad garantizada'],
        correcta: 1,
        explicacion: 'Más deuda frente a los activos deja menos colchón si el negocio va mal.',
      },
    ],
  },
  'fin.stop_loss': {
    nombre: 'Stop-loss',
    lenguaje: 'finanzas',
    icono: 'escudo',
    resumen: 'Regla para vender si el precio cae cierto % desde la compra',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'Compras a 50 con un stop-loss de 10%. ¿A qué precio se activa?',
        opciones: ['40', '45', '49.5', '55'],
        correcta: 1,
        explicacion: '50 × (1 − 0.10) = 45.',
      },
    ],
  },
  'fin.valor_presente': {
    nombre: 'Valor presente',
    lenguaje: 'finanzas',
    icono: 'reloj-arena',
    resumen: 'VP = VF / (1 + r)^n: un dólar de mañana vale menos que uno de hoy',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'Te prometen 1100 en un año. Con una tasa de 10%, ¿cuánto valen hoy?',
        opciones: ['990', '1000', '1100', '1210'],
        correcta: 1,
        explicacion: '1100 / 1.10 = 1000.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Si la tasa de descuento sube, el valor presente de un flujo futuro...',
        opciones: ['Sube', 'Baja', 'No cambia', 'Se vuelve negativo'],
        correcta: 1,
        explicacion: 'Dividir entre un número mayor da un resultado menor. Por eso los precios de los bonos bajan cuando suben las tasas.',
      },
    ],
  },
  'fin.anualidades': {
    nombre: 'Cuota de préstamo (anualidad)',
    lenguaje: 'finanzas',
    icono: 'casa',
    resumen: 'cuota = P·r / (1 − (1 + r)^−n), el sistema francés',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: 'En un préstamo con cuota fija (sistema francés), con el tiempo la parte de interés de cada cuota...',
        opciones: ['Sube', 'Baja', 'Se mantiene', 'Es cero desde el inicio'],
        correcta: 1,
        explicacion: 'El interés se calcula sobre el saldo pendiente, que va bajando; así que cada vez más de la cuota amortiza capital.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Si la tasa es 0%, la cuota de 1200 a 12 meses es:',
        opciones: ['0', '100', '1200', 'No se puede calcular'],
        correcta: 1,
        explicacion: 'Sin interés, la cuota es el principal dividido entre los meses. La fórmula general divide entre cero, por eso se trata aparte.',
      },
    ],
  },
  'fin.portafolio': {
    nombre: 'Pesos y retorno de un portafolio',
    lenguaje: 'finanzas',
    icono: 'pastel',
    resumen: 'peso = valor / total; E[Rp] = Σ peso × E[R]',
    repasos: [
      {
        tipo: 'opcion',
        pregunta: '60% en un activo que rinde 10% y 40% en uno que rinde 5%. ¿Retorno esperado?',
        opciones: ['7.5%', '8%', '15%', '6%'],
        correcta: 1,
        explicacion: '0.6 × 10% + 0.4 × 5% = 6% + 2% = 8%.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Los pesos de un portafolio completamente invertido suman...',
        opciones: ['0', '1 (100%)', 'El número de activos', 'Depende del precio'],
        correcta: 1,
        explicacion: 'Cada peso es una fracción del total; juntos suman 100%.',
      },
    ],
  },
};

export const NOMBRE_LENGUAJE = {
  python: 'Python',
  sql: 'SQL',
  r: 'R',
  powerbi: 'Power BI',
  excel: 'Excel / VBA',
  finanzas: 'Finanzas',
};
