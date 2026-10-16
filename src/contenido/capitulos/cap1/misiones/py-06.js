// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-06: Tu caja de herramientas financieras

export default {
  id: 'py-06',
  titulo: 'Tu caja de herramientas financieras',
  resumen: 'Funciones con def y return: valor presente, cuota de préstamo e interés simple.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '10 min',
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
        'Una **función** empaqueta un cálculo. Se define con `def nombre(parámetros):` y devuelve el resultado con `return`.\n\nLos parámetros pueden tener **valor por defecto**: `def fee(amount, rate=0.01)` usa 0.01 si no le pasas rate.',
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
        },
      ],
      pistas: [
        'Empieza con def present_value(fv, rate, years):  y en la línea siguiente, con 4 espacios, el return.',
        'return fv / (1 + rate) ** years',
        'def present_value(fv, rate, years):\n    return fv / (1 + ____) ** _____',
      ],
      incorrectas: [
        'def present_value(fv, rate, years):\n    print(fv / (1 + rate) ** years)',
        'def present_value(fv, rate, years):\n    return fv * (1 + rate) ** years',
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'La cuota de un préstamo',
      texto:
        'En un préstamo de cuota fija (sistema francés, el más usado en hipotecas y créditos de consumo), la cuota mensual es:\n\n`cuota = P × r / (1 − (1 + r) ** −n)`\n\ndonde P es el monto prestado, r la tasa **mensual** y n el número de meses. Si r es 0, la fórmula divide entre cero: en ese caso la cuota es simplemente `P / n`.',
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
        },
      ],
      pistas: [
        'Primero un if para el caso monthly_rate == 0. Después, el return con la fórmula.',
        'return principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)',
        'def loan_payment(principal, monthly_rate, months):\n    if monthly_rate == 0:\n        return principal / ______\n    return principal * monthly_rate / (1 - (1 + monthly_rate) ** -______)',
      ],
      incorrectas: ['def loan_payment(principal, monthly_rate, months):\n    return principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)'],
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
        },
      ],
      pistas: [
        'El valor por defecto se escribe en la definición: years=1',
        'def simple_interest(capital, rate, years=1):',
        '    return capital * rate * _____',
      ],
      incorrectas: ['def simple_interest(capital, rate, years):\n    return capital * rate * years'],
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
