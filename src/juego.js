// Lógica pura del juego. Sin acceso al DOM.
import {
  victimas, sospechosos, armas, habitaciones, lugaresHallazgo, motivos, textosPista,
} from './datos.js';

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

export const nombreArma = (id) => armas.find((a) => a.id === id).nombre;
export const nombreHabitacion = (id) => habitaciones.find((h) => h.id === id).nombre;
export const sospechoso = (id) => sospechosos.find((s) => s.id === id);

export function generarCaso(semilla) {
  const aleatorio = crearAleatorio(semilla);
  const caso = {
    semilla,
    victima: elegir(victimas, aleatorio),
    hallazgo: elegir(lugaresHallazgo, aleatorio),
    culpable: elegir(sospechosos, aleatorio).id,
    arma: elegir(armas, aleatorio).id,
    habitacion: elegir(habitaciones, aleatorio).id,
    motivo: elegir(motivos, aleatorio),
  };
  const escena = planificarEscena(caso, aleatorio);
  const { hechosPistas, hechosTestigos } = repartirHechos(escena, aleatorio);
  caso.ubicaciones = escena.ubicaciones;
  caso.pistas = colocarPistas(hechosPistas, aleatorio);
  caso.hechosTestigos = hechosTestigos;
  return caso;
}

// Los cuatro inocentes estaban por parejas en dos habitaciones que no son la del crimen.
// Las demás armas y habitaciones se descartan con hechos repartidos entre pistas y testigos.
function planificarEscena(caso, aleatorio) {
  const otrasHabitaciones = barajar(
    habitaciones.map((h) => h.id).filter((id) => id !== caso.habitacion),
    aleatorio,
  );
  const inocentes = barajar(
    sospechosos.map((s) => s.id).filter((id) => id !== caso.culpable),
    aleatorio,
  );
  const ubicaciones = {};
  for (let i = 0; i < inocentes.length; i += 2) {
    const [uno, otro] = [inocentes[i], inocentes[i + 1]];
    const habitacion = otrasHabitaciones[i / 2];
    ubicaciones[uno] = { habitacion, con: [otro] };
    ubicaciones[otro] = { habitacion, con: [uno] };
  }
  const eliminaciones = [
    ...armas.filter((a) => a.id !== caso.arma).map((a) => ({ tipo: 'noArma', arma: a.id })),
    ...otrasHabitaciones.slice(inocentes.length / 2).map((id) => ({ tipo: 'noLugar', habitacion: id })),
  ];
  return { ubicaciones, eliminaciones };
}

// Entre 3 y 4 hechos van a las habitaciones; el resto, a lo que vieron los inocentes.
function repartirHechos(escena, aleatorio) {
  const hechos = barajar(escena.eliminaciones, aleatorio);
  const enPistas = 3 + Math.floor(aleatorio() * 2);
  return { hechosPistas: hechos.slice(0, enPistas), hechosTestigos: hechos.slice(enPistas) };
}

function colocarPistas(hechos, aleatorio) {
  const lugares = barajar(habitaciones.map((h) => h.id), aleatorio);
  const pistas = Object.fromEntries(lugares.map((id) => [id, null]));
  hechos.forEach((hecho, i) => {
    pistas[lugares[i]] = { hecho, texto: textoPista(hecho, lugares[i]) };
  });
  return pistas;
}

function textoPista(hecho, dondeEsta) {
  if (hecho.tipo === 'noArma') return textosPista.noArma(nombreArma(hecho.arma));
  if (hecho.habitacion === dondeEsta) return textosPista.noLugarAqui();
  return textosPista.noLugarOtro(nombreHabitacion(hecho.habitacion));
}
