# Fuentes de los datos reales

Todos los datos de esta carpeta son **de dominio público**. Se copiaron sin modificaciones desde los conjuntos de datos que distribuye la biblioteca **statsmodels** (versión 0.15.0, licencia BSD-3-Clause), que documenta su origen y su licencia en cada conjunto (`statsmodels/datasets/<nombre>/data.py`, campo `COPYRIGHT`).

| Archivo | Contenido | Origen | Licencia |
|---|---|---|---|
| `macro_eeuu_fred_1959_2009.csv` | Datos macroeconómicos trimestrales de EE. UU., 1959T1-2009T3 (203 filas): PIB real, consumo, inversión, gasto público, ingreso disponible, IPC, M1, tasa de Letras del Tesoro a 3 meses (`tbilrate`), desempleo (`unemp`), población, inflación (`infl`) y tasa real (`realint`) | Compilado por Skipper Seabold. Según statsmodels, todos los datos vienen de **FRED (Federal Reserve Bank of St. Louis)**, excepto el desempleo, que viene del **Bureau of Labor Statistics**; consultados el 15/12/2009 | *"This is public domain."* (statsmodels `macrodata`) |
| `grunfeld_inversion_1935_1954.csv` | Inversión bruta (`invest`), valor de mercado (`value`) y stock de capital (`capital`) de 11 empresas de EE. UU., 1935-1954, en dólares de 1947 (220 filas) | Datos de la tesis doctoral de Y. Grunfeld, en la versión de 11 empresas reconstruida por Kleiber y Zeileis (2008), "The Grunfeld Data at 50" | *"This is public domain."* (statsmodels `grunfeld`) |

**Huellas SHA-256** (para comprobar que no se alteraron):
```
d93c0d3a7a77ef83c3af14e46032bb1d02ae3a512b22ab94159a8ca226fcf708  macro_eeuu_fred_1959_2009.csv
6f6ca138e645eeee6ff3e54fe5b9b498f7ddb5c484237d2a8489c524b3c94098  grunfeld_inversion_1935_1954.csv
```

**Definiciones de variables** (según statsmodels):
- `infl` es la inflación anualizada: ln(IPC_t / IPC_{t−1}) × 400.
- `realint` = `tbilrate` − `infl`.
- `tbilrate` es el promedio trimestral de la tasa mensual de la Letra del Tesoro a 3 meses en mercado secundario.

**Por qué estos datos y no una descarga directa de FRED o del Banco Mundial.** El entorno donde se construyó esta versión no tenía acceso de red a FRED ni a la API del Banco Mundial. Estos dos conjuntos son datos reales, de dominio público y con origen documentado. En el roadmap queda un script opcional para descargar series actualizadas, revisando la licencia de cada serie: en FRED muchas son de dominio público, pero algunas tienen derechos de terceros.

**Datos inventados.** Las tablas `assets`, `prices`, `clients` y `trades` de la base del juego son **ficticias**. Se generan en `src/contenido/datos/fondo-condor.js` con una semilla fija. Cualquier parecido con empresas reales es casual.
