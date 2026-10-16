# Roadmap

Estado actual: **v0.1, capítulo 1 jugable** (Python + SQL, 13 misiones y jefe). El resto se agrega por etapas con la estructura ya preparada (`src/contenido/index.js`: los capítulos 2 a 8 ya aparecen en el mapa como "próximamente").

## Cómo se agrega un capítulo
1. Crear `src/contenido/capitulos/capN/` con `misiones-*.js`, `jefe.js` e `index.js` (ver `cap1/`).
2. Agregar sus conceptos, con al menos 2 repasos cada uno, en `src/contenido/conceptos.js`.
3. Registrar el capítulo en `CAPITULOS` con `disponible: true`.
4. Si usa un lenguaje nuevo, agregar su motor en `src/runtimes/` y su rama en `src/core/evaluador.js`.
5. `npm test` valida automáticamente todos los ejercicios nuevos (solución, código inicial, alternativas e incorrectas).

## Capítulo 2: Riesgo y volatilidad (Python con numpy/pandas + R)
**Ascenso:** Analista → Analista Senior.

**Infraestructura nueva.**
- Motor de R con **webR** (WebAssembly) en un worker, con caché igual que Pyodide.
- Paquetes de Pyodide (numpy, pandas, matplotlib) cargados bajo demanda y mostrados en el editor.

**Misiones previstas.**
- **Python:** "¿Cuánto se mueve CND?" (desviación estándar), "Volatilidad anualizada" (√252), "pandas: tu primera tabla", "Volatilidad móvil con `rolling`", "Gráficos con matplotlib".
- **R:** "Instala tu estación de R" (ya disponible en Herramientas), "Vectores y data frames", "dplyr: filtrar y resumir `us_macro`", "ggplot2: la crisis en un gráfico".

**Jefe "El comité de riesgos"** en **RStudio real**: el juego entrega un CSV, el jugador produce una tabla de volatilidades por activo y un gráfico, y pega en el juego los valores clave.

## Capítulo 3: Los estados financieros (Excel + SQL intermedio)
**Ascenso:** Analista Senior → Asociado.
- **Excel (simulado y real):** referencias, `BUSCARX`, tablas, tablas dinámicas, ratios, "Tu propio presupuesto" (opcional).
- **SQL:** `CASE`, subconsultas, `UNION`, libro mayor contable.
- **Jefe "El cierre de Llama Retail"** en **Excel real**: estados financieros y ratios a partir de un .xlsx exportado por el juego; validación por valores pegados.

## Capítulo 4: Valuación, DCF y bonos (Excel/VBA + Python)
**Ascenso:** Asociado → Vicepresidente.
- **Python:** VAN y TIR desde cero (bisección y Newton), precio y YTM de bonos, duración, clases `Bond` y `Portfolio`.
- **Excel/VBA:** `VNA`, `TIR`, `PAGO`, sensibilidad, Buscar objetivo, macros y UDF.
- **Jefe "Valuar Cóndor Minera"** en **Excel + VBA real**: un DCF con tabla de sensibilidad y una macro que la regenera. El juego valida el valor por acción en tres escenarios.

## Capítulo 5: El reporte del directorio (Power BI + SQL avanzado)
**Ascenso:** Vicepresidente → Director de Inversiones.
- **SQL:** CTE (incluida la recursiva), funciones de ventana (`LAG`, `SUM() OVER`, `RANK`), esquema estrella.
- **Power BI (simulado):** Power Query/M, relaciones, medidas DAX, `CALCULATE`, inteligencia de tiempo.
- **Jefe "Presupuesto vs. real"** en **Power BI Desktop real**: modelo, medidas YTD y YoY, y desvíos. Se validan los valores de las medidas.

## Capítulo 6: Portafolios y CAPM (Python + R)
**Ascenso:** Director → Portfolio Manager.
- Covarianza, frontera eficiente (`scipy.optimize`), máximo Sharpe, beta por regresión (`statsmodels`, `lm`), Fama-French opcional.
- **Jefe en RStudio:** regresión CAPM de los activos del fondo.

## Capítulo 7: Riesgo de mercado (Python + R)
**Ascenso:** Portfolio Manager → Socio.
- VaR (histórico, paramétrico y Monte Carlo), Expected Shortfall, Black-Scholes, árbol binomial, coberturas.

## Capítulo 8: El fondo es tuyo (Python + SQL + Power BI)
**Ascenso:** Socio → **Dueño del fondo**.
- Backtesting (sesgos, costos, métricas), series de tiempo (ARIMA), scoring de crédito con scikit-learn, tablero final.
- **Jefe final:** presentar la estrategia del fondo ante Don Aurelio, combinando los cinco lenguajes.

## Mejoras transversales planificadas
- **Datos reales actualizados:** un script opcional para descargar series de FRED y del Banco Mundial a `datos/`, revisando la licencia de cada serie. En FRED muchas series son de dominio público, pero no todas: algunas tienen derechos de terceros. Los datos del Banco Mundial suelen ser CC BY 4.0; hay que verificarlo por serie.
- **Retos opcionales de optimización** ("hazlo en menos líneas", "sin bucles con pandas").
- **Percentiles contra tus propios intentos** (al estilo Opus Magnum, pero local).
- **Intención de implementación** opcional ("¿cuándo vas a jugar?"), sin notificaciones.
- **Métricas locales de dificultad** para rebalancear ejercicios con muchos intentos fallidos, sin enviar datos a ningún lado.
- **Modo celular**: la interfaz ya funciona en navegador y tiene un diseño responsivo. Falta adaptar el editor de código a pantallas táctiles y elegir el empaquetado.
- **Firma de código del .exe**: hoy Windows SmartScreen puede advertir que el instalador no está firmado. Firmarlo cuesta dinero, así que se documenta y no se hace (regla: todo gratis).
