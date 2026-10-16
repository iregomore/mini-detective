import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, dificultades, solucionar } from '../src/juego.js';

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

const pistasCon = (caso) => Object.values(caso.pistas).filter(Boolean);
const casosDe = (dificultad, n = 200) => Array.from({ length: n }, (_, s) => generarCaso(s, dificultad));

test('fácil tiene más pistas que normal', () => {
  for (const caso of casosDe('facil')) {
    assert.equal(pistasCon(caso).length, 5, `semilla ${caso.semilla}`);
  }
  for (const caso of casosDe('normal')) assert.ok(pistasCon(caso).length <= 4);
});

test('fácil: la mentira del culpable contradice directamente una pista', () => {
  for (const caso of casosDe('facil')) {
    const [mentira] = caso.respuestas[caso.culpable].donde.hechos;
    const contradice = pistasCon(caso).some((pista) => solucionar([
      { fuente: 'pista', hecho: pista.hecho },
      { fuente: 'pista', hecho: mentira },
    ]).length === 0);
    assert.ok(contradice, `semilla ${caso.semilla}`);
  }
});

test('fácil: las pistas siguen sin descartar el arma ni el lugar del crimen', () => {
  for (const caso of casosDe('facil')) {
    for (const pista of pistasCon(caso)) {
      assert.notEqual(pista.hecho.arma, caso.arma);
      assert.notEqual(pista.hecho.habitacion, caso.habitacion);
    }
  }
});
