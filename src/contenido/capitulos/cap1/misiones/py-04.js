// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-04: Retornos de IBM

export default {
  id: 'py-04',
  titulo: 'Retornos de IBM',
  resumen: 'Bucles for, range() y el patrón acumulador con datos reales (Grunfeld).',
  pista: 'python',
  lenguaje: 'python',
  duracion: '9 min',
  requiere: ['py-03'],
  nivelDiagnostico: 4,
  conceptos: ['py.for', 'fin.retornos', 'fin.cagr'],
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
          texto: 'Los precios solos dicen poco. Lo que importa es el retorno: cuánto ganaste en proporción a lo que pusiste.',
        },
        {
          quien: 'marta',
          texto: 'Hoy trabajas con el valor de mercado de IBM entre 1947 y 1954. Son datos históricos reales.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Bucles for',
      texto:
        'Un bucle `for` repite un bloque por cada elemento. El bloque va con **4 espacios** de sangría.\n\n`range(1, n)` produce 1, 2, …, n−1. Sirve para recorrer posiciones y comparar cada precio con el anterior: dentro del bucle, `prices[i]` es el precio de esta vuelta y `prices[i - 1]` el de la vuelta anterior. Por eso el bucle empieza en 1: el primer precio no tiene anterior.\n\n`lista.append(x)` agrega `x` al final de la lista en cada vuelta.\n\nEl **retorno simple** es `precio_hoy / precio_ayer − 1`.',
      codigo:
        'prices = [100, 105, 102]\nfor p in prices:\n    print(p)\n\nreturns = []\nfor i in range(1, len(prices)):\n    r = prices[i] / prices[i - 1] - 1\n    returns.append(r)\nprint(returns)   # [0.05, -0.0285...]',
      lenguaje: 'python',
    },
    {
      tipo: 'quiz',
      id: 'py-04-q1',
      concepto: 'py.for',
      pregunta: '¿Qué imprime este código?',
      codigo: 'for i in range(1, 4):\n    print(i)',
      opciones: ['1 2 3', '1 2 3 4', '0 1 2 3', '1 4'],
      correcta: 0,
      explicacion: 'range(1, 4) empieza en 1 y se detiene antes del 4.',
    },
    {
      tipo: 'ejercicio',
      id: 'py-04-e1',
      concepto: 'fin.retornos',
      lenguaje: 'python',
      enunciado:
        '`ibm_value` tiene el valor de mercado de IBM al 31 de diciembre de cada año, de 1947 a 1954 (millones de dólares de 1947). Con un bucle `for`, crea la lista `growth` con el crecimiento de cada año respecto al anterior.',
      inicial: 'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = []\n',
      solucion:
        'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = []\nfor i in range(1, len(ibm_value)):\n    growth.append(ibm_value[i] / ibm_value[i - 1] - 1)\nprint(growth)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'growth',
          ayuda:
            'Son 8 valores y 7 crecimientos: recorre i desde 1 con range(1, len(ibm_value)) y calcula ibm_value[i] / ibm_value[i - 1] - 1. Dividir (no restar) da el crecimiento en proporción.',
        },
        {
          tipo: 'codigoIncluye',
          patron: '\\bfor\\b',
          mensaje: 'Usa un bucle for.',
        },
      ],
      pistas: [
        'Hay 8 valores, así que habrá 7 crecimientos. Empieza el bucle en la posición 1.',
        'for i in range(1, len(ibm_value)):  y adentro  growth.append(...)',
        'for i in range(1, len(ibm_value)):\n    growth.append(ibm_value[i] / ibm_value[____] - 1)',
      ],
      alternativas: [
        'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = []\nprev = ibm_value[0]\nfor v in ibm_value[1:]:\n    growth.append(v / prev - 1)\n    prev = v',
      ],
      incorrectas: [
        {
          codigo:
            'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = []\nfor i in range(1, len(ibm_value)):\n    growth.append(ibm_value[i] - ibm_value[i - 1])',
          retro: 'Dividir (no restar)',
        },
        {
          codigo:
            'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = []\nfor i in range(len(ibm_value)):\n    growth.append(ibm_value[i] / ibm_value[i - 1] - 1)',
          retro: ['esperaba 7', 'range(1, len(ibm_value))'],
        },
      ],
      explicacion:
        'Hay 8 valores, así que hay 7 crecimientos: el bucle recorre `i` de 1 a 7 con `range(1, len(ibm_value))`. En cada vuelta, `ibm_value[i] / ibm_value[i - 1] - 1` compara el valor de un año con el del año anterior y `growth.append(...)` agrega el resultado al final de la lista.\n\nEl error típico es restar (`ibm_value[i] - ibm_value[i - 1]`): eso da la diferencia en millones de dólares, no el crecimiento en proporción. Otro es usar `range(len(ibm_value))`: con `i = 0`, `ibm_value[i - 1]` es el **último** valor y sale un crecimiento de más.',
    },
    {
      tipo: 'leccion',
      titulo: 'El patrón acumulador',
      texto:
        'Para combinar valores en un bucle, empiezas con un acumulador y lo actualizas en cada vuelta.\n\nLos retornos **se multiplican**: crecer 10% y luego 20% es `1.10 × 1.20 = 1.32`, o sea +32%, no +30%.',
      codigo: 'returns = [0.10, 0.20]\nfactor = 1\nfor r in returns:\n    factor = factor * (1 + r)\nprint(factor - 1)   # 0.32',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-04-e2',
      concepto: 'py.for',
      lenguaje: 'python',
      enunciado:
        'Usando `growth`, calcula con un bucle `total_growth`: el crecimiento total de 1947 a 1954 (multiplica todos los `1 + g` y al final réstale 1).',
      inicial:
        'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\n# La línea siguiente crea growth en una sola línea (comprensión de listas; la verás más adelante)\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\n\nfactor = 1\n',
      solucion:
        'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\n\nfactor = 1\nfor g in growth:\n    factor = factor * (1 + g)\ntotal_growth = factor - 1\nprint(total_growth)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'total_growth',
          tol: {
            rel: 1e-9,
            abs: 1e-9,
          },
          ayuda: 'Multiplica dentro del bucle: factor = factor * (1 + g). Cuando el bucle termina (en una línea sin sangría), total_growth = factor - 1.',
        },
        {
          tipo: 'codigoIncluye',
          patron: '^\\s*for\\b',
          mensaje: 'Usa un bucle for para acumular.',
        },
      ],
      pistas: [
        'Dentro del bucle: factor = factor * (1 + g)',
        'Al terminar el bucle: total_growth = factor - 1',
        'for g in growth:\n    factor = factor * (1 + _)\ntotal_growth = factor - _',
      ],
      explicacion:
        '`factor` empieza en 1 y en cada vuelta se multiplica por `(1 + g)`: así se encadenan los 7 crecimientos. Al final, `factor` ≈ 2.276 (IBM valía 2.276 veces lo de 1947) y `total_growth = factor - 1` ≈ 1.276, o sea +127.6%.\n\nEl acumulador empieza en 1 y no en 0 porque multiplicar por 0 da siempre 0. Y sumar los crecimientos no sirve: los retornos se componen (se multiplican), no se suman.',
      alternativas: [
        'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\n\nfactor = 1\nfor i in range(len(growth)):\n    factor = factor * (1 + growth[i])\ntotal_growth = factor - 1',
      ],
      incorrectas: [
        {
          codigo:
            'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\n\ntotal = 0\nfor g in growth:\n    total = total + g\ntotal_growth = total',
          retro: 'factor = factor * (1 + g)',
        },
        {
          codigo:
            'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\n\nfactor = 1\nfor g in growth:\n    factor = factor * (1 + g)\ntotal_growth = factor',
          retro: 'total_growth = factor - 1',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Promedio vs. CAGR',
      texto:
        'El promedio simple de los retornos **exagera** el crecimiento cuando hay volatilidad. La medida honesta es el **CAGR** (tasa de crecimiento anual compuesta):\n\n`CAGR = (valor_final / valor_inicial) ** (1 / años) − 1`\n\n`** (1 / años)` es la **raíz** de orden `años`: `x ** (1 / 2)` es la raíz cuadrada y `x ** (1 / 7)` la raíz séptima. Así se obtiene la tasa fija que, repetida cada año, lleva del valor inicial al final. Los paréntesis en `(1 / años)` son obligatorios: `x ** 1 / 7` calcula `x` y después lo divide entre 7.',
      codigo: 'start, end, years = 100, 121, 2\ncagr = (end / start) ** (1 / years) - 1\nprint(cagr)   # 0.1 (10% anual)',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-04-e3',
      concepto: 'fin.cagr',
      lenguaje: 'python',
      enunciado: 'Calcula `average_growth` (promedio simple de `growth`) y `cagr` de IBM entre 1947 y 1954 (son 7 años). Compara ambos.',
      inicial:
        'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\n',
      solucion:
        'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\naverage_growth = sum(growth) / len(growth)\ncagr = (ibm_value[-1] / ibm_value[0]) ** (1 / 7) - 1\nprint(average_growth, cagr)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'average_growth',
          ayuda: 'Promedio simple: sum(growth) / len(growth).',
        },
        {
          tipo: 'variable',
          nombre: 'cagr',
          tol: {
            rel: 1e-9,
            abs: 1e-9,
          },
          ayuda:
            'CAGR = (valor_final / valor_inicial) ** (1 / años) - 1. Aquí el final es ibm_value[-1], el inicial ibm_value[0] y los años son 7. Pon (1 / 7) entre paréntesis.',
        },
      ],
      pistas: [
        'average_growth es el promedio de siempre: sum(...) / len(...). Para el CAGR usa la fórmula de la lección con el primer y el último valor.',
        'Son 7 años (7 saltos entre 8 valores): cagr = (ibm_value[-1] / ibm_value[0]) ** (1 / 7) - 1',
        'cagr = (ibm_value[___] / ibm_value[0]) ** (1 / ___) - 1',
      ],
      alternativas: [
        'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\naverage_growth = sum(growth) / len(growth)\ncagr = (ibm_value[-1] / ibm_value[0]) ** (1 / len(growth)) - 1',
      ],
      explicacion:
        '`average_growth = sum(growth) / len(growth)` da ≈ 0.1315 (13.2% anual). El CAGR usa solo el primer y el último valor: `(927.3 / 407.4) ** (1 / 7) - 1` ≈ 0.1247 (12.5% anual). Son 7 años porque de 1947 a 1954 hay 7 saltos de un año, aunque la lista tenga 8 valores.\n\nEl promedio simple siempre es mayor o igual que el CAGR, y la diferencia crece cuanto más varían los retornos de un año a otro. El CAGR es la tasa que, repetida 7 veces, reproduce el resultado real.',
      incorrectas: [
        {
          codigo:
            'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\naverage_growth = sum(growth) / len(growth)\ncagr = (ibm_value[-1] / ibm_value[0]) ** 1 / 7 - 1',
          retro: '(1 / 7) entre paréntesis',
        },
        {
          codigo:
            'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\naverage_growth = sum(growth) / len(growth)\ncagr = (ibm_value[-1] / ibm_value[0]) ** (1 / 8) - 1',
          retro: 'los años son 7',
        },
      ],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'Promedio simple: 13.2% anual. CAGR: 12.5%. La diferencia parece chica, pero en 30 años es enorme.',
        },
        {
          quien: 'marta',
          texto: 'Cuando alguien te venda un fondo con su "retorno promedio", pregúntale por el CAGR.',
        },
      ],
    },
  ],
};
