// Lógica pura del juego. Sin acceso al DOM.
import { victimas, sospechosos, armas, habitaciones, lugaresHallazgo, motivos } from './datos.js';

// Generador pseudoaleatorio determinista (mulberry32).
export function crearAleatorio(semilla) {
  let estado = semilla >>> 0;
  return function aleatorio() {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function elegir(lista, aleatorio) {
  return lista[Math.floor(aleatorio() * lista.length)];
}

export function barajar(lista, aleatorio) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function generarCaso(semilla) {
  const aleatorio = crearAleatorio(semilla);
  return {
    semilla,
    victima: elegir(victimas, aleatorio),
    hallazgo: elegir(lugaresHallazgo, aleatorio),
    culpable: elegir(sospechosos, aleatorio).id,
    arma: elegir(armas, aleatorio).id,
    habitacion: elegir(habitaciones, aleatorio).id,
    motivo: elegir(motivos, aleatorio),
  };
}
