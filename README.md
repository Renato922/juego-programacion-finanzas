# Cóndor Capital

**Un juego para aprender programación aplicada a finanzas**: Python, SQL, R, Power BI y Excel/VBA, resolviendo casos reales.

Empiezas como Analista Junior en un fondo de inversión. Cada reto resuelto te da capital para mejorar tu oficina e invertir en el fondo, y cada jefe vencido te asciende, hasta llegar a ser dueño del fondo. Es gratis, funciona sin cuentas y tu progreso se guarda en tu computadora.

> **Versión 0.1:** está completo el **capítulo 1** (Python y SQL desde cero, 13 misiones y un jefe). Los capítulos con R, Power BI y Excel/VBA están planificados en [`docs/roadmap.md`](docs/roadmap.md).

## Qué incluye
- **Historia de carrera + tycoon:** misiones de 8 a 13 minutos, capital, mejoras de oficina en pixel art y un fondo con perfil de riesgo.
- **Jefes:** cada misión termina con un **jefe del día** y cada capítulo con un **jefe de capítulo**. En los jefes tienes **3 vidas**: cada comprobación fallida cuesta una; ejecutar y pedir pistas no. Sin vidas, reintentas al instante sin perder nada.
- **Barra de dominio** (estilo ALEKS): equivocarte la hace retroceder un paso y te agrega un ejercicio de refuerzo del mismo tema antes del jefe del día.
- **Menú principal** con 3 ranuras de partida: continuar, nueva partida, cargar partida e importar un respaldo.
- **Test de nivel** que te salta lo que ya sabes.
- **Python real** (Pyodide) y **SQL real** (SQLite con sql.js) dentro del juego, con errores explicados en español y pistas que escalan.
- **Sala de trading:** entrenamiento con repaso espaciado, combos y potenciadores.
- **Datos reales** de dominio público (FRED/BLS y Grunfeld; ver [`datos/FUENTES.md`](datos/FUENTES.md)) más una empresa ficticia realista.
- **Diseño amable:** nada se pierde por no jugar, hay un modo poca energía, no hay notificaciones y no hay compras.

## Instalar y jugar (Windows)

**Requisitos.**
- Windows 10 u 11.
- [Node.js](https://nodejs.org/) 22 o más reciente (con la 24 funciona).
- [Git](https://git-scm.com/).
- Conexión a internet la primera vez.

```bash
git clone https://github.com/Renato922/juego-programacion-finanzas.git
cd juego-programacion-finanzas
npm install
npm start
```

Notas:
- `npm install` descarga Electron (unos 100 MB). Es normal que tarde.
- `npm start` abre el juego en su propia ventana.
- **La primera vez que ejecutes Python**, el juego descarga Python (Pyodide, unos 12 MB) y lo guarda. Desde entonces abre rápido y funciona sin internet. SQL viene incluido.

### Crear el ejecutable (.exe)
```bash
npm run dist
```
Genera en `dist/` un **instalador** (`CondorCapital-Instalador-0.1.0.exe`, con acceso directo en el escritorio) y una **versión portable** (`CondorCapital-Portable-0.1.0.exe`, se abre con doble clic, sin instalar).

Windows puede mostrar "Windows protegió su PC" porque el ejecutable no está firmado digitalmente (firmar cuesta dinero). Haz clic en *Más información → Ejecutar de todas formas*.

### Descargar el instalador hecho por GitHub (sin compilar nada)
Cada vez que se sube un cambio, GitHub arma el juego automáticamente:
1. En el repositorio, entra a la pestaña **Actions** → **Construir para Windows** → la ejecución más reciente con ✓ verde.
2. Abajo, en **Artifacts**, descarga **CondorCapital-Instalador** (llega como .zip).
3. Descomprímelo y ejecuta `CondorCapital-Instalador-0.1.0.exe`. El instalador crea el acceso directo **Cóndor Capital** en tu escritorio y en el menú Inicio.

También puedes lanzarlo a mano con el botón **Run workflow** en esa misma página.

## Instalar y jugar (Mac)
GitHub también arma una versión para Mac (un solo `.dmg` que sirve para procesadores Intel y Apple Silicon):
1. Pestaña **Actions** → **Construir para Mac** → la ejecución más reciente con ✓ verde.
2. En **Artifacts**, descarga **CondorCapital-Mac** (llega como .zip) y descomprímelo.
3. Abre `CondorCapital-Mac-0.1.0.dmg` y arrastra **Condor Capital** a la carpeta **Aplicaciones**.
4. La primera vez, macOS lo bloqueará porque la app no está firmada por Apple (firmar cuesta dinero). Ábrela una vez, cierra el aviso y ve a **Ajustes del Sistema → Privacidad y seguridad**; abajo aparece "Se bloqueó Condor Capital": haz clic en **Abrir igualmente**.
5. Si en lugar de eso macOS dice que la app "está dañada", abre la app **Terminal** y ejecuta:
   ```bash
   xattr -cr "/Applications/Condor Capital.app"
   ```
   Ese comando solo quita la marca de "descargado de internet"; después la app abre normalmente.

La primera vez que uses Python, el juego necesita internet para descargarlo (Pyodide, unos 12 MB); después funciona sin conexión.

### Jugar en el navegador (modo desarrollo)
```bash
npm run web
```
Abre <http://localhost:5178>. Es el mismo juego; Python se carga desde `node_modules` en lugar del CDN.

### Pruebas
```bash
npm test
```
Las pruebas comprueban:
- el repaso espaciado, la economía, la validación de respuestas, el progreso, el test de nivel, las batallas y sus vidas, la barra de dominio, las ranuras de partida, el entrenamiento y los mensajes de regreso;
- **cada ejercicio del juego, ejecutado de verdad** en Pyodide y sql.js: la solución pasa, el código inicial no pasa, las soluciones alternativas pasan y las respuestas incorrectas conocidas fallan.

## Dónde se guarda tu progreso
- **App de escritorio:** en la carpeta de datos de la app, un archivo por ranura (`ranura-1.json` a `ranura-3.json`), con una copia `.bak` del guardado anterior. En Windows suele ser `%APPDATA%\Condor Capital\partida\`; en Mac, `~/Library/Application Support/Condor Capital/partida/`.
- Si ya tenías una partida de una versión anterior (`progreso.json`), aparece sola en la **ranura 1**.
- Borrar una partida desde el menú no destruye el archivo: queda como `ranura-N.borrada.json` por si quieres recuperarla.
- **Modo navegador:** en el `localStorage` del navegador.
- En el menú principal puedes importar un respaldo y en **Ajustes** exportarlo.

## R, RStudio, Excel y Power BI
Los jefes de R, Power BI y Excel/VBA se juegan en los programas reales. En la sección **Herramientas** el juego te guía para instalar **R** y **RStudio Desktop** (ambos gratis) y verifica la instalación. Excel de escritorio y Power BI Desktop (gratis) los usarás desde el capítulo 3.

## Estructura del proyecto
```
electron/         ventana, protocolo app://, caché de Pyodide, guardado local
src/core/         lógica del juego (probada): repaso espaciado, economía, validación, progreso...
src/contenido/    capítulos, misiones, jefes, conceptos, mejoras, test de nivel, base de datos
src/runtimes/     workers de Python (Pyodide) y SQL (sql.js)
src/ui/           interfaz: pantallas, editor, pixel art, gráficos, sonido
datos/            datos reales (CSV) y sus fuentes
docs/             investigación, diseño y roadmap
test/             pruebas (node:test)
```

## Documentación
- [Investigación](docs/investigacion/):
  1. [Juegos adictivos](docs/investigacion/01-juegos-adictivos.md)
  2. [Psicología (incluye el análisis de la culpa)](docs/investigacion/02-psicologia.md)
  3. [Aprendizaje](docs/investigacion/03-aprendizaje.md)
  4. [Temario por lenguaje](docs/investigacion/04-temario-lenguajes.md)
  5. [Temario financiero](docs/investigacion/05-temario-financiero.md)
- [Diseño del juego](docs/diseno.md)
- [Roadmap](docs/roadmap.md)

## Solución de problemas
- **"No se pudo iniciar Python"**: la primera vez hace falta internet para descargarlo. Si tu red bloquea `cdn.jsdelivr.net`, prueba con otra red. Para desarrollo sin internet: `set JUEGO_RUNTIME_LOCAL=1 && npm start` usa la copia de `node_modules/pyodide`.
- **La ventana queda en blanco**: ejecuta `npm install` otra vez y revisa que tu versión de Node sea 22 o más reciente (`node -v`).
- **Tu código "tardó demasiado"**: el juego corta la ejecución a los 8 segundos, casi siempre por un bucle infinito.

## Licencias de terceros
Electron (MIT), Pyodide (MPL-2.0), sql.js (MIT), CodeMirror 5 (MIT), fuentes Press Start 2P y VT323 (SIL Open Font License). Los datos reales son de dominio público (ver `datos/FUENTES.md`).

> Este juego es una herramienta de aprendizaje y **no reemplaza ayuda profesional** de salud mental. Tampoco es asesoría financiera: los casos y empresas del fondo son ficticios.
