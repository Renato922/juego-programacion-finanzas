// Jefe del capítulo 1: la auditoría de fin de mes.
// Combina todo lo del capítulo (SQL y Python) en fases que mezclan temas.

const POSICIONES = `positions = {
    "CND": (44.55, 100),
    "LLM": (11.98, 200),
    "QTZ": (103.82, 300),
    "PAC": (66.73, 500),
    "CAF": (23.2, 250),
}
current_prices = {"CND": 65.06, "LLM": 8.1, "QTZ": 99.01, "PAC": 78.59, "CAF": 18.36}
`;

export const JEFE_CAP1 = {
  id: 'jefe-cap1',
  tipo: 'jefe',
  titulo: 'La auditoría de fin de mes',
  resumen: 'La auditora Valdivia revisa todo lo que hiciste este mes. SQL y Python mezclados.',
  pista: 'jefe',
  lenguaje: 'mixto',
  duracion: '20-25 min',
  requiere: ['py-07', 'sql-06'],
  conceptos: ['sql.groupby', 'sql.join', 'fin.regla72', 'py.funciones', 'py.diccionarios', 'py.fstrings', 'fin.interes_compuesto'],
  recompensa: { capital: 8000, xp: 300 },
  jefe: { nombre: 'Auditora Valdivia', sprite: 'valdivia' },
  intro: [
    { quien: 'valdivia', texto: 'Soy Irene Valdivia, auditora externa. En veinte años no he firmado un solo informe con errores.' },
    { quien: 'valdivia', texto: 'Voy a revisar tus números uno por uno. Si algo no cuadra, lo repites hasta que cuadre.' },
    { quien: 'marta', texto: 'Tranquilidad, {nombre}. Ya hiciste todo esto antes. Aquí solo está mezclado.' },
  ],
  fases: [
    {
      dano: 15,
      provocacion: 'Empecemos por lo básico: ¿cuánto compró y cuánto vendió el fondo?',
      paso: {
        tipo: 'ejercicio',
        id: 'jefe1-f1',
        concepto: 'sql.groupby',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado: 'Cuadre de caja: muestra cada `side` (buy / sell) y el monto total `SUM(quantity * price)` con el nombre `total_amount`.',
        inicial: '',
        solucion: 'SELECT side, SUM(quantity * price) AS total_amount FROM trades GROUP BY side;',
        opciones: { nombresColumnas: true, tol: { abs: 0.01, rel: 1e-9 } },
        pistas: ['Es un GROUP BY por side.', 'SELECT side, SUM(quantity * price) AS total_amount FROM trades ...', '... GROUP BY ____;'],
      },
    },
    {
      dano: 20,
      provocacion: 'Quiero saber quiénes son sus clientes más grandes. Con nombre, no con números de ID.',
      paso: {
        tipo: 'ejercicio',
        id: 'jefe1-f2',
        concepto: 'sql.join',
        lenguaje: 'sql',
        db: 'fondo',
        enunciado:
          'Muestra el `name` de los **3 clientes** con mayor monto negociado (`SUM(t.quantity * t.price) AS traded`), de mayor a menor. Tienes que unir `trades` con `clients`.',
        inicial: '',
        solucion:
          'SELECT c.name, SUM(t.quantity * t.price) AS traded FROM trades t JOIN clients c ON t.client_id = c.client_id GROUP BY c.name ORDER BY traded DESC LIMIT 3;',
        opciones: { ordenImporta: true, tol: { abs: 0.01, rel: 1e-9 } },
        pistas: [
          'Necesitas JOIN, GROUP BY, ORDER BY y LIMIT, en ese orden.',
          'FROM trades t JOIN clients c ON t.client_id = c.client_id GROUP BY c.name',
          'SELECT c.name, SUM(t.quantity * t.price) AS traded FROM trades t JOIN clients c ON t.client_id = c.client_id GROUP BY c.name ORDER BY ______ DESC LIMIT _;',
        ],
      },
    },
    {
      dano: 10,
      provocacion: 'Una pregunta rápida, sin computadora.',
      paso: {
        tipo: 'quiz',
        id: 'jefe1-f3',
        concepto: 'fin.regla72',
        pregunta: 'Un cliente quiere duplicar su dinero en 6 años. Según la regla del 72, ¿qué rendimiento anual necesita?',
        opciones: ['6%', '12%', '72%', '8%'],
        correcta: 1,
        explicacion: '72 / 6 = 12% anual.',
      },
    },
    {
      dano: 20,
      provocacion: 'Sus posiciones. ¿Ganan o pierden? Quiero una función que lo diga, no una opinión.',
      paso: {
        tipo: 'ejercicio',
        id: 'jefe1-f4',
        concepto: 'py.funciones',
        lenguaje: 'python',
        enunciado:
          'Define dos funciones:\n- `position_pnl(buy_price, current_price, quantity)`: devuelve la ganancia o pérdida en dólares: `(current_price - buy_price) * quantity`.\n- `position_status(pnl)`: devuelve `"profit"` si pnl > 0, `"loss"` si pnl < 0 y `"flat"` si es 0.',
        inicial: '# Define tus dos funciones aquí\n',
        solucion:
          'def position_pnl(buy_price, current_price, quantity):\n    return (current_price - buy_price) * quantity\n\ndef position_status(pnl):\n    if pnl > 0:\n        return "profit"\n    elif pnl < 0:\n        return "loss"\n    else:\n        return "flat"',
        verificar: [
          {
            tipo: 'funcion',
            nombre: 'position_pnl',
            casos: [
              [44.55, 65.06, 100],
              [11.98, 8.1, 200],
              [10, 10, 50],
            ],
            tol: 1e-6,
          },
          { tipo: 'funcion', nombre: 'position_status', casos: [[2051.0], [-776.0], [0]] },
        ],
        pistas: [
          'La primera es una resta multiplicada por la cantidad. La segunda necesita if / elif / else.',
          'def position_status(pnl):\n    if pnl > 0:\n        return "profit"\n    ...',
          'def position_pnl(buy_price, current_price, quantity):\n    return (current_price - _________) * ________',
        ],
      },
    },
    {
      dano: 20,
      provocacion: 'Ahora todas juntas. ¿Cuánto gana o pierde la cartera? ¿Y cuáles posiciones están en rojo?',
      paso: {
        tipo: 'ejercicio',
        id: 'jefe1-f5',
        concepto: 'py.diccionarios',
        lenguaje: 'python',
        enunciado:
          '`positions` guarda `ticker: (precio_de_compra, cantidad)`. Calcula `total_pnl` (la suma de ganancias y pérdidas de todas las posiciones) y `losers`: la lista de tickers en pérdida, **ordenada alfabéticamente** con `sorted()`.',
        inicial: POSICIONES + '\ntotal_pnl = 0\nlosers = []\n',
        solucion:
          POSICIONES +
          '\ntotal_pnl = 0\nlosers = []\nfor ticker, (buy_price, qty) in positions.items():\n    pnl = (current_prices[ticker] - buy_price) * qty\n    total_pnl = total_pnl + pnl\n    if pnl < 0:\n        losers.append(ticker)\nlosers = sorted(losers)\nprint(total_pnl, losers)',
        verificar: [
          { tipo: 'variable', nombre: 'total_pnl', tol: 1e-6 },
          { tipo: 'variable', nombre: 'losers' },
        ],
        pistas: [
          'Recorre positions.items(). Cada valor es una tupla: se puede desarmar con buy_price, qty = valor.',
          'for ticker, (buy_price, qty) in positions.items():\n    pnl = (current_prices[ticker] - buy_price) * qty',
          'Suma pnl a total_pnl; si pnl < 0, agrega el ticker a losers. Al final: losers = sorted(losers)',
        ],
        alternativas: [
          POSICIONES +
            '\npnls = {t: (current_prices[t] - p[0]) * p[1] for t, p in positions.items()}\ntotal_pnl = sum(pnls.values())\nlosers = sorted([t for t in pnls if pnls[t] < 0])',
        ],
      },
    },
    {
      dano: 15,
      provocacion: 'Última. Su jefe dice que el fondo valdrá mucho más en 5 años. Demuéstrelo con un número bien presentado.',
      paso: {
        tipo: 'ejercicio',
        id: 'jefe1-f6',
        concepto: 'py.fstrings',
        lenguaje: 'python',
        enunciado:
          'El fondo vale 2500000 hoy y espera rendir 7% anual. Calcula el valor en 5 años e imprime **exactamente**: `Proyección a 5 años: $3,506,379.33`  (usa un f-string con formato `,.2f`).',
        inicial: 'fund_value = 2500000\nexpected_return = 0.07\nyears = 5\n',
        solucion:
          'fund_value = 2500000\nexpected_return = 0.07\nyears = 5\nprojection = fund_value * (1 + expected_return) ** years\nprint(f"Proyección a 5 años: ${projection:,.2f}")',
        verificar: [
          { tipo: 'salida', modo: 'exacta' },
          { tipo: 'codigoIncluye', patron: '\\*\\*|pow\\(', mensaje: 'Calcula la proyección con la fórmula, no escribas el número a mano.' },
        ],
        pistas: [
          'Primero el valor futuro: fund_value * (1 + expected_return) ** years',
          'Luego: print(f"Proyección a 5 años: ${projection:,.2f}")',
          'projection = fund_value * (1 + expected_return) ** years\nprint(f"Proyección a 5 años: ${__________:,.2f}")',
        ],
      },
    },
  ],
  victoria: [
    { quien: 'valdivia', texto: 'Todo cuadra. No suelo decir esto, pero… buen trabajo.' },
    { quien: 'aurelio', texto: '{nombre}, pasaste tu primera auditoría. A partir de hoy ya no eres junior: eres Analista de Cóndor Capital.' },
    { quien: 'aurelio', texto: 'Y te doy algo más: un pequeño presupuesto para mejorar tu oficina. Úsalo bien.' },
    { quien: 'marta', texto: 'Capítulo 2: riesgo y volatilidad. Vamos a medir cuánto se mueve una acción, y vas a conocer R. Prepárate.' },
  ],
};
