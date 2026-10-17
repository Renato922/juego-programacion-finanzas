// Web Worker de SQL (sql.js). Igual que Python, corre aparte para poder
// cortar consultas que no terminan (por ejemplo, CTE recursivas sin fin).

// Es un worker clásico: sql-wasm.js es un script UMD que define initSqlJs
// con importScripts. El ejecutor (código compartido con las pruebas) se
// carga con import() dinámico.

importScripts('/vendor/sql.js/sql-wasm.js');

let SQL = null;
let ejecutor = null;
const plantillas = {};

async function cargarSqlJs() {
  if (SQL) return SQL;
  ejecutor = await import('../core/ejecutor-sql.js');
  SQL = await self.initSqlJs({ locateFile: (archivo) => `/vendor/sql.js/${archivo}` });
  return SQL;
}

self.onmessage = async (evento) => {
  const { id, tipo, db, semilla, consulta } = evento.data;
  try {
    await cargarSqlJs();
    if (tipo === 'preparar') {
      if (!plantillas[db]) plantillas[db] = ejecutor.crearPlantillaBD(SQL, semilla);
      self.postMessage({ id, ok: true, resultado: ejecutor.describirEsquema(SQL, plantillas[db]) });
      return;
    }
    if (!plantillas[db]) throw new Error(`Base ${db} no preparada`);
    self.postMessage({ id, ok: true, resultado: ejecutor.ejecutarSQL(SQL, plantillas[db], consulta) });
  } catch (e) {
    self.postMessage({ id, ok: false, error: String(e?.message ?? e) });
  }
};
