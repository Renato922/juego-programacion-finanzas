// Puente seguro entre la ventana del juego y el sistema (contextIsolation).
// Solo expone lo necesario: guardar progreso, exportar/importar archivos
// y abrir enlaces https en el navegador.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('juegoNativo', {
  leerProgreso: () => ipcRenderer.invoke('progreso:leer'),
  guardarProgreso: (texto) => ipcRenderer.invoke('progreso:guardar', texto),
  exportarArchivo: (nombre, contenido) => ipcRenderer.invoke('archivo:exportar', { nombre, contenido }),
  importarArchivo: (extensiones) => ipcRenderer.invoke('archivo:importar', { extensiones }),
  abrirEnlace: (url) => ipcRenderer.invoke('enlace:abrir', url),
  info: () => ipcRenderer.invoke('app:info'),
});
