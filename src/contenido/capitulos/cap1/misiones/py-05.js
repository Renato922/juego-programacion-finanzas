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
        '`if` ejecuta un bloque solo si la condición es verdadera. `elif` prueba otra condición si la anterior falló, y `else` atrapa todo lo demás. Solo se ejecuta **la primera** rama verdadera.\n\nComparaciones: `==` (igual), `!=` (distinto), `<`, `<=`, `>`, `>=`. Se combinan con `and` y `or`.\n\nOjo con dos detalles:\n\n- `=` guarda un valor y `==` compara. En un `if` siempre va `==`.\n- Lo que va dentro de cada rama lleva 4 espacios más de sangría. Si el `if` está dentro de un `for`, el `if` va con 4 espacios y su contenido con 8.',
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
          ayuda: 'Revisa los bordes: «menos de 0.3» se escribe d < 0.3 (no <=), así que 0.3 es "medium". Y debe haber un resultado por empresa: 6 en total.',
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
        {
          codigo:
            'debt_ratios = [0.2, 0.45, 0.7, 0.3, 0.9, 0.55]\nrisk_levels = []\nfor d in debt_ratios:\n    if d <= 0.3:\n        risk_levels.append("low")\n    elif d < 0.6:\n        risk_levels.append("medium")\n    else:\n        risk_levels.append("high")',
          retro: 'no <=',
        },
        {
          codigo:
            'debt_ratios = [0.2, 0.45, 0.7, 0.3, 0.9, 0.55]\nrisk_levels = []\nfor d in debt_ratios:\n    if d < 0.3:\n        risk_levels.append("low")\n    elif d < 0.6:\n        risk_levels.append("medium")',
          retro: '6 en total',
        },
      ],
      explicacion:
        "El `for` toma cada `d` de la lista y el `if / elif / else` elige **una sola** rama: si `d < 0.3` agrega \"low\"; si no, prueba `d < 0.6` y agrega \"medium\"; si tampoco, cae en el `else` y agrega \"high\". El resultado es `['low', 'medium', 'high', 'medium', 'high', 'medium']`.\n\nFíjate en 0.3: \"menos de 0.3\" se escribe `<`, no `<=`, así que 0.3 es \"medium\". Los textos van entre comillas y cada `append` va dentro de su rama, con 8 espacios de sangría.",
      alternativas: [
        'debt_ratios = [0.2, 0.45, 0.7, 0.3, 0.9, 0.55]\nrisk_levels = []\nfor d in debt_ratios:\n    if d < 0.3:\n        level = "low"\n    elif d < 0.6:\n        level = "medium"\n    else:\n        level = "high"\n    risk_levels.append(level)',
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
        'Un **stop-loss** es una regla para limitar pérdidas: vender si el precio cae cierto porcentaje desde la compra.\n\n`break` corta un bucle apenas encuentras lo que buscabas.\n\n`None` es el valor de Python para "todavía no hay dato". Si el bucle termina sin encontrar nada, la variable sigue en `None`.\n\nLas posiciones de una lista empiezan en 0, pero los meses en 1: la posición 0 es enero, así que el número de mes es `i + 1`.',
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
          ayuda: 'stop_price es el 80% del precio de compra: buy_price * 0.8.',
        },
        {
          tipo: 'variable',
          nombre: 'sell_month',
          ayuda: 'Guarda el número de mes, no la posición: sell_month = i + 1. Y pon break justo después, para quedarte con el primer mes que cumple la regla.',
        },
      ],
      pistas: [
        'stop_price = buy_price * 0.8. Luego recorre las posiciones con range(len(prices)).',
        'Las posiciones empiezan en 0 pero los meses en 1: sell_month = i + 1.',
        'for i in range(len(prices)):\n    if prices[i] <= stop_price:\n        sell_month = i + _\n        break',
      ],
      incorrectas: [
        {
          codigo:
            'prices = [11.28, 11.98, 11.85, 12.89, 11.64, 10.21, 9.48, 9.63, 8.79, 7.59, 7.58, 8.1]\nbuy_price = 11.98\nsell_month = None\nstop_price = buy_price * 0.8\nfor i in range(len(prices)):\n    if prices[i] <= stop_price:\n        sell_month = i + 1',
          retro: 'break justo después',
        },
        {
          codigo:
            'prices = [11.28, 11.98, 11.85, 12.89, 11.64, 10.21, 9.48, 9.63, 8.79, 7.59, 7.58, 8.1]\nbuy_price = 11.98\nsell_month = None\nstop_price = buy_price * 0.8\nfor i in range(len(prices)):\n    if prices[i] <= stop_price:\n        sell_month = i\n        break',
          retro: 'sell_month = i + 1',
        },
      ],
      explicacion:
        '`stop_price = buy_price * 0.8` da 9.584 (80% de 11.98). El bucle recorre las posiciones `i` de 0 a 11; en la primera donde `prices[i] <= stop_price`, guarda `sell_month = i + 1` y `break` detiene el bucle. Julio (posición 6, precio 9.48) es el primer cierre que cumple la regla, así que `sell_month` vale 7.\n\nSin `break`, el bucle sigue y `sell_month` termina con el **último** mes que cumple (diciembre, 12). Y sin el `+ 1` obtendrías 6, que es la posición y no el mes.',
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
