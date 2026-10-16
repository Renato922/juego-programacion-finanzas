# Diseño de Cóndor Capital

Este documento deriva de la investigación (`docs/investigacion/01` a `05`) y describe cómo funciona el juego. Cada regla tiene su porqué, con referencia al documento de investigación correspondiente.

## 1. Fantasía y premisa
Entras como **Analista Junior** en *Cóndor Capital*, un fondo de inversión latinoamericano. Cada capítulo es una etapa de tu carrera (Analista → Analista Senior → … → **Dueño del fondo**). Resuelves problemas reales del fondo con código, y el capital que ganas lo inviertes en tu oficina y en el fondo (*tycoon*).

**Personajes.**
- **Marta Ríos**, gestora y tu mentora: enseña Python.
- **Bruno Salas**, analista senior y rival amistoso: enseña SQL.
- **Don Aurelio Cóndor**, el fundador.
- Un **jefe** por capítulo. En el capítulo 1 es la auditora **Irene Valdivia**.

## 2. Bucles de juego

### Bucle principal (5 a 10 min): la misión
`Diálogo → Lección con ejemplo ejecutable → Quiz → Ejercicio(s) → Diálogo de cierre → Recompensas`
- **Un concepto nuevo por misión** (carga cognitiva, doc. 3 §7).
- Los ejercicios **no se saltan**: se avanza al resolver (aprendizaje por dominio, doc. 3 §6).
- **Validación por resultado:** cualquier solución correcta vale (doc. 1, Zachtronics; doc. 3 §8).
- Al fallar se muestra el error explicado en español. Desde el segundo intento fallido aparece el valor esperado y una sugerencia de pista.
- **3 pistas** que escalan: idea → estructura → casi solución con huecos `___` (doc. 3 §9).
- Pausa en cualquier momento, con borrador guardado (efecto Ovsiankina, doc. 2 §2).

### Bucle de sesión (10 a 30 min): encadenar
Al cerrar una misión se ofrece "**Siguiente: …▸**". La recomendación alterna Python y SQL (intercalado) y, si hay 4 o más repasos vencidos, propone ir a la Sala de trading.

### Bucle diario o semanal: volver
- **Meta semanal flexible** (1 a 7 días, 3 por defecto). Los días no tienen que ser seguidos y la semana empieza en blanco cada lunes.
- **Contador total de días activos** que nunca baja.
- **Repasos vencidos** que pagan ×2.
- **Mensaje de regreso** cálido; con el modo compromiso, incluye tu motivo (doc. 2 §10).
- **Sin notificaciones.**

### Bucle largo: carrera y tycoon
- Rangos que exigen XP **y** vencer al jefe del capítulo (gradiente de meta, doc. 2 §7).
- Mejoras de oficina que cambian el pixel art y dan efectos.
- Fondo con perfil de riesgo y colección de cartas.

## 3. Progresión

| Elemento | Regla | Código |
|---|---|---|
| XP | Por misión (60 a 90), jefe (300) y repasos (2 a 10). Empiezas con 60 (progreso dotado) | `src/core/progreso.js`, `src/core/estado.js` |
| Rangos | Junior (0) → Analista (800 + jefe cap. 1) → Senior (2000 + jefe cap. 2) → … → Dueño (20000 + jefe cap. 8) | `src/contenido/rangos.js` |
| Desbloqueos | Cada misión exige las anteriores de su pista; el jefe exige el final de ambas pistas | `requiere` en cada misión |
| Test de nivel | Adaptativo por área: sube de nivel mientras aciertas y el primer error o "No lo sé" cierra el área. Convalida misiones con `nivelDiagnostico ≤ nivel` | `src/core/diagnostico.js` |
| Convalidadas | Pagan 50% (sin bono). Sus conceptos se repasan en 2 días para confirmar con práctica | `convalidarMisiones` |
| Rejugar | Siempre se puede. Paga 25%, no abre caja y califica las tarjetas | `completarMision` |

## 4. Economía del fondo (tycoon)

**Monedas.**
- **Capital ($):** efectivo que ganas.
- **AUM:** capital + valor del fondo (lo que se muestra como tamaño del fondo).

**Ingresos.**
- Misión: capital base × (1 + mejoras) × (1 + 25% × fracción de ejercicios limpios). "Limpio" = sin errores ni pistas. **Las pistas no restan la base.**
- Caja de dividendos al completar por primera vez. **Siempre positiva**:
  - 60%: +10% a 30% del pago;
  - 25%: carta brillante cosmética;
  - 15%: pago doble.
- Sala de trading: P&L = Σ valor × combo (repasos vencidos ×2; combo de x1 a x3).
- Primera instalación verificada de R: +$500.

**Gastos: mejoras** (`src/contenido/mejoras.js`), con costo base × crecimiento^nivel:

| Mejora | Efecto |
|---|---|
| Segundo monitor | +10% de capital por nivel |
| Cafetera | +5% de XP por nivel |
| Terminal de datos | +0.1% de retorno esperado del fondo por actividad |
| Mesa de riesgo | Desbloquea los perfiles Balanceado y Agresivo |
| Practicante | +1 comodín en el trading |
| Expansión de oficina | Cubículo → oficina → piso → penthouse (cosmético) |
| Planta | Cosmética |

**El fondo.**
- Inviertes o retiras capital.
- Rinde **por actividad completada** (misión o jefe), **nunca por tiempo**, así que la ausencia no gana ni pierde (doc. 2 §5).
- Retorno por actividad ~ Normal(media, desvío), acotado a ±3 desvíos:

| Perfil | Media | Desvío |
|---|---|---|
| Conservador | 0.4% | 0.4% |
| Balanceado | 0.8% | 1.2% |
| Agresivo | 1.2% | 3.0% |

- El perfil conservador pierde en menos del 20% de las actividades (verificado en `test/economia.test.js`). El agresivo enseña la volatilidad.

**Balance de referencia.** Jugar el capítulo 1 completo da unos **$35,000 a $40,000** (en dos corridas de la prueba automática: $36,068 y $39,090, sin invertir; varía por la caja de dividendos). Alcanza para varias mejoras de nivel 1 y 2 y empezar a invertir. Los costos de mejoras del capítulo 2 en adelante se calibrarán con esa cifra.

## 5. Batallas contra jefes
- Un jefe por capítulo, con **barra de vida** = suma del daño de sus fases (capítulo 1: 6 fases, 100 HP).
- Cada fase es un ejercicio o quiz que **mezcla** temas de todo el capítulo y de capítulos anteriores (intercalado). El jefe "provoca" en cada fase.
- **No hay vida del jugador**: fallar no hace perder; se corrige y se sigue (doc. 1, Hades).
- **Crítico** con 2 o más fases limpias seguidas (efecto visual).
- **Nota final**:

| Nota | Condición |
|---|---|
| S | Todo limpio |
| A | 70% o más limpio y sin última pista |
| B | 40% o más limpio |
| C | El resto |

- Se guarda la mejor nota y se puede pedir **revancha** cuando quieras (doc. 1, Zachtronics).
- **Jefes en herramientas reales** (capítulos 2 a 6): el juego entrega los archivos del reto (CSV/XLSX, exportados con `plataforma.exportarArchivo`) y valida el resultado pegando valores (`validarRespuestaEscrita`, que ya acepta "1.234,56", "12%" y "$ 3 000") o leyendo el archivo exportado (`plataforma.importarArchivo`). La infraestructura ya existe; el contenido llega con cada capítulo.

## 6. Entrenamiento y repaso espaciado ("Sala de trading")
- Cada concepto aprendido es una **tarjeta SM-2** (doc. 3 §2). La calidad (0 a 5) sale del desempeño: intentos, pistas y última pista.
- **Sesión**: 5 rondas (3 en modo poca energía). En cada ronda hay **3 operaciones** de conceptos distintos, priorizando vencidas, débiles y lenguajes diferentes (intercalado), y eliges una (autonomía, doc. 1, Slay the Spire).
- **Tipos de reto**: pregunta rápida, completar, o escribir código (este último no aparece en modo poca energía).
- **Combo** +0.5 por acierto hasta x3. Un error vuelve a x1 **sin restar P&L** y deja el concepto para revancha.
- **Potenciadores** tras 2 aciertos seguidos:
  - Mercado alcista: ×2;
  - Cobertura: protege el combo;
  - Análisis previo: descarta una opción incorrecta.
- **Comodines** (mejora Practicante): saltar una ronda.
- **Reglas de bienestar**: lo vencido no pierde fuerza, solo paga más; la pila atrasada se reparte en varios días; la colección nunca baja de estrellas.

## 7. Colección
Una carta por concepto (29 en el capítulo 1). Las no descubiertas se ven como "???". Las estrellas (0 a 4) reflejan la mejor racha de repasos correctos. Las cartas brillantes salen de las cajas.

## 8. Accesibilidad y bienestar
- **Modo poca energía**, botón "2 minutos", sin temporizadores, sin notificaciones y sin rankings sociales.
- Animaciones y sonido desactivables, y se respeta `prefers-reduced-motion`.
- Atajos de teclado (Ctrl+Enter, Shift+Enter, Enter para diálogos).
- Lenguaje sin culpa por defecto. Modo compromiso opcional con reglas estrictas (doc. 2 §10).
- Progreso solo local, con exportar e importar respaldo. Borrar la partida exige doble confirmación.

## 9. Estilo visual
Pixel art dibujado por código (retratos 16×16 y oficina 192×108) más una "terminal financiera" oscura:
- tipografías **Press Start 2P** (títulos) y **VT323** (texto), ambas con licencia OFL;
- cinta de cotizaciones;
- gráficos en vivo del fondo y del P&L, de una serie con tooltip, con colores validados para fondo oscuro.

## 10. Arquitectura técnica

```
electron/      main.js (ventana, protocolo app://, caché de Pyodide, guardado), preload.cjs (puente seguro), rutas.js
src/core/      lógica pura y probada: srs, economía, validación, errores, progreso, diagnóstico, batallas, entrenamiento, regreso, arnés de Python, ejecutor SQL, evaluador
src/contenido/ capítulos, misiones, jefes, conceptos (con repasos), mejoras, rangos, test de nivel, base de datos del fondo
src/runtimes/  workers de Python (Pyodide) y SQL (sql.js), motores con tiempo máximo, versiones fijas
src/ui/        interfaz sin frameworks: pantallas, pasos, editor (CodeMirror 5), pixel art, gráficos, sonido
src/plataforma escritorio (Electron) vs. navegador: guardar, exportar, importar, abrir enlaces
datos/         CSV reales (dominio público) + FUENTES.md
test/          node:test: lógica + ejecución real de TODOS los ejercicios en Pyodide y sql.js
```

**Decisiones técnicas.**
- **El mismo código valida en el juego y en las pruebas.** `src/core/evaluador.js` recibe "motores": en el juego son Web Workers y en las pruebas son Pyodide y sql.js cargados en Node. Así `npm test` ejecuta *de verdad* cada solución de referencia, comprueba que el código inicial no pase, que las soluciones alternativas pasen y que las respuestas incorrectas conocidas fallen.
- **Workers con tiempo máximo**: 8 s para Python y 5 s para SQL. Si se pasa (por ejemplo, un bucle infinito), se termina el worker y se explica el error.
- **Pyodide** se descarga del CDN de jsDelivr la primera vez y queda en `userData/runtimes/pyodide-<versión>/`; después funciona sin internet. **sql.js** viene incluido (~1 MB). **webR** usará el mismo mecanismo de caché.
- **Seguridad de Electron**: `contextIsolation`, `sandbox`, sin `nodeIntegration`, CSP, navegación bloqueada fuera de `app://` y enlaces externos solo `https` abiertos en el navegador.
- **Preparado para un modo celular**: la interfaz no depende de Electron (todo pasa por `src/plataforma/`), el diseño es responsivo y el modo navegador (`npm run web`) ya funciona. Un modo celular podría empaquetarse más adelante con un contenedor web, sin reescribir el juego.
