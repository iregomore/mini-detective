import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generarCaso, crearCuaderno, anotarPista, anotarRespuesta, explorar, interrogar,
} from '../src/juego.js';
import {
  resumirPartida, guardarPartida, cargarPartida, borrarPartida,
  restaurarPartida, resumenPartidaGuardada,
} from '../src/guardado.js';

function almacenSimulado() {
  const datos = new Map();
  return {
    datos,
    getItem: (clave) => (datos.has(clave) ? datos.get(clave) : null),
    setItem: (clave, valor) => { datos.set(clave, String(valor)); },
    removeItem: (clave) => { datos.delete(clave); },
  };
}

const almacenRoto = {
  getItem() { throw new Error('bloqueado'); },
  setItem() { throw new Error('cuota llena'); },
  removeItem() { throw new Error('bloqueado'); },
};

function partidaDeEjemplo() {
  let cuaderno = crearCuaderno();
  cuaderno = anotarPista(cuaderno, 'cocina', 'Nada.');
  cuaderno = anotarRespuesta(cuaderno, 'socio', 'donde', 'En el salón.');
  return resumirPartida(42, cuaderno, { culpable: 'socio' });
}

test('resumirPartida guarda solo la semilla y los identificadores', () => {
  assert.deepEqual(partidaDeEjemplo(), {
    version: 1,
    semilla: 42,
    pistas: ['cocina'],
    respuestas: [{ sospechoso: 'socio', pregunta: 'donde' }],
    acusacion: { culpable: 'socio' },
  });
});

test('guarda y carga la misma partida', () => {
  const almacen = almacenSimulado();
  assert.equal(guardarPartida(partidaDeEjemplo(), almacen), true);
  assert.deepEqual(cargarPartida(almacen), partidaDeEjemplo());
});

test('sin partida guardada, cargar devuelve null', () => {
  assert.equal(cargarPartida(almacenSimulado()), null);
});

test('borrar elimina la partida guardada', () => {
  const almacen = almacenSimulado();
  guardarPartida(partidaDeEjemplo(), almacen);
  borrarPartida(almacen);
  assert.equal(cargarPartida(almacen), null);
});

test('ignora datos dañados o de otra versión', () => {
  const almacen = almacenSimulado();
  for (const valor of ['{no es json', '"texto"', '{"version":1,"semilla":-3,"pistas":[],"respuestas":[],"acusacion":{}}',
    JSON.stringify({ ...partidaDeEjemplo(), version: 99 }),
    JSON.stringify({ ...partidaDeEjemplo(), pistas: [7] })]) {
    almacen.datos.set('mini-detective:partida', valor);
    assert.equal(cargarPartida(almacen), null, valor);
  }
});

test('si el almacenamiento falla, nada lanza error', () => {
  assert.equal(guardarPartida(partidaDeEjemplo(), almacenRoto), false);
  assert.equal(cargarPartida(almacenRoto), null);
  assert.doesNotThrow(() => borrarPartida(almacenRoto));
});

test('sin almacenamiento disponible, guardar y cargar no fallan', () => {
  assert.equal(guardarPartida(partidaDeEjemplo(), null), false);
  assert.equal(cargarPartida(null), null);
  assert.doesNotThrow(() => borrarPartida(null));
});

test('restaurar reconstruye el mismo cuaderno a partir de la semilla', () => {
  const caso = generarCaso(77);
  let cuaderno = crearCuaderno();
  cuaderno = anotarPista(cuaderno, 'biblioteca', explorar(caso, 'biblioteca'));
  cuaderno = anotarRespuesta(cuaderno, 'sobrina', 'donde', interrogar(caso, 'sobrina', 'donde'));
  const acusacion = { culpable: 'sobrina', arma: 'veneno' };
  const guardada = JSON.parse(JSON.stringify(resumirPartida(77, cuaderno, acusacion)));
  const restaurada = restaurarPartida(guardada);
  assert.deepEqual(restaurada.caso, caso);
  assert.deepEqual(restaurada.cuaderno, cuaderno);
  assert.deepEqual(restaurada.acusacion, acusacion);
});

test('restaurar ignora identificadores que ya no existen', () => {
  const restaurada = restaurarPartida({
    version: 1,
    semilla: 5,
    pistas: ['biblioteca', 'sotano-secreto'],
    respuestas: [{ sospechoso: 'nadie', pregunta: 'donde' }, { sospechoso: 'sobrina', pregunta: 'otra' }],
    acusacion: { culpable: 'nadie', habitacion: 'biblioteca' },
  });
  assert.deepEqual(restaurada.cuaderno.pistas.map((p) => p.habitacion), ['biblioteca']);
  assert.equal(restaurada.cuaderno.respuestas.length, 0);
  assert.deepEqual(restaurada.acusacion, { habitacion: 'biblioteca' });
});

test('el resumen de la partida guardada concuerda en número', () => {
  assert.equal(resumenPartidaGuardada({ pistas: [1], respuestas: [] }),
    'Tienes este caso a medias: 1 habitación registrada y 0 preguntas hechas.');
  assert.equal(resumenPartidaGuardada({ pistas: [1, 2], respuestas: [1] }),
    'Tienes este caso a medias: 2 habitaciones registradas y 1 pregunta hecha.');
});
