// Verifica una o varias misiones ejecutando cada ejercicio de verdad.
// Uso: node scripts/verificar-mision.js py-01 [sql-03 ...]   (o "todas")
// Sale con código 1 si encuentra problemas.

import { CATALOGO, pasosEvaluables } from '../src/contenido/index.js';
import { crearMotores } from '../test/motores-node.js';
import { auditarEjercicio, auditarLeccion } from '../test/auditoria-contenido.js';

const ids = process.argv.slice(2);
const lista = ids[0] === 'todas' || !ids.length ? Object.keys(CATALOGO.misiones) : ids;
const motores = await crearMotores();
let total = 0;
for (const id of lista) {
  const m = CATALOGO.misiones[id];
  if (!m) {
    console.log(`✘ ${id}: no existe`);
    total++;
    continue;
  }
  const problemas = [];
  for (const p of m.pasos ?? []) if (p.tipo === 'leccion') problemas.push(...(await auditarLeccion(p, motores)));
  for (const p of pasosEvaluables(m)) {
    if (p.tipo !== 'ejercicio') continue;
    for (const x of await auditarEjercicio(p, motores)) problemas.push(`[${p.id}] ${x}`);
  }
  total += problemas.length;
  console.log(problemas.length ? `✘ ${id}: ${problemas.length} problema(s)\n  - ${problemas.join('\n  - ')}` : `✔ ${id}: sin problemas`);
}
process.exit(total ? 1 : 0);
