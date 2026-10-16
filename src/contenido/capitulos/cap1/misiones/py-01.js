// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-01: Primer día en la terminal

export default {
  id: 'py-01',
  titulo: 'Primer día en la terminal',
  resumen: 'Variables, operaciones y print(): tu sueldo y la comisión del fondo.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '6 min',
  requiere: [],
  nivelDiagnostico: 1,
  conceptos: ['py.variables', 'py.aritmetica'],
  recompensa: {
    capital: 1200,
    xp: 60,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'aurelio',
          texto: 'Así que tú eres {nombre}. Fundé Cóndor Capital hace 30 años con una calculadora y mucha terquedad. Hoy el fondo funciona con código.',
        },
        {
          quien: 'marta',
          texto: 'Soy Marta Ríos, gestora de portafolios. Vas a trabajar en mi equipo. Aquí todo empieza en la terminal.',
        },
        {
          quien: 'marta',
          texto: 'Regla de la casa: nadie nace sabiendo. Si tu código falla, lo arreglamos. Equivocarte no te quita nada.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Variables y print()',
      texto:
        'Una **variable** es una etiqueta para un dato. Se crea con `=`: a la izquierda va el nombre y a la derecha el valor.\n\nLos porcentajes se escriben en decimal: 8% es `0.08`. Los operadores son `+`, `-`, `*` (multiplicar) y `/` (dividir).\n\n`print()` muestra un resultado en la consola. Presiona **Ejecutar** para ver qué pasa.',
      codigo:
        'capital = 10000        # dólares en la cuenta\nannual_rate = 0.08     # 8% en decimal\nprofit = capital * annual_rate\nprint("Ganancia del año:", profit)',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-01-e1',
      concepto: 'py.variables',
      lenguaje: 'python',
      enunciado: 'Tu sueldo mensual como analista junior es 2500. Crea la variable `annual_salary` con el sueldo de 12 meses y muéstrala con `print()`.',
      inicial: 'monthly_salary = 2500\n\n# Escribe tu código debajo\n',
      solucion: 'monthly_salary = 2500\nannual_salary = monthly_salary * 12\nprint(annual_salary)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'annual_salary',
        },
        {
          tipo: 'salida',
          modo: 'contiene',
          texto: '30000',
        },
      ],
      pistas: [
        'Un año tiene 12 meses: multiplica el sueldo mensual por 12.',
        'Crea la variable así: annual_salary = monthly_salary * ...  y después usa print(annual_salary).',
        'annual_salary = monthly_salary * 12\nprint(______)',
      ],
      alternativas: ['monthly_salary = 2500\nannual_salary = 12 * monthly_salary\nprint("Sueldo anual:", annual_salary)'],
      incorrectas: [
        'monthly_salary = 2500\nannual_salary = monthly_salary * 12\n',
        'monthly_salary = 2500\nannual_salary = monthly_salary + 12\nprint(annual_salary)',
      ],
    },
    {
      tipo: 'quiz',
      id: 'py-01-q1',
      concepto: 'py.variables',
      pregunta: '¿Qué imprime este código?',
      codigo: 'x = 5\nx = x + 3\nprint(x)',
      opciones: ['5', '8', 'x + 3', 'Error'],
      correcta: 1,
      explicacion: '`x = x + 3` toma el valor actual de x (5), le suma 3 y guarda el resultado otra vez en x.',
    },
    {
      tipo: 'ejercicio',
      id: 'py-01-e2',
      concepto: 'py.aritmetica',
      lenguaje: 'python',
      enunciado:
        'El fondo cobra una comisión de gestión de **1.5% anual**. Un cliente tiene 200000 invertidos. Cambia `fee_rate` a 1.5% en decimal y calcula `management_fee` (la comisión en dólares).',
      inicial: 'assets = 200000\nfee_rate = 0   # cambia 0 por 1.5% en decimal\n\nmanagement_fee = 0\nprint(management_fee)\n',
      solucion: 'assets = 200000\nfee_rate = 0.015\nmanagement_fee = assets * fee_rate\nprint(management_fee)',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'fee_rate',
        },
        {
          tipo: 'variable',
          nombre: 'management_fee',
        },
      ],
      pistas: [
        '1.5% en decimal es 1.5 / 100.',
        'fee_rate = 0.015, y la comisión es assets multiplicado por fee_rate.',
        'fee_rate = 0.015\nmanagement_fee = assets * ________',
      ],
      alternativas: ['assets = 200000\nfee_rate = 1.5 / 100\nmanagement_fee = assets * fee_rate'],
      incorrectas: ['assets = 200000\nfee_rate = 1.5\nmanagement_fee = assets * fee_rate'],
    },
    {
      tipo: 'leccion',
      titulo: 'División entera y resto',
      texto:
        'Para comprar acciones necesitas números enteros. `//` divide y descarta los decimales; `%` (módulo) da lo que sobra.\n\n`17 // 5` es 3 y `17 % 5` es 2.',
      codigo: 'cash = 1000\nprice = 300\nprint(cash // price)   # 3 acciones\nprint(cash % price)    # sobran 100',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-01-e3',
      concepto: 'py.aritmetica',
      lenguaje: 'python',
      enunciado:
        'Tienes 10000 dólares y cada acción de Cóndor Minera (CND) cuesta 44.55. Guarda en `shares` cuántas acciones **enteras** puedes comprar (con `//`) y en `leftover` el dinero que sobra (con `%`).',
      inicial: 'cash = 10000\nprice = 44.55\n',
      solucion: 'cash = 10000\nprice = 44.55\nshares = cash // price\nleftover = cash % price',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'shares',
        },
        {
          tipo: 'variable',
          nombre: 'leftover',
          tol: 0.000001,
        },
      ],
      pistas: ['shares usa // y leftover usa %.', 'shares = cash // price', 'shares = cash // price\nleftover = cash % _____'],
      alternativas: ['cash = 10000\nprice = 44.55\nshares = int(cash / price)\nleftover = cash - shares * price'],
      incorrectas: ['cash = 10000\nprice = 44.55\nshares = cash / price\nleftover = 0'],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'Nada mal para tu primer día. Fíjate: 224 acciones y te sobran unos 20.80 dólares.',
        },
        {
          quien: 'marta',
          texto: 'Mañana viene el interés compuesto. Es la idea más importante de todo el fondo.',
        },
      ],
    },
  ],
};
