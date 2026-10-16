// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-07: Tu primera cartera modelo

export default {
  id: 'py-07',
  titulo: 'Tu primera cartera modelo',
  resumen: 'Diccionarios: valor de la cartera, pesos y retorno esperado.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '9 min',
  requiere: ['py-06'],
  nivelDiagnostico: 7,
  conceptos: ['py.diccionarios', 'fin.portafolio'],
  recompensa: {
    capital: 2200,
    xp: 90,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'Te asigno tu primera cartera modelo. Cuatro activos, precios de cierre de diciembre.',
        },
        {
          quien: 'marta',
          texto: 'Para guardar "ticker → cantidad" se usa un diccionario.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Diccionarios',
      texto:
        'Un **diccionario** asocia claves con valores: `{"CND": 100}`. Se consulta con `d["CND"]` y se agrega con `d["QTZ"] = 20`.\n\nSi la clave no existe, `d["XYZ"]` da error; `d.get("XYZ", 0)` devuelve 0. Con `for k, v in d.items():` recorres pares clave-valor.\n\nEn `for ticker, qty in holdings.items():`, cada vuelta entrega un par: `ticker` recibe la clave y `qty` el valor. Con la clave puedes buscar en **otro** diccionario que use las mismas claves, por ejemplo `prices[ticker]`.',
      codigo:
        'holdings = {"CND": 100, "PAC": 50}\nprint(holdings["CND"])         # 100\nholdings["QTZ"] = 20\nfor ticker, qty in holdings.items():\n    print(ticker, qty)\nprint(holdings.get("XYZ", 0))  # 0',
      lenguaje: 'python',
    },
    {
      tipo: 'quiz',
      id: 'py-07-q1',
      concepto: 'py.diccionarios',
      pregunta: '¿Qué pasa con `holdings["XYZ"]` si "XYZ" no está en el diccionario?',
      opciones: ['Devuelve 0', 'Devuelve None', 'Da un KeyError', 'Crea la clave'],
      correcta: 2,
      explicacion: 'Acceder con corchetes a una clave inexistente da KeyError. Para evitarlo se usa .get().',
    },
    {
      tipo: 'ejercicio',
      id: 'py-07-e1',
      concepto: 'py.diccionarios',
      lenguaje: 'python',
      enunciado: 'Calcula `portfolio_value`: la suma de cantidad × precio de cada activo. Recorre `holdings` con `.items()`.',
      inicial:
        'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\n\nportfolio_value = 0\n',
      solucion:
        'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\n\nportfolio_value = 0\nfor ticker, qty in holdings.items():\n    portfolio_value = portfolio_value + qty * prices[ticker]\nprint(portfolio_value)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'portfolio_value',
          tol: 0.000001,
          ayuda: 'En cada vuelta suma cantidad × precio del mismo activo: portfolio_value = portfolio_value + qty * prices[ticker].',
        },
      ],
      pistas: [
        'Por cada ticker, multiplica su cantidad por prices[ticker] y súmalo al acumulador.',
        'for ticker, qty in holdings.items():\n    portfolio_value = portfolio_value + ...',
        'for ticker, qty in holdings.items():\n    portfolio_value = portfolio_value + qty * prices[______]',
      ],
      alternativas: [
        'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\nportfolio_value = sum(holdings[t] * prices[t] for t in holdings)',
      ],
      explicacion:
        '`portfolio_value` empieza en 0 y en cada vuelta suma `qty * prices[ticker]`, el valor de esa posición: CND aporta 100 × 65.06 = 6506.0, PAC 3929.5, QTZ 1980.2 y BTP 3168.9. En total, 15584.6.\n\nLa clave `ticker` sirve para buscar el precio del mismo activo en el otro diccionario. El error típico es sumar solo las cantidades o solo los precios: lo que vale es la cantidad **por** el precio.',
      incorrectas: [
        {
          codigo:
            'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\n\nportfolio_value = 0\nfor ticker, qty in holdings.items():\n    portfolio_value = portfolio_value + qty',
          retro: 'qty * prices[ticker]',
        },
        {
          codigo:
            'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\n\nportfolio_value = 0\nfor ticker, qty in holdings.items():\n    portfolio_value = qty * prices[ticker]',
          retro: 'portfolio_value = portfolio_value +',
        },
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'py-07-e2',
      concepto: 'fin.portafolio',
      lenguaje: 'python',
      enunciado: 'Crea el diccionario `weights` con el **peso** de cada activo: su valor (cantidad × precio) dividido entre `portfolio_value`.',
      inicial:
        'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\n# La línea siguiente calcula portfolio_value en una sola línea (la verás más adelante)\nportfolio_value = sum(holdings[t] * prices[t] for t in holdings)\n\nweights = {}\n',
      solucion:
        'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\nportfolio_value = sum(holdings[t] * prices[t] for t in holdings)\n\nweights = {}\nfor ticker, qty in holdings.items():\n    weights[ticker] = qty * prices[ticker] / portfolio_value\nprint(weights)\nprint(sum(weights.values()))   # debe dar 1.0',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'weights',
          tol: 1e-9,
          ayuda: 'El peso es el valor del activo entre el total: weights[ticker] = qty * prices[ticker] / portfolio_value. Los pesos deben sumar 1.',
        },
      ],
      pistas: [
        'Recorre holdings y asigna weights[ticker] = ...',
        'El valor de cada activo es qty * prices[ticker]; divídelo entre portfolio_value.',
        'for ticker, qty in holdings.items():\n    weights[______] = qty * prices[ticker] / _______________',
      ],
      explicacion:
        'El valor de cada activo es `qty * prices[ticker]` y su peso es ese valor dividido entre `portfolio_value`. Con `weights[ticker] = ...` creas una clave nueva en el diccionario en cada vuelta. CND pesa ≈ 0.4175 (41.75%), PAC ≈ 0.2521, QTZ ≈ 0.1271 y BTP ≈ 0.2033.\n\nLos pesos siempre suman 1 (100%): es una buena forma de comprobar tu resultado. El error típico es dividir la cantidad (`qty / portfolio_value`) sin multiplicarla antes por el precio.',
      alternativas: [
        'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\nportfolio_value = sum(holdings[t] * prices[t] for t in holdings)\nweights = {t: holdings[t] * prices[t] / portfolio_value for t in holdings}',
      ],
      incorrectas: [
        {
          codigo:
            'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\nportfolio_value = sum(holdings[t] * prices[t] for t in holdings)\n\nweights = {}\nfor ticker, qty in holdings.items():\n    weights[ticker] = qty / portfolio_value',
          retro: 'qty * prices[ticker] / portfolio_value',
        },
        {
          codigo:
            'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\nportfolio_value = sum(holdings[t] * prices[t] for t in holdings)\n\nweights = {}\nfor ticker, qty in holdings.items():\n    weights[ticker] = qty * prices[ticker] / portfolio_value * 100',
          retro: 'deben sumar 1',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Retorno esperado de un portafolio',
      texto:
        'El retorno esperado de un portafolio es el **promedio ponderado** de los retornos esperados de sus activos: `E[Rp] = Σ peso_i × E[R_i]`. Se calcula con un acumulador, como el valor de la cartera: por cada activo, peso × retorno esperado.',
      codigo:
        'weights = {"A": 0.6, "B": 0.4}\nexp_ret = {"A": 0.10, "B": 0.05}\ntotal = 0\nfor k, w in weights.items():\n    total = total + w * exp_ret[k]\nprint(total)   # 0.08 = 0.6 × 0.10 + 0.4 × 0.05',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-07-e3',
      concepto: 'fin.portafolio',
      lenguaje: 'python',
      enunciado: 'Calcula `portfolio_return`, el retorno esperado de la cartera con estos pesos y retornos esperados anuales.',
      inicial: 'weights = {"CND": 0.4, "PAC": 0.25, "QTZ": 0.15, "BTP": 0.2}\nexpected_returns = {"CND": 0.12, "PAC": 0.09, "QTZ": 0.15, "BTP": 0.05}\n',
      solucion:
        'weights = {"CND": 0.4, "PAC": 0.25, "QTZ": 0.15, "BTP": 0.2}\nexpected_returns = {"CND": 0.12, "PAC": 0.09, "QTZ": 0.15, "BTP": 0.05}\nportfolio_return = 0\nfor ticker, w in weights.items():\n    portfolio_return = portfolio_return + w * expected_returns[ticker]\nprint(portfolio_return)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'portfolio_return',
          tol: 1e-9,
          ayuda: 'Promedio ponderado: empieza con portfolio_return = 0 y en cada vuelta suma peso × retorno del mismo ticker: w * expected_returns[ticker].',
        },
      ],
      pistas: [
        'Multiplica cada peso por el retorno esperado del mismo ticker y suma.',
        'portfolio_return = portfolio_return + w * expected_returns[ticker]',
        'for ticker, w in weights.items():\n    portfolio_return = portfolio_return + w * ________________[ticker]',
      ],
      incorrectas: [
        {
          codigo:
            'weights = {"CND": 0.4, "PAC": 0.25, "QTZ": 0.15, "BTP": 0.2}\nexpected_returns = {"CND": 0.12, "PAC": 0.09, "QTZ": 0.15, "BTP": 0.05}\nportfolio_return = sum(expected_returns.values()) / 4',
          retro: 'Promedio ponderado',
        },
        {
          codigo:
            'weights = {"CND": 0.4, "PAC": 0.25, "QTZ": 0.15, "BTP": 0.2}\nexpected_returns = {"CND": 0.12, "PAC": 0.09, "QTZ": 0.15, "BTP": 0.05}\nfor ticker, w in weights.items():\n    portfolio_return = portfolio_return + w * expected_returns[ticker]',
          retro: '"portfolio_return" no existe todavía',
        },
      ],
      explicacion:
        'Es un promedio **ponderado**: cada retorno esperado cuenta según su peso. El acumulador empieza en 0 y suma `w * expected_returns[ticker]` en cada vuelta: 0.4 × 0.12 + 0.25 × 0.09 + 0.15 × 0.15 + 0.2 × 0.05 = 0.103, o sea 10.3% anual.\n\nEl error típico es el promedio simple de los retornos (`sum(expected_returns.values()) / 4` = 0.1025), que trata a todos los activos como si pesaran lo mismo.',
      alternativas: [
        'weights = {"CND": 0.4, "PAC": 0.25, "QTZ": 0.15, "BTP": 0.2}\nexpected_returns = {"CND": 0.12, "PAC": 0.09, "QTZ": 0.15, "BTP": 0.05}\nportfolio_return = sum(weights[t] * expected_returns[t] for t in weights)',
      ],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: '10.3% esperado. Ojo con la palabra "esperado": es un promedio de escenarios, no una promesa.',
        },
        {
          quien: 'marta',
          texto: 'Ya piensas como gestor: pesos y retornos. Lo que falta es medir el riesgo. Eso viene en el capítulo 2.',
        },
      ],
    },
  ],
};
