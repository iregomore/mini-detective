// Guardar y cargar la partida en curso en localStorage.
// Todo va envuelto en try/catch: si el almacenamiento falla, el juego sigue sin guardar.

const CLAVE_PARTIDA = 'mini-detective:partida';
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
