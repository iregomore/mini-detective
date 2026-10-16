import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, dificultades } from '../src/juego.js';

test('las dificultades son fácil, normal y difícil', () => {
  assert.deepEqual(dificultades, ['facil', 'normal', 'dificil']);
});

test('sin dificultad, el caso es normal y no cambia', () => {
  assert.equal(generarCaso(7).dificultad, 'normal');
  assert.deepEqual(generarCaso(7), generarCaso(7, 'normal'));
});

test('cada dificultad es determinista con la misma semilla', () => {
  for (const dificultad of dificultades) {
    assert.deepEqual(generarCaso(7, dificultad), generarCaso(7, dificultad));
    assert.equal(generarCaso(7, dificultad).dificultad, dificultad);
  }
});

test('una dificultad desconocida da error', () => {
  assert.throws(() => generarCaso(7, 'imposible'));
});
