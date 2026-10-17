// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-02: La fuerza del interés compuesto

export default {
  id: 'py-02',
  titulo: 'La fuerza del interés compuesto',
  resumen: 'Potencias, round(), f-strings y el módulo math.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '13 min',
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
        'La fórmula del **valor futuro** es `VF = VP × (1 + r)^n`: VP es el valor presente (lo que inviertes hoy), r es la tasa anual en decimal y n son los años.\n\nEn Python la potencia se escribe con dos asteriscos: `(1 + rate) ** years` significa "(1 + rate) elevado a years". Ojo: `^` no es potencia en Python. Con decimales da error y con enteros da otro número (`2 ^ 3` da 1, no 8).\n\nLos paréntesis importan, porque Python calcula la potencia antes que la suma:\n\n- `(1 + rate) ** years` suma primero y después eleva. Es lo correcto.\n- `1 + rate ** years` eleva solo rate y después suma 1. Da otro número.\n\n`round(valor, 2)` devuelve el valor redondeado a 2 decimales: el primer dato es el número y el segundo, cuántos decimales quieres. Puedes guardar el resultado en la misma variable: `future_value = round(future_value, 2)` toma el valor actual, lo redondea y lo guarda otra vez.\n\n`print(future_value)` muestra el valor de la variable en la consola. Lo que quieres ver va **dentro** de los paréntesis; un `print()` vacío solo imprime una línea en blanco.',
      codigo:
        'present_value = 1000   # lo que inviertes hoy\nrate = 0.07            # 7% anual, en decimal\nyears = 5\nfuture_value = present_value * (1 + rate) ** years\nfuture_value = round(future_value, 2)\nprint(future_value)    # 1402.55',
      lenguaje: 'python',
    },
    {
      tipo: 'quiz',
      id: 'py-02-q1',
      concepto: 'py.potencias',
      pregunta: 'Quieres calcular `(1 + rate)` elevado a `years`. ¿Qué línea es correcta en Python?',
      opciones: ['(1 + rate) ^ years', '(1 + rate) ** years', '1 + rate ** years', '(1 + rate) * years'],
      correcta: 1,
      explicacion:
        'La correcta es `(1 + rate) ** years`: la potencia se escribe con dos asteriscos, y los paréntesis hacen que primero se sume 1 + rate.\n\n- `^` es tentador porque en Excel sí es potencia, pero en Python es otra operación: con decimales da error y con enteros da un número equivocado (`2 ^ 3` da 1).\n- Sin paréntesis, Python eleva solo `rate` y después suma 1.\n- Con un solo asterisco `*` multiplicas por years, no elevas.',
    },
    {
      tipo: 'ejercicio',
      id: 'py-02-p1',
      concepto: 'py.potencias',
      lenguaje: 'python',
      enunciado:
        'Práctica guiada. Un depósito de 2000 al 5% anual dura 3 años. Completa los tres huecos `___` para calcular `future_value`, redondearlo a 2 decimales y mostrarlo. La última línea, `print(future_value)`, ya está escrita.',
      inicial:
        'present_value = 2000\nrate = 0.05\nyears = 3\n\n# Completa los huecos ___\nfuture_value = present_value * (1 + ___) ** ___\nfuture_value = round(future_value, ___)\nprint(future_value)\n',
      solucion:
        'present_value = 2000\nrate = 0.05\nyears = 3\n\nfuture_value = present_value * (1 + rate) ** years\nfuture_value = round(future_value, 2)\nprint(future_value)',
      explicacion:
        '`(1 + rate)` es lo que crece tu dinero en un año: 1.05 significa "lo que tenías más un 5%". Elevarlo a `years` con dos asteriscos aplica ese crecimiento 3 veces seguidas: 2000 × 1.05 × 1.05 × 1.05.\n\n`round(future_value, 2)` deja el resultado con 2 decimales, 2315.25, y `print(future_value)` lo muestra.\n\nError típico: escribir 5 en lugar de `rate`. La tasa siempre va en decimal (0.05); por eso se usa la variable `rate`.',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'future_value',
          etiqueta: 'el valor de future_value',
          ayuda:
            'Revisa los tres huecos: el primero es la tasa ya en decimal (la variable rate, no 5), el segundo es el exponente (la variable years) y el tercero es cuántos decimales quieres en round (2).',
        },
        {
          tipo: 'salida',
          modo: 'contiene',
          etiqueta: 'mostrar future_value con print()',
          ayuda: 'Si el valor de future_value ya está bien, revisa la última línea: debe ser print(future_value), con la variable dentro de los paréntesis.',
        },
      ],
      pistas: [
        'Compara con el ejemplo de la lección: la fórmula es la misma, solo cambian los datos.',
        'El primer hueco es la tasa en decimal, el segundo son los años y el tercero es la cantidad de decimales.',
        'future_value = present_value * (1 + rate) ** _____\nfuture_value = round(future_value, _)',
      ],
      alternativas: [
        'present_value = 2000\nrate = 0.05\nyears = 3\nfuture_value = present_value * (1 + 0.05) ** 3\nfuture_value = round(future_value, 2)\nprint(future_value)',
      ],
      incorrectas: [
        {
          codigo:
            'present_value = 2000\nrate = 0.05\nyears = 3\nfuture_value = present_value * (1 + 5) ** years\nfuture_value = round(future_value, 2)\nprint(future_value)',
          retro: ['la variable rate, no 5'],
        },
        {
          codigo:
            'present_value = 2000\nrate = 0.05\nyears = 3\nfuture_value = present_value * (1 + rate) ** years\nfuture_value = round(future_value, 0)\nprint(future_value)',
          retro: ['cuantos decimales'],
        },
        {
          codigo:
            'present_value = 2000\nrate = 0.05\nyears = 3\nfuture_value = present_value * (1 + rate) ** years\nfuture_value = round(future_value, 2)\nprint()',
          retro: ['print(future_value)', 'linea en blanco'],
        },
        {
          codigo:
            'present_value = 2000\nrate = 0.05\nyears = 3\nfuture_value = present_value * (1 + rate) ** years\nfuture_value = round(future_value, ___)\nprint(future_value)',
          retro: ['hueco ___ sin completar'],
        },
        {
          codigo:
            'present_value = 2000\nrate = 0.05\nyears = 3\nfuture_value = present_value * (1 + rate) ^ years\nfuture_value = round(future_value, 2)\nprint(future_value)',
          retro: ['la potencia es **, no ^'],
        },
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'py-02-e1',
      concepto: 'fin.interes_compuesto',
      lenguaje: 'python',
      enunciado:
        'Ahora sin huecos. Un cliente invierte **5000** al **6% anual** durante **10 años**. Calcula el valor futuro y guárdalo en `future_value`, redondeado a 2 decimales con `round()`. Al final, muéstralo con `print(future_value)`.',
      inicial: 'present_value = 5000\nrate = 0.06\nyears = 10\n\n# Escribe tu código debajo\n',
      solucion:
        'present_value = 5000\nrate = 0.06\nyears = 10\n\nfuture_value = present_value * (1 + rate) ** years\nfuture_value = round(future_value, 2)\nprint(future_value)',
      explicacion:
        'Primero se calcula el crecimiento: `(1 + rate)` vale 1.06, y elevarlo a `years` lo aplica 10 años seguidos. Multiplicado por `present_value` da 8954.2384…, y `round(future_value, 2)` lo deja en 8954.24.\n\nDespués, `print(future_value)` muestra ese valor; con un `print()` vacío no verías nada.\n\nErrores típicos: olvidar los paréntesis, porque sin ellos Python eleva solo la tasa, o multiplicar `rate * years`, que es interés simple y da 8000.',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'future_value',
          tol: 0.005,
          etiqueta: 'el valor de future_value',
          ayuda:
            'Revisa la fórmula VF = VP × (1 + r)^n: (1 + rate) va completo entre paréntesis y se eleva a years. Multiplicar rate * years sería interés simple, no compuesto.',
        },
        {
          tipo: 'codigoIncluye',
          patron: '\\*\\*|pow\\(',
          etiqueta: 'usar ** para la potencia',
          mensaje: 'No encontré la potencia ** en tu código.',
          ayuda: 'En Python se eleva con dos asteriscos. El interés compuesto necesita la potencia, no una multiplicación.',
        },
        {
          tipo: 'codigoIncluye',
          patron: 'round\\(',
          etiqueta: 'redondear con round()',
          mensaje: 'No encontré round() en tu código.',
          ayuda: 'Redondea con round(valor, 2): el primer dato es el número y el segundo, la cantidad de decimales.',
        },
        {
          tipo: 'salida',
          modo: 'contiene',
          etiqueta: 'mostrar future_value con print()',
          ayuda: 'Si future_value ya está bien, termina con print(future_value): la variable va dentro de los paréntesis, ya redondeada.',
        },
      ],
      pistas: [
        'Es la misma fórmula que en la práctica: VF = VP × (1 + r)^n, con la potencia escrita como dos asteriscos.',
        'Primero calcula future_value con present_value, rate y years; después redondéalo con round(..., 2) y al final usa print(future_value).',
        'future_value = present_value * (1 + ____) ** _____\nfuture_value = round(future_value, _)\nprint(____________)',
      ],
      alternativas: [
        'present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = round(present_value * (1 + rate) ** years, 2)\nprint(future_value)',
        'present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = present_value * (1 + rate) ** years\nprint(round(future_value, 2))',
        'present_value = 5000\nrate = 0.06\nyears = 10\nfv = present_value * pow(1 + rate, years)\nfuture_value = round(fv, 2)\nprint("Valor futuro:", future_value)',
      ],
      incorrectas: [
        {
          codigo: 'present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = round(present_value * (1 + rate * years), 2)\nprint(future_value)',
          retro: ['interes simple', 'dos asteriscos'],
        },
        {
          codigo: 'present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = round(present_value * 1 + rate ** years, 2)\nprint(future_value)',
          retro: ['entre parentesis'],
        },
        {
          codigo: 'present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = round(present_value * (1 + rate) ^ years, 2)\nprint(future_value)',
          retro: ['la potencia es **, no ^'],
        },
        {
          codigo:
            'present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = present_value * (1 + rate) ** years\nfuture_value = round(future_value, 2)\nprint()',
          retro: ['print(future_value)', 'linea en blanco'],
        },
        {
          codigo: 'present_value = 5000\nrate = 0.06\nyears = 10\nfuture_value = present_value * (1 + rate) ** years\nprint(future_value)',
          retro: ['round(valor, 2)'],
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'f-strings: mostrar números como en un informe',
      texto:
        'Un **f-string** es un texto entre comillas con una `f` pegada delante: `f"..."`. Lo que pongas entre llaves `{}` se reemplaza por su valor. Sin la `f`, Python imprime las llaves tal cual.\n\nDentro de las llaves puedes agregar dos puntos `:` y un formato después de la variable:\n\n- `{value:,.2f}`: la coma agrega el separador de miles y `.2f` deja 2 decimales. 1402.5517 se ve como 1,402.55.\n- `{rate:.1%}`: el `%` multiplica por 100 y agrega el signo, y `.1` deja 1 decimal. 0.07 se ve como 7.0%.\n\nEl número después del punto es la cantidad de decimales: `.0%` da 7%, `.1%` da 7.0% y `.2%` da 7.00%. No multipliques por 100 tú: el `%` del formato ya lo hace.\n\nOjo: en la misión anterior viste que `%` da el resto de una división. En las cuentas sigue siendo así (`17 % 5` da 2). Solo dentro de las llaves de un f-string, después de los dos puntos, `%` significa "muéstralo como porcentaje".\n\nEl `$` que va antes de la llave es texto normal, igual que "Valor futuro:". Prueba el ejemplo: la última línea muestra qué pasa si olvidas la `f`.',
      codigo:
        'value = 1402.5517\nrate = 0.07\nprint(f"Valor futuro: ${value:,.2f}")   # Valor futuro: $1,402.55\nprint(f"Tasa: {rate:.1%}")              # Tasa: 7.0%\nprint("Tasa: {rate:.1%}")               # sin f: Tasa: {rate:.1%}',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-02-p2',
      concepto: 'py.fstrings',
      lenguaje: 'python',
      enunciado:
        'Práctica guiada. Completa cada hueco `___` con la variable, dos puntos y el formato, como en `{value:,.2f}`. El código debe imprimir exactamente estas dos líneas:\n\n`Cartera: $25,890.46`\n`Comisión: 1.5%`\n\nEl monto lleva separador de miles y 2 decimales; la comisión es un porcentaje con 1 decimal.',
      inicial: 'portfolio_value = 25890.456\nfee_rate = 0.015\n\n# En cada hueco: variable:formato\nprint(f"Cartera: ${___}")\nprint(f"Comisión: {___}")\n',
      solucion: 'portfolio_value = 25890.456\nfee_rate = 0.015\n\nprint(f"Cartera: ${portfolio_value:,.2f}")\nprint(f"Comisión: {fee_rate:.1%}")',
      explicacion:
        'Cada hueco sigue la forma `{variable:formato}`. En `{portfolio_value:,.2f}`, la coma agrega el separador de miles y `.2f` redondea a 2 decimales: 25890.456 se muestra como 25,890.46.\n\nEn `{fee_rate:.1%}`, el `%` multiplica 0.015 por 100 y agrega el signo, y `.1` deja un decimal: 1.5%. El `$` antes de la llave es texto normal.\n\nError típico: poner solo `{fee_rate}`, que muestra 0.015 en lugar de 1.5%.',
      verificar: [
        {
          tipo: 'salida',
          modo: 'exacta',
          etiqueta: 'las dos líneas que imprimes',
          ayuda:
            'En cada hueco va la variable, dos puntos y el formato. Para el monto: coma para los miles y .2f para 2 decimales (,.2f). Para la comisión: .1% (el % ya multiplica por 100).',
        },
      ],
      pistas: [
        'Mira el ejemplo de la lección: el formato va dentro de las llaves, después de la variable y de los dos puntos.',
        'Para dinero con miles y 2 decimales se usa ,.2f; para un porcentaje con 1 decimal, .1%.',
        'print(f"Cartera: ${portfolio_value:_____}")\nprint(f"Comisión: {________:.1%}")',
      ],
      alternativas: ['portfolio_value = 25890.456\nfee_rate = 0.015\nprint(f"Cartera: ${portfolio_value:,.2f}")\nprint(f"Comisión: {fee_rate * 100:.1f}%")'],
      incorrectas: [
        {
          codigo: 'portfolio_value = 25890.456\nfee_rate = 0.015\nprint(f"Cartera: ${portfolio_value}")\nprint(f"Comisión: {fee_rate}")',
          retro: [',.2f', '.1%'],
        },
        {
          codigo: 'portfolio_value = 25890.456\nfee_rate = 0.015\nprint(f"Cartera: ${portfolio_value:.2f}")\nprint(f"Comisión: {fee_rate:.1%}")',
          retro: ['coma para los miles'],
        },
        {
          codigo: 'portfolio_value = 25890.456\nfee_rate = 0.015\nprint(f"Cartera: ${portfolio_value:,.2f}")\nprint(f"Comisión: {fee_rate:.1f}")',
          retro: ['el % ya multiplica por 100'],
        },
        {
          codigo: 'portfolio_value = 25890.456\nfee_rate = 0.015\nprint(f"Cartera: ${portfolio_value:,.2f}")\nprint(f"Comisión: {___}")',
          retro: ['hueco ___ sin completar'],
        },
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'py-02-e2',
      concepto: 'py.fstrings',
      lenguaje: 'python',
      enunciado:
        'Ahora sin huecos. Usa la variable `annual_return` dentro de un f-string para imprimir exactamente:\n\n`Rendimiento anual: 12.50%`\n\nEs un porcentaje con **2 decimales**.',
      inicial: 'annual_return = 0.125\n\n# Escribe tu print debajo\n',
      solucion: 'annual_return = 0.125\n\nprint(f"Rendimiento anual: {annual_return:.2%}")',
      explicacion:
        'La `f` pegada a las comillas hace que Python reemplace lo que va entre llaves. En `{annual_return:.2%}`, el `%` multiplica 0.125 por 100 y agrega el signo, y `.2` deja dos decimales: 12.50%. Por eso no hace falta multiplicar por 100 a mano.\n\nSi te faltaba la `f`, verías las llaves impresas tal cual. Si usabas `.1%`, saldría 12.5% y no 12.50%.',
      verificar: [
        {
          tipo: 'salida',
          modo: 'exacta',
          etiqueta: 'lo que imprimes (exactamente «Rendimiento anual: 12.50%»)',
          ayuda:
            'Dentro de las llaves va la variable, dos puntos y el formato de porcentaje. En ese formato, el número después del punto indica los decimales (aquí, 2) y el % ya multiplica por 100: no multipliques tú.',
        },
        {
          tipo: 'codigoIncluye',
          patron: '[fF]["\']',
          etiqueta: 'usar un f-string',
          mensaje: 'No encontré un f-string (un texto con f delante de las comillas).',
          ayuda: 'Escribe la f pegada antes de las comillas: print(f"..."). Sin la f, Python imprime las llaves tal cual.',
        },
        {
          tipo: 'codigoIncluye',
          patron: '\\{\\s*annual_return',
          etiqueta: 'poner annual_return entre llaves',
          mensaje: 'No encontré {annual_return} dentro del texto.',
          ayuda: 'Escribe la variable entre llaves para que Python ponga su valor; no copies el 12.50% a mano.',
        },
      ],
      pistas: [
        'Es como el formato de porcentaje `{rate:.1%}` de la lección, pero con 2 decimales.',
        'La estructura es print(f"Rendimiento anual: {variable:formato}"): la variable es annual_return y el formato es de porcentaje.',
        'print(f"Rendimiento anual: {annual_return:.__}")',
      ],
      alternativas: [
        "annual_return = 0.125\nprint(f'Rendimiento anual: {annual_return:.2%}')",
        'annual_return = 0.125\nprint(f"Rendimiento anual: {annual_return * 100:.2f}%")',
        'annual_return = 0.125\ntext = f"Rendimiento anual: {annual_return:.2%}"\nprint(text)',
      ],
      incorrectas: [
        {
          codigo: 'annual_return = 0.125\nprint(f"Rendimiento anual: {annual_return}")',
          retro: ['formato de porcentaje', 'los decimales (aqui, 2)'],
        },
        {
          codigo: 'annual_return = 0.125\nprint("Rendimiento anual: {annual_return:.2%}")',
          retro: ['f pegada antes de las comillas'],
        },
        {
          codigo: 'annual_return = 0.125\nprint(f"Rendimiento anual: {annual_return:.1%}")',
          retro: ['los decimales (aqui, 2)'],
        },
        {
          codigo: 'annual_return = 0.125\nprint(f"Rendimiento anual: {annual_return * 100}%")',
          retro: ['no multipliques tu'],
        },
        {
          codigo: 'annual_return = 0.125\nprint(f"Rendimiento anual: 12.50%")',
          retro: ['entre llaves'],
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'La regla del 72 y el módulo math',
      texto:
        'La **regla del 72** estima en cuántos años se duplica una inversión: divide 72 entre la tasa **en porcentaje** (8, no 0.08). Al 8% anual, `72 / 8` da 9 años, más o menos.\n\nLa cuenta exacta usa logaritmos: `años = ln(2) / ln(1 + r)`, con r en decimal. El 2 representa "duplicar" y `1 + r` es lo que crece el dinero cada año.\n\nPython guarda funciones extra en **módulos**. `import math`, al inicio del código, carga el módulo de matemáticas. Sus funciones se usan con el prefijo `math.` delante:\n\n- `math.log(x)` es el logaritmo natural: el ln de la fórmula.\n- `math.sqrt(x)` es la raíz cuadrada.\n\nSi escribes `log(2)` sin `math.`, Python no la encuentra y da NameError.\n\nPara ver varios valores en una misma línea, sepáralos con comas dentro de print: `print(a, b)`.',
      codigo:
        'import math\n\nrate = 0.08                                # 8% anual\nprint(72 / 8)                              # regla del 72: 9.0 años\nprint(math.log(2) / math.log(1 + rate))    # exacto: 9.006... años\nprint(math.log(2), math.sqrt(16))          # 0.693... 4.0',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-02-e3',
      concepto: 'py.import',
      lenguaje: 'python',
      enunciado:
        'La tasa ahora es **9% anual** (`rate = 0.09`). Calcula dos variables:\n\n- `rule_of_72`: la estimación de la regla del 72 (72 dividido entre 9).\n- `exact_years`: los años exactos con la fórmula `ln(2) / ln(1 + r)`, usando `math.log()`.\n\nSe revisan las dos variables. Si quieres verlas, usa `print(rule_of_72, exact_years)`.',
      inicial: 'import math\n\nrate = 0.09\n\n# Escribe tu código debajo\n',
      solucion: 'import math\n\nrate = 0.09\nrule_of_72 = 72 / 9\nexact_years = math.log(2) / math.log(1 + rate)\nprint(rule_of_72, exact_years)',
      explicacion:
        '`rule_of_72 = 72 / 9` da 8.0, porque la regla usa la tasa en porcentaje.\n\nPara la cuenta exacta, `math.log` es el logaritmo natural (ln) del módulo `math`, que ya está importado en la primera línea. `math.log(2) / math.log(1 + rate)` da 8.0432…: casi lo mismo que la regla.\n\nError típico: escribir `math.log(rate)` sin el 1 +, que da un número negativo. Dentro del logaritmo va lo que crece el dinero en un año (1.09), no solo la tasa.',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'rule_of_72',
          etiqueta: 'el valor de rule_of_72',
          ayuda: 'La regla del 72 divide 72 entre la tasa en porcentaje: 9, no 0.09. Si prefieres usar rate, conviértela: rate * 100.',
        },
        {
          tipo: 'variable',
          nombre: 'exact_years',
          tol: 0.000001,
          etiqueta: 'el valor de exact_years',
          ayuda:
            'El numerador es math.log(2). En el denominador va el logaritmo de 1 + rate, con la tasa en decimal: el 1 + representa lo que tenías más lo que ganas en un año.',
        },
      ],
      pistas: [
        'La regla del 72 usa la tasa en porcentaje (9); la fórmula exacta usa la tasa en decimal (rate).',
        'Escribe dos líneas: rule_of_72 = 72 / ... y exact_years = math.log(...) / math.log(...).',
        'rule_of_72 = 72 / _\nexact_years = math.log(_) / math.log(1 + ____)',
      ],
      alternativas: [
        'import math\nrate = 0.09\nrule_of_72 = 72 / (rate * 100)\nexact_years = math.log(2) / math.log(1 + rate)',
        'import math\nrate = 0.09\nrule_of_72 = 72 / 9\nexact_years = math.log(2) / math.log(1.09)\nprint("Regla del 72:", rule_of_72)\nprint("Exacto:", exact_years)',
      ],
      incorrectas: [
        {
          codigo: 'import math\n\nrate = 0.09\nrule_of_72 = 72 / rate\nexact_years = math.log(2) / math.log(1 + rate)',
          retro: ['tasa en porcentaje', 'rate * 100'],
        },
        {
          codigo: 'import math\n\nrate = 0.09\nrule_of_72 = 72 / 9\nexact_years = math.log(2) / math.log(rate)',
          retro: ['1 + rate'],
        },
        {
          codigo: 'import math\n\nrate = 0.09\nrule_of_72 = 72 / 9\nexact_years = math.log(2) / math.log(1 + 9)',
          retro: ['tasa en decimal'],
        },
        'import math\n\nrate = 0.09\nrule_of_72 = 72 / 9\nexact_years = log(2) / log(1 + rate)',
      ],
    },
    {
      tipo: 'jefeDia',
      id: 'py-02-jefe',
      jefe: {
        nombre: 'Gonzalo Vega',
        sprite: 'vega',
        provocacion: 'Un cliente quiere saber cuánto tendrá en 10 años. Yo le digo "mucho". ¿Tú puedes darle un número bien presentado?',
        derrota: '26,862.72 con separador de miles. Está bien, eso se ve mejor que "mucho".',
      },
      paso: {
        tipo: 'ejercicio',
        id: 'py-02-jefe-e1',
        concepto: 'fin.interes_compuesto',
        lenguaje: 'python',
        enunciado:
          'Un cliente deposita `capital = 15000` al `rate = 0.06` anual durante `years = 10`. Calcula:\n\n- `future_value`: el valor futuro con interés compuesto;\n- `rule_72`: los años para duplicar según la regla del 72 (72 entre la tasa **en porcentaje**).\n\nImprime exactamente: `Valor futuro: $26,862.72` (con un f-string y el formato `,.2f`).',
        inicial: 'capital = 15000\nrate = 0.06\nyears = 10\n',
        solucion:
          'capital = 15000\nrate = 0.06\nyears = 10\nfuture_value = capital * (1 + rate) ** years\nrule_72 = 72 / 6\nprint(f"Valor futuro: ${future_value:,.2f}")',
        verificar: [
          {
            tipo: 'variable',
            nombre: 'future_value',
            ayuda: 'Interés compuesto: capital * (1 + rate) ** years. La potencia en Python es **.',
          },
          {
            tipo: 'variable',
            nombre: 'rule_72',
            ayuda: 'La regla del 72 usa la tasa en porcentaje: 72 / 6, no 72 / 0.06.',
          },
          {
            tipo: 'salida',
            modo: 'exacta',
            etiqueta: 'imprimir el valor futuro con formato',
            ayuda:
              'Usa un f-string: la f va antes de las comillas y, dentro de las llaves, la variable con su formato: {future_value:,.2f}. El $ va antes de las llaves.',
          },
        ],
        explicacion:
          '`capital * (1 + rate) ** years` calcula 15000 × 1.06¹⁰ ≈ 26862.72: Python hace primero la potencia y después la multiplicación. La regla del 72 usa la tasa en porcentaje: `72 / 6` = 12 años, más o menos.\n\nEn el f-string, `{future_value:,.2f}` agrega separadores de miles y deja 2 decimales. El error típico es olvidar la `f` antes de las comillas: entonces se imprime el texto de las llaves tal cual.',
        pistas: [
          'Primero el valor futuro con la fórmula de interés compuesto; después la regla del 72; al final el print con f-string.',
          'future_value = capital * (1 + rate) ** years  ·  rule_72 = 72 / 6',
          'print(f"Valor futuro: ${____________:,.2f}")',
        ],
        alternativas: [
          'capital = 15000\nrate = 0.06\nyears = 10\nfuture_value = capital * (1 + rate) ** years\nrule_72 = 72 / (rate * 100)\nprint(f"Valor futuro: ${future_value:,.2f}")',
        ],
        incorrectas: [
          {
            codigo:
              'capital = 15000\nrate = 0.06\nyears = 10\nfuture_value = capital * (1 + rate) ^ years\nrule_72 = 72 / 6\nprint(f"Valor futuro: ${future_value:,.2f}")',
            retro: 'la potencia es **',
          },
          {
            codigo:
              'capital = 15000\nrate = 0.06\nyears = 10\nfuture_value = capital * (1 + rate) ** years\nrule_72 = 72 / rate\nprint(f"Valor futuro: ${future_value:,.2f}")',
            retro: 'no 72 / 0.06',
          },
          {
            codigo:
              'capital = 15000\nrate = 0.06\nyears = 10\nfuture_value = capital * (1 + rate) ** years\nrule_72 = 72 / 6\nprint("Valor futuro: ${future_value:,.2f}")',
            retro: 'la f va antes de las comillas',
          },
        ],
      },
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'marta',
          texto: 'La regla del 72 se equivoca por poco: 8 años contra 8.04. Para conversar con un cliente basta. Para un informe, usa la fórmula exacta.',
        },
        {
          quien: 'marta',
          texto: 'Hoy usaste potencias, round(), f-strings y el módulo math. Con eso ya puedes armar la proyección de cualquier cliente.',
        },
      ],
    },
  ],
};
