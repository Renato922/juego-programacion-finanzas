// Traduce errores de Python y SQL a explicaciones en español.
// El mensaje original (en inglés) se muestra igual, porque es el que vas a
// ver en el trabajo; esto solo agrega una explicación y un consejo.

const ERRORES_PYTHON = {
  SyntaxError: {
    titulo: 'Error de sintaxis',
    explicacion: 'Python no pudo entender cómo está escrita una línea.',
    consejo: 'Revisa paréntesis y comillas sin cerrar, y los dos puntos (:) al final de if, for y def.',
  },
  IndentationError: {
    titulo: 'Error de sangría',
    explicacion: 'En Python los espacios al inicio de la línea indican qué código va dentro de un bloque.',
    consejo: 'Usa 4 espacios dentro de cada if, for o def, y el mismo número en todo el bloque.',
  },
  TabError: {
    titulo: 'Mezcla de tabuladores y espacios',
    explicacion: 'El bloque usa tabuladores y espacios a la vez.',
    consejo: 'Usa solo espacios (el editor inserta 4 al presionar Tab).',
  },
  NameError: {
    titulo: 'Nombre no definido',
    explicacion: 'Usaste una variable o función que todavía no existe.',
    consejo: 'Revisa que esté bien escrita (mayúsculas incluidas) y que la hayas creado antes de usarla. Si es texto, ponlo entre comillas.',
  },
  TypeError: {
    titulo: 'Tipos incompatibles',
    explicacion:
      'Intentaste combinar datos de tipos que no encajan, por ejemplo sumar texto con un número, o llamar una función con argumentos de más o de menos.',
    consejo: 'Convierte con int(), float() o str() si hace falta, y revisa cuántos argumentos recibe la función.',
  },
  ValueError: {
    titulo: 'Valor no válido',
    explicacion: 'El tipo de dato es correcto, pero el valor no sirve para esa operación.',
    consejo: 'Por ejemplo, float("12,5") falla: Python usa punto decimal.',
  },
  ZeroDivisionError: {
    titulo: 'División entre cero',
    explicacion: 'Dividiste entre cero. En finanzas pasa, por ejemplo, con un precio anterior igual a 0.',
    consejo: 'Revisa el divisor o usa un if para manejar el caso en que vale cero.',
  },
  IndexError: {
    titulo: 'Índice fuera de rango',
    explicacion: 'Pediste una posición de la lista que no existe.',
    consejo: 'Las listas empiezan en 0: una lista de 5 elementos va de [0] a [4]. lista[-1] es el último.',
  },
  KeyError: {
    titulo: 'Clave inexistente',
    explicacion: 'Buscaste en un diccionario una clave que no está.',
    consejo: 'Revisa cómo está escrita la clave, o usa dic.get(clave, valor_por_defecto).',
  },
  AttributeError: {
    titulo: 'Atributo o método inexistente',
    explicacion: 'Ese tipo de dato no tiene el método o atributo que usaste.',
    consejo: 'Por ejemplo, las listas tienen .append() pero los números no.',
  },
  UnboundLocalError: {
    titulo: 'Variable local sin valor',
    explicacion: 'Dentro de una función usaste una variable antes de darle un valor.',
    consejo: 'Asígnale un valor inicial dentro de la función antes de usarla.',
  },
  RecursionError: {
    titulo: 'Recursión infinita',
    explicacion: 'Una función se llamó a sí misma demasiadas veces.',
    consejo: 'Revisa la condición que detiene la recursión.',
  },
  ModuleNotFoundError: {
    titulo: 'Módulo no encontrado',
    explicacion: 'Intentaste importar un módulo que no está disponible en este capítulo.',
    consejo: 'Revisa el nombre del módulo (por ejemplo, import math).',
  },
  ImportError: {
    titulo: 'Error al importar',
    explicacion: 'No se pudo importar algo del módulo.',
    consejo: 'Revisa el nombre de lo que importas.',
  },
  AssertionError: {
    titulo: 'Verificación fallida',
    explicacion: 'Un assert encontró una condición falsa.',
    consejo: 'Lee el mensaje del assert.',
  },
  OverflowError: {
    titulo: 'Número demasiado grande',
    explicacion: 'El resultado no cabe en un número decimal.',
    consejo: 'Revisa exponentes muy grandes.',
  },
  Timeout: {
    titulo: 'Tu código tardó demasiado',
    explicacion: 'Lo detuvimos porque llevaba demasiado tiempo. Casi siempre es un bucle infinito.',
    consejo: 'Revisa que el bucle while tenga una condición que llegue a ser falsa.',
  },
};

const GENERICO = {
  titulo: 'Error al ejecutar',
  explicacion: 'Tu código produjo un error.',
  consejo: 'Lee el mensaje y la línea indicada.',
};

export function traducirErrorPython(error) {
  if (!error) return null;
  const info = ERRORES_PYTHON[error.tipo] ?? GENERICO;
  const extra = pistaEspecificaPython(error);
  return {
    ...info,
    consejo: extra ?? info.consejo,
    original: `${error.tipo}: ${error.mensaje}`,
    linea: error.linea ?? null,
  };
}

function pistaEspecificaPython({ tipo, mensaje = '' }) {
  let m;
  if (tipo === 'NameError' && /name '_{2,}' is not defined/.test(mensaje)) {
    return 'Quedó un hueco ___ sin completar. Reemplázalo por el código que falta.';
  }
  if (tipo === 'NameError' && (m = mensaje.match(/name '(.+?)' is not defined/))) {
    return `"${m[1]}" no existe todavía. ¿Lo escribiste distinto antes, o le faltan comillas si es texto?`;
  }
  if (tipo === 'TypeError' && /can only concatenate str/.test(mensaje)) {
    return 'Estás sumando texto con un número. Usa un f-string: f"Total: {total}" o convierte con str().';
  }
  if (tipo === 'TypeError' && /unsupported operand type\(s\) for \^/.test(mensaje)) {
    return 'En Python la potencia es **, no ^. Ejemplo: (1 + r) ** n';
  }
  if (tipo === 'TypeError' && /missing \d+ required positional argument/.test(mensaje)) {
    return 'Llamaste la función con menos argumentos de los que pide su definición.';
  }
  if (tipo === 'TypeError' && /takes \d+ positional argument/.test(mensaje)) {
    return 'Llamaste la función con más argumentos de los que pide su definición.';
  }
  if (tipo === 'TypeError' && /'(int|float)' object is not (subscriptable|iterable)/.test(mensaje)) {
    return 'Trataste un número como si fuera una lista. Revisa qué variable estás recorriendo o indexando.';
  }
  if (tipo === 'SyntaxError' && /expected ':'/.test(mensaje)) {
    return 'Falta el ":" al final de la línea del if, for, while o def.';
  }
  if (tipo === 'SyntaxError' && /invalid decimal literal/.test(mensaje)) {
    return 'Un nombre de variable no puede empezar con número, y los decimales llevan punto: 0.05, no 0,05.';
  }
  if (tipo === 'SyntaxError' && /was never closed|unterminated string/.test(mensaje)) {
    return 'Hay un paréntesis, corchete o comilla que abriste y no cerraste.';
  }
  if (tipo === 'SyntaxError' && /invalid syntax\. Maybe you meant '==' or ':='/.test(mensaje)) {
    return 'Para comparar se usa ==. Un solo = sirve para asignar un valor.';
  }
  return null;
}

export function traducirErrorSQL(error) {
  if (!error) return null;
  const mensaje = error.mensaje ?? String(error);
  let m;
  let info;
  if ((m = mensaje.match(/no such column: (\S+)/))) {
    info = {
      titulo: 'Columna inexistente',
      explicacion: `La columna "${m[1]}" no existe en las tablas de tu consulta.`,
      consejo: "Revisa el nombre en el panel de esquema. Si es un texto, va entre comillas simples: 'compra'.",
    };
  } else if ((m = mensaje.match(/no such table: (\S+)/))) {
    info = {
      titulo: 'Tabla inexistente',
      explicacion: `La tabla "${m[1]}" no existe.`,
      consejo: 'Revisa el nombre de la tabla en el panel de esquema.',
    };
  } else if ((m = mensaje.match(/near "(.+?)": syntax error/))) {
    info = {
      titulo: 'Error de sintaxis',
      explicacion: `SQL no entendió la consulta cerca de "${m[1]}".`,
      consejo: 'Revisa el orden: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT. Y las comas entre columnas.',
    };
  } else if (/incomplete input/.test(mensaje)) {
    info = {
      titulo: 'Consulta incompleta',
      explicacion: 'La consulta terminó antes de tiempo.',
      consejo: 'Revisa paréntesis y comillas sin cerrar.',
    };
  } else if ((m = mensaje.match(/ambiguous column name: (\S+)/))) {
    info = {
      titulo: 'Columna ambigua',
      explicacion: `La columna "${m[1]}" existe en más de una tabla del JOIN.`,
      consejo: 'Indica de qué tabla es: tabla.columna o alias.columna (por ejemplo t.ticker).',
    };
  } else if (/misuse of aggregate/.test(mensaje)) {
    info = {
      titulo: 'Uso incorrecto de agregación',
      explicacion: 'Usaste SUM, COUNT o AVG donde no se permite, por ejemplo dentro de WHERE.',
      consejo: 'Para filtrar por un agregado usa HAVING después de GROUP BY.',
    };
  } else if (/You can only execute one statement at a time|no hay consulta/.test(mensaje)) {
    info = {
      titulo: 'Consulta vacía',
      explicacion: 'No hay ninguna consulta para ejecutar.',
      consejo: 'Escribe una consulta SELECT.',
    };
  } else if (/Timeout/.test(mensaje)) {
    info = {
      titulo: 'La consulta tardó demasiado',
      explicacion: 'La detuvimos porque llevaba demasiado tiempo.',
      consejo: 'Revisa JOINs sin condición ON (multiplican filas) o CTE recursivas sin fin.',
    };
  } else {
    info = { ...GENERICO, consejo: 'Lee el mensaje original; suele decir dónde está el problema.' };
  }
  return { ...info, original: mensaje, linea: null };
}
