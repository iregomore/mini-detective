import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearCuaderno, anotarPista, anotarRespuesta } from '../src/juego.js';

test('el cuaderno empieza vacío', () => {
  assert.deepEqual(crearCuaderno(), { pistas: [], respuestas: [] });
});

test('anota pistas y respuestas sin repetir', () => {
  let cuaderno = crearCuaderno();
  cuaderno = anotarPista(cuaderno, 'cocina', 'Nada.');
  cuaderno = anotarPista(cuaderno, 'cocina', 'Nada.');
  cuaderno = anotarRespuesta(cuaderno, 'socio', 'donde', 'En el salón.');
  cuaderno = anotarRespuesta(cuaderno, 'socio', 'donde', 'En el salón.');
  cuaderno = anotarRespuesta(cuaderno, 'socio', 'quien', 'No sé.');
  assert.equal(cuaderno.pistas.length, 1);
  assert.equal(cuaderno.respuestas.length, 2);
});

test('anotar no modifica el cuaderno original', () => {
  const vacio = crearCuaderno();
  anotarPista(vacio, 'cocina', 'Nada.');
  assert.equal(vacio.pistas.length, 0);
});
