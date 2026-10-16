// Prueba una respuesta en un ejercicio y muestra la retroalimentación exacta
// que vería el jugador. Útil para auditar mensajes de error.
// Uso:  node scripts/probar-respuesta.js <idMision> <idPaso> <archivo.py|.sql>
//       (o pasa el código por la entrada estándar si omites el archivo)

import fs from 'node:fs';
import { CATALOGO, pasosEvaluables } from '../src/contenido/index.js';
import { crearMotores } from '../test/motores-node.js';
import { evaluarEjercicio } from '../src/core/evaluador.js';

const [idMision, idPaso, archivo] = process.argv.slice(2);
const mision = CATALOGO.misiones[idMision];
let paso = mision && pasosEvaluables(mision).find((p) => p.id === idPaso);
if (!paso && CATALOGO.conceptos[idMision]) paso = CATALOGO.conceptos[idMision].repasos[Number(idPaso)];
if (!paso) {
  console.error('No encontré ese ejercicio. Uso: node scripts/probar-respuesta.js <idMision> <idPaso> <archivo>');
  process.exit(2);
}
const codigo = archivo ? fs.readFileSync(archivo, 'utf8') : fs.readFileSync(0, 'utf8');
const r = await evaluarEjercicio(paso, codigo, await crearMotores());
console.log(JSON.stringify({ ok: r.ok, error: r.error, verificaciones: r.verificaciones, fallas: r.fallas, salida: r.salida }, null, 2));
