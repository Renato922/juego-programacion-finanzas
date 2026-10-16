// Capa de plataforma: aísla lo que cambia entre escritorio (Electron) y
// navegador (desarrollo hoy; modo celular en el futuro). El resto del juego
// solo usa estas funciones.

const nativo = typeof window !== 'undefined' ? window.juegoNativo : undefined;
const CLAVE = 'condor-capital-progreso';

export const plataforma = {
  tipo: nativo ? 'escritorio' : 'navegador',

  async leerProgreso() {
    if (nativo) return nativo.leerProgreso();
    try {
      return localStorage.getItem(CLAVE);
    } catch {
      return null;
    }
  },

  async guardarProgreso(texto) {
    if (nativo) return nativo.guardarProgreso(texto);
    try {
      localStorage.setItem(CLAVE, texto);
      return true;
    } catch {
      return false;
    }
  },

  async exportarArchivo(nombre, contenido) {
    if (nativo) return nativo.exportarArchivo(nombre, contenido);
    const url = URL.createObjectURL(new Blob([contenido], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: nombre });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  },

  async importarArchivo(extensiones = ['json']) {
    if (nativo) return nativo.importarArchivo(extensiones);
    return new Promise((resolve) => {
      const input = Object.assign(document.createElement('input'), { type: 'file', accept: extensiones.map((e) => '.' + e).join(',') });
      input.onchange = async () => {
        const f = input.files?.[0];
        resolve(f ? { nombre: f.name, contenido: await f.text() } : null);
      };
      input.click();
    });
  },

  abrirEnlace(url) {
    if (!url.startsWith('https://')) return;
    if (nativo) nativo.abrirEnlace(url);
    else window.open(url, '_blank', 'noopener');
  },

  async info() {
    if (nativo) return nativo.info();
    return { version: 'web', plataforma: 'navegador' };
  },
};
