// Proceso principal de Electron: ventana del juego, protocolo app://,
// caché de Pyodide y guardado local del progreso.

import { app, BrowserWindow, protocol, net, ipcMain, dialog, shell, Menu } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolverRuta, tipoMime } from './rutas.js';
import { crearCacheRuntime } from './cache-runtimes.js';
import { PYODIDE_VERSION, PYODIDE_CDN } from '../src/runtimes/versiones.js';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = 'app://juego';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true, codeCache: true },
  },
]);

if (!app.requestSingleInstanceLock()) app.quit();

let ventana = null;
let cachePyodide = null;

function carpetaPartida() {
  return path.join(app.getPath('userData'), 'partida');
}

async function escribirSeguro(archivo, texto) {
  await fs.promises.mkdir(path.dirname(archivo), { recursive: true });
  const temporal = archivo + '.tmp';
  await fs.promises.writeFile(temporal, texto, 'utf8');
  try {
    await fs.promises.copyFile(archivo, archivo + '.bak');
  } catch {
    // Primera vez: no hay copia anterior.
  }
  await fs.promises.rename(temporal, archivo);
}

async function servir(request) {
  const url = new URL(request.url);
  const ruta = resolverRuta(RAIZ, decodeURIComponent(url.pathname));
  if (!ruta) return new Response('No encontrado', { status: 404 });
  try {
    if (ruta.runtime === 'pyodide') {
      const { datos } = await cachePyodide.obtener(ruta.relativo);
      return new Response(datos, { headers: { 'content-type': tipoMime(ruta.relativo) } });
    }
    const datos = await fs.promises.readFile(ruta.archivo);
    return new Response(datos, { headers: { 'content-type': tipoMime(ruta.archivo) } });
  } catch (e) {
    return new Response(`No disponible: ${e.message}`, { status: 404 });
  }
}

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    title: 'Cóndor Capital',
    backgroundColor: '#0b1020',
    icon: path.join(RAIZ, 'build', 'icon.png'),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(RAIZ, 'electron', 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  ventana.once('ready-to-show', () => ventana.show());
  ventana.webContents.on('will-navigate', (evento, destino) => {
    if (!destino.startsWith(ORIGEN)) evento.preventDefault();
  });
  ventana.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  ventana.loadURL(`${ORIGEN}/`);
}

app.on('second-instance', () => {
  if (ventana) {
    if (ventana.isMinimized()) ventana.restore();
    ventana.focus();
  }
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  cachePyodide = crearCacheRuntime({
    carpeta: path.join(app.getPath('userData'), 'runtimes', `pyodide-${PYODIDE_VERSION}`),
    cdns: PYODIDE_CDN,
    descargar: (url) => net.fetch(url),
    // Para desarrollo sin internet: JUEGO_RUNTIME_LOCAL=1 usa node_modules/pyodide.
    carpetaLocal: process.env.JUEGO_RUNTIME_LOCAL ? path.join(RAIZ, 'node_modules', 'pyodide') : null,
  });
  protocol.handle('app', servir);

  const archivoProgreso = path.join(carpetaPartida(), 'progreso.json');
  ipcMain.handle('progreso:leer', async () => {
    try {
      return await fs.promises.readFile(archivoProgreso, 'utf8');
    } catch {
      try {
        return await fs.promises.readFile(archivoProgreso + '.bak', 'utf8');
      } catch {
        return null;
      }
    }
  });
  ipcMain.handle('progreso:guardar', async (_e, texto) => {
    if (typeof texto !== 'string' || texto.length > 20_000_000) return false;
    await escribirSeguro(archivoProgreso, texto);
    return true;
  });
  ipcMain.handle('archivo:exportar', async (_e, { nombre, contenido }) => {
    const r = await dialog.showSaveDialog(ventana, { defaultPath: nombre });
    if (r.canceled || !r.filePath) return false;
    await fs.promises.writeFile(r.filePath, contenido, 'utf8');
    return true;
  });
  ipcMain.handle('archivo:importar', async (_e, { extensiones = ['json'] } = {}) => {
    const r = await dialog.showOpenDialog(ventana, { properties: ['openFile'], filters: [{ name: 'Archivo', extensions: extensiones }] });
    if (r.canceled || !r.filePaths[0]) return null;
    const stat = await fs.promises.stat(r.filePaths[0]);
    if (stat.size > 50_000_000) return null;
    return { nombre: path.basename(r.filePaths[0]), contenido: await fs.promises.readFile(r.filePaths[0], 'utf8') };
  });
  ipcMain.handle('enlace:abrir', async (_e, url) => {
    if (typeof url === 'string' && url.startsWith('https://')) await shell.openExternal(url);
  });
  ipcMain.handle('app:info', () => ({ version: app.getVersion(), plataforma: process.platform, carpetaDatos: app.getPath('userData') }));

  crearVentana();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentana();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
