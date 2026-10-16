// Capítulo 1 — Pista de Python (fundamentos con contexto financiero).
// Convención: explicaciones en español; código e identificadores en inglés,
// como se usan en el trabajo.

export const MISIONES_PYTHON = [
  // ------------------------------------------------------------------ py-01
  {
    id: 'py-01',
    titulo: 'Primer día en la terminal',
    resumen: 'Variables, operaciones y print(): tu sueldo y la comisión del fondo.',
    pista: 'python',
    lenguaje: 'python',
    duracion: '6 min',
    requiere: [],
    nivelDiagnostico: 1,
    conceptos: ['py.variables', 'py.aritmetica'],
    recompensa: { capital: 1200, xp: 60 },
    pasos: [
      {
        tipo: 'dialogo',
        lineas: [
          {
            quien: 'aurelio',
            texto: 'Así que tú eres {nombre}. Fundé Cóndor Capital hace 30 años con una calculadora y mucha terquedad. Hoy el fondo funciona con código.',
          },
          { quien: 'marta', texto: 'Soy Marta Ríos, gestora de portafolios. Vas a trabajar en mi equipo. Aquí todo empieza en la terminal.' },
          { quien: 'marta', texto: 'Regla de la casa: nadie nace sabiendo. Si tu código falla, lo arreglamos. Equivocarte no te quita nada.' },
        ],
      },
      {
        tipo: 'leccion',
        titulo: 'Variables y print()',
        texto:
          'Una **variable** es una etiqueta para un dato. Se crea con `=`: a la izquierda va el nombre y a la derecha el valor.\n\n' +
          'Los porcentajes se escriben en decimal: 8% es `0.08`. Los operadores son `+`, `-`, `*` (multiplicar) y `/` (dividir).\n\n' +
          '`print()` muestra un resultado en la consola. Presiona **Ejecutar** para ver qué pasa.',
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
          { tipo: 'variable', nombre: 'annual_salary' },
          { tipo: 'salida', modo: 'contiene', texto: '30000' },
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
          { tipo: 'variable', nombre: 'fee_rate' },
          { tipo: 'variable', nombre: 'management_fee' },
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
          'Para comprar acciones necesitas números enteros. `//` divide y descarta los decimales; `%` (módulo) da lo que sobra.\n\n' +
          '`17 // 5` es 3 y `17 % 5` es 2.',
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
          { tipo: 'variable', nombre: 'shares' },
          { tipo: 'variable', nombre: 'leftover', tol: 1e-6 },
        ],
        pistas: ['shares usa // y leftover usa %.', 'shares = cash // price', 'shares = cash // price\nleftover = cash % _____'],
        alternativas: ['cash = 10000\nprice = 44.55\nshares = int(cash / price)\nleftover = cash - shares * price'],
        incorrectas: ['cash = 10000\nprice = 44.55\nshares = cash / price\nleftover = 0'],
      },
      {
        tipo: 'dialogo',
        lineas: [
          { quien: 'marta', texto: 'Nada mal para tu primer día. Fíjate: 224 acciones y te sobran unos 20.80 dólares.' },
          { quien: 'marta', texto: 'Mañana viene el interés compuesto. Es la idea más importante de todo el fondo.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ py-02
  {
    id: 'py-02',
    titulo: 'La fuerza del interés compuesto',
    resumen: 'Potencias, round(), f-strings y el módulo math.',
    pista: 'python',
    lenguaje: 'python',
    duracion: '8 min',
    requiere: ['py-01'],
    nivelDiagnostico: 2,
    conceptos: ['py.potencias', 'py.fstrings', 'py.import', 'fin.interes_compuesto', 'fin.regla72'],
    recompensa: { capital: 1500, xp: 70 },
    pasos: [
      {
        tipo: 'dialogo',
        lineas: [
          { quien: 'marta', texto: 'Un cliente quiere saber cuánto tendrá si deja su dinero 10 años. Para eso usamos el interés compuesto.' },
          { quien: 'marta', texto: 'Cada año ganas intereses sobre tu dinero y también sobre los intereses que ya ganaste.' },
        ],
      },
      {
        tipo: 'leccion',
        titulo: 'Interés compuesto en Python',
        texto:
          'La fórmula del **valor futuro** es `VF = VP × (1 + r)^n`, donde VP es el valor presente, r la tasa y n los años.\n\n' +
          'En Python la potencia se escribe con `**` (dos asteriscos). `round(x, 2)` redondea a 2 decimales.',
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
          { tipo: 'variable', nombre: 'future_value', tol: 0.005 },
          { tipo: 'codigoIncluye', patron: '\\*\\*|pow\\(', mensaje: 'Usa ** para elevar (1 + rate) a years.' },
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
          'Un **f-string** es un texto con `f` delante, donde lo que va entre llaves `{}` se reemplaza por su valor.\n\n' +
          'Después de `:` va el formato: `,.2f` agrega separador de miles y 2 decimales; `.1%` muestra un porcentaje con 1 decimal.',
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
          { tipo: 'salida', modo: 'exacta' },
          { tipo: 'codigoIncluye', patron: 'f"|f\'', mensaje: 'Usa un f-string (texto con f delante).' },
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
          'La **regla del 72** estima en cuántos años se duplica una inversión: `72 / tasa en %`. Al 9%, unos 8 años.\n\n' +
          'La cuenta exacta usa logaritmos: `años = ln(2) / ln(1 + r)`. Para eso se importa el módulo `math` con `import math` y se usa `math.log()`.',
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
          { tipo: 'variable', nombre: 'rule_of_72' },
          { tipo: 'variable', nombre: 'exact_years', tol: 1e-6 },
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
  },

  // ------------------------------------------------------------------ py-03
  {
    id: 'py-03',
    titulo: 'Las tasas de la crisis de 2008',
    resumen: 'Listas, índices, slicing, len, sum, max y min con datos reales de FRED.',
    pista: 'python',
    lenguaje: 'python',
    duracion: '7 min',
    requiere: ['py-02'],
    nivelDiagnostico: 3,
    conceptos: ['py.listas', 'py.slicing'],
    recompensa: { capital: 1500, xp: 70 },
    pasos: [
      {
        tipo: 'dialogo',
        lineas: [
          {
            quien: 'bruno',
            texto: '¿Tú eres {nombre}? Soy Bruno, analista senior. Te dejé un regalo: las tasas de las Letras del Tesoro de EE. UU. durante la crisis de 2008.',
          },
          { quien: 'bruno', texto: 'Son datos reales, de FRED (Reserva Federal de St. Louis). Veamos qué tan rápido te mueves con listas.' },
        ],
      },
      {
        tipo: 'leccion',
        titulo: 'Listas',
        texto:
          'Una **lista** guarda varios valores en orden: `[a, b, c]`. Las posiciones empiezan en **0**: `lista[0]` es el primero y `lista[-1]` el último.\n\n' +
          '`len()` cuenta elementos; `sum()`, `max()` y `min()` hacen lo que dicen. `.append(x)` agrega al final.\n\n' +
          'Con **slicing** tomas un tramo: `lista[1:3]` toma las posiciones 1 y 2 (la 3 no se incluye).',
        codigo:
          'prices = [44.55, 48.11, 51.2, 54.48]\nprint(prices[0])      # 44.55\nprint(prices[-1])     # 54.48\nprint(len(prices))    # 4\nprint(prices[1:3])    # [48.11, 51.2]\nprices.append(54.63)\nprint(prices)',
        lenguaje: 'python',
      },
      {
        tipo: 'quiz',
        id: 'py-03-q1',
        concepto: 'py.listas',
        pregunta: '¿Qué imprime este código?',
        codigo: 'rates = [3.01, 1.56, 1.74]\nprint(rates[1])',
        opciones: ['3.01', '1.56', '1.74', 'Error'],
        correcta: 1,
        explicacion: 'Los índices empiezan en 0: rates[0] es 3.01 y rates[1] es 1.56.',
      },
      {
        tipo: 'ejercicio',
        id: 'py-03-e1',
        concepto: 'py.listas',
        lenguaje: 'python',
        enunciado:
          '`tbill_rates` tiene la tasa promedio de las Letras del Tesoro a 3 meses (en %) por trimestre, desde el 4.º trimestre de 2007 hasta el 3.º de 2009. Calcula `average_rate` (el promedio), `max_rate` y `min_rate`.',
        inicial: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\n',
        solucion:
          'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\naverage_rate = sum(tbill_rates) / len(tbill_rates)\nmax_rate = max(tbill_rates)\nmin_rate = min(tbill_rates)\nprint(average_rate, max_rate, min_rate)',
        verificar: [
          { tipo: 'variable', nombre: 'average_rate' },
          { tipo: 'variable', nombre: 'max_rate' },
          { tipo: 'variable', nombre: 'min_rate' },
        ],
        pistas: [
          'El promedio es la suma dividida entre la cantidad.',
          'average_rate = sum(tbill_rates) / len(tbill_rates)',
          'max_rate = max(tbill_rates)\nmin_rate = ___(tbill_rates)',
        ],
        incorrectas: [
          'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\naverage_rate = sum(tbill_rates) / 7\nmax_rate = max(tbill_rates)\nmin_rate = min(tbill_rates)',
        ],
      },
      {
        tipo: 'ejercicio',
        id: 'py-03-e2',
        concepto: 'py.listas',
        lenguaje: 'python',
        enunciado:
          'Calcula `rate_drop`: cuánto bajó la tasa entre el **primer** y el **último** trimestre (primero menos último). Usa índices; no escribas los números a mano.',
        inicial: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\n',
        solucion: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrate_drop = tbill_rates[0] - tbill_rates[-1]\nprint(rate_drop)',
        verificar: [
          { tipo: 'variable', nombre: 'rate_drop' },
          { tipo: 'codigoIncluye', patron: 'tbill_rates\\[', mensaje: 'Usa índices, por ejemplo tbill_rates[0].' },
        ],
        pistas: ['El primero es tbill_rates[0]. ¿Y el último?', 'El último es tbill_rates[-1].', 'rate_drop = tbill_rates[0] - tbill_rates[__]'],
        alternativas: ['tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrate_drop = tbill_rates[0] - tbill_rates[len(tbill_rates) - 1]'],
      },
      {
        tipo: 'ejercicio',
        id: 'py-03-e3',
        concepto: 'py.slicing',
        lenguaje: 'python',
        enunciado: 'Los 4 trimestres de 2008 están en las posiciones 1 a 4. Crea `rates_2008` con esos 4 valores usando slicing y `avg_2008` con su promedio.',
        inicial: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\n',
        solucion:
          'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrates_2008 = tbill_rates[1:5]\navg_2008 = sum(rates_2008) / len(rates_2008)\nprint(rates_2008, avg_2008)',
        verificar: [
          { tipo: 'variable', nombre: 'rates_2008' },
          { tipo: 'variable', nombre: 'avg_2008' },
          { tipo: 'codigoIncluye', patron: '\\[\\s*\\d*\\s*:\\s*-?\\d*\\s*\\]', mensaje: 'Usa slicing: tbill_rates[inicio:fin].' },
        ],
        pistas: [
          'El final de un slice no se incluye: para llegar a la posición 4 escribe 5.',
          'rates_2008 = tbill_rates[1:5]',
          'avg_2008 = sum(rates_2008) / ___(rates_2008)',
        ],
        incorrectas: [
          'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrates_2008 = tbill_rates[1:4]\navg_2008 = sum(rates_2008) / len(rates_2008)',
        ],
      },
      {
        tipo: 'dialogo',
        lineas: [
          { quien: 'bruno', texto: 'La tasa pasó de 3% a casi 0% en un año: así respondió la Reserva Federal a la crisis. Los datos cuentan historias.' },
          { quien: 'bruno', texto: 'Nada mal para alguien que recién llega. Te espero en SQL.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ py-04
  {
    id: 'py-04',
    titulo: 'Retornos de IBM',
    resumen: 'Bucles for, range() y el patrón acumulador con datos reales (Grunfeld).',
    pista: 'python',
    lenguaje: 'python',
    duracion: '9 min',
    requiere: ['py-03'],
    nivelDiagnostico: 4,
    conceptos: ['py.for', 'fin.retornos', 'fin.cagr'],
    recompensa: { capital: 1800, xp: 80 },
    pasos: [
      {
        tipo: 'dialogo',
        lineas: [
          { quien: 'marta', texto: 'Los precios solos dicen poco. Lo que importa es el retorno: cuánto ganaste en proporción a lo que pusiste.' },
          { quien: 'marta', texto: 'Hoy trabajas con el valor de mercado de IBM entre 1947 y 1954. Son datos históricos reales.' },
        ],
      },
      {
        tipo: 'leccion',
        titulo: 'Bucles for',
        texto:
          'Un bucle `for` repite un bloque por cada elemento. El bloque va con **4 espacios** de sangría.\n\n' +
          '`range(1, n)` produce 1, 2, …, n−1. Sirve para recorrer posiciones y comparar cada precio con el anterior.\n\n' +
          'El **retorno simple** es `precio_hoy / precio_ayer − 1`.',
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
          { tipo: 'variable', nombre: 'growth' },
          { tipo: 'codigoIncluye', patron: '\\bfor\\b', mensaje: 'Usa un bucle for.' },
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
          'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = []\nfor i in range(1, len(ibm_value)):\n    growth.append(ibm_value[i] - ibm_value[i - 1])',
        ],
      },
      {
        tipo: 'leccion',
        titulo: 'El patrón acumulador',
        texto:
          'Para combinar valores en un bucle, empiezas con un acumulador y lo actualizas en cada vuelta.\n\n' +
          'Los retornos **se multiplican**: crecer 10% y luego 20% es `1.10 × 1.20 = 1.32`, o sea +32%, no +30%.',
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
          { tipo: 'variable', nombre: 'total_growth', tol: { rel: 1e-9, abs: 1e-9 } },
          { tipo: 'codigoIncluye', patron: '^\\s*for\\b', mensaje: 'Usa un bucle for para acumular.' },
        ],
        pistas: [
          'Dentro del bucle: factor = factor * (1 + g)',
          'Al terminar el bucle: total_growth = factor - 1',
          'for g in growth:\n    factor = factor * (1 + _)\ntotal_growth = factor - _',
        ],
      },
      {
        tipo: 'leccion',
        titulo: 'Promedio vs. CAGR',
        texto:
          'El promedio simple de los retornos **exagera** el crecimiento cuando hay volatilidad. La medida honesta es el **CAGR** (tasa de crecimiento anual compuesta):\n\n' +
          '`CAGR = (valor_final / valor_inicial) ** (1 / años) − 1`',
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
          { tipo: 'variable', nombre: 'average_growth' },
          { tipo: 'variable', nombre: 'cagr', tol: { rel: 1e-9, abs: 1e-9 } },
        ],
        pistas: [
          'average_growth = sum(growth) / len(growth)',
          'cagr = (ibm_value[-1] / ibm_value[0]) ** (1 / 7) - 1',
          'cagr = (ibm_value[__] / ibm_value[0]) ** (1 / _) - 1',
        ],
        alternativas: [
          'ibm_value = [407.4, 409.2, 482.2, 673.8, 676.9, 702.0, 793.5, 927.3]\ngrowth = [ibm_value[i] / ibm_value[i - 1] - 1 for i in range(1, len(ibm_value))]\naverage_growth = sum(growth) / len(growth)\ncagr = (ibm_value[-1] / ibm_value[0]) ** (1 / len(growth)) - 1',
        ],
      },
      {
        tipo: 'dialogo',
        lineas: [
          { quien: 'marta', texto: 'Promedio simple: 13.2% anual. CAGR: 12.5%. La diferencia parece chica, pero en 30 años es enorme.' },
          { quien: 'marta', texto: 'Cuando alguien te venda un fondo con su "retorno promedio", pregúntale por el CAGR.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ py-05
  {
    id: 'py-05',
    titulo: 'Reglas de riesgo',
    resumen: 'if / elif / else, comparaciones y break: clasificar deudores y un stop-loss.',
    pista: 'python',
    lenguaje: 'python',
    duracion: '8 min',
    requiere: ['py-04'],
    nivelDiagnostico: 5,
    conceptos: ['py.condicionales', 'fin.riesgo_credito', 'fin.stop_loss'],
    recompensa: { capital: 1800, xp: 80 },
    pasos: [
      {
        tipo: 'dialogo',
        lineas: [
          { quien: 'marta', texto: 'El comité de crédito clasifica a las empresas según su endeudamiento: deuda dividida entre activos.' },
          { quien: 'marta', texto: 'Hoy lo hace a mano en una hoja de cálculo. Vamos a automatizar la regla.' },
        ],
      },
      {
        tipo: 'leccion',
        titulo: 'if, elif, else',
        texto:
          '`if` ejecuta un bloque solo si la condición es verdadera. `elif` prueba otra condición si la anterior falló, y `else` atrapa todo lo demás. Solo se ejecuta **la primera** rama verdadera.\n\n' +
          'Comparaciones: `==` (igual), `!=` (distinto), `<`, `<=`, `>`, `>=`. Se combinan con `and` y `or`.',
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
          { tipo: 'variable', nombre: 'risk_levels' },
          { tipo: 'codigoIncluye', patron: '\\bif\\b', mensaje: 'Usa if / elif / else.' },
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
          'Un **stop-loss** es una regla para limitar pérdidas: vender si el precio cae cierto porcentaje desde la compra.\n\n' +
          '`break` corta un bucle apenas encuentras lo que buscabas.',
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
          { tipo: 'variable', nombre: 'stop_price', tol: 1e-6 },
          { tipo: 'variable', nombre: 'sell_month' },
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
  },

  // ------------------------------------------------------------------ py-06
  {
    id: 'py-06',
    titulo: 'Tu caja de herramientas financieras',
    resumen: 'Funciones con def y return: valor presente, cuota de préstamo e interés simple.',
    pista: 'python',
    lenguaje: 'python',
    duracion: '10 min',
    requiere: ['py-05'],
    nivelDiagnostico: 6,
    conceptos: ['py.funciones', 'fin.valor_presente', 'fin.anualidades'],
    recompensa: { capital: 2200, xp: 90 },
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
          'Una **función** empaqueta un cálculo. Se define con `def nombre(parámetros):` y devuelve el resultado con `return`.\n\n' +
          'Los parámetros pueden tener **valor por defecto**: `def fee(amount, rate=0.01)` usa 0.01 si no le pasas rate.',
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
            tol: { rel: 1e-9, abs: 1e-9 },
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
          'En un préstamo de cuota fija (sistema francés, el más usado en hipotecas y créditos de consumo), la cuota mensual es:\n\n' +
          '`cuota = P × r / (1 − (1 + r) ** −n)`\n\n' +
          'donde P es el monto prestado, r la tasa **mensual** y n el número de meses. Si r es 0, la fórmula divide entre cero: en ese caso la cuota es simplemente `P / n`.',
        codigo: 'P, r, n = 10000, 0.01, 12\npayment = P * r / (1 - (1 + r) ** -n)\nprint(round(payment, 2))   # 888.49',
        lenguaje: 'python',
      },
      {
        tipo: 'ejercicio',
        id: 'py-06-e2',
        concepto: 'fin.anualidades',
        lenguaje: 'python',
        enunciado:
          'Define `loan_payment(principal, monthly_rate, months)` que devuelva la cuota mensual. Si `monthly_rate` es 0, devuelve `principal / months`.',
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
            tol: { rel: 1e-9, abs: 1e-9 },
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
        enunciado:
          'Define `simple_interest(capital, rate, years=1)` que devuelva `capital * rate * years`. El parámetro `years` debe valer 1 si no se lo pasan.',
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
  },

  // ------------------------------------------------------------------ py-07
  {
    id: 'py-07',
    titulo: 'Tu primera cartera modelo',
    resumen: 'Diccionarios: valor de la cartera, pesos y retorno esperado.',
    pista: 'python',
    lenguaje: 'python',
    duracion: '9 min',
    requiere: ['py-06'],
    nivelDiagnostico: 7,
    conceptos: ['py.diccionarios', 'fin.portafolio'],
    recompensa: { capital: 2200, xp: 90 },
    pasos: [
      {
        tipo: 'dialogo',
        lineas: [
          { quien: 'marta', texto: 'Te asigno tu primera cartera modelo. Cuatro activos, precios de cierre de diciembre.' },
          { quien: 'marta', texto: 'Para guardar "ticker → cantidad" se usa un diccionario.' },
        ],
      },
      {
        tipo: 'leccion',
        titulo: 'Diccionarios',
        texto:
          'Un **diccionario** asocia claves con valores: `{"CND": 100}`. Se consulta con `d["CND"]` y se agrega con `d["QTZ"] = 20`.\n\n' +
          'Si la clave no existe, `d["XYZ"]` da error; `d.get("XYZ", 0)` devuelve 0. Con `for k, v in d.items():` recorres pares clave-valor.',
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
        verificar: [{ tipo: 'variable', nombre: 'portfolio_value', tol: 1e-6 }],
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
        verificar: [{ tipo: 'variable', nombre: 'weights', tol: 1e-9 }],
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
        verificar: [{ tipo: 'variable', nombre: 'portfolio_return', tol: 1e-9 }],
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
          { quien: 'marta', texto: '10.3% esperado. Ojo con la palabra "esperado": es un promedio de escenarios, no una promesa.' },
          { quien: 'marta', texto: 'Ya piensas como gestor: pesos y retornos. Lo que falta es medir el riesgo. Eso viene en el capítulo 2.' },
        ],
      },
    ],
  },
];
