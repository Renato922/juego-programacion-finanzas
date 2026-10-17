# 4. Temario completo por lenguaje (de básico a avanzado)

Cada tema indica el **capítulo** del juego donde se enseña (ver `docs/roadmap.md`) y **cómo** se practica:

- **[juego]**: dentro del juego (Pyodide, webR o sql.js).
- **[simulado]**: el juego lo simula (Power BI, Excel).
- **[real]**: en la herramienta real (jefes finales en RStudio, Excel o Power BI Desktop).

> Referencias oficiales recomendadas: documentación de [Python](https://docs.python.org/3/tutorial/), [pandas](https://pandas.pydata.org/docs/), [NumPy](https://numpy.org/doc/), [statsmodels](https://www.statsmodels.org/), [scikit-learn](https://scikit-learn.org/stable/), el libro gratuito *R for Data Science* 2.ª ed. ([r4ds.hadley.nz](https://r4ds.hadley.nz/)), [funciones de ventana de SQLite](https://www.sqlite.org/windowfunctions.html), [referencia de Power Query M](https://learn.microsoft.com/powerquery-m/), [DAX Guide](https://dax.guide/) y [referencia de VBA para Excel](https://learn.microsoft.com/office/vba/api/overview/excel). Las versiones cambian: verifica las funciones en la documentación vigente.

---

## Python

| Nivel | Tema | Contenido | Cap. |
|---|---|---|---|
| 1 | Fundamentos | `print`, variables, tipos (`int`, `float`, `str`, `bool`), operadores, `//` y `%` | **1 ✔** |
| 1 | Formato | `round`, f-strings (`:,.2f`, `:.1%`), `import math` | **1 ✔** |
| 1 | Colecciones | listas, índices, slicing, `len/sum/max/min`, `append` | **1 ✔** |
| 1 | Control de flujo | `for`, `range`, acumuladores, `if/elif/else`, `and/or`, `break` | **1 ✔** |
| 1 | Funciones | `def`, `return`, parámetros por defecto | **1 ✔** |
| 1 | Diccionarios | acceso, `.get`, `.items()`, tuplas, `sorted` | **1 ✔** |
| 2 | Más estructuras | comprensiones de listas y diccionarios, `while`, `enumerate`, `zip`, conjuntos | 2 |
| 2 | Errores y archivos | `try/except`, leer CSV con `csv` y con pandas, `datetime` | 2 |
| 2 | NumPy | arrays, vectorización, `mean/std`, `np.log`, `np.sqrt(252)`, `percentile` | 2 |
| 2 | pandas I | `DataFrame`, `read_csv`, selección (`loc/iloc`), filtros, `describe`, columnas nuevas | 2 |
| 2 | pandas II | `pct_change`, `rolling` (volatilidad móvil), `resample`, `groupby`, `merge` | 2 |
| 2 | matplotlib | líneas, histogramas, subgráficos, títulos y ejes | 2 |
| 3 | Funciones financieras | VAN, TIR (bisección y Newton), amortización, bonos (precio, YTM, duración) | 4 |
| 3 | POO básica | clases (`Bond`, `Portfolio`), `@dataclass` | 4 |
| 4 | Estadística | `statsmodels`: OLS, R², p-valores; regresión CAPM (beta y alfa) | 6 |
| 4 | Optimización | `scipy.optimize.minimize`: frontera eficiente de Markowitz, máximo Sharpe | 6 |
| 5 | Simulación | Monte Carlo con `numpy.random`, movimiento browniano geométrico, VaR histórico, paramétrico y Monte Carlo | 7 |
| 5 | Derivados | Black-Scholes, árbol binomial, griegas | 7 |
| 6 | Series de tiempo | autocorrelación, ARIMA (`statsmodels.tsa`), estacionariedad (ADF) | 8 |
| 6 | Backtesting | estrategias de cruce de medias y momentum, *look-ahead bias*, costos, *drawdown* | 8 |
| 6 | Machine learning básico | `scikit-learn`: train/test split, regresión logística (default de crédito), árboles, validación cruzada, sobreajuste | 8 |

**Notas técnicas.**
- Pyodide incluye numpy, pandas, matplotlib, scipy, statsmodels y scikit-learn como paquetes precompilados. Conviene verificar la lista exacta en la versión fijada (`src/runtimes/versiones.js`) antes de cada capítulo.
- matplotlib en Pyodide necesita un backend compatible con el navegador: probarlo al empezar el capítulo 2.

## R

| Nivel | Tema | Contenido | Cap. |
|---|---|---|---|
| 0 | Instalación | R desde CRAN, RStudio Desktop (Posit), primer script, consola vs. editor | **Guía ✔** (pantalla Herramientas) |
| 1 | Fundamentos | vectores, `c()`, tipos, `seq`, indexación desde 1, `NA`, funciones, `if/for` | 2 [juego] |
| 1 | data frames | `data.frame`, `str`, `summary`, `$`, `[ , ]` | 2 [juego] |
| 2 | tidyverse | `dplyr` (`filter`, `select`, `mutate`, `arrange`, `group_by`, `summarise`), pipe `|>` / `%>%` | 2 [juego] |
| 2 | Importar y ordenar | `readr::read_csv`, `tidyr` (`pivot_longer/wider`), `lubridate` | 2 [juego] |
| 2 | ggplot2 | gramática de gráficos: `aes`, `geom_line`, `geom_histogram`, `facet_wrap` | 2 [juego] → jefe [real] |
| 3 | Finanzas en R | `quantmod`-like: series de precios, retornos (`TTR`, `PerformanceAnalytics`), `tidyquant` | 6 [real] |
| 3 | Regresión | `lm`, `summary`, diagnóstico de residuos, CAPM, Fama-French | 6 [real] |
| 4 | Simulación | Monte Carlo con `rnorm`, `replicate`; VaR | 7 [juego/real] |
| 4 | Series de tiempo | `ts`, `acf`, `forecast::auto.arima` | 8 [real] |
| 5 | Reportes | R Markdown / Quarto (ya incluido en RStudio) | 8 [real] |

**Notas técnicas.**
- **webR** ejecuta R en WebAssembly y tiene un repositorio con muchos paquetes de CRAN compilados (incluidos varios del tidyverse). Hay que verificar paquete por paquete, porque no todos están (por ejemplo, `quantmod` o `forecast`). Por eso los temas avanzados de R se hacen en **RStudio real**.
- `quantmod::getSymbols` descarga datos de internet (por ejemplo Yahoo Finance o FRED). En el juego conviene usar los CSV incluidos en `datos/` para no depender de servicios externos, y mostrar `getSymbols` como opción para la casa.

## SQL

| Nivel | Tema | Contenido | Cap. |
|---|---|---|---|
| 1 | Consultas básicas | `SELECT`, `FROM`, columnas calculadas, `AS` | **1 ✔** |
| 1 | Filtros | `WHERE`, `AND/OR`, `IN`, `BETWEEN`, comparación de textos y fechas ISO | **1 ✔** |
| 1 | Orden | `ORDER BY`, `ASC/DESC`, `LIMIT`, `DISTINCT` | **1 ✔** |
| 1 | Agregación | `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `ROUND`, `NULL` en `COUNT` | **1 ✔** |
| 1 | Agrupación | `GROUP BY`, `HAVING`, orden de las cláusulas | **1 ✔** |
| 1 | Uniones | `JOIN` (`INNER`), alias de tablas, `LEFT JOIN` + `IS NULL` | **1 ✔** |
| 2 | Lógica | `CASE WHEN`, `COALESCE`, `NULLIF`, `LIKE`, funciones de texto y fecha (`strftime`) | 3 |
| 2 | Subconsultas | en `WHERE` (`IN`, `EXISTS`), en `FROM`, correlacionadas | 3 |
| 2 | Conjuntos | `UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT` | 3 |
| 3 | CTE | `WITH`, varias CTE encadenadas, CTE recursiva (calendario, amortización) | 5 |
| 3 | Funciones de ventana | `ROW_NUMBER`, `RANK`, `LAG/LEAD` (retornos), `SUM() OVER` (acumulados), ventanas móviles (`ROWS BETWEEN`), `PARTITION BY` | 5 |
| 3 | Modelado | claves primarias y foráneas, normalización, esquema estrella (hechos y dimensiones, el puente hacia Power BI) | 5 |
| 4 | DDL/DML | `CREATE TABLE`, `INSERT`, `UPDATE`, `DELETE`, transacciones, índices y `EXPLAIN QUERY PLAN` | 5 |
| 4 | Análisis financiero en SQL | retornos con `LAG`, volatilidad, *drawdown* máximo con ventanas, cohortes de clientes | 8 |

**Notas técnicas.**
- sql.js es SQLite y soporta funciones de ventana (desde SQLite 3.25).
- Se enseñan las diferencias con otros motores (SQL Server `TOP`, PostgreSQL `::`) como notas al margen, porque en el trabajo se usan varios.

## Power BI

| Nivel | Tema | Contenido | Cap. |
|---|---|---|---|
| 1 | Interfaz | vistas Informe, Datos y Modelo; obtener datos (CSV, Excel) | 5 [simulado] |
| 1 | Power Query | tipos de datos, quitar filas, dividir columnas, rellenar, anular dinamización (*unpivot*), combinar (merge/append) | 5 [simulado] |
| 2 | Lenguaje M | `let ... in`, pasos, `Table.SelectRows`, `Table.AddColumn`, parámetros, funciones personalizadas | 5 [simulado] |
| 2 | Modelado | esquema estrella, relaciones 1:*, dirección de filtro, tabla de fechas marcada | 5 [real] |
| 3 | DAX básico | columnas calculadas vs. medidas, `SUM`, `DIVIDE`, `COUNTROWS`, `RELATED` | 5 [simulado] |
| 3 | Contexto | contexto de fila y de filtro, `CALCULATE`, `FILTER`, `ALL`, `ALLEXCEPT` | 5 [simulado] |
| 4 | Inteligencia de tiempo | `DATESYTD`, `TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`, YoY %, promedios móviles | 5 [real] |
| 4 | Visuales | tarjetas, líneas, matrices, segmentaciones, formato condicional, *drill-through*, tooltips | 5 [real] |
| 5 | Avanzado | variables (`VAR`), `SWITCH(TRUE())`, grupos de cálculo (verificar disponibilidad en tu versión), RLS (concepto) | 8 [real] |

**Notas técnicas.**
- Power BI Desktop es gratis. Publicar y compartir en el servicio de Power BI requiere licencia, así que **el juego no lo usa**.
- El jefe entrega un CSV o Excel. El jugador construye el informe en Desktop y **pega los valores de sus medidas** (por ejemplo, ventas YTD a una fecha, % YoY). El juego los valida con `validarRespuestaEscrita`, que ya acepta formatos con coma o punto, porcentajes y símbolos de moneda.

## Excel y VBA

| Nivel | Tema | Contenido | Cap. |
|---|---|---|---|
| 1 | Fundamentos | referencias relativas y absolutas (`$`), formatos, `SUMA`, `PROMEDIO`, `SI`, `Y/O` | 3 [simulado] |
| 1 | Búsquedas | `BUSCARX` (XLOOKUP), `INDICE` + `COINCIDIR`, `BUSCARV` (por compatibilidad) | 3 [simulado] |
| 2 | Funciones financieras | `VF`, `VA`, `PAGO`, `TASA`, `NPER`, `VNA` (NPV), `TIR` (IRR), `TIR.NO.PER` (XIRR), `VNA.NO.PER` (XNPV) | 4 [simulado] |
| 2 | Tablas y matrices dinámicas | formato de tabla, `FILTRAR`, `ORDENAR`, `UNICOS`, `SUMAR.SI.CONJUNTO` | 3 [simulado] |
| 2 | Tablas dinámicas | campos, filtros, segmentaciones, agrupar fechas, campos calculados | 3 [real] |
| 3 | Modelos financieros | estados proyectados, DCF, análisis de sensibilidad (tablas de datos), escenarios, Buscar objetivo, Solver | 4 [real] |
| 3 | VBA I | editor, grabadora de macros, `Sub`, variables, `Range/Cells`, bucles, `If` | 4 [real] |
| 4 | VBA II | funciones definidas por el usuario (UDF), eventos, recorrer hojas, formularios simples, manejo de errores | 4 [real] |
| 4 | Power Query en Excel | el mismo M de Power BI dentro de Excel | 5 [real] |

**Notas técnicas.**
- En Excel en español los nombres de funciones y el separador de argumentos (`;` en vez de `,`) cambian según la configuración regional. El juego mostrará ambos nombres (ES/EN), porque en el trabajo y en internet se usan los dos.
- Para simular fórmulas dentro del juego hay bibliotecas de JavaScript como formula.js (licencia MIT, según su repositorio) o HyperFormula (licencia GPLv3 o comercial: **revisar compatibilidad antes de usarla**). Por ahora, los ejercicios de Excel serán de "calcula y pega el valor", que no necesitan motor de fórmulas.
