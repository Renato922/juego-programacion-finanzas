// Versiones fijas de los lenguajes que corren dentro del juego.
// Pyodide (Python) se descarga la primera vez desde el CDN y queda en caché
// en la carpeta de datos de la app. sql.js viene incluido (pesa ~1 MB).
// webR (R) se agregará en el capítulo 2 con el mismo mecanismo.

export const PYODIDE_VERSION = '0.29.5';

// Se prueban en orden. El primero es la distribución completa (incluye
// paquetes como numpy y pandas para capítulos futuros); el segundo es el
// paquete npm, que trae solo el núcleo de Python.
export const PYODIDE_CDN = [`https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`, `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VERSION}/`];

export const TAMANO_APROX_PYODIDE_MB = 12;
