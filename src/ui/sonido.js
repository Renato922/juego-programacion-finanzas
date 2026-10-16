// Efectos de sonido chiptune generados con WebAudio (sin archivos).

let ctx = null;
let activo = true;

export function configurarSonido(encendido) {
  activo = encendido;
}

function tono(frecuencia, duracion, { tipo = 'square', volumen = 0.05, retraso = 0 } = {}) {
  if (!activo) return;
  try {
    ctx ??= new AudioContext();
    const osc = ctx.createOscillator();
    const gan = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = frecuencia;
    const t0 = ctx.currentTime + retraso;
    gan.gain.setValueAtTime(volumen, t0);
    gan.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion);
    osc.connect(gan).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duracion + 0.02);
  } catch {
    // Sin audio disponible: se ignora.
  }
}

export const sonido = {
  clic: () => tono(660, 0.05, { volumen: 0.03 }),
  acierto: () => [523, 659, 784].forEach((f, i) => tono(f, 0.12, { retraso: i * 0.08 })),
  error: () => tono(196, 0.18, { tipo: 'triangle', volumen: 0.06 }),
  moneda: () => [988, 1319].forEach((f, i) => tono(f, 0.09, { retraso: i * 0.07, volumen: 0.04 })),
  golpe: () => tono(110, 0.2, { tipo: 'sawtooth', volumen: 0.05 }),
  victoria: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tono(f, 0.16, { retraso: i * 0.12 })),
  ascenso: () => [392, 523, 659, 784, 1047].forEach((f, i) => tono(f, 0.2, { retraso: i * 0.1, tipo: 'triangle', volumen: 0.07 })),
};
