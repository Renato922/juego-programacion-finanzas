// Auditoría ejecutable de un ejercicio: lo corre de verdad en Pyodide o sql.js
// y devuelve la lista de problemas encontrados (vacía si todo está bien).
// La usan test/contenido.test.js y scripts/verificar-mision.js.
//
// Reglas que verifica:
//  - la solución de referencia pasa;
//  - el código inicial NO pasa (el ejercicio no viene resuelto);
//  - cada alternativa correcta pasa;
//  - cada respuesta incorrecta conocida falla. Una incorrecta puede ser un
//    texto (solo debe fallar) o { codigo, retro } donde retro es un texto o
//    una lista de textos que DEBEN aparecer en la retroalimentación que ve el
//    jugador (sin distinguir mayúsculas). Así se garantiza que los errores
//    típicos reciben una explicación útil y no un mensaje genérico.

import { evaluarEjercicio } from '../src/core/evaluador.js';

export function textoRetroalimentacion(v) {
  const partes = [];
  for (const f of v.fallas ?? []) partes.push(f.mensaje, f.ayuda, f.esperado);
  if (v.error) partes.push(v.error.titulo, v.error.explicacion, v.error.consejo, v.error.original);
  return partes.filter(Boolean).join(' \n ');
}

function sinTildes(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export async function auditarEjercicio(paso, motores, { exigirExplicacion = true, minimoPistas = 3 } = {}) {
  const problemas = [];
  if (exigirExplicacion && !String(paso.explicacion ?? '').trim()) problemas.push('falta "explicacion" (cómo se resuelve)');
  if ((paso.pistas ?? []).length < minimoPistas) problemas.push(`tiene ${(paso.pistas ?? []).length} pistas; mínimo ${minimoPistas}`);

  const ref = await evaluarEjercicio(paso, paso.solucion, motores);
  if (!ref.ok) problemas.push(`la solución no pasa: ${JSON.stringify(ref.fallas ?? ref.error)}`);

  const inicial = await evaluarEjercicio(paso, paso.inicial ?? '', motores);
  if (inicial.ok) problemas.push('el código inicial ya resuelve el ejercicio');

  for (const alt of paso.alternativas ?? []) {
    const r = await evaluarEjercicio(paso, alt, motores);
    if (!r.ok) problemas.push(`alternativa rechazada:\n${alt}\n→ ${textoRetroalimentacion(r)}`);
  }
  for (const mala of paso.incorrectas ?? []) {
    const codigo = typeof mala === 'string' ? mala : mala.codigo;
    const r = await evaluarEjercicio(paso, codigo, motores);
    if (r.ok) {
      problemas.push(`respuesta incorrecta aceptada:\n${codigo}`);
      continue;
    }
    if (typeof mala === 'object' && mala.retro) {
      const texto = sinTildes(textoRetroalimentacion(r));
      for (const debe of [].concat(mala.retro)) {
        if (!texto.includes(sinTildes(debe))) {
          problemas.push(`para el error:\n${codigo}\nla retroalimentación no menciona "${debe}". Dice: ${textoRetroalimentacion(r)}`);
        }
      }
    }
  }
  return problemas;
}

export async function auditarLeccion(paso, motores) {
  if (!paso.codigo) return [];
  if (paso.lenguaje === 'python') {
    const r = await motores.python(paso.codigo, [], '');
    return r.error ? [`el código de la lección "${paso.titulo}" falla: ${JSON.stringify(r.error)}`] : [];
  }
  if (paso.lenguaje === 'sql') {
    const r = await motores.sql(paso.db ?? 'fondo', paso.codigo);
    return r.ok ? [] : [`la consulta de la lección "${paso.titulo}" falla: ${JSON.stringify(r.error)}`];
  }
  return [];
}
