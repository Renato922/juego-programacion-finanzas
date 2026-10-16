# 5. Temario financiero completo

Para cada tema: **qué se enseña**, **con qué lenguaje** y **en qué misión**. Las misiones marcadas con ✔ ya existen (capítulo 1); las demás son las misiones planificadas en `docs/roadmap.md` (los nombres pueden cambiar).

> **Textos de referencia** (clásicos de grado y posgrado, citados por autor y título): Brealey, Myers y Allen, *Principles of Corporate Finance*; Bodie, Kane y Marcus, *Investments*; Hull, *Options, Futures, and Other Derivatives*; Jorion, *Value at Risk*; Damodaran, *Investment Valuation*. Damodaran publica datos y planillas gratuitas en su sitio de NYU Stern. Artículos fundacionales: Markowitz (1952, *Journal of Finance*, "Portfolio Selection"), Sharpe (1964, *Journal of Finance*, CAPM), Black y Scholes (1973, *Journal of Political Economy*) y Fama y French (1993, *Journal of Financial Economics*).
>
> **Datos.** Reales y de dominio público en `datos/` (ver `datos/FUENTES.md`), más casos de empresas inventadas pero realistas (Cóndor Minera, Banco Pacífico, etc.).

| # | Tema | Qué se enseña | Lenguaje | Misión |
|---|---|---|---|---|
| 1 | **Valor del dinero en el tiempo** | interés simple y compuesto, capitalización, regla del 72, valor presente y futuro | Python, Excel | ✔ `py-02` La fuerza del interés compuesto; ✔ `py-06` Tu caja de herramientas; Excel: `VF`/`VA` (cap. 4) |
| 2 | **Anualidades y préstamos** | cuota fija (sistema francés), tabla de amortización, tasa efectiva vs. nominal | Python, Excel, SQL | ✔ `py-06` (cuota); cap. 3 "La hipoteca de Bruno" (tabla en Excel); cap. 5 CTE recursiva de amortización en SQL |
| 3 | **Retorno** | retorno simple y logarítmico, acumulado, CAGR vs. promedio aritmético | Python, SQL, R | ✔ `py-04` Retornos de IBM; cap. 5 `LAG` en SQL; cap. 2 `dplyr::mutate` en R |
| 4 | **Contabilidad y estados financieros** | balance, estado de resultados, flujo de caja; devengado vs. caja; cómo se conectan | Excel, SQL | cap. 3 "Los libros de Llama Retail" (Excel), "El mayor contable" (SQL `GROUP BY` por cuenta) |
| 5 | **Ratios financieros** | liquidez (corriente, ácida), endeudamiento (deuda/activos, D/E, cobertura de intereses), rentabilidad (ROE, ROA, márgenes), eficiencia (rotaciones), DuPont | Python, Excel, Power BI | ✔ `py-05` Reglas de riesgo (deuda/activos); cap. 3 tablero de ratios en Excel; cap. 5 medidas DAX |
| 6 | **Flujos de caja y DCF** | flujo de caja libre (FCFF/FCFE), WACC, valor terminal (Gordon y múltiplos), sensibilidad | Excel/VBA, Python | cap. 4 "Valuar Cóndor Minera" (jefe en Excel real con tabla de sensibilidad) |
| 7 | **VAN y TIR** | VAN, TIR, TIR múltiple, período de recuperación, índice de rentabilidad; TIR por bisección y Newton | Python, Excel | cap. 4 "Proyecto Andes Energía" (Python desde cero, comparado con `VNA`/`TIR` de Excel) |
| 8 | **Renta fija y bonos** | precio, rendimiento al vencimiento (YTM), cupón vs. tasa, duración y convexidad, curva de tasas | Python, Excel, R | cap. 4 "Bono Tesoro 2030" (BTP del juego); cap. 2 con las tasas reales de `us_macro` (`tbilrate`) |
| 9 | **Acciones y valoración relativa** | modelo de dividendos (Gordon), múltiplos (P/E, EV/EBITDA), comparables | Excel, SQL | cap. 4 "Comparables del sector minero" |
| 10 | **Riesgo y volatilidad** | varianza, desviación estándar, volatilidad anualizada (×√252), *drawdown*, distribución de retornos, colas | Python (numpy/pandas), R | cap. 2 completo: "¿Cuánto se mueve CND?", "Volatilidad móvil", jefe en RStudio |
| 11 | **Diversificación y correlación** | covarianza, correlación, efecto de la diversificación | Python, R | cap. 6 "El almuerzo gratis de la diversificación" |
| 12 | **Teoría de portafolios (Markowitz)** | pesos y retorno esperado del portafolio, frontera eficiente, mínima varianza, máximo Sharpe | Python (scipy), Excel (Solver) | ✔ `py-07` Tu primera cartera modelo (pesos y retorno esperado); cap. 6 "La frontera eficiente" |
| 13 | **CAPM y beta** | beta por regresión, alfa de Jensen, línea del mercado de valores, Sharpe, Treynor | R (`lm`), Python (statsmodels) | cap. 6 "Beta de Quetzal Tech" (jefe en RStudio) |
| 14 | **Factores** | Fama-French (3 factores) como extensión del CAPM | R, Python | cap. 6 misión opcional |
| 15 | **VaR y riesgo de mercado** | VaR histórico, paramétrico y Monte Carlo; Expected Shortfall; backtesting del VaR | Python, R | cap. 7 "El comité de riesgos" |
| 16 | **Derivados básicos** | forwards, futuros, opciones (pagos), paridad put-call, Black-Scholes, árbol binomial, cobertura | Python, Excel | cap. 7 "Cubrir el cobre de Cóndor Minera" |
| 17 | **Simulación Monte Carlo** | movimiento browniano geométrico, simulación de portafolios, probabilidad de cumplir una meta (jubilación) | Python, R | cap. 7 "Mil futuros posibles" |
| 18 | **Series de tiempo y econometría** | tendencia, estacionalidad, autocorrelación, estacionariedad, ARIMA, regresión con datos macro (inflación vs. desempleo) | R, Python | cap. 2 (gráficos de `us_macro`); cap. 8 "Pronosticar la inflación" |
| 19 | **Backtesting de estrategias** | señales (medias móviles, momentum), costos, *look-ahead* y sesgo de supervivencia, métricas (CAGR, Sharpe, *drawdown*) | Python, SQL | cap. 8 "La estrategia de Bruno" (jefe final) |
| 20 | **Análisis de crédito** | 5 C del crédito, scoring, probabilidad de default, regresión logística, matriz de confusión | Python (scikit-learn), SQL | ✔ `py-05` (clasificación por ratio); cap. 8 "Modelo de scoring de Banco Pacífico" |
| 21 | **Presupuestos y FP&A** | presupuesto vs. real, análisis de desvíos (precio/volumen), forecast continuo (*rolling forecast*), KPIs, tableros | Power BI, Excel, SQL | cap. 5 completo: "El reporte del directorio" (jefe en Power BI Desktop) |
| 22 | **Finanzas personales** | presupuesto 50/30/20 (como heurística), fondo de emergencia, interés de tarjetas, inflación y poder de compra, interés compuesto para la jubilación | Python, Excel | ✔ `py-01` (sueldo anual); ✔ `py-02`; cap. 3 "Tu propio presupuesto" (opcional, con tus datos, que nunca salen de tu PC) |
| 23 | **Macroeconomía para analistas** | tasas de interés y política monetaria, inflación, desempleo, ciclos, tasa real = nominal − inflación | SQL, Python, R | ✔ `sql-01` a `sql-05` (datos reales `us_macro`: desempleo de 1982-83 y 2009, inflación de 1980); ✔ `py-03` (T-bills en 2008) |
| 24 | **Inversión corporativa (datos históricos)** | inversión, valor de mercado y stock de capital; relación inversión-valor (Grunfeld, un clásico de la econometría) | SQL, Python, R | ✔ `sql-05` (Grunfeld por empresa); ✔ `py-04` (IBM); cap. 6 regresión de inversión sobre valor en R |
| 25 | **Operaciones y back office** | libro de operaciones, compras y ventas, conciliación, P&L por posición | SQL, Python | ✔ `sql-01` a `sql-06` (tabla `trades`); ✔ jefe "La auditoría de fin de mes" (P&L por posición) |

## Cobertura del capítulo 1 (lo que ya está jugable)
- **Finanzas:**
  - interés compuesto y regla del 72;
  - retorno simple y CAGR;
  - endeudamiento y clasificación de riesgo;
  - stop-loss;
  - valor presente;
  - cuota de préstamo;
  - pesos y retorno esperado de un portafolio;
  - lectura de datos macro reales;
  - libro de operaciones y P&L.
- **Datos reales usados:**
  - tasas de T-bills de EE. UU. 2007-2009;
  - desempleo e inflación de EE. UU. 1959-2009;
  - valor de mercado de IBM 1947-1954;
  - inversión de 11 empresas 1935-1954.

## Principio pedagógico
Cada tema financiero se introduce con **un caso** (un cliente, un comité, una auditoría) antes de la fórmula, y la fórmula se escribe **en código** en lugar de memorizarse. Cuando un tema se repite en otro lenguaje (VAN en Python y en Excel; retornos en Python, SQL y R), el juego lo señala, porque en el trabajo vas a elegir la herramienta según el contexto.
