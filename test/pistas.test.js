import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso } from '../src/juego.js';
import { habitaciones, sospechosos } from '../src/datos.js';

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
  assert.equal(ids.length, sospechosos.length - 1);
  assert.ok(!ids.includes(caso.culpable));
  const solos = ids.filter((id) => caso.ubicaciones[id].con.length === 0);
  assert.equal(solos.length, ids.length % 2, 'solo hay alguien sin pareja si son impares');
  for (const id of ids) {
    const { habitacion, con } = caso.ubicaciones[id];
    assert.notEqual(habitacion, caso.habitacion);
    for (const otro of con) assert.equal(caso.ubicaciones[otro].habitacion, habitacion);
  }
});

test('explorar devuelve la pista o "no hay nada"', async () => {
  const { explorar } = await import('../src/juego.js');
  const { textosPista } = await import('../src/datos.js');
  const caso = generarCaso(5);
  for (const [id, pista] of Object.entries(caso.pistas)) {
    assert.equal(explorar(caso, id), pista ? pista.texto : textosPista.nada);
  }
});
