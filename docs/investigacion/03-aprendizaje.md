# 3. Métodos de aprendizaje con evidencia

> Las referencias son publicaciones conocidas y muy citadas; se dan por autor, año y revista para que se puedan buscar en Google Scholar. Las que tienen enlace se revisaron durante esta investigación. La guía más completa para empezar es Dunlosky y otros (2013), que evalúa 10 técnicas de estudio según la calidad de su evidencia.

## Resumen

| Técnica | Evidencia | Dónde está en el juego |
|---|---|---|
| Práctica de recuperación | Alta | Cada misión termina en ejercicios y quizzes; la Sala de trading es solo recuperación |
| Repaso espaciado | Alta | Tarjetas por concepto con algoritmo SM-2 adaptado |
| Práctica intercalada | Moderada a alta (más en matemáticas) | Repasos que alternan lenguajes; jefes que mezclan temas; pistas Python/SQL alternadas |
| Ejemplos resueltos | Alta para principiantes | Cada concepto nuevo empieza con un ejemplo ejecutable |
| Desvanecimiento de la guía (*fading*) | Moderada a alta | Ejemplo → ejercicio con código inicial → ejercicio en blanco (jefe) |
| Efecto de reversión por experticia | Moderada | Test de nivel que salta lo conocido |
| Aprendizaje por dominio | Alta (efecto moderado) | No se avanza sin resolver; los requisitos encadenan misiones |
| Carga cognitiva | Alta (teoría) | Un concepto nuevo por misión, datos chicos, esquema visible |
| Retroalimentación inmediata y elaborada | Alta | El validador explica qué falló y por qué, en español |
| Pistas graduadas | Moderada | 3 pistas: idea → estructura → casi solución |
| Mensajes de error mejorados | Mixta pero prometedora | Traducción de errores de Python y SQL |

---

## 1. Práctica de recuperación (*retrieval practice*)
**Qué dice la evidencia.**
- Intentar recordar fortalece la memoria más que releer.
- En Roediger y Karpicke (*Psychological Science*, 2006), los estudiantes que se autoevaluaron recordaron bastante más una semana después que quienes releyeron, aunque los que releyeron se sentían más seguros.
- Karpicke y Roediger (*Science*, 2008) mostraron que repetir la recuperación, y no repetir el estudio, era lo que sostenía la memoria a largo plazo.
- Dunlosky y otros (*Psychological Science in the Public Interest*, 2013) le dan a la "práctica con pruebas" utilidad **alta**.

**Implementación.**
- Las misiones no son "lee y sigue": cada concepto termina en un **ejercicio que hay que resolver**.
- La Sala de trading es 100% recuperación (opción múltiple, completar y escribir código), sin material para releer durante la pregunta.

## 2. Repaso espaciado
**Qué dice la evidencia.**
- Repartir el estudio en el tiempo supera a concentrarlo, y el intervalo óptimo crece con el tiempo que se quiere retener. Ver el metaanálisis de Cepeda y otros (*Psychological Bulletin*, 2006), con raíces en la curva del olvido de Ebbinghaus (1885). Dunlosky y otros (2013) le dan utilidad **alta**.
- Algoritmos usados en producción:
  - **SM-2** (Wozniak, SuperMemo, 1987-1990; la base de Anki).
  - **Half-life regression** de Duolingo (Settles y Meeder, ACL 2016, [P16-1174](https://aclanthology.org/P16-1174)).

**Implementación (`src/core/srs.js`).**
- **SM-2 adaptado.** Cada concepto es una tarjeta con facilidad (empieza en 2.5 y nunca baja de 1.3), intervalo e historial.
- **Calidad 0 a 5 deducida del desempeño** (`calidadDesdeDesempeno`):
  - 5: correcto al primer intento y sin pistas;
  - 4: un error o una pista;
  - 3: más errores;
  - 2: correcto solo con la última pista;
  - 1: incorrecto.
- **Intervalos:** 1 día → 3 días → intervalo × facilidad. Un fallo vuelve a 1 día.
- **Adaptaciones por bienestar** (doc. 2):
  - nunca se resta "fuerza" por ausencia;
  - lo vencido paga el doble;
  - la colección usa la **mejor racha** (nunca baja);
  - al volver tras mucho tiempo, `repartirAtrasadas` reparte la pila (8 por día; 3 con poca energía).
- **Por qué SM-2 y no HLR:** HLR necesita entrenarse con muchos datos de muchos usuarios, y aquí no hay servidores. SM-2 funciona bien con un solo usuario.
- **Pruebas:** `test/srs.test.js`.

## 3. Práctica intercalada
**Qué dice la evidencia.**
- Mezclar tipos de problemas en vez de agruparlos por tema mejora la capacidad de elegir el método correcto, aunque la práctica se sienta más difícil (Rohrer y Taylor, *Instructional Science*, 2007, en matemáticas).
- Es una "dificultad deseable" (Bjork, 1994).
- La evidencia es más fuerte cuando los temas mezclados se parecen y se confunden entre sí.

**Implementación.**
- `intercalar()` evita dos tarjetas seguidas del mismo lenguaje.
- La Sala de trading ofrece 3 operaciones de lenguajes distintos cuando se puede.
- El botón "Siguiente misión" alterna entre la pista de Python y la de SQL.
- Los **jefes mezclan** SQL, Python y finanzas en fases seguidas.
- Las misiones reutilizan conceptos anteriores (por ejemplo, `py-05` usa bucles de `py-04` y `py-06` usa `if` de `py-05`).

## 4. Ejemplos resueltos y desvanecimiento
**Qué dice la evidencia.**
- Para principiantes, estudiar ejemplos resueltos rinde más que resolver problemas desde cero (Sweller y Cooper, *Cognition and Instruction*, 1985).
- La guía debe **desvanecerse** a medida que la persona aprende.
- La instrucción con guía mínima es menos eficaz para novatos (Kirschner, Sweller y Clark, *Educational Psychologist*, 2006).

**Implementación.**
- Cada concepto nuevo arranca con una **lección con ejemplo ejecutable** (botón "Ejecutar ejemplo").
- Después viene un ejercicio con **código inicial** (la estructura ya está y falta la idea clave).
- Más adelante, ejercicios en blanco. Los jefes no traen código inicial.

## 5. Efecto de reversión por experticia
**Qué dice la evidencia.** Lo que ayuda a un principiante (ejemplos, explicaciones) puede **estorbar** a alguien con experiencia (Kalyuga, Ayres, Chandler y Sweller, *Educational Psychologist*, 2003).

**Implementación.**
- **Test de nivel adaptativo**: convalida misiones que ya dominas y paga la mitad de su capital.
- "Saltar diálogo" y "Mostrar los diálogos completos al instante" para quien quiere ir directo al código.

## 6. Aprendizaje por dominio (*mastery learning*)
**Qué dice la evidencia.**
- Avanzar solo cuando se domina lo anterior, con retroalimentación y corrección, mejora el rendimiento. Un metaanálisis encontró efectos positivos consistentes (Kulik, Kulik y Bangert-Drowns, *Review of Educational Research*, 1990).
- Bloom (*Educational Researcher*, 1984) planteó el "problema de las 2 sigmas": la tutoría individual con dominio rendía mucho más que la clase tradicional. Esa cifra se considera hoy optimista, y efectos posteriores fueron menores.

**Implementación.**
- **No se avanza hasta resolver bien** (decisión del encargo y respaldada por esta evidencia).
- Las misiones se desbloquean por requisitos.
- El jefe exige terminar ambas pistas.

## 7. Carga cognitiva
**Qué dice la evidencia.** La memoria de trabajo es limitada; el diseño debe evitar la carga innecesaria (Sweller, *Cognitive Science*, 1988).

**Implementación.**
- **Un concepto nuevo por misión** (dos como máximo).
- Datos pequeños en Python (listas de 6 a 8 valores).
- Esquema de la base siempre visible en SQL, con una descripción en español de cada tabla.
- Explicación y código lado a lado (efecto de atención dividida).
- Nombres en inglés coherentes en todo el capítulo.

## 8. Retroalimentación inmediata y elaborada
**Qué dice la evidencia.**
- La retroalimentación es de las intervenciones más potentes, sobre todo cuando informa sobre la tarea y cómo mejorar, y no sobre la persona (Hattie y Timperley, *Review of Educational Research*, 2007).
- La retroalimentación formativa debe ser específica y oportuna, sin abrumar (Shute, *Review of Educational Research*, 2008).

**Implementación (`src/core/validacion.js`, `src/core/errores.js`).**
- **Validación por resultado:** se ejecuta la solución de referencia y se compara con lo que produce el jugador (variables, funciones con casos de prueba, salida impresa o tabla SQL), con tolerancia numérica.
- **Mensajes específicos**, por ejemplo:
  - "La variable fee_rate: el número no coincide; obtuviste 0, que es menor que lo esperado".
  - "Tu consulta devuelve 3 columnas y se esperaban 2: sector, total".
  - "Las filas son correctas, pero el orden no; revisa tu ORDER BY".
- **El valor esperado se muestra recién al segundo intento fallido**, para no regalar la respuesta pero tampoco dejar trabado a nadie.
- La retroalimentación habla de la **tarea**, nunca de la persona.

## 9. Pistas graduadas
**Qué dice la evidencia.**
- Los tutores inteligentes usan pistas que van de lo general a lo específico. Hay un "dilema de la asistencia": demasiada ayuda impide aprender y muy poca frustra (Koedinger y Aleven, *Educational Psychology Review*, 2007).
- Pedir ayuda solo cuando hace falta se asocia con mejor aprendizaje.

**Implementación.**
- **3 pistas por ejercicio**: (1) la idea, (2) la estructura, (3) casi la solución, con huecos `___` para completar.
- Abrir pistas **no resta** recompensa base, pero el ejercicio deja de contar como "limpio" (sin el +25%) y el repaso espaciado lo vuelve a mostrar antes.
- La sugerencia de abrir una pista aparece después de 2 intentos fallidos.

## 10. Errores de programación mejorados
**Qué dice la evidencia.**
- Los mensajes de error de los compiladores son una barrera conocida para principiantes (Becker y otros, *Computer Science Education*, 2016, sobre mensajes mejorados; la evidencia es mixta pero en general favorable).
- La literatura de enseñanza de programación muestra que los novatos tienen más problemas con *combinar* construcciones que con entenderlas por separado (Robins, Rountree y Rountree, *Computer Science Education*, 2003).

**Implementación.**
- Se muestra el mensaje original en inglés (el que vas a ver en el trabajo) **más** un título, una explicación y un consejo en español.
- Hay consejos específicos para errores típicos:
  - usar `^` en vez de `**`;
  - olvidar los `:`;
  - usar `0,05` en vez de `0.05`;
  - sumar texto con números;
  - columnas SQL sin comillas.
- La línea del error se resalta en el editor.
- Los jefes y las misiones avanzadas **combinan** construcciones (bucle + if + diccionario).

## 11. Motivación y aprendizaje: el puente
Ver doc. 2. En resumen: los puntos y niveles funcionan como indicadores de progreso (Mekler y otros, 2017). La motivación sostenida viene de competencia, autonomía y relación (Ryan y Deci, 2000). Por eso la economía del juego acompaña al aprendizaje, pero no lo reemplaza.
