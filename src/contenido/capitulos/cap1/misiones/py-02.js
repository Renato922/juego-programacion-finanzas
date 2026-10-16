// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-02: La fuerza del interés compuesto

export default {
  id: 'py-02',
  titulo: 'La fuerza del interés compuesto',
  resumen: 'Potencias, round(), f-strings y el módulo math.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '8 min',
  requiere: ['py-01'],
  nivelDiagnostico: 2,
  conceptos: ['py.potencias', 'py.fstrings', 'py.import', 'fin.interes_compuesto', 'fin.regla72'],
  recompensa: {
    capital: 1500,
    xp: 70,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'Un cliente quiere saber cuánto tendrá si deja su dinero 10 años. Para eso usamos el interés compuesto.',
        },
        {
          quien: 'marta',
          texto: 'Cada año ganas intereses sobre tu dinero y también sobre los intereses que ya ganaste.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Interés compuesto en Python',
      texto:
        'La fórmula del **valor futuro** es `VF = VP × (1 + r)^n`, donde VP es el valor presente, r la tasa y n los años.\n\nEn Python la potencia se escribe con `**` (dos asteriscos). `round(x, 2)` redondea a 2 decimales.',
      codigo: 'present_value = 1000\nrate = 0.07\nyears = 5\nfuture_value = present_value * (1 + rate) ** years\nprint(round(future_value, 2))   # 1402.55',
      lenguaje: 'python',
    },
    {
      tipo: 'quiz',
      id: 'py-02-q1',
      concepto: 'py.potencias',
      pregunta: '¿Qué da `2 ^ 3` en Python?',
      opciones: ['8, porque ^ es potencia', '1, porque ^ no es potencia (es XOR bit a bit)', '6', 'Un error'],
      correcta: 1,
      explicacion: 'Es un error muy común: en Excel `^` es potencia, pero en Python es otra operación (XOR). La potencia es `**`.',
    },
    {
      tipo: 'ejercicio',
      id: 'py-02-e1',
      concepto: 'fin.interes_compuesto',
      lenguaje: 'python',
      enunciado: 'Un cliente invierte **5000** al **6% anual** durante **10 años**. Calcula `future_value` redondeado a 2 decimales con `round()`.',
      inicial: 'present_value = 5000\nrate = 0.06\nyears = 10\n\n',
      solucion: 'present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = round(present_value * (1 + rate) ** years, 2)\nprint(future_value)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'future_value',
          tol: 0.005,
        },
        {
          tipo: 'codigoIncluye',
          patron: '\\*\\*|pow\\(',
          mensaje: 'Usa ** para elevar (1 + rate) a years.',
        },
      ],
      pistas: [
        'VF = VP × (1 + r)^n. Recuerda que la potencia es **.',
        'future_value = round(present_value * (1 + rate) ** years, ...)',
        'future_value = round(present_value * (1 + rate) ** years, _)',
      ],
      alternativas: ['present_value = 5000\nrate = 0.06\nyears = 10\nfv = present_value * pow(1 + rate, years)\nfuture_value = round(fv, 2)'],
      incorrectas: ['present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = present_value * (1 + rate * years)'],
    },
    {
      tipo: 'leccion',
      titulo: 'f-strings: mostrar números como en un informe',
      texto:
        'Un **f-string** es un texto con `f` delante, donde lo que va entre llaves `{}` se reemplaza por su valor.\n\nDespués de `:` va el formato: `,.2f` agrega separador de miles y 2 decimales; `.1%` muestra un porcentaje con 1 decimal.',
      codigo:
        'value = 1402.5517\nrate = 0.07\nprint(f"Valor futuro: ${value:,.2f}")   # Valor futuro: $1,402.55\nprint(f"Tasa: {rate:.1%}")              # Tasa: 7.0%',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-02-e2',
      concepto: 'py.fstrings',
      lenguaje: 'python',
      enunciado: 'Imprime exactamente `Rendimiento anual: 12.50%` usando la variable `annual_return` y un f-string con formato de porcentaje.',
      inicial: 'annual_return = 0.125\n',
      solucion: 'annual_return = 0.125\nprint(f"Rendimiento anual: {annual_return:.2%}")',
      verificar: [
        {
          tipo: 'salida',
          modo: 'exacta',
        },
        {
          tipo: 'codigoIncluye',
          patron: 'f"|f\'',
          mensaje: 'Usa un f-string (texto con f delante).',
        },
      ],
      pistas: [
        'El formato de porcentaje con 2 decimales es :.2%',
        'print(f"Rendimiento anual: {annual_return:...}")',
        'print(f"Rendimiento anual: {annual_return:.2_}")',
      ],
      incorrectas: ['annual_return = 0.125\nprint(f"Rendimiento anual: {annual_return}")'],
    },
    {
      tipo: 'leccion',
      titulo: 'La regla del 72 y el módulo math',
      texto:
        'La **regla del 72** estima en cuántos años se duplica una inversión: `72 / tasa en %`. Al 9%, unos 8 años.\n\nLa cuenta exacta usa logaritmos: `años = ln(2) / ln(1 + r)`. Para eso se importa el módulo `math` con `import math` y se usa `math.log()`.',
      codigo: 'import math\nprint(math.log(2))      # 0.693...\nprint(math.sqrt(16))    # 4.0',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-02-e3',
      concepto: 'py.import',
      lenguaje: 'python',
      enunciado: 'Con una tasa de 9% anual, calcula `rule_of_72` (72 dividido entre 9) y `exact_years` con `math.log(2) / math.log(1 + rate)`.',
      inicial: 'import math\n\nrate = 0.09\n',
      solucion: 'import math\n\nrate = 0.09\nrule_of_72 = 72 / 9\nexact_years = math.log(2) / math.log(1 + rate)\nprint(rule_of_72, exact_years)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'rule_of_72',
        },
        {
          tipo: 'variable',
          nombre: 'exact_years',
          tol: 0.000001,
        },
      ],
      pistas: [
        'rule_of_72 es una división simple: 72 / 9. También sirve 72 / (rate * 100).',
        'exact_years = math.log(2) / math.log(1 + rate)',
        'rule_of_72 = 72 / 9\nexact_years = math.log(_) / math.log(1 + ____)',
      ],
      alternativas: ['import math\nrate = 0.09\nrule_of_72 = 72 / (rate * 100)\nexact_years = math.log(2) / math.log(1 + rate)'],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'La regla del 72 se equivoca por poco: 8 años contra 8.04. Para conversar con un cliente basta. Para un informe, usa la fórmula exacta.',
        },
      ],
    },
  ],
};
