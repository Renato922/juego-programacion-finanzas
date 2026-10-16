// Ejecuta consultas SQL con sql.js (SQLite compilado a WebAssembly).
// Cada ejecución parte de una copia limpia de la base de datos, así un
// DELETE o DROP del jugador no rompe los ejercicios siguientes.

export function crearPlantillaBD(SQL, semillaSQL) {
  const db = new SQL.Database();
  try {
    db.exec(semillaSQL);
    return db.export();
  } finally {
    db.close();
  }
}

export function ejecutarSQL(SQL, plantilla, consulta) {
  if (!consulta || !consulta.replace(/--.*$/gm, '').trim()) {
    return { ok: false, error: { mensaje: 'no hay consulta' } };
  }
  const db = new SQL.Database(plantilla);
  try {
    const resultados = db.exec(consulta);
    if (!resultados.length) return { ok: true, columnas: [], filas: [], vacia: true };
    const ultimo = resultados[resultados.length - 1];
    return { ok: true, columnas: ultimo.columns, filas: ultimo.values.slice(0, 5000) };
  } catch (e) {
    return { ok: false, error: { mensaje: e.message ?? String(e) } };
  } finally {
    db.close();
  }
}

// Esquema de la base (tablas y columnas) para mostrarlo en el panel lateral.
export function describirEsquema(SQL, plantilla) {
  const db = new SQL.Database(plantilla);
  try {
    const tablas = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    if (!tablas.length) return [];
    return tablas[0].values.map(([nombre]) => {
      const cols = db.exec(`PRAGMA table_info("${nombre}")`)[0].values.map((c) => ({ nombre: c[1], tipo: c[2] }));
      const n = db.exec(`SELECT COUNT(*) FROM "${nombre}"`)[0].values[0][0];
      return { nombre, columnas: cols, filas: n };
    });
  } finally {
    db.close();
  }
}
