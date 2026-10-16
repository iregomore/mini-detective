// Guardar y cargar la partida en curso y las estadísticas en localStorage.
// Todo va envuelto en try/catch: si el almacenamiento falla, el juego sigue sin guardar.

import {
  generarCaso, explorar, interrogar, crearCuaderno, anotarPista, anotarRespuesta,
} from './juego.js';
import { habitaciones, sospechosos, armas, preguntas } from './datos.js';

const CLAVE_PARTIDA = 'mini-detective:partida';
const CLAVE_ESTADISTICAS = 'mini-detective:estadisticas';
const VERSION = 1;

function almacenPorDefecto() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function leer(almacen, clave) {
  try {
    const texto = almacen?.getItem(clave);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

function escribir(almacen, clave, valor) {
  try {
    if (!almacen) return false;
    almacen.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

function quitar(almacen, clave) {
  try {
    almacen?.removeItem(clave);
  } catch {
    // Sin almacenamiento no hay nada que borrar.
  }
}

const esTexto = (valor) => typeof valor === 'string' && valor.length > 0;
const esEnteroPositivo = (valor) => Number.isInteger(valor) && valor > 0;

// Resumen guardable de la partida: la semilla y los identificadores de lo descubierto.
// Los textos no se guardan: se regeneran a partir de la semilla al cargar.
export function resumirPartida(semilla, cuaderno, acusacion = {}) {
  return {
    version: VERSION,
    semilla,
    pistas: cuaderno.pistas.map((p) => p.habitacion),
    respuestas: cuaderno.respuestas.map((r) => ({ sospechoso: r.sospechoso, pregunta: r.pregunta })),
    acusacion: { ...acusacion },
  };
}

function partidaValida(partida) {
  return partida?.version === VERSION
    && esEnteroPositivo(partida.semilla)
    && Array.isArray(partida.pistas) && partida.pistas.every(esTexto)
    && Array.isArray(partida.respuestas)
    && partida.respuestas.every((r) => esTexto(r?.sospechoso) && esTexto(r?.pregunta))
    && typeof partida.acusacion === 'object' && partida.acusacion !== null;
}

export function guardarPartida(partida, almacen = almacenPorDefecto()) {
  return escribir(almacen, CLAVE_PARTIDA, partida);
}

// Devuelve la partida guardada o null si no hay ninguna o está dañada.
export function cargarPartida(almacen = almacenPorDefecto()) {
  const partida = leer(almacen, CLAVE_PARTIDA);
  return partidaValida(partida) ? partida : null;
}

export function borrarPartida(almacen = almacenPorDefecto()) {
  quitar(almacen, CLAVE_PARTIDA);
}

const existe = (lista, id) => lista.some((elemento) => elemento.id === id);

// Reconstruye el caso, el cuaderno y la acusación a partir de una partida guardada.
// Los identificadores que ya no existan en los datos se ignoran.
export function restaurarPartida(partida) {
  const caso = generarCaso(partida.semilla);
  let cuaderno = crearCuaderno();
  for (const habitacion of partida.pistas.filter((id) => existe(habitaciones, id))) {
    cuaderno = anotarPista(cuaderno, habitacion, explorar(caso, habitacion));
  }
  const validas = partida.respuestas
    .filter((r) => existe(sospechosos, r.sospechoso) && existe(preguntas, r.pregunta));
  for (const { sospechoso, pregunta } of validas) {
    cuaderno = anotarRespuesta(cuaderno, sospechoso, pregunta, interrogar(caso, sospechoso, pregunta));
  }
  const listas = { culpable: sospechosos, arma: armas, habitacion: habitaciones };
  const acusacion = Object.fromEntries(Object.entries(listas)
    .filter(([parte, lista]) => existe(lista, partida.acusacion[parte]))
    .map(([parte]) => [parte, partida.acusacion[parte]]));
  return { caso, cuaderno, acusacion };
}

const plural = (n, singular, varios) => `${n} ${n === 1 ? singular : varios}`;

export function resumenPartidaGuardada(cuaderno) {
  const habitacionesRegistradas = plural(cuaderno.pistas.length, 'habitación registrada', 'habitaciones registradas');
  const preguntasHechas = plural(cuaderno.respuestas.length, 'pregunta hecha', 'preguntas hechas');
  return `Tienes este caso a medias: ${habitacionesRegistradas} y ${preguntasHechas}.`;
}

export function cargarEstadisticas(almacen = almacenPorDefecto()) {
  const datos = leer(almacen, CLAVE_ESTADISTICAS);
  const jugadas = Number.isInteger(datos?.jugadas) && datos.jugadas >= 0 ? datos.jugadas : 0;
  const ganadas = Number.isInteger(datos?.ganadas) && datos.ganadas >= 0 ? datos.ganadas : 0;
  return { jugadas, ganadas: Math.min(ganadas, jugadas) };
}

export function registrarResultado(gana, almacen = almacenPorDefecto()) {
  const { jugadas, ganadas } = cargarEstadisticas(almacen);
  const nuevas = { jugadas: jugadas + 1, ganadas: ganadas + (gana ? 1 : 0) };
  escribir(almacen, CLAVE_ESTADISTICAS, nuevas);
  return nuevas;
}

export function textoContador({ jugadas, ganadas }) {
  if (jugadas === 0) return 'Todavía no has cerrado ningún caso.';
  return `Casos resueltos: ${ganadas} de ${jugadas} ${jugadas === 1 ? 'jugado' : 'jugados'}.`;
}
