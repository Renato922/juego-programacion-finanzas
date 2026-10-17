// Puente seguro entre la ventana del juego y el sistema (contextIsolation).
// Solo expone lo necesario: leer, guardar y borrar partidas, exportar/importar archivos
// y abrir enlaces https en el navegador.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('juegoNativo', {
  leerPartida: (n) => ipcRenderer.invoke('partida:leer', n),
  guardarPartida: (n, texto) => ipcRenderer.invoke('partida:guardar', n, texto),
  borrarPartida: (n) => ipcRenderer.invoke('partida:borrar', n),
  salir: () => ipcRenderer.invoke('app:salir'),
  exportarArchivo: (nombre, contenido) => ipcRenderer.invoke('archivo:exportar', { nombre, contenido }),
  importarArchivo: (extensiones) => ipcRenderer.invoke('archivo:importar', { extensiones }),
  abrirEnlace: (url) => ipcRenderer.invoke('enlace:abrir', url),
  info: () => ipcRenderer.invoke('app:info'),
});
