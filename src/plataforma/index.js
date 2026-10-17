// Capa de plataforma: aísla lo que cambia entre escritorio (Electron) y
// navegador (desarrollo hoy; modo celular en el futuro). El resto del juego
// solo usa estas funciones.

const nativo = typeof window !== 'undefined' ? window.juegoNativo : undefined;
// Clave de la única partida que existía antes de las ranuras: se lee como ranura 1.
const CLAVE_ANTERIOR = 'condor-capital-progreso';
const claveRanura = (n) => `condor-capital-ranura-${n}`;
export const RANURAS = 3;

function almacen(accion) {
  try {
    return accion(localStorage);
  } catch {
    return null;
  }
}

export const plataforma = {
  tipo: nativo ? 'escritorio' : 'navegador',

  async leerPartida(n) {
    if (nativo) return nativo.leerPartida(n);
    return almacen((ls) => ls.getItem(claveRanura(n)) ?? (n === 1 ? ls.getItem(CLAVE_ANTERIOR) : null));
  },

  async guardarPartida(n, texto) {
    if (nativo) return nativo.guardarPartida(n, texto);
    return almacen((ls) => (ls.setItem(claveRanura(n), texto), true)) ?? false;
  },

  async borrarPartida(n) {
    if (nativo) return nativo.borrarPartida(n);
    return (
      almacen((ls) => {
        ls.removeItem(claveRanura(n));
        if (n === 1) ls.removeItem(CLAVE_ANTERIOR);
        return true;
      }) ?? false
    );
  },

  // Solo en escritorio: en el navegador se cierra la pestaña.
  puedeSalir: Boolean(nativo),
  salir() {
    if (nativo) nativo.salir();
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
