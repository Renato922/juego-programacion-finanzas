// Generador pseudoaleatorio con semilla (mulberry32).
// Se usa una semilla para que las pruebas sean reproducibles y para que
// el jugador no pueda "forzar" recompensas recargando la partida.

export function crearRng(semilla = 1) {
  let a = semilla >>> 0;
  const siguiente = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    siguiente,
    entero(min, max) {
      return min + Math.floor(siguiente() * (max - min + 1));
    },
    elegir(lista) {
      return lista[Math.floor(siguiente() * lista.length)];
    },
    // Distribución normal estándar (Box-Muller).
    normal(media = 0, desvio = 1) {
      let u = 0;
      while (u === 0) u = siguiente();
      const v = siguiente();
      return media + desvio * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    barajar(lista) {
      const copia = [...lista];
      for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(siguiente() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
      }
      return copia;
    },
    // Devuelve un número para guardar y reanudar la secuencia más adelante.
    estado() {
      return a;
    },
  };
}
