// Capítulo 1 — Pista de Python. Explicaciones en español; código e identificadores en inglés.
// Misión py-03: Las tasas de la crisis de 2008

export default {
  id: 'py-03',
  titulo: 'Las tasas de la crisis de 2008',
  resumen: 'Listas, índices, slicing, len, sum, max y min con datos reales de FRED.',
  pista: 'python',
  lenguaje: 'python',
  duracion: '7 min',
  requiere: ['py-02'],
  nivelDiagnostico: 3,
  conceptos: ['py.listas', 'py.slicing'],
  recompensa: {
    capital: 1500,
    xp: 70,
  },
  pasos: [
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: '¿Tú eres {nombre}? Soy Bruno, analista senior. Te dejé un regalo: las tasas de las Letras del Tesoro de EE. UU. durante la crisis de 2008.',
        },
        {
          quien: 'bruno',
          texto: 'Son datos reales, de FRED (Reserva Federal de St. Louis). Veamos qué tan rápido te mueves con listas.',
        },
      ],
    },
    {
      tipo: 'leccion',
      titulo: 'Listas',
      texto:
        'Una **lista** guarda varios valores en orden: `[a, b, c]`. Las posiciones empiezan en **0**: `lista[0]` es el primero y `lista[-1]` el último (los índices negativos cuentan desde el final: `-2` es el penúltimo).\n\n`len()` cuenta elementos; `sum()`, `max()` y `min()` hacen lo que dicen. `.append(x)` agrega al final.\n\nCon **slicing** tomas un tramo: `lista[1:3]` toma las posiciones 1 y 2 (la 3 no se incluye). La cantidad de elementos de un slice es fin − inicio: `lista[1:3]` toma 3 − 1 = 2.',
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
        {
          tipo: 'variable',
          nombre: 'average_rate',
          ayuda: 'El promedio es sum(tbill_rates) / len(tbill_rates). Usa len() en lugar de contar a mano: la lista tiene 8 trimestres.',
        },
        {
          tipo: 'variable',
          nombre: 'max_rate',
          ayuda: 'max_rate = max(tbill_rates) devuelve el valor más alto de la lista.',
        },
        {
          tipo: 'variable',
          nombre: 'min_rate',
          ayuda: 'min_rate = min(tbill_rates) devuelve el valor más bajo de la lista.',
        },
      ],
      pistas: [
        'El promedio es la suma dividida entre la cantidad.',
        'average_rate = sum(tbill_rates) / len(tbill_rates)',
        'max_rate = max(tbill_rates)\nmin_rate = ___(tbill_rates)',
      ],
      incorrectas: [
        {
          codigo:
            'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\naverage_rate = sum(tbill_rates) / 7\nmax_rate = max(tbill_rates)\nmin_rate = min(tbill_rates)',
          retro: 'len(tbill_rates)',
        },
        {
          codigo:
            'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\naverage_rate = sum(tbill_rates) / len(tbill_rates)\nmax_rate = min(tbill_rates)\nmin_rate = max(tbill_rates)',
          retro: ['max_rate = max(tbill_rates)', 'min_rate = min(tbill_rates)'],
        },
      ],
      explicacion:
        'El promedio es la suma dividida entre la cantidad: `sum(tbill_rates) / len(tbill_rates)` da 8.12 / 8 = 1.015. `max()` y `min()` devuelven el valor más alto (3.01) y el más bajo (0.12) de la lista.\n\nUsar `len()` en vez de escribir el 8 a mano evita contar mal (dividir entre 7 infla el promedio) y sigue funcionando si la lista cambia.',
      alternativas: [
        'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\naverage_rate = sum(tbill_rates) / 8\nmax_rate = max(tbill_rates)\nmin_rate = min(tbill_rates)',
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
        {
          tipo: 'variable',
          nombre: 'rate_drop',
          ayuda: 'Resta el primero menos el último: tbill_rates[0] - tbill_rates[-1]. Si te salió negativo, invertiste el orden.',
        },
        {
          tipo: 'codigoIncluye',
          patron: 'tbill_rates\\[',
          mensaje: 'Usa índices, por ejemplo tbill_rates[0].',
        },
      ],
      pistas: ['El primero es tbill_rates[0]. ¿Y el último?', 'El último es tbill_rates[-1].', 'rate_drop = tbill_rates[0] - tbill_rates[___]'],
      alternativas: ['tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrate_drop = tbill_rates[0] - tbill_rates[len(tbill_rates) - 1]'],
      explicacion:
        '`tbill_rates[0]` es el primer trimestre (3.01) y `tbill_rates[-1]` el último (0.12). Restarlos da `rate_drop` ≈ 2.89 puntos porcentuales. Python puede mostrar 2.8899999999999997: es la forma en que la computadora guarda los decimales, no un error.\n\nEl índice `-1` siempre apunta al último elemento, sin importar el largo de la lista. El error típico es `tbill_rates[8]`: con 8 elementos las posiciones van de 0 a 7, así que da IndexError.',
      incorrectas: [
        {
          codigo: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrate_drop = tbill_rates[-1] - tbill_rates[0]',
          retro: 'invertiste el orden',
        },
        {
          codigo: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrate_drop = tbill_rates[0] - tbill_rates[8]',
          retro: 'lista[-1] es el último',
        },
        {
          codigo: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrate_drop = 3.01 - 0.12',
          retro: 'Usa índices',
        },
      ],
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
        {
          tipo: 'variable',
          nombre: 'rates_2008',
          ayuda: 'Un slice [inicio:fin] no incluye la posición fin. Para tomar las posiciones 1 a 4 escribe tbill_rates[1:5] (5 − 1 = 4 elementos).',
        },
        {
          tipo: 'variable',
          nombre: 'avg_2008',
          ayuda: 'Promedio de los 4 valores: sum(rates_2008) / len(rates_2008). Si rates_2008 tiene ✘, corrígela primero.',
        },
        {
          tipo: 'codigoIncluye',
          patron: '\\[\\s*\\d*\\s*:\\s*-?\\d*\\s*\\]',
          mensaje: 'Usa slicing: tbill_rates[inicio:fin].',
        },
      ],
      pistas: [
        'El final de un slice no se incluye: para llegar a la posición 4 escribe 5.',
        'rates_2008 = tbill_rates[1:5]',
        'avg_2008 = sum(rates_2008) / ___(rates_2008)',
      ],
      incorrectas: [
        {
          codigo: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrates_2008 = tbill_rates[1:4]\navg_2008 = sum(rates_2008) / len(rates_2008)',
          retro: 'tbill_rates[1:5]',
        },
        {
          codigo: 'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrates_2008 = tbill_rates[0:4]\navg_2008 = sum(rates_2008) / len(rates_2008)',
          retro: 'no incluye la posición fin',
        },
      ],
      explicacion:
        '`tbill_rates[1:5]` toma las posiciones 1, 2, 3 y 4: el final del slice (5) **no se incluye**, por eso para llegar hasta la posición 4 se escribe 5. El resultado es `[1.56, 1.74, 1.17, 0.12]` y su promedio, `sum(rates_2008) / len(rates_2008)`, es 1.1475.\n\nEl error típico es `tbill_rates[1:4]`, que deja fuera el 4.º trimestre de 2008 y toma solo 3 valores.',
      alternativas: [
        'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrates_2008 = tbill_rates[1:-3]\navg_2008 = sum(rates_2008) / len(rates_2008)',
      ],
    },
    {
      tipo: 'dialogo',
      lineas: [
        {
          quien: 'bruno',
          texto: 'La tasa pasó de 3% a casi 0% en un año: así respondió la Reserva Federal a la crisis. Los datos cuentan historias.',
        },
        {
          quien: 'bruno',
          texto: 'Nada mal para alguien que recién llega. Te espero en SQL.',
        },
      ],
    },
  ],
};
