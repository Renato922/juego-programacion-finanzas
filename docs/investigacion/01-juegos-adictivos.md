# 1. Juegos (y apps) que enganchan: qué hacen y qué tomamos

> **Cómo leer este documento.** Cada juego tiene tres partes: qué estrategias concretas usa, de dónde sale la información y qué decidimos para *Cóndor Capital* (**Sí** = lo usamos, **Adaptado** = lo usamos con cambios, **No** = lo rechazamos y por qué).
>
> **Sobre las fuentes.** Las citas con enlace se revisaron durante esta investigación (octubre de 2026). Varias son fuentes secundarias (prensa, blogs, foros) y se marcan así. Lo que viene de conocimiento general sin una fuente revisada se marca **[sin fuente verificada]**. Las mecánicas de juegos en servicio cambian seguido: algunas pueden haber cambiado después de las fechas citadas.

Además de los ejemplos pedidos (Duolingo, Candy Crush, Clash Royale, Pokémon, idle, Hades, Slay the Spire, Genshin, Vampire Survivors), se investigaron por cuenta propia otros juegos y apps elegidos con tres criterios:

1. **Juegos de programación** que la gente juega por gusto (Zachtronics, Human Resource Machine, Factorio, Advent of Code).
2. **Juegos con muchísima constancia sin ser abusivos** (Wordle, Chess.com, Civilization, Football Manager, Old School RuneScape, Balatro, Marvel Snap).
3. **Diseño amable para gente con poca energía o con depresión** (Animal Crossing, Stardew Valley, Celeste, Finch), más **contraejemplos** (Habitica, Fortnite y las *loot boxes*).

---

## A. Los ejemplos del encargo

### Duolingo
**Estrategias.** Racha diaria (*streak*), meta diaria, ligas semanales, notificaciones con la mascota, "protector de racha", "apuesta de racha" (*streak wager*), lecciones de pocos minutos y un modelo de repaso espaciado propio.

**Evidencia.**
- En un experimento de Duolingo, **separar la meta diaria de la racha** subió la retención al día 14 en 3.3% (relativo) ([Duolingo, "Improving the streak"](https://blog.duolingo.com/improving-the-streak)).
- La **apuesta de racha** subió la retención a 1, 7 y 14 días; la mayor mejora fue al día 7, con +14% ([Duolingo Engineering](https://making.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals)). Contexto adicional en [Lenny's Newsletter](https://lennysnewsletter.com/p/behind-the-product-duolingo-streaks) (fuente secundaria).
- El repaso usa **half-life regression**: predice cuánto dura un recuerdo. Según sus autores, redujo el error de predicción en más de 45% frente a otros métodos y aumentó la actividad diaria en 12% (Settles y Meeder, ACL 2016, [P16-1174](https://aclanthology.org/P16-1174); [blog de Duolingo](https://blog.duolingo.com/how-we-learn-how-you-learn)).

**Para Cóndor Capital.**
- **Sí:** lecciones cortas (misiones de 5 a 10 min) y repaso espaciado que paga más si "ya tocaba".
- **Adaptado:** en lugar de racha consecutiva usamos una **meta semanal flexible** (días que no tienen que ser seguidos) y un **contador total de días activos que nunca baja**. La investigación sobre rachas rotas (Silverman y Barasch, 2023; ver doc. 2) muestra que romper una racha desmotiva, y el encargo prohíbe quitar progreso por no jugar.
- **No:** ligas que te bajan de división si no juegas y notificaciones insistentes.

### Candy Crush Saga
**Estrategias.** Niveles muy cortos, dificultad que sube con "respiros" (niveles fáciles después de uno difícil), vidas que se recargan con el tiempo y un mapa de progreso visible.

**Evidencia.** El equipo de datos de King contó que el nivel 65 era el que más convertía en compras pero también el que más abandonos causaba; hacerlo más fácil retuvo a más jugadores a largo plazo ([mobilegamer.biz](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/), fuente secundaria sobre una charla de GDC; [TechTarget](https://www.techtarget.com/searchbusinessanalytics/feature/Customer-analysis-a-winning-play-for-Candy-Crush-Saga-maker)). Hay acusaciones no verificadas de niveles casi imposibles para empujar compras ([Deceptive Patterns](https://deceptive.design/articles/candy-crush-saga-impossible-levels); el propio sitio aclara que no está verificado).

**Para Cóndor Capital.**
- **Sí:** **mapa de carrera** visible y curva de dificultad con respiros (después de cada lección viene un quiz corto antes del ejercicio difícil).
- **Sí:** cuidar los "niveles 65", es decir, los picos de abandono. Cada ejercicio tiene 3 pistas que escalan y la última casi resuelve el problema, para que nadie quede trabado.
- **No:** vidas, esperas ni compras. Fallar no cuesta nada.

### Clash Royale
**Estrategias.** Partidas de 3 minutos, cofres con temporizador, mazos coleccionables y mejora de cartas.

**Evidencia.** En 2025 Supercell **eliminó los cofres con temporizador**. Según la cobertura del cambio, argumentó que obligaban a entrar seguido y cortaban la recompensa de ganar una batalla ([RoyaleAPI](https://royaleapi.com/blog/rip-chests-2025-q1-update); experimento previo en [Supercell](https://supercell.com/en/games/clashroyale/blog/news/chest-experiment-king-tower-levels-1-9)).

**Para Cóndor Capital.**
- **Sí:** **colección de cartas** (una por concepto) con niveles de dominio.
- **Sí:** recompensa **inmediata** al terminar: la caja de dividendos se abre en el momento, sin espera.
- **No:** temporizadores. El propio Supercell los quitó por empujar visitas forzadas.

### Pokémon (serie principal y Pokémon GO)
**Estrategias.** Coleccionar ("atrápalos a todos"), una Pokédex con huecos visibles, evoluciones, ventajas entre tipos al estilo piedra-papel-tijera y un mapa que se abre por medallas **[sin fuente verificada; conocimiento general]**. Pokémon GO llevó esto a caminar en el mundo real.

**Evidencia.** En usuarios de Microsoft Band, los jugadores más comprometidos de Pokémon GO caminaron unos 1,473 pasos más por día (+25%) en los primeros 30 días. Además llegó a personas poco activas, que las apps de salud no alcanzaban (Althoff, White y Horvitz, [JMIR 2016](https://jmir.org/2016/12/e315/)). Un juego puede cambiar una conducta real.

**Para Cóndor Capital.**
- **Sí:** la **colección** muestra cartas "???" de conceptos que aún no descubres (el efecto Pokédex), y las cartas suben de nivel con el repaso, como una evolución.
- **Sí:** los **jefes** funcionan como "medallas" que abren el siguiente capítulo.

### Juegos *idle* o incrementales (Cookie Clicker, AdVenture Capitalist, Universal Paperclips)
**Estrategias.** Números que crecen, ganancias "mientras no estás", mejoras que multiplican ganancias y "prestigio" (reiniciar a cambio de un multiplicador permanente) **[sin fuente verificada; conocimiento general]**.

**Para Cóndor Capital.**
- **Sí:** el corazón *tycoon*: capital, mejoras con efectos multiplicadores y una oficina que crece visualmente.
- **Adaptado:** el fondo **rinde por actividad completada, no por tiempo**. Las ganancias por ausencia premian no estudiar, y su contracara (dejar de ganar si no entras) castiga. No hacemos ninguna de las dos.
- **No por ahora:** el prestigio con reinicio. Podría servir en un modo posterior al capítulo 8, pero borrar avance va contra la regla principal.

### Hades (Supergiant Games)
**Estrategias.** Morir es parte del progreso: cada intento fallido avanza la historia y las relaciones con los personajes. Hay mejoras permanentes entre intentos y diálogos que reaccionan a lo que hiciste.

**Evidencia.** El guionista Greg Kasavin describió el objetivo como "quitarle el aguijón al fracaso" ([The Inlander](https://inlander.com/culture/hades-writer-greg-kasavin-on-how-he-made-video-game-deaths-drive-a-feel-good-story-22725237); análisis en [First Person Scholar](https://www.firstpersonscholar.com/there-is-no-escape/), ambas fuentes secundarias).

**Para Cóndor Capital.**
- **Sí, central:** **fallar no quita nada**. Un error de código te devuelve una explicación en español, un consejo y, si insistes, una pista. Cada error corregido también cuenta como práctica (el mensaje de éxito lo dice).
- **Sí:** los personajes (Marta, Bruno y la auditora) reaccionan y la historia avanza con tu progreso.

### Slay the Spire (Mega Crit)
**Estrategias.** Elegir 1 de 3 cartas después de cada combate, rutas en un mapa, sinergias entre cartas y partidas cortas con mucha decisión. El balance se ajustó con métricas de jugadores.

**Evidencia.** Charla de Anthony Giovannetti en GDC 2019 sobre diseño y balance guiados por métricas ([GDC Vault](https://www.gdcvault.com/browse/gdc-19/play/1025731); [Game Developer](https://www.gamedeveloper.com/design/learn-i-slay-the-spire-i-s-metrics-driven-approach-to-game-balancing-at-gdc-2019)).

**Para Cóndor Capital.**
- **Sí:** la **Sala de trading** ofrece **3 operaciones** por ronda y eliges una (autonomía), y entre rondas eliges **potenciadores** (alcista, cobertura, análisis previo).
- **Sí, a futuro:** registrar métricas *locales* (qué ejercicios tienen más intentos fallidos) para rebalancear el contenido sin servidores.

### Genshin Impact (y gacha en general)
**Estrategias.** Tiradas aleatorias de personajes con "pity" (un 5 estrellas garantizado tras cierto número de tiradas; fuentes de terceros hablan de 90 tiradas en el banner de personajes), resina que se recarga con el tiempo y misiones diarias ([DualShockers](https://www.dualshockers.com/genshin-impact-pity-gacha-system-banner-explained/), fuente secundaria; no encontré la cifra oficial de HoYoverse).

**Para Cóndor Capital.**
- **Adaptado:** recompensa variable **sin dinero real y siempre positiva**. La caja de dividendos siempre da algo (capital extra o una carta brillante cosmética).
- **No:** energía que se recarga con el tiempo, compras o cualquier cosa que imite una apuesta. Ver la evidencia sobre *loot boxes* más abajo.

### Vampire Survivors (poncle)
**Estrategias.** Partidas cortas, poder que crece muy rápido, cofres con animación de tragamonedas y "una partida más".

**Evidencia.** El diseñador trabajó antes en la industria del juego de azar, y la prensa señala que usó esa experiencia para los cofres y efectos ([The Conversation](https://theconversation.com/vampire-survivors-how-developers-used-gambling-psychology-to-create-a-bafta-winning-game-203613)). Un análisis afirma que los primeros cofres están programados para dar mucho y después las probabilidades bajan ([Substack de J. Boger](https://jboger.substack.com/p/the-secret-sauce-of-vampire-survivors), fuente secundaria no verificada).

**Para Cóndor Capital.**
- **Sí:** el "*juice*": sonidos chiptune, números que suben animados, el jefe que tiembla y daño flotante.
- **No:** las técnicas de tragamonedas (casi-aciertos, primeras recompensas infladas para luego quitarlas). Ver doc. 2.

---

## B. Investigación propia: otros juegos y apps

### Opus Magnum y los juegos de Zachtronics (programación como puzzle)
**Estrategias.** Resolver primero de forma tosca y después **optimizar**. Al terminar, el juego te muestra **histogramas** de costo, ciclos y área comparando tu solución con la de todos los jugadores. No hay una solución "perfecta" única.

**Evidencia.** PC Gamer argumenta que los histogramas funcionan mejor que un ranking. En vez de preguntar "¿puedes ser el número uno?", preguntan "¿puedes llegar al percentil 70 o 90?", así que casi toda solución se siente como un logro ([PC Gamer](https://www.pcgamer.com/au/perfectly-solving-opus-magnums-puzzles-is-impossible-but-thats-ok)).

**Para Cóndor Capital.**
- **Sí:** aceptar **cualquier solución correcta**. El validador compara *resultados*, no el texto del código.
- **Sí:** los jefes tienen nota (S, A, B, C) para invitar a la **revancha**.
- **A futuro:** percentiles *contra tus propios intentos anteriores* (no hay servidores) y retos opcionales de "hazlo en menos líneas".

### Human Resource Machine (Tomorrow Corporation)
**Estrategias.** Enseña ensamblador como puzzles de oficina, con humor. Cada nivel tiene retos opcionales de **tamaño** (menos instrucciones) y **velocidad** (menos pasos).

**Evidencia.** Un análisis señala que el juego suma comandos nuevos de a poco para mantener el interés, pero que no da ayuda para optimizar y los jugadores trabados buscan fuera del juego ([Superjump](https://www.superjumpmagazine.com/integrating-learning-with-gameplay-human-resource-machine/), fuente secundaria).

**Para Cóndor Capital.**
- **Sí:** contexto de oficina con humor y un concepto nuevo por misión.
- **Sí:** pistas *dentro* del juego para lo esencial, para que nadie tenga que salir a buscar ayuda.
- **A futuro:** retos opcionales de optimización con su propia pista.

### Factorio (Wube Software)
**Estrategias.** Automatizar, escalar y refactorizar: "la fábrica debe crecer". Siempre hay un siguiente cuello de botella.

**Evidencia.** LeadDev lo compara con el trabajo de un desarrollador: diseñar sistemas que resuelven problemas y luego escalarlos ([LeadDev](https://leaddev.com/career-development/factorio-and-the-promise-of-better-software-engineering)). El Financial Times mencionó el apodo "Cracktorio" (vía [gwern.net](https://gwern.net/doc/www/www.ft.com/bc49b7a849d7a0317a9b485bd07af23c23d0f994.html)).

**Para Cóndor Capital.**
- **Sí:** el código que escribes **se reutiliza**. Las funciones del capítulo 1 (valor presente, cuota) vuelven en el jefe, y en capítulos posteriores formarán tu "librería" de analista.
- **Sí:** el *tycoon* con siempre una mejora más a la vista.

### Advent of Code (Eric Wastl)
**Estrategias.** Un puzzle por día con una historia, en dos partes: la segunda se abre al resolver la primera y es una variante más difícil. Tiene tablas de posiciones privadas entre amigos.

**Evidencia.** Charlas "Behind the Scenes" de su creador ([FOSDEM 2021](https://archive.fosdem.org/2021/schedule/event/adventofcode/); [Spotify Engineering](https://engineering.atspotify.com/2019/12/techbytes-behind-the-scenes-with-the-creator-of-advent-code/)). Un resumen de un podcast dice que diseña los puzzles para que haya una sola respuesta correcta y para todos los niveles ([Room Escape Artist](https://roomescapeartist.com/2023/11/28/repod-s6e9-advent-of-code-25-days-of-programming-puzzles-with-creator-eric-wastl/), fuente secundaria).

**Para Cóndor Capital.**
- **Sí:** las misiones encadenan ejercicios donde el siguiente es una variante del anterior (retornos → acumulado → CAGR).
- **No:** ranking por velocidad. Presiona y no aporta aprendizaje.

### Wordle
**Estrategias.** Un solo reto al día, unos 3 minutos y un resultado fácil de compartir. Sin notificaciones.

**Evidencia.** Su creador, Josh Wardle, dijo que el gran acierto fue limitar a un juego por día, lo que crea escasez. Lo describió como algo que te pide "tres minutos al día", sin notificaciones ([Boston.com/NYT](https://www.boston.com/news/national-news/2022/01/04/he-made-wordle-for-his-partner-now-its-an-online-hit/)).

**Para Cóndor Capital.**
- **Adaptado:** el **repaso de 2 minutos** para días de poca energía es la versión "Wordle" del juego. Nunca obligamos a parar, pero la sesión mínima es diminuta.
- **Sí:** **cero notificaciones** en esta versión.

### Chess.com (puzzles)
**Estrategias.** Un puzzle diario compartido por más de un millón de personas, Puzzle Rush (contrarreloj) y un rating de puzzles.

**Evidencia.** Chess.com cambió el puzzle diario de **un solo intento a 5 vidas, con pista de un entrenador** al fallar ([Chess.com](https://www.chess.com/news/view/announcing-daily-puzzle-lives-system)). Puzzle Rush no afecta el rating, así que funciona como un desafío aparte ([soporte Chess.com](https://support.chess.com/en/articles/8608686-how-do-puzzles-work)).

**Para Cóndor Capital.**
- **Sí:** intentos ilimitados con **pistas al fallar**, la misma dirección que tomó Chess.com.
- **Sí:** la Sala de trading es un modo aparte que no afecta tu rango (el rango viene de las misiones y jefes).

### Balatro (LocalThunk)
**Estrategias.** Un *roguelike* de póker donde la puntuación **escala** en cascada (multiplicadores sobre multiplicadores), con una puesta en escena muy satisfactoria del momento de contar.

**Evidencia.** Mark Brown (GMTK) analiza que el autor esconde a propósito la vista previa del puntaje para que veas cómo se resuelve tu combinación ([GMTK](https://gmtk.substack.com/p/balatros-cursed-design-problem)). Un ensayo concluye que es poco probable que fomente la adicción al juego de azar, aunque su retroalimentación sensorial se parece a la de las tragamonedas ([Mechanics of Magic](https://mechanicsofmagic.com/2025/05/22/critical-play-games-of-chance-addiction-jack-ryan/)).

**Para Cóndor Capital.**
- **Sí:** combos que **multiplican** el P&L en la Sala de trading, con el número animado.
- **Sí:** el momento de cobrar la recompensa se pone en escena (conteo animado, caja, sonido).

### Marvel Snap (Second Dinner)
**Estrategias.** Partidas de unos 3 a 5 minutos (seis turnos) y "snap" para doblar la apuesta.

**Evidencia.** Ben Brode dijo que buscaba "una experiencia en bocados" con toda la estrategia ([The Guardian vía PressReader](https://www.pressreader.com/usa/the-guardian-usa/20221112/282024741243323); [Wikipedia](https://en.wikipedia.org/wiki/Marvel_Snap)).

**Para Cóndor Capital.**
- **Sí:** sesiones en bocados que se pueden encadenar. Al terminar, siempre se ofrece "Siguiente misión ▸".
- **No:** apostar recursos. En el fondo el riesgo existe pero lo eliges tú, y es parte de lo que se enseña.

### Civilization (Sid Meier)
**Estrategias.** "Un turno más": varias metas abiertas a la vez y decisiones interesantes cada pocos segundos.

**Evidencia.** Meier dijo que el efecto "un turno más" es intencional, y que una decisión interesante es aquella donde el jugador se pregunta qué habría pasado si elegía distinto ([Game Developer](https://www.gamedeveloper.com/game-platforms/just-one-more-turn---game-development-tips-and-tricks-from-the-creator-of-civilization-sid-meier-)).

**Para Cóndor Capital.**
- **Sí:** **metas superpuestas** (efecto Zeigarnik, doc. 2): la próxima misión, la mejora que casi puedes comprar, la carta que te falta, el jefe que espera y la meta semanal, todas a la vista en la oficina.
- **Sí:** decisiones con consecuencias: invertir o comprar una mejora, y elegir el perfil de riesgo.

### Football Manager (Sports Interactive)
**Estrategias.** Un "videojuego de planilla": bases de datos enormes, decisiones de gestión y una historia que surge sola.

**Evidencia.** Su director, Miles Jacobson, rechaza la comparación con una adicción y lo describe como "un segundo trabajo". Dice que los jugadores juegan en promedio unas 300 horas al año ([ESPN](https://global.espn.com/football/english-premier-league/story/4084425/from-solskjaer-to-griezmann-how-football-manager-keeps-virtual-fans-engaged); cifra que reporta el propio Jacobson).

**Para Cóndor Capital.** Demuestra que **los datos y las planillas pueden ser divertidos** si tienen historia y consecuencias. Por eso usamos datos reales con una narración (la crisis de 2008 y la inflación de 1980) en lugar de números sueltos.

### Old School RuneScape (habilidades a nivel 99)
**Estrategias.** Muchas habilidades independientes, cada una con una curva de XP larga y "microprogreso" (cada acción muestra los XP ganados).

**Evidencia.** El equipo describe el ciclo como "fijar una meta, trabajar hacia ella, completarla", con 99 niveles de progreso grande más un microprogreso en cada acción ([OSRS Wiki, resumen de preguntas y respuestas con los desarrolladores](https://oldschool.runescape.wiki/w/Update:Q%26A_Summary_-_16/06/23)). La crítica habitual es que el tramo final se vuelve demasiado lento para quien trabaja o estudia ([Nerdbot](https://nerdbot.com/2026/06/09/is-osrs-progression-too-slow/), opinión).

**Para Cóndor Capital.**
- **Sí:** microprogreso (capital y XP en cada ejercicio, cada repaso y cada caja) y macroprogreso (rangos de carrera).
- **Adaptado:** la curva de rangos **no** es exponencial. Cada ascenso pide más XP, pero también un jefe de historia, así que el ritmo lo marcan los capítulos y no un trabajo repetitivo.

### Animal Crossing y Stardew Valley ("juegos acogedores")
**Estrategias.** Rutinas diarias suaves, nada de "game over", y el jugador elige sus metas.

**Evidencia.**
- Un estudio con datos reales de tiempo de juego (Animal Crossing y Plants vs. Zombies) encontró una **asociación pequeña y positiva** entre jugar y el bienestar. La necesidad satisfecha y la motivación pesaban más que las horas (Johannes, Vuorre y Przybylski, [Royal Society Open Science, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8074794/)).
- Un estudio posterior más grande del mismo grupo **no encontró evidencia de un efecto causal** del tiempo de juego sobre el bienestar ([Oxford Internet Institute](https://www.oii.ox.ac.uk/major-new-study-finds-little-evidence-for-causal-connection-between-well-being-and-video-game-playing/)).
- Conclusión honesta: importa *cómo* se juega, no *cuánto*.
- Sobre Stardew, los análisis destacan que es casi imposible perder y que la energía diaria funciona como una restricción suave ([Game Tyrant](https://gametyrant.com/news/from-crops-to-connections-how-stardew-valley-redefines-life-simulation-gaming), fuente secundaria).

**Para Cóndor Capital.**
- **Sí:** no se pierde nunca.
- **Sí:** medimos el éxito por **calidad** (lo que aprendiste y repasaste), no por minutos jugados.

### Celeste (Maddy Makes Games)
**Estrategias.** Un plataformero muy difícil con un **Modo Asistencia** que permite ajustar velocidad, invencibilidad y más. La historia trata de la ansiedad y la autoaceptación.

**Evidencia.** El modo asistencia se llamaba "Cheat Mode" al principio. Lo renombraron porque ese nombre sonaba a juicio ([Vice](https://www.vice.com/en/article/d3w887/celeste-difficulty-assist-mode); [Wikipedia](https://en.wikipedia.org/wiki/Celeste_(video_game))).

**Para Cóndor Capital.**
- **Sí:** el **modo poca energía** se presenta sin juicio ("Hoy tengo poca energía") y se puede activar y desactivar en cualquier momento.
- **Sí:** las pistas no se llaman "trampas" ni restan la recompensa base. Solo dejan de sumar el bono de ejercicio limpio.

### Finch (app de autocuidado con mascota)
**Estrategias.** Una mascota que crece cuando haces pequeñas tareas de autocuidado, con un tono muy cálido.

**Evidencia.** No encontré ensayos clínicos. Hay un estudio autoetnográfico de 9 meses (una sola persona con depresión estacional) que reporta mejor autocuidado y conexión emocional, pero **también una dependencia de las recompensas** que con el tiempo reemplazó la motivación inicial ([Chalmers](https://research.chalmers.se/publication/552903)). Es una advertencia útil.

**Para Cóndor Capital.**
- **Adaptado:** el tono cálido de los personajes y las tareas mínimas (un repaso de 2 minutos ya cuenta).
- **Cuidado:** que la recompensa externa no reemplace el motivo propio. Por eso el modo compromiso recuerda **tu** razón, escrita por ti, y la colección muestra lo que *sabes*, no lo que compraste.

---

## C. Contraejemplos: lo que no hay que hacer

### Habitica (gamificación con castigo)
Habitica convierte tareas en un juego de rol; si no cumples tus tareas diarias, tu personaje pierde vida. Un estudio de campo (Diefenbach y Müssig, 2019, *International Journal of Human-Computer Studies*; [repositorio LMU](https://epub.ub.uni-muenchen.de/77668)) identificó **efectos contraproducentes** ligados a su sistema de premios y castigos (estudio pequeño: una entrevista en profundidad y 45 usuarios durante dos semanas). Es poca evidencia, pero va en la misma dirección que la investigación sobre culpa y rachas rotas del doc. 2. Por eso: **ningún castigo por ausencia**.

### Fortnite y los patrones oscuros
La FTC de EE. UU. ordenó a Epic Games pagar USD 245 millones en reembolsos (más USD 275 millones por privacidad infantil) por **patrones oscuros** que llevaban a compras no deseadas ([FTC](https://www.ftc.gov/node/80648); [CBS News](https://www.cbsnews.com/news/fortnite-ftc-settlement-refund-claim)). Por eso: nada de compras, botones engañosos ni urgencias falsas. El juego es gratis y no pide tarjeta.

### Loot boxes y casi-aciertos
El gasto en *loot boxes* se asocia con la gravedad del juego problemático (Zendle y Cairns, PLOS ONE 2018, n = 7,422; [White Rose](https://eprints.whiterose.ac.uk/139116/)). Los "casi aciertos" de las tragamonedas aumentan las ganas de seguir apostando y activan circuitos de recompensa (Clark y otros, Neuron 2009; [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC2658737/)). Por eso, la caja de dividendos **siempre da algo**, no tiene dinero real, no muestra "casi ganaste" y su contenido es cosmético o un poco de capital.

---

## D. Resumen: patrón → decisión

| Patrón | De dónde | Decisión en Cóndor Capital |
|---|---|---|
| Sesiones cortas que se encadenan | Duolingo, Marvel Snap, Wordle | **Sí.** Misiones de 5 a 10 min y botón "Siguiente misión ▸" |
| Repaso espaciado con modelo de memoria | Duolingo (HLR) | **Sí.** SM-2 adaptado; lo vencido paga ×2 |
| Racha consecutiva | Duolingo | **No.** Meta semanal flexible y contador total que nunca baja |
| Mapa de progreso visible | Candy Crush, Pokémon | **Sí.** Mapa de carrera con dos pistas paralelas |
| Pistas que escalan, intentos ilimitados | Chess.com, Celeste | **Sí.** 3 pistas; la última casi resuelve |
| Fallar como parte del progreso | Hades | **Sí.** Fallar no quita nada y explica el error en español |
| Elegir 1 de 3 y potenciadores | Slay the Spire | **Sí.** Sala de trading |
| Colección con huecos y evolución | Pokémon, Clash Royale | **Sí.** Cartas por concepto con estrellas de dominio |
| Tycoon: números que crecen, mejoras | Idle games, Factorio | **Sí.** Fondo, mejoras y oficina pixel art que crece |
| Ganancias por ausencia, energía por tiempo | Idle, Genshin, Clash Royale | **No.** El fondo rinde por actividad |
| Recompensa variable | Gacha, Vampire Survivors | **Adaptado.** Siempre positiva, sin dinero ni casi-aciertos |
| Nota y revancha, varias soluciones válidas | Zachtronics, HRM | **Sí.** Nota S/A/B/C; el validador acepta cualquier solución correcta |
| Metas superpuestas ("un turno más") | Civilization | **Sí.** Oficina con próxima misión, mejora, carta y jefe a la vista |
| Datos con historia | Football Manager | **Sí.** Datos reales de FRED y Grunfeld con narración |
| Modo asistencia sin juicio | Celeste | **Sí.** Modo poca energía |
| Castigo por inactividad | Habitica | **No** |
| Compras, patrones oscuros, apuestas | Fortnite, loot boxes | **No** |
| Notificaciones push | Duolingo y otros | **No** en esta versión (como Wordle) |
