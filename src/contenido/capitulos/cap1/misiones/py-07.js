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
        'Un **diccionario** asocia claves con valores: `{"CND": 100}`. Se consulta con `d["CND"]` y se agrega con `d["QTZ"] = 20`.\n\nSi la clave no existe, `d["XYZ"]` da error; `d.get("XYZ", 0)` devuelve 0. Con `for k, v in d.items():` recorres pares clave-valor.',
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
    },
    {
      tipo: 'ejercicio',
      id: 'py-07-e2',
      concepto: 'fin.portafolio',
      lenguaje: 'python',
      enunciado: 'Crea el diccionario `weights` con el **peso** de cada activo: su valor (cantidad × precio) dividido entre `portfolio_value`.',
      inicial:
        'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\nportfolio_value = sum(holdings[t] * prices[t] for t in holdings)\n\nweights = {}\n',
      solucion:
        'holdings = {"CND": 100, "PAC": 50, "QTZ": 20, "BTP": 30}\nprices = {"CND": 65.06, "PAC": 78.59, "QTZ": 99.01, "BTP": 105.63}\nportfolio_value = sum(holdings[t] * prices[t] for t in holdings)\n\nweights = {}\nfor ticker, qty in holdings.items():\n    weights[ticker] = qty * prices[ticker] / portfolio_value\nprint(weights)\nprint(sum(weights.values()))   # debe dar 1.0',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'weights',
          tol: 1e-9,
        },
      ],
      pistas: [
        'Recorre holdings y asigna weights[ticker] = ...',
        'El valor de cada activo es qty * prices[ticker]; divídelo entre portfolio_value.',
        'for ticker, qty in holdings.items():\n    weights[______] = qty * prices[ticker] / _______________',
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Retorno esperado de un portafolio',
      texto: 'El retorno esperado de un portafolio es el **promedio ponderado** de los retornos esperados de sus activos: `E[Rp] = Σ peso_i × E[R_i]`.',
      codigo: 'weights = {"A": 0.6, "B": 0.4}\nexp_ret = {"A": 0.10, "B": 0.05}\nprint(sum(weights[k] * exp_ret[k] for k in weights))   # 0.08',
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
        },
      ],
      pistas: [
        'Multiplica cada peso por el retorno esperado del mismo ticker y suma.',
        'portfolio_return = portfolio_return + w * expected_returns[ticker]',
        'for ticker, w in weights.items():\n    portfolio_return = portfolio_return + w * ________________[ticker]',
      ],
      incorrectas: [
        'weights = {"CND": 0.4, "PAC": 0.25, "QTZ": 0.15, "BTP": 0.2}\nexpected_returns = {"CND": 0.12, "PAC": 0.09, "QTZ": 0.15, "BTP": 0.05}\nportfolio_return = sum(expected_returns.values()) / 4',
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
