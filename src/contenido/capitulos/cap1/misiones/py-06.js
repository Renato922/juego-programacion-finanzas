// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-06: Tu caja de herramientas financieras

export default {
  id: 'py-06',
  titulo: 'Tu caja de herramientas financieras',
  resumen: 'Funciones con def y return: valor presente, cuota de préstamo e interés simple.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '13 min',
  requiere: ['py-05'],
  nivelDiagnostico: 6,
  conceptos: ['py.funciones', 'fin.valor_presente', 'fin.anualidades'],
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
          texto: 'Llevas varios días escribiendo la misma fórmula una y otra vez. Un profesional la escribe una vez, como función, y la reutiliza.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Funciones: def y return',
      texto:
        'Una **función** empaqueta un cálculo. Se define con `def nombre(parámetros):` y devuelve el resultado con `return`.\n\nLos parámetros pueden tener **valor por defecto**: `def fee(amount, rate=0.01)` usa 0.01 si no le pasas rate.\n\nEl cuerpo de la función va con 4 espacios de sangría. `return` **devuelve** el resultado a quien llamó la función, para que puedas guardarlo o usarlo en otro cálculo; `print` solo lo muestra en la consola, y una función sin `return` devuelve `None`.\n\nDefinir la función no la ejecuta: se ejecuta cada vez que la llamas, por ejemplo `future_value(1000, 0.07, 5)`.',
      codigo:
        'def future_value(pv, rate, years):\n    return pv * (1 + rate) ** years\n\nprint(future_value(1000, 0.07, 5))   # 1402.55...\nprint(future_value(500, 0.1, 2))     # 605.0...',
      lenguaje: 'python',
    },
    {
      tipo: 'quiz',
      id: 'py-06-q1',
      concepto: 'py.funciones',
      pregunta: '¿Qué imprime este código?',
      codigo: 'def double(x):\n    y = x * 2\n\nprint(double(5))',
      opciones: ['10', 'None', 'y', 'Error'],
      correcta: 1,
      explicacion: 'La función calcula y pero no tiene return, así que devuelve None.',
    },
    {
      tipo: 'ejercicio',
      id: 'py-06-e1',
      concepto: 'fin.valor_presente',
      lenguaje: 'python',
      enunciado:
        'Define `present_value(fv, rate, years)` que devuelva el **valor presente**: `fv / (1 + rate) ** years`. Es la fórmula inversa del valor futuro: cuánto vale hoy un dinero que recibirás después.',
      inicial: '# Define present_value aquí\n\n\nprint(present_value(1000, 0.1, 1))   # debería dar 909.09...\n',
      solucion: 'def present_value(fv, rate, years):\n    return fv / (1 + rate) ** years\n\nprint(present_value(1000, 0.1, 1))',
      verificar: [
        {
          tipo: 'funcion',
          nombre: 'present_value',
          casos: [
            [1000, 0.1, 1],
            [5000, 0.05, 3],
            [100, 0, 5],
            [250000, 0.08, 30],
          ],
          tol: {
            rel: 1e-9,
            abs: 1e-9,
          },
          ayuda:
            'El valor presente divide entre (1 + rate) ** years (multiplicar daría el valor futuro), y la función tiene que devolverlo con return, no solo imprimirlo.',
        },
      ],
      pistas: [
        'Empieza con def present_value(fv, rate, years):  y en la línea siguiente, con 4 espacios, el return.',
        'return fv / (1 + rate) ** years',
        'def present_value(fv, rate, years):\n    return fv / (1 + ____) ** _____',
      ],
      incorrectas: [
        {
          codigo: 'def present_value(fv, rate, years):\n    print(fv / (1 + rate) ** years)',
          retro: ['devolvió None', 'return'],
        },
        {
          codigo: 'def present_value(fv, rate, years):\n    return fv * (1 + rate) ** years',
          retro: 'multiplicar daría el valor futuro',
        },
      ],
      explicacion:
        'La función recibe `fv`, `rate` y `years` y **devuelve** `fv / (1 + rate) ** years`. Con 1000 a 10% por 1 año: 1000 / 1.1 = 909.09.\n\nPython calcula primero la potencia `**` y después la división, así que no hacen falta más paréntesis. El error típico es usar `print` en lugar de `return`: la función mostraría el número, pero devolvería `None` y no podrías usar el resultado en otro cálculo.',
      alternativas: ['def present_value(fv, rate, years):\n    return fv * (1 + rate) ** -years'],
    },
    {
      tipo: 'leccion',
      titulo: 'La cuota de un préstamo',
      texto:
        'En un préstamo de cuota fija (sistema francés, el más usado en hipotecas y créditos de consumo), la cuota mensual es:\n\n`cuota = P × r / (1 − (1 + r) ** −n)`\n\ndonde P es el monto prestado, r la tasa **mensual** y n el número de meses. `(1 + r) ** -n` es lo mismo que `1 / (1 + r) ** n`: un exponente negativo significa "uno dividido entre". Con r = 0.01 y n = 12 vale ≈ 0.8874. Si r es 0, la fórmula divide entre cero: en ese caso la cuota es simplemente `P / n`.',
      codigo: 'P, r, n = 10000, 0.01, 12\npayment = P * r / (1 - (1 + r) ** -n)\nprint(round(payment, 2))   # 888.49',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-06-e2',
      concepto: 'fin.anualidades',
      lenguaje: 'python',
      enunciado: 'Define `loan_payment(principal, monthly_rate, months)` que devuelva la cuota mensual. Si `monthly_rate` es 0, devuelve `principal / months`.',
      inicial: '# Define loan_payment aquí\n',
      solucion:
        'def loan_payment(principal, monthly_rate, months):\n    if monthly_rate == 0:\n        return principal / months\n    return principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)',
      verificar: [
        {
          tipo: 'funcion',
          nombre: 'loan_payment',
          casos: [
            [10000, 0.01, 12],
            [50000, 0.008, 60],
            [1200, 0, 12],
            [250000, 0.006, 240],
          ],
          tol: {
            rel: 1e-9,
            abs: 1e-9,
          },
          ayuda:
            'Dos detalles: (1) si monthly_rate es 0 la fórmula divide entre cero; antes, con if monthly_rate == 0:, devuelve principal / months. (2) El exponente es negativo: (1 + monthly_rate) ** -months.',
        },
      ],
      pistas: [
        'Primero un if para el caso monthly_rate == 0. Después, el return con la fórmula.',
        'return principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)',
        'def loan_payment(principal, monthly_rate, months):\n    if monthly_rate == 0:\n        return principal / ______\n    return principal * monthly_rate / (1 - (1 + monthly_rate) ** -______)',
      ],
      incorrectas: [
        {
          codigo: 'def loan_payment(principal, monthly_rate, months):\n    return principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)',
          retro: ['divide entre cero', 'if monthly_rate == 0'],
        },
        {
          codigo:
            'def loan_payment(principal, monthly_rate, months):\n    if monthly_rate == 0:\n        return principal / months\n    return principal * monthly_rate / (1 - (1 + monthly_rate) ** months)',
          retro: '** -months',
        },
      ],
      explicacion:
        'Primero el caso especial: si `monthly_rate == 0`, la fórmula dividiría entre cero, así que devuelves `principal / months` (sin intereses, la cuota es el monto repartido en partes iguales). Si no, devuelves `principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)`. Para 10000 al 1% mensual en 12 meses, la cuota es ≈ 888.49.\n\nEl `return` dentro del `if` termina la función ahí mismo, por eso no hace falta un `else`. Se compara con `==`: un solo `=` es una asignación y da error de sintaxis.',
      alternativas: [
        'def loan_payment(principal, monthly_rate, months):\n    if monthly_rate == 0:\n        return principal / months\n    else:\n        return principal * monthly_rate / (1 - 1 / (1 + monthly_rate) ** months)',
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'py-06-e3',
      concepto: 'py.funciones',
      lenguaje: 'python',
      enunciado: 'Define `simple_interest(capital, rate, years=1)` que devuelva `capital * rate * years`. El parámetro `years` debe valer 1 si no se lo pasan.',
      inicial: '# Define simple_interest aquí\n',
      solucion: 'def simple_interest(capital, rate, years=1):\n    return capital * rate * years',
      verificar: [
        {
          tipo: 'funcion',
          nombre: 'simple_interest',
          casos: [
            [1000, 0.05],
            [1000, 0.05, 3],
            [2500, 0.1, 2],
          ],
          ayuda:
            'El valor por defecto va en la definición: def simple_interest(capital, rate, years=1):, y el return multiplica los tres: capital * rate * years.',
        },
      ],
      pistas: [
        'El valor por defecto se escribe en la definición, con =: years=1',
        'La primera línea es def simple_interest(capital, rate, years=1):  y la segunda, con 4 espacios, el return.',
        'def simple_interest(capital, rate, years=___):\n    return capital * rate * _____',
      ],
      incorrectas: [
        {
          codigo: 'def simple_interest(capital, rate, years):\n    return capital * rate * years',
          retro: ['menos argumentos', 'years=1'],
        },
        {
          codigo: 'def simple_interest(capital, rate, years=1):\n    return capital * rate',
          retro: 'capital * rate * years',
        },
      ],
      explicacion:
        'Al escribir `years=1` en la definición, `years` pasa a ser opcional: `simple_interest(1000, 0.05)` usa 1 año y da 50.0, y `simple_interest(1000, 0.05, 3)` da 150.0.\n\nSin el `=1`, llamar a la función con dos argumentos da `TypeError` porque falta `years`. Los parámetros con valor por defecto van siempre al final de la lista.',
    },
    {
      tipo: 'jefeDia',
      id: 'py-06-jefe',
      jefe: {
        nombre: 'Gonzalo Vega',
        sprite: 'vega',
        provocacion: 'Este préstamo cobra "12% anual". Es 12% y punto. ¿O me vas a decir que cuesta más?',
        derrota: '12.68% efectivo… Así que la capitalización mensual sí suma. Voy a releer mis contratos.',
      },
      paso: {
        tipo: 'ejercicio',
        id: 'py-06-jefe-e1',
        concepto: 'py.funciones',
        lenguaje: 'python',
        enunciado:
          'Define `effective_rate(nominal, periods=12)` que **devuelva** la tasa efectiva anual: `(1 + nominal / periods) ** periods - 1`. Si no le pasan `periods`, usa 12 (capitalización mensual).',
        inicial: '# Define effective_rate aquí\n\n\nprint(effective_rate(0.12))   # debería dar 0.1268...\n',
        solucion: 'def effective_rate(nominal, periods=12):\n    return (1 + nominal / periods) ** periods - 1\n\nprint(effective_rate(0.12))',
        verificar: [
          {
            tipo: 'funcion',
            nombre: 'effective_rate',
            casos: [[0.12], [0.12, 4], [0.12, 1], [0, 12], [0.06, 365]],
            tol: {
              rel: 1e-9,
              abs: 1e-9,
            },
            ayuda:
              'La función devuelve (1 + nominal / periods) ** periods - 1 con return (no print), y el valor por defecto va en la definición: def effective_rate(nominal, periods=12):',
          },
        ],
        explicacion:
          'La tasa nominal se reparte en `periods` partes y se compone `periods` veces: con 12% nominal y capitalización mensual, `(1 + 0.12 / 12) ** 12 - 1` ≈ 0.1268, o sea 12.68% efectivo al año. Con `periods=4` da ≈ 12.55% y con `periods=1`, exactamente 12%.\n\nEl `=12` en la definición hace que `periods` sea opcional. Los errores típicos son usar `print` en lugar de `return` (la función devolvería None) y olvidar el `- 1` final.',
        pistas: [
          'Es una función con un parámetro con valor por defecto, como simple_interest en la misión.',
          'def effective_rate(nominal, periods=12):  y en la línea siguiente, con 4 espacios, el return.',
          'def effective_rate(nominal, periods=___):\n    return (1 + nominal / periods) ** _______ - 1',
        ],
        alternativas: ['def effective_rate(nominal, periods=12):\n    factor = 1 + nominal / periods\n    return factor ** periods - 1'],
        incorrectas: [
          {
            codigo: 'def effective_rate(nominal, periods=12):\n    print((1 + nominal / periods) ** periods - 1)',
            retro: '¿Te falta el return?',
          },
          {
            codigo: 'def effective_rate(nominal, periods):\n    return (1 + nominal / periods) ** periods - 1',
            retro: 'menos argumentos',
          },
          {
            codigo: 'def effective_rate(nominal, periods=12):\n    return (1 + nominal / periods) ** periods',
            retro: 'periods - 1',
          },
        ],
      },
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'Ahora tienes tu propia caja de herramientas. En el trabajo real estas funciones viven en un archivo que todo el equipo importa.',
        },
      ],
    },
  ],
};
