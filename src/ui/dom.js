// Ayudas mínimas para construir la interfaz sin frameworks.

// h('div.clase#id', { atributos, onclick }, hijos...)
export function h(etiqueta, props = {}, ...hijos) {
  if (props === null || typeof props !== 'object' || props instanceof Node || Array.isArray(props)) {
    hijos.unshift(props);
    props = {};
  }
  const [tag, ...resto] = etiqueta.split(/(?=[.#])/);
  const el = document.createElement(tag || 'div');
  for (const parte of resto) {
    if (parte.startsWith('.')) el.classList.add(parte.slice(1));
    else if (parte.startsWith('#')) el.id = parte.slice(1);
  }
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'clase') el.className += ' ' + v;
    else if (k === 'estilo') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  agregar(el, hijos);
  return el;
}

function agregar(el, hijos) {
  for (const hijo of hijos.flat(Infinity)) {
    if (hijo === null || hijo === undefined || hijo === false) continue;
    el.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
  }
}

// Vacía el elemento y agrega los hijos (ignora null/false y aplana listas).
export function llenar(el, ...hijos) {
  vaciar(el);
  agregar(el, hijos);
  return el;
}

export function vaciar(el) {
  while (el.firstChild) el.firstChild.remove();
  return el;
}

export function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// Markdown muy reducido: párrafos, **negrita**, `código` y listas con "- ".
export function markdown(texto) {
  const bloques = String(texto).split(/\n{2,}/);
  return bloques
    .map((b) => {
      const lineas = b.split('\n');
      if (lineas.every((l) => l.startsWith('- '))) {
        return `<ul>${lineas.map((l) => `<li>${enLinea(l.slice(2))}</li>`).join('')}</ul>`;
      }
      return `<p>${lineas.map(enLinea).join('<br>')}</p>`;
    })
    .join('');
}

function enLinea(t) {
  return escapar(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export function plantilla(texto, estado) {
  return String(texto).replace(/\{nombre\}/g, estado?.jugador?.nombre || 'analista');
}

export function toast(mensaje, ms = 2600) {
  document.querySelectorAll('.aviso-toast').forEach((t) => t.remove());
  const el = h('div.aviso-toast', { role: 'status' }, mensaje);
  document.body.append(el);
  setTimeout(() => el.remove(), ms);
}

export function modal(contenido, { cerrable = true } = {}) {
  const capa = h('div.capa', { role: 'dialog', 'aria-modal': 'true' });
  const caja = h('div.panel.modal', {}, contenido);
  capa.append(caja);
  const cerrar = () => {
    capa.remove();
    document.removeEventListener('keydown', alTeclear);
  };
  const alTeclear = (e) => {
    if (e.key === 'Escape' && cerrable) cerrar();
  };
  if (cerrable) capa.addEventListener('click', (e) => e.target === capa && cerrar());
  document.addEventListener('keydown', alTeclear);
  document.body.append(capa);
  return { cerrar, caja };
}

export function confirmar(mensaje, { si = 'Sí', no = 'Cancelar' } = {}) {
  return new Promise((resolve) => {
    const m = modal(
      h(
        'div.columna',
        {},
        h('p', {}, mensaje),
        h('div.fila', {}, h('button.primario', { onclick: () => fin(true) }, si), h('button', { onclick: () => fin(false) }, no)),
      ),
      { cerrable: false },
    );
    function fin(r) {
      m.cerrar();
      resolve(r);
    }
  });
}

export function animarNumero(el, desde, hasta, formato, ms = 900) {
  const inicio = performance.now();
  const paso = (t) => {
    const p = Math.min(1, (t - inicio) / ms);
    const v = desde + (hasta - desde) * (1 - Math.pow(1 - p, 3));
    el.textContent = formato(v);
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}
