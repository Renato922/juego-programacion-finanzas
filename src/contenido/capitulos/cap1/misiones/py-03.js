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
        'Una **lista** guarda varios valores en orden: `[a, b, c]`. Las posiciones empiezan en **0**: `lista[0]` es el primero y `lista[-1]` el último.\n\n`len()` cuenta elementos; `sum()`, `max()` y `min()` hacen lo que dicen. `.append(x)` agrega al final.\n\nCon **slicing** tomas un tramo: `lista[1:3]` toma las posiciones 1 y 2 (la 3 no se incluye).',
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
        },
        {
          tipo: 'variable',
          nombre: 'max_rate',
        },
        {
          tipo: 'variable',
          nombre: 'min_rate',
        },
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
        {
          tipo: 'variable',
          nombre: 'rate_drop',
        },
        {
          tipo: 'codigoIncluye',
          patron: 'tbill_rates\\[',
          mensaje: 'Usa índices, por ejemplo tbill_rates[0].',
        },
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
        {
          tipo: 'variable',
          nombre: 'rates_2008',
        },
        {
          tipo: 'variable',
          nombre: 'avg_2008',
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
        'tbill_rates = [3.01, 1.56, 1.74, 1.17, 0.12, 0.22, 0.18, 0.12]\nrates_2008 = tbill_rates[1:4]\navg_2008 = sum(rates_2008) / len(rates_2008)',
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
