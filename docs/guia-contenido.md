# Guía de calidad del contenido

Reglas para escribir y auditar misiones, jefes y repasos. Existen porque un jugador real se trabó en `py-01`: escribió bien `annual_salary = monthly_salary * 12`, pero puso `print()` vacío. El juego solo le dijo "Tu salida no incluye 30000", sin explicar que su cálculo ya estaba bien ni cómo se usa `print`.

## 1. Enseñar antes de exigir
- Toda sintaxis, función u operador que necesite la solución tiene que estar **explicado explícitamente** antes, en una lección de la misma misión o de una misión anterior de la misma pista. Un ejemplo de código sin explicación no cuenta.
- Las lecciones nombran las confusiones típicas. Por ejemplo: "`print(x)` muestra el valor de `x`; `print()` vacío imprime una línea en blanco".
- Si un ejercicio usa algo que aún no se enseña (por ejemplo, una comprensión de listas en el código inicial), un comentario lo dice: "esta línea la verás más adelante".

## 2. Enunciados sin ambigüedad
- Indicar los nombres exactos de las variables y funciones que se verifican, en `código`.
- Si se verifica lo que se imprime, decir **qué** imprimir: "muestra annual_salary con print()".
- Si importan las unidades, el redondeo o el formato, indicarlo ("en decimal", "redondeado a 2 decimales", "exactamente: …").

## 3. Estructura de práctica: ejemplo → completar → solo
Cada misión, por concepto nuevo:
1. **Lección** con un ejemplo ejecutable y explicado.
2. **Práctica guiada** (`id: '<mision>-pN'`): el código inicial ya trae la estructura y deja huecos `___` para completar. Es un ejercicio corto, del mismo tipo que el ejemplo.
3. **Ejercicio** independiente (el que ya existía), con menos andamiaje.

4. **Jefe del día** (`tipo: 'jefeDia'`, id `'<mision>-jefe'`), justo antes del diálogo de cierre: un solo ejercicio (`paso`, id `'<mision>-jefe-e1'`) que combina lo del día, con las mismas reglas de la sección 4. Lleva `jefe: { nombre, sprite, provocacion, derrota }`. El rival provoca sin humillar: nunca se burla del jugador.

Las misiones duran de 5 a 13 minutos, contando unos 3 del jefe del día. Si se agregan pasos, hay que actualizar `duracion`.

## 4. Campos obligatorios de cada ejercicio
| Campo | Regla |
|---|---|
| `enunciado` | Claro y completo (sección 2) |
| `inicial` | No debe resolver el ejercicio. En las prácticas guiadas usa `___` |
| `solucion` | La forma más simple y clara (la que se muestra como modelo) |
| `explicacion` | **Obligatoria.** Markdown de 3 a 6 frases que explica la solución paso a paso, por qué funciona y el error típico que evita. Se muestra en "Cómo se resuelve" después de acertar |
| `pistas` | Exactamente 3 en misiones y jefes (2 o más en repasos): (1) la idea, (2) la estructura, (3) casi la solución con huecos `___`. Nunca la respuesta completa literal |
| `verificar` (Python) / `opciones` (SQL) | Las verificaciones. Cada una que pueda fallar por un error típico lleva `ayuda`: un consejo específico (por ejemplo: "Pon la variable dentro de los paréntesis: print(annual_salary)") |
| `alternativas` | Al menos una forma correcta distinta, si existe |
| `incorrectas` | Al menos 2 errores típicos de principiante, como `{ codigo, retro }`. `retro` es el texto (o la lista de textos) que **debe** aparecer en la retroalimentación. Por ejemplo, para `print()` vacío, `retro: 'print(annual_salary)'` |

## 5. Quizzes
- La `explicacion` dice por qué la correcta es correcta **y** por qué la opción tentadora es incorrecta.
- No hay opciones con "trampa" de redacción: la dificultad está en el concepto.

## 6. Tono y lenguaje
- Español neutro, tuteo y lenguaje sin género cuando se habla al jugador ("te damos la bienvenida", no "bienvenido").
- Nunca culpa ni vergüenza. El error es información.
- Código, identificadores, tablas y columnas en inglés, como en el trabajo.

## 7. Exactitud
- Todo número que se afirme en diálogos, explicaciones o enunciados se verifica ejecutando código.
- Los datos reales (FRED/BLS y Grunfeld) se citan con su fuente y no se inventan valores.

## 8. Compatibilidad
- No se cambian los `id` existentes de misiones ni de pasos, ni `requiere`, `nivelDiagnostico`, `recompensa` o `conceptos`. Sí se pueden **agregar** pasos nuevos con ids nuevos.

## 9. Verificación
```
node scripts/verificar-mision.js <id>                             # una misión: debe imprimir ✔
node scripts/probar-respuesta.js <idMision> <idPaso> archivo.py   # ver la retroalimentación exacta de una respuesta
npm test                                                          # todo
```
