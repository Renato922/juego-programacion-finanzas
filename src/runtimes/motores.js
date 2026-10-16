// Motores de ejecución vistos desde la interfaz: arrancan los workers bajo
// demanda, aplican un tiempo máximo y avisan su estado (cargando / listo).

import { construirSemillaFondo, ARCHIVOS_DATOS } from '../contenido/datos/fondo-condor.js';

const TIEMPO_MAX_PY_MS = 8000;
const TIEMPO_MAX_CARGA_MS = 180000;
const TIEMPO_MAX_SQL_MS = 5000;

class Trabajador {
  constructor(url, nombre, alCambiarEstado, tipo = 'module') {
    this.url = url;
    this.tipo = tipo;
    this.nombre = nombre;
    this.alCambiarEstado = alCambiarEstado;
    this.worker = null;
    this.pendientes = new Map();
    this.siguienteId = 1;
    this.estado = 'apagado';
  }

  iniciar() {
    if (this.worker) return;
    this.worker = new Worker(this.url, { type: this.tipo });
    this.worker.onmessage = (e) => {
      const p = this.pendientes.get(e.data.id);
      if (!p) return;
      clearTimeout(p.temporizador);
      this.pendientes.delete(e.data.id);
      if (e.data.ok) p.resolve(e.data.resultado);
      else p.reject(new Error(e.data.error));
    };
    this.worker.onerror = (e) => {
      for (const p of this.pendientes.values()) p.reject(new Error(e.message || 'Error del worker'));
      this.pendientes.clear();
      this.reiniciar();
    };
  }

  reiniciar() {
    this.worker?.terminate();
    this.worker = null;
    this.cambiar('apagado');
  }

  cambiar(estado, detalle) {
    this.estado = estado;
    this.alCambiarEstado?.(this.nombre, estado, detalle);
  }

  enviar(mensaje, tiempoMax) {
    this.iniciar();
    const id = this.siguienteId++;
    return new Promise((resolve, reject) => {
      const temporizador = setTimeout(() => {
        this.pendientes.delete(id);
        // Cortar el worker es la única forma segura de detener un bucle infinito.
        for (const p of this.pendientes.values()) p.reject(new Error('Reiniciado'));
        this.pendientes.clear();
        this.reiniciar();
        reject(Object.assign(new Error('Timeout'), { timeout: true }));
      }, tiempoMax);
      this.pendientes.set(id, { resolve, reject, temporizador });
      this.worker.postMessage({ id, ...mensaje });
    });
  }
}

export function crearMotores({ alCambiarEstado } = {}) {
  const python = new Trabajador(new URL('./python-worker.js', import.meta.url), 'python', alCambiarEstado);
  const sql = new Trabajador(new URL('./sql-worker.js', import.meta.url), 'sql', alCambiarEstado, 'classic');
  let cargaPython = null;
  let cargaSQL = null;
  let esquemas = {};

  async function asegurarPython() {
    if (python.estado === 'listo' && python.worker) return;
    if (!cargaPython) {
      python.cambiar('cargando');
      cargaPython = python
        .enviar({ tipo: 'cargar' }, TIEMPO_MAX_CARGA_MS)
        .then(() => python.cambiar('listo'))
        .catch((e) => {
          python.cambiar('error', e.message);
          throw e;
        })
        .finally(() => {
          cargaPython = null;
        });
    }
    return cargaPython;
  }

  async function asegurarSQL() {
    if (sql.estado === 'listo' && sql.worker) return;
    if (!cargaSQL) {
      sql.cambiar('cargando');
      cargaSQL = (async () => {
        const [macroCSV, grunfeldCSV] = await Promise.all([ARCHIVOS_DATOS.macro, ARCHIVOS_DATOS.grunfeld].map((r) => fetch('/' + r).then((x) => x.text())));
        const semilla = construirSemillaFondo({ macroCSV, grunfeldCSV });
        esquemas.fondo = await sql.enviar({ tipo: 'preparar', db: 'fondo', semilla }, 30000);
        sql.cambiar('listo');
      })()
        .catch((e) => {
          sql.cambiar('error', e.message);
          throw e;
        })
        .finally(() => {
          cargaSQL = null;
        });
    }
    return cargaSQL;
  }

  return {
    async python(codigo, sondas = [], preludio = '') {
      await asegurarPython();
      try {
        return await python.enviar({ tipo: 'ejecutar', codigo, sondas, preludio }, TIEMPO_MAX_PY_MS);
      } catch (e) {
        if (e.timeout) {
          return { stdout: '', sondas: {}, error: { tipo: 'Timeout', mensaje: `Se detuvo después de ${TIEMPO_MAX_PY_MS / 1000} s`, linea: null } };
        }
        return { stdout: '', sondas: {}, error: { tipo: 'ErrorInterno', mensaje: e.message, linea: null } };
      }
    },
    async sql(db, consulta) {
      await asegurarSQL();
      try {
        return await sql.enviar({ tipo: 'ejecutar', db, consulta }, TIEMPO_MAX_SQL_MS);
      } catch (e) {
        return { ok: false, error: { mensaje: e.timeout ? 'Timeout' : e.message } };
      }
    },
    precargar(lenguaje) {
      const p = lenguaje === 'python' ? asegurarPython() : lenguaje === 'sql' ? asegurarSQL() : Promise.resolve();
      return p.catch(() => {});
    },
    async esquema(db = 'fondo') {
      await asegurarSQL();
      return esquemas[db];
    },
    estado(lenguaje) {
      return lenguaje === 'python' ? python.estado : sql.estado;
    },
  };
}
