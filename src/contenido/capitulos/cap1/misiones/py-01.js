// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-01: Primer día en la terminal

export default {
  id: 'py-01',
  titulo: 'Primer día en la terminal',
  resumen: 'Variables, operaciones, porcentajes y print(): tu sueldo, la comisión del fondo y tu primera compra de acciones.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '12 min',
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
          texto: 'Regla de la casa: nadie nace sabiendo. Si tu código falla, lo arreglamos. Equivocarte nunca te quita lo que ya ganaste: solo te pide practicar un poco más.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Variables y print()',
      texto:
        'Una **variable** es una etiqueta para un dato. Se crea con `=`: a la izquierda va el nombre y a la derecha el valor o la cuenta. Ese `=` no es una igualdad de matemáticas: significa "calcula lo de la derecha y guárdalo con este nombre".\n\nPython lee de arriba hacia abajo: primero creas la variable y después la usas. El nombre se escribe siempre igual (`profit` y `Profit` son distintas); usamos minúsculas y `_` en vez de espacios.\n\nLos operadores son `+` (sumar), `-` (restar), `*` (multiplicar) y `/` (dividir). Lo que va después de `#` es un **comentario**: una nota para personas que Python ignora.\n\nCrear una variable no la muestra. Para verla usas `print()`, que muestra en la consola lo que pongas **dentro de los paréntesis**:\n\n- `print(profit)` muestra el valor de la variable: 800.0\n- `print("profit")`, con comillas, muestra la palabra profit tal cual, no su valor.\n- `print()` vacío no muestra nada: solo imprime una línea en blanco.\n- `print("Ganancia del año:", profit)` muestra varias cosas separadas por un espacio.\n\nSale 800.0 y no 800 porque al multiplicar por un número con decimales el resultado también lleva decimales. Presiona **Ejecutar** para verlo.',
      codigo:
        'capital = 10000        # dólares en la cuenta\nannual_rate = 0.08     # 8% en decimal\nprofit = capital * annual_rate\nprint(profit)                        # muestra 800.0\nprint("Ganancia del año:", profit)   # muestra: Ganancia del año: 800.0',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-01-p1',
      concepto: 'py.variables',
      lenguaje: 'python',
      enunciado:
        'Práctica guiada. Compras 4 acciones a 50 dólares cada una. Completa los huecos `___`: en la línea de `total_cost`, guarda el precio multiplicado por la cantidad; en la línea de `print()`, muestra el valor de `total_cost`.',
      inicial: 'price = 50        # dólares por acción\nquantity = 4      # acciones que compras\n\ntotal_cost = ___ * ___\nprint(___)\n',
      solucion: 'price = 50        # dólares por acción\nquantity = 4      # acciones que compras\n\ntotal_cost = price * quantity\nprint(total_cost)',
      explicacion:
        'La línea de `total_cost` calcula `price * quantity` (50 × 4 = 200) y guarda el resultado en `total_cost`. Después, `print(total_cost)` muestra **el valor** de esa variable: 200.\n\nEl error típico es dejar `print()` vacío, que solo imprime una línea en blanco, o escribir `print("total_cost")` con comillas, que muestra la palabra y no el número. La regla: lo que quieres ver va dentro de los paréntesis y, si es una variable, sin comillas.',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'total_cost',
          etiqueta: 'el cálculo de total_cost',
          ayuda:
            'El costo total es el precio multiplicado por la cantidad: en la línea de total_cost van price y quantity, unidos con * (multiplicar), no con + (sumar).',
        },
        {
          tipo: 'salida',
          modo: 'contiene',
          texto: '200',
          etiqueta: 'mostrar total_cost con print()',
          ayuda:
            'Si el cálculo de total_cost tiene ✘, corrígelo primero: el número impreso se arregla solo. Si el cálculo está bien, revisa el print: dentro de los paréntesis va la variable, sin comillas: print(total_cost). Un print() vacío solo imprime una línea en blanco, y print("total_cost") imprime la palabra, no el valor.',
        },
      ],
      pistas: [
        'El costo total es el precio de una acción multiplicado por cuántas acciones compras.',
        'En la línea de `total_cost` van los nombres de las dos variables de arriba, `price` y `quantity`. Dentro de `print( )` va la variable que quieres ver.',
        'total_cost = price * ________\nprint(__________)   # la variable que acabas de crear',
      ],
      alternativas: ['price = 50\nquantity = 4\ntotal_cost = quantity * price\nprint("Costo total:", total_cost)'],
      incorrectas: [
        {
          codigo: 'price = 50\nquantity = 4\ntotal_cost = price * quantity\nprint()',
          retro: ['print(total_cost)', 'linea en blanco'],
        },
        {
          codigo: 'price = 50\nquantity = 4\ntotal_cost = price * quantity\nprint("total_cost")',
          retro: 'sin comillas',
        },
        {
          codigo: 'price = 50\nquantity = 4\ntotal_cost = price + quantity\nprint(total_cost)',
          retro: ['* (multiplicar)', 'corrigelo primero'],
        },
        {
          codigo: 'price = 50\nquantity = 4\ntotal_cost = price * quantity\nprint(___)',
          retro: 'hueco ___ sin completar',
        },
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'py-01-e1',
      concepto: 'py.variables',
      lenguaje: 'python',
      enunciado:
        'Tu sueldo mensual como analista junior es 2500. Crea la variable `annual_salary` con lo que ganas en 12 meses y muestra su valor con `print()`. Se revisan dos cosas: el valor de `annual_salary` y lo que imprimes.',
      inicial: 'monthly_salary = 2500\n\n# Escribe tu código debajo\n',
      solucion: 'monthly_salary = 2500\nannual_salary = monthly_salary * 12\nprint(annual_salary)',
      explicacion:
        'Se resuelve en dos líneas. Primero, `annual_salary = monthly_salary * 12` calcula 2500 × 12 = 30000 y lo guarda en la variable. Después, `print(annual_salary)` muestra ese valor en la consola.\n\nSon dos pasos distintos: crear la variable no la muestra, y un `print()` vacío no sabe qué mostrar (solo imprime una línea en blanco). Si escribes `print("annual_salary")` con comillas, verás la palabra annual_salary en lugar del número.',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'annual_salary',
          etiqueta: 'el cálculo de annual_salary',
          ayuda: 'Crea annual_salary con ese nombre exacto, a la izquierda del =, y a la derecha multiplica el sueldo mensual por 12 con el operador *.',
        },
        {
          tipo: 'salida',
          modo: 'contiene',
          texto: '30000',
          etiqueta: 'mostrar annual_salary con print()',
          ayuda:
            'Si el cálculo de annual_salary tiene ✘, corrígelo primero: el número impreso se arregla solo. Si el cálculo está bien, revisa el print: dentro de los paréntesis va la variable, sin comillas: print(annual_salary). Un print() vacío solo imprime una línea en blanco.',
        },
      ],
      pistas: [
        'Un año tiene 12 meses: multiplica el sueldo mensual por 12 con el operador `*`.',
        'Son dos líneas: primero crea la variable (`nombre = cuenta`) y debajo muéstrala escribiendo su nombre dentro de `print( )`.',
        'annual_salary = monthly_salary * __\nprint(_____________)',
      ],
      alternativas: ['monthly_salary = 2500\nannual_salary = 12 * monthly_salary\nprint("Sueldo anual:", annual_salary)'],
      incorrectas: [
        {
          codigo: 'monthly_salary = 2500\nannual_salary = monthly_salary * 12\nprint()',
          retro: ['print(annual_salary)', 'linea en blanco'],
        },
        {
          codigo: 'monthly_salary = 2500\nannual_salary = monthly_salary * 12\n',
          retro: 'print(annual_salary)',
        },
        {
          codigo: 'monthly_salary = 2500\nannual_salary = monthly_salary * 12\nprint("annual_salary")',
          retro: 'sin comillas',
        },
        {
          codigo: 'monthly_salary = 2500\nannual_salary = monthly_salary + 12\nprint(annual_salary)',
          retro: ['multiplica el sueldo mensual por 12', 'corrigelo primero'],
        },
        {
          codigo: 'monthly_salary = 2500\nprint(monthly_salary * 12)',
          retro: ['nombre exacto', 'a la izquierda del ='],
        },
        {
          codigo: 'monthly_salary = 2500\nAnnual_salary = monthly_salary * 12\nprint(Annual_salary)',
          retro: 'nombre exacto',
        },
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
      explicacion:
        'Imprime 8. El `=` significa "calcula lo de la derecha y guárdalo en la variable de la izquierda": `x = x + 3` toma el valor actual de x (5), le suma 3 y guarda 8 otra vez en x. El 5 se reemplaza, por eso no imprime 5.\n\nTampoco imprime "x + 3": sin comillas, Python hace la cuenta en vez de mostrar el texto. Y no es un error: en matemáticas x = x + 3 sería imposible, pero en Python solo es actualizar una variable.',
    },
    {
      tipo: 'leccion',
      titulo: 'Porcentajes en decimal',
      texto:
        'En Python los porcentajes no se escriben con el símbolo `%` (ese símbolo hace otra cosa, que verás en unos minutos). Un porcentaje se pasa a decimal **dividiendo entre 100**: 5% es `5 / 100`, o sea `0.05`; 25% es `0.25`.\n\nPython usa **punto** decimal, nunca coma: `0.05`, no `0,05`. Con coma, Python entiende dos números separados.\n\nPara saber cuánto dinero es un porcentaje, multiplica el monto por la tasa en decimal.',
      codigo:
        'balance = 8000\ntax_rate = 5 / 100        # 5% en decimal\ntax = balance * tax_rate\nprint(tax_rate)           # muestra 0.05\nprint(tax)                # muestra 400.0',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-01-e2',
      concepto: 'py.aritmetica',
      lenguaje: 'python',
      enunciado:
        'El fondo cobra una comisión de gestión de **1.5% anual**. Un cliente tiene 200000 dólares invertidos (`assets`). Cambia el 0 de `fee_rate` por 1.5% en decimal y cambia el 0 de `management_fee` por la cuenta de la comisión en dólares. El `print(management_fee)` ya está listo para que veas el resultado.',
      inicial:
        'assets = 200000\nfee_rate = 0         # cambia 0 por 1.5% en decimal\n\nmanagement_fee = 0   # cambia 0 por la cuenta de la comisión\nprint(management_fee)\n',
      solucion: 'assets = 200000\nfee_rate = 0.015\nmanagement_fee = assets * fee_rate\nprint(management_fee)',
      explicacion:
        'Primero conviertes la tasa: 1.5% es 1.5 / 100, o sea `0.015` (puedes escribir cualquiera de las dos formas). Después, la comisión es `management_fee = assets * fee_rate`: 200000 × 0.015 = 3000.0 dólares al año.\n\nEl error típico es dejar `fee_rate = 1.5`: eso sería una comisión del 150% y daría 300000. Otro error frecuente en español es escribir `0,015` con coma: Python usa punto decimal.',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'fee_rate',
          etiqueta: 'fee_rate en decimal',
          ayuda:
            'Un porcentaje se pasa a decimal dividiendo entre 100: 1.5% es 1.5 / 100. Escribe los decimales con punto (1.5, no 1,5: con coma, Python crea una tupla de dos números) y sin el símbolo %.',
        },
        {
          tipo: 'variable',
          nombre: 'management_fee',
          etiqueta: 'la comisión management_fee',
          ayuda:
            'La comisión es assets multiplicado por fee_rate (usa la variable, no el número 1.5). Si fee_rate está mal, esta cuenta también sale mal: corrige primero fee_rate.',
        },
      ],
      pistas: [
        'Para pasar un porcentaje a decimal, divídelo entre 100. La comisión en dólares es el monto invertido por la tasa.',
        'Cambias dos líneas: `fee_rate` pasa a ser 1.5 en decimal, y `management_fee` pasa a ser `assets` multiplicado por `fee_rate`.',
        'fee_rate = 1.5 / ___\nmanagement_fee = assets * ________',
      ],
      alternativas: [
        'assets = 200000\nfee_rate = 1.5 / 100\nmanagement_fee = assets * fee_rate',
        'assets = 200000\nfee_rate = 0.015\nmanagement_fee = fee_rate * assets\nprint("Comisión:", management_fee)',
      ],
      incorrectas: [
        {
          codigo: 'assets = 200000\nfee_rate = 1.5\nmanagement_fee = assets * fee_rate\nprint(management_fee)',
          retro: ['1.5 / 100', 'corrige primero fee_rate'],
        },
        {
          codigo: 'assets = 200000\nfee_rate = 0.15\nmanagement_fee = assets * fee_rate\nprint(management_fee)',
          retro: '1.5 / 100',
        },
        {
          codigo: 'assets = 200000\nfee_rate = 1,5 / 100\nmanagement_fee = assets * fee_rate\nprint(management_fee)',
          retro: ['decimales con punto', 'tupla'],
        },
        {
          codigo: 'assets = 200000\nfee_rate = 0.015\n\nmanagement_fee = 0\nprint(management_fee)',
          retro: 'assets multiplicado por fee_rate',
        },
        {
          codigo: 'assets = 200000\nfee_rate = 0.015\nmanagement_fee = assets * 1.5\nprint(management_fee)',
          retro: 'usa la variable',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'División entera y resto',
      texto:
        'Para comprar acciones necesitas números enteros: no puedes comprar media acción. Python tiene dos operadores para eso:\n\n- `//` (división entera) divide y descarta los decimales: `17 // 5` es 3.\n- `%` (resto o módulo) da lo que sobra de esa división: `17 % 5` es 2, porque 3 × 5 = 15 y sobran 2.\n\nOjo: en Python `%` **no** significa "por ciento"; es el resto de una división. Y el orden importa: primero va el dinero y después el precio (`cash // price`, no `price // cash`).\n\nSi alguno de los dos números tiene decimales, `//` da un resultado como `3.0`: sigue siendo un número entero de acciones, solo que escrito con decimal.',
      codigo:
        'cash = 1000\nprice = 300\nshares = cash // price     # 3 acciones (3 × 300 = 900)\nleftover = cash % price    # sobran 100\nprint(shares, leftover)    # muestra: 3 100',
      lenguaje: 'python',
    },
    {
      tipo: 'ejercicio',
      id: 'py-01-p2',
      concepto: 'py.aritmetica',
      lenguaje: 'python',
      enunciado:
        'Práctica guiada. Tienes 950 dólares y cada bono cuesta 200. Completa los dos huecos `___`: en `bonds`, cuántos bonos **enteros** puedes comprar (con `//`), y en `remaining`, el dinero que te sobra (con `%`). Usa las variables `cash` y `bond_price`.',
      inicial:
        'cash = 950          # dólares disponibles\nbond_price = 200    # precio de un bono\n\nbonds = ___         # bonos enteros: divide cash entre bond_price con //\nremaining = ___     # lo que sobra: usa % con cash y bond_price\nprint(bonds, remaining)\n',
      solucion:
        'cash = 950          # dólares disponibles\nbond_price = 200    # precio de un bono\n\nbonds = cash // bond_price\nremaining = cash % bond_price\nprint(bonds, remaining)',
      explicacion:
        '`cash // bond_price` es 950 // 200 = 4: caben 4 bonos enteros (4 × 200 = 800). `cash % bond_price` es 950 % 200 = 150: lo que sobra después de comprar esos 4 bonos (950 − 800).\n\nEl error típico es usar una sola barra `/`, que da 4.75 (no se compra 0.75 de un bono), o pensar que `%` es un porcentaje: aquí significa "resto". También importa el orden: `bond_price // cash` daría 0.',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'bonds',
          etiqueta: 'los bonos enteros (bonds)',
          ayuda: 'Usa dos barras y pon primero el dinero: cash // bond_price. Con una sola barra (/) sale 4.75, y no se puede comprar 0.75 de un bono.',
        },
        {
          tipo: 'variable',
          nombre: 'remaining',
          etiqueta: 'el dinero que sobra (remaining)',
          ayuda: 'remaining es el resto de la división: cash % bond_price, con el dinero primero. Aquí % no es un porcentaje.',
        },
      ],
      pistas: [
        '`//` te dice cuántas veces cabe el precio en tu dinero; `%` te dice cuánto dinero queda después.',
        'En cada hueco van tres cosas, en este orden: `cash`, un operador y `bond_price`.',
        'bonds = cash __ bond_price\nremaining = cash _ bond_price',
      ],
      alternativas: ['cash = 950\nbond_price = 200\nbonds = cash // bond_price\nremaining = cash - bonds * bond_price\nprint(bonds, remaining)'],
      incorrectas: [
        {
          codigo: 'cash = 950\nbond_price = 200\nbonds = cash / bond_price\nremaining = cash % bond_price\nprint(bonds, remaining)',
          retro: 'dos barras',
        },
        {
          codigo: 'cash = 950\nbond_price = 200\nbonds = bond_price // cash\nremaining = bond_price % cash\nprint(bonds, remaining)',
          retro: ['primero el dinero', 'cash % bond_price'],
        },
        {
          codigo: 'cash = 950\nbond_price = 200\nbonds = cash // bond_price\nremaining = cash - bonds\nprint(bonds, remaining)',
          retro: 'cash % bond_price',
        },
        {
          codigo: 'cash = 950\nbond_price = 200\nbonds = cash // bond_price\nremaining = ___\nprint(bonds, remaining)',
          retro: 'hueco ___ sin completar',
        },
      ],
    },
    {
      tipo: 'ejercicio',
      id: 'py-01-e3',
      concepto: 'py.aritmetica',
      lenguaje: 'python',
      enunciado:
        'Tienes 10000 dólares y cada acción de Cóndor Minera (CND) cuesta 44.55. Guarda en `shares` cuántas acciones **enteras** puedes comprar (con `//`) y en `leftover` el dinero que sobra (con `%`). Si quieres ver los resultados, agrega `print(shares, leftover)` al final.',
      inicial: 'cash = 10000\nprice = 44.55\n',
      solucion: 'cash = 10000\nprice = 44.55\nshares = cash // price\nleftover = cash % price\nprint(shares, leftover)',
      explicacion:
        '`shares = cash // price` da 10000 // 44.55 = 224.0: puedes comprar 224 acciones enteras. Sale 224.0 y no 224 porque el precio tiene decimales, pero es el mismo número entero. `leftover = cash % price` da lo que sobra: 10000 − 224 × 44.55, unos 20.80 dólares.\n\nSi imprimes `leftover` verás algo como 20.800000000000637: la computadora guarda los decimales con un error diminuto, y en la próxima misión aprenderás a redondear con `round()`. Los errores típicos son usar `/` (224.47 acciones, que no se pueden comprar) o calcular `cash - shares`, que resta acciones a dólares.',
      verificar: [
        {
          tipo: 'variable',
          nombre: 'shares',
          etiqueta: 'las acciones enteras (shares)',
          ayuda: 'Usa dos barras y pon primero el dinero: cash // price. Con una sola barra (/) obtienes acciones con decimales, que no se pueden comprar.',
        },
        {
          tipo: 'variable',
          nombre: 'leftover',
          tol: 0.000001,
          etiqueta: 'el dinero que sobra (leftover)',
          ayuda: 'leftover es el resto de la división: cash % price, con el dinero primero. No restes shares a cash: shares son acciones y cash son dólares.',
        },
      ],
      pistas: [
        'Es lo mismo que la práctica de los bonos, pero con otros nombres: `shares` usa `//` y `leftover` usa `%`.',
        'Escribe dos líneas nuevas debajo del precio: `shares = ...` y `leftover = ...`, cada una con `cash`, un operador y `price`.',
        'shares = cash // _____\nleftover = cash % _____',
      ],
      alternativas: ['cash = 10000\nprice = 44.55\nshares = int(cash / price)\nleftover = cash - shares * price'],
      incorrectas: [
        {
          codigo: 'cash = 10000\nprice = 44.55\nshares = cash / price\nleftover = cash % price\nprint(shares, leftover)',
          retro: 'dos barras',
        },
        {
          codigo: 'cash = 10000\nprice = 44.55\nshares = cash // price\nleftover = cash - shares\nprint(shares, leftover)',
          retro: ['cash % price', 'no restes shares'],
        },
        {
          codigo: 'cash = 10000\nprice = 44.55\nshares = price // cash\nleftover = price % cash\nprint(shares, leftover)',
          retro: 'primero el dinero',
        },
        {
          codigo: 'cash = 10000\nprice = 44.55\nshares = cash % price\nleftover = cash // price\nprint(shares, leftover)',
          retro: ['cash // price', 'cash % price'],
        },
        'cash = 10000\nprice = 44.55\nshares = cash / price\nleftover = 0',
      ],
    },
    {
      tipo: 'jefeDia',
      id: 'py-01-jefe',
      jefe: {
        nombre: 'Gonzalo Vega',
        sprite: 'vega',
        provocacion: 'Soy Gonzalo, de la mesa de trading de al lado. ¿Así que tú eres {nombre}? A ver si sabes cuántas acciones te alcanzan sin calculadora.',
        derrota: 'Hmm. 23 acciones y 140 de vuelto. Bien hecho, novato… digo, {nombre}.',
      },
      paso: {
        tipo: 'ejercicio',
        id: 'py-01-jefe-e1',
        concepto: 'py.aritmetica',
        lenguaje: 'python',
        enunciado:
          'Gonzalo te reta: con `cash = 7500` dólares y acciones a `price = 320`, calcula:\n\n- `shares`: cuántas acciones **enteras** puedes comprar (con `//`);\n- `leftover`: el dinero que te sobra (con `%`);\n- `total_cost`: lo que pagas por esas acciones (`shares * price`).\n\nMuestra `shares` y `leftover` con `print(shares, leftover)`.',
        inicial: 'cash = 7500\nprice = 320\n\n# Escribe tu código debajo\n',
        solucion: 'cash = 7500\nprice = 320\n\nshares = cash // price\nleftover = cash % price\ntotal_cost = shares * price\nprint(shares, leftover)',
        verificar: [
          {
            tipo: 'variable',
            nombre: 'shares',
            ayuda: 'Acciones enteras: shares = cash // price, con dos barras. Una sola barra (/) da decimales.',
          },
          {
            tipo: 'variable',
            nombre: 'leftover',
            ayuda: 'Lo que sobra es el resto de la división: leftover = cash % price (primero el dinero, después el precio).',
          },
          {
            tipo: 'variable',
            nombre: 'total_cost',
            ayuda: 'total_cost = shares * price: lo que pagas por las acciones enteras.',
          },
          {
            tipo: 'salida',
            modo: 'numeros',
            etiqueta: 'mostrar shares y leftover con print()',
            ayuda: 'Muestra los dos valores con print(shares, leftover).',
          },
        ],
        explicacion:
          '`cash // price` da 7500 // 320 = 23 acciones enteras y `cash % price` da 140: lo que sobra (23 × 320 = 7360 y 7500 − 7360 = 140). `total_cost = shares * price` es 7360.\n\nEl error típico es usar `/`, que da 23.4375: no se compran fracciones de acción. Y crear las variables no las muestra: hace falta `print(shares, leftover)`.',
        pistas: [
          'Usa los dos operadores de la misión: // para las acciones enteras y % para lo que sobra.',
          'shares usa //, leftover usa % (con cash y price en ese orden) y total_cost multiplica shares por price.',
          'shares = cash // price\nleftover = cash % _____\ntotal_cost = shares * _____\nprint(shares, ________)',
        ],
        alternativas: [
          'cash = 7500\nprice = 320\nshares = cash // price\ntotal_cost = shares * price\nleftover = cash - total_cost\nprint("Acciones:", shares, "Sobra:", leftover)',
        ],
        incorrectas: [
          {
            codigo: 'cash = 7500\nprice = 320\nshares = cash / price\nleftover = cash % price\ntotal_cost = shares * price\nprint(shares, leftover)',
            retro: 'dos barras',
          },
          {
            codigo: 'cash = 7500\nprice = 320\nshares = cash // price\nleftover = price % cash\ntotal_cost = shares * price\nprint(shares, leftover)',
            retro: 'primero el dinero',
          },
          {
            codigo: 'cash = 7500\nprice = 320\nshares = cash // price\nleftover = cash % price\ntotal_cost = shares * price\nprint()',
            retro: 'no mostró nada',
          },
        ],
      },
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
          texto:
            'Lo de hoy en una frase: las variables guardan datos, los operadores hacen las cuentas y print() muestra lo que pongas dentro de sus paréntesis.',
        },
        {
          quien: 'marta',
          texto: 'Mañana viene el interés compuesto. Es la idea más importante de todo el fondo.',
        },
      ],
    },
  ],
};
