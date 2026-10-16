import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso } from '../src/juego.js';
import { habitaciones } from '../src/datos.js';

test('cada habitación tiene una pista o nada', () => {
  const caso = generarCaso(5);
  assert.deepEqual(Object.keys(caso.pistas).sort(), habitaciones.map((h) => h.id).sort());
  const conPista = Object.values(caso.pistas).filter(Boolean);
  assert.ok(conPista.length >= 3 && conPista.length <= 4);
  for (const pista of conPista) assert.ok(pista.texto.length > 0);
});

test('las pistas son verdaderas: nunca descartan el arma ni el lugar del crimen', () => {
  for (let s = 0; s < 200; s++) {
    const caso = generarCaso(s);
    for (const pista of Object.values(caso.pistas).filter(Boolean)) {
      assert.notEqual(pista.hecho.arma, caso.arma);
      assert.notEqual(pista.hecho.habitacion, caso.habitacion);
    }
  }
});

test('cada pista descarta una sola cosa: ninguna resuelve el caso por sí sola', () => {
  for (let s = 0; s < 200; s++) {
    for (const pista of Object.values(generarCaso(s).pistas).filter(Boolean)) {
      assert.ok(['noArma', 'noLugar'].includes(pista.hecho.tipo));
    }
  }
});

test('los inocentes estaban por parejas fuera de la habitación del crimen', () => {
  const caso = generarCaso(9);
  const ids = Object.keys(caso.ubicaciones);
  assert.equal(ids.length, 4);
  assert.ok(!ids.includes(caso.culpable));
  for (const id of ids) {
    const { habitacion, con } = caso.ubicaciones[id];
    assert.notEqual(habitacion, caso.habitacion);
    assert.equal(caso.ubicaciones[con[0]].habitacion, habitacion);
  }
});
