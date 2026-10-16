// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-05: Reglas de riesgo

export default {
  id: 'py-05',
  titulo: 'Reglas de riesgo',
  resumen: 'if / elif / else, comparaciones y break: clasificar deudores y un stop-loss.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '8 min',
  requiere: ['py-04'],
  nivelDiagnostico: 5,
  conceptos: ['py.condicionales', 'fin.riesgo_credito', 'fin.stop_loss'],
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
          texto: 'El comité de crédito clasifica a las empresas según su endeudamiento: deuda dividida entre activos.',
        },
        {
          quien: 'marta',
          texto: 'Hoy lo hace a mano en una hoja de cálculo. Vamos a automatizar la regla.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'if, elif, else',
      texto:
        '`if` ejecuta un bloque solo si la condición es verdadera. `elif` prueba otra condición si la anterior falló, y `else` atrapa todo lo demás. Solo se ejecuta **la primera** rama verdadera.\n\nComparaciones: `==` (igual), `!=` (distinto), `<`, `<=`, `>`, `>=`. Se combinan con `and` y `or`.',
      codigo:
        'debt_ratio = 0.45   # deuda / activos\nif debt_ratio < 0.3:\n    risk = "low"\nelif debt_ratio < 0.6:\n    risk = "medium"\nelse:\n    risk = "high"\nprint(risk)   # medium',
      lenguaje: 'python',
    },
    {
      tipo: 'quiz',
      id: 'py-05-q1',
      concepto: 'py.condicionales',
      pregunta: 'Con el código de la lección, si `debt_ratio = 0.6`, ¿qué valor toma `risk`?',
      opciones: ['"low"', '"medium"', '"high"', 'Ninguno'],
      correcta: 2,
      explicacion: '0.6 < 0.6 es falso (son iguales), así que cae en el else: "high". Los bordes importan.',
    },
    {
      tipo: 'ejercicio',
      id: 'py-05-e1',
      concepto: 'fin.riesgo_credito',
      lenguaje: 'python',
      enunciado:
        'Clasifica cada empresa de `debt_ratios` y guarda los resultados en la lista `risk_levels`: menos de 0.3 es `"low"`, menos de 0.6 es `"medium"`, y el resto `"high"`.',
      inicial: 'debt_ratios = [0.2, 0.45, 0.7, 0.3, 0.9, 0.55]\nrisk_levels = []\n',
      solucion:
        'debt_ratios = [0.2, 0.45, 0.7, 0.3, 0.9, 0.55]\nrisk_levels = []\nfor d in debt_ratios:\n    if d < 0.3:\n        risk_levels.append("low")\n    elif d < 0.6:\n        risk_levels.append("medium")\n    else:\n        risk_levels.append("high")\nprint(risk_levels)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'risk_levels',
        },
        {
          tipo: 'codigoIncluye',
          patron: '\\bif\\b',
          mensaje: 'Usa if / elif / else.',
        },
      ],
      pistas: [
        'Recorre la lista con for y, dentro, decide con if / elif / else.',
        'Dentro del bucle: if d < 0.3: risk_levels.append("low")  elif d < 0.6: ...  else: ...',
        'for d in debt_ratios:\n    if d < 0.3:\n        risk_levels.append("low")\n    elif d < ___:\n        risk_levels.append("medium")\n    else:\n        risk_levels.append("____")',
      ],
      incorrectas: [
        'debt_ratios = [0.2, 0.45, 0.7, 0.3, 0.9, 0.55]\nrisk_levels = []\nfor d in debt_ratios:\n    if d <= 0.3:\n        risk_levels.append("low")\n    elif d < 0.6:\n        risk_levels.append("medium")\n    else:\n        risk_levels.append("high")',
      ],
    },
    {
      tipo: 'quiz',
      id: 'py-05-q2',
      concepto: 'py.condicionales',
      pregunta: '¿Cuánto vale `5 > 3 and 2 > 4`?',
      opciones: ['True', 'False', '5', 'Error'],
      correcta: 1,
      explicacion: '`and` necesita que ambas sean verdaderas. 2 > 4 es falso.',
    },
    {
      tipo: 'leccion',
      titulo: 'Stop-loss y break',
      texto:
        'Un **stop-loss** es una regla para limitar pérdidas: vender si el precio cae cierto porcentaje desde la compra.\n\n`break` corta un bucle apenas encuentras lo que buscabas.',
      codigo:
        'prices = [10, 9.5, 8.7, 8.1]\nfor i in range(len(prices)):\n    if prices[i] < 9:\n        print("Primera vez bajo 9 en la posición", i)\n        break',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-05-e2',
      concepto: 'fin.stop_loss',
      lenguaje: 'python',
      enunciado:
        'Compraste Llama Retail (LLM) a 11.98. Tu regla: vender si el precio de cierre es **menor o igual** a 80% del precio de compra. Calcula `stop_price` y guarda en `sell_month` el **número de mes** (1 = enero) del primer cierre que cumple la regla. Usa `break`.',
      inicial:
        '# Cierres mensuales de LLM en 2025 (enero a diciembre)\nprices = [11.28, 11.98, 11.85, 12.89, 11.64, 10.21, 9.48, 9.63, 8.79, 7.59, 7.58, 8.1]\nbuy_price = 11.98\nsell_month = None\n',
      solucion:
        'prices = [11.28, 11.98, 11.85, 12.89, 11.64, 10.21, 9.48, 9.63, 8.79, 7.59, 7.58, 8.1]\nbuy_price = 11.98\nsell_month = None\nstop_price = buy_price * 0.8\nfor i in range(len(prices)):\n    if prices[i] <= stop_price:\n        sell_month = i + 1\n        break\nprint(stop_price, sell_month)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'stop_price',
          tol: 0.000001,
        },
        {
          tipo: 'variable',
          nombre: 'sell_month',
        },
      ],
      pistas: [
        'stop_price = buy_price * 0.8. Luego recorre las posiciones con range(len(prices)).',
        'Las posiciones empiezan en 0 pero los meses en 1: sell_month = i + 1.',
        'for i in range(len(prices)):\n    if prices[i] <= stop_price:\n        sell_month = i + _\n        break',
      ],
      incorrectas: [
        'prices = [11.28, 11.98, 11.85, 12.89, 11.64, 10.21, 9.48, 9.63, 8.79, 7.59, 7.58, 8.1]\nbuy_price = 11.98\nstop_price = buy_price * 0.8\nsell_month = None\nfor i in range(len(prices)):\n    if prices[i] <= stop_price:\n        sell_month = i + 1',
      ],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'Julio: la regla habría vendido a 9.48. Después LLM siguió bajando hasta 7.58. Un stop-loss no adivina el futuro, pero limita el daño.',
        },
      ],
    },
  ],
};
