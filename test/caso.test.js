import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, crearAleatorio } from '../src/juego.js';
import { sospechosos, armas, habitaciones } from '../src/datos.js';

test('el generador aleatorio es determinista', () => {
  const a = crearAleatorio(42);
  const b = crearAleatorio(42);
  for (let i = 0; i < 10; i++) assert.equal(a(), b());
});

test('la misma semilla genera el mismo caso', () => {
  assert.deepEqual(generarCaso(7), generarCaso(7));
});

test('el caso tiene víctima, culpable, arma y habitación válidos', () => {
  const caso = generarCaso(123);
  assert.ok(caso.victima.nombre);
  assert.ok(sospechosos.some((s) => s.id === caso.culpable));
  assert.ok(armas.some((a) => a.id === caso.arma));
  assert.ok(habitaciones.some((h) => h.id === caso.habitacion));
});

test('semillas distintas producen casos variados', () => {
  const culpables = new Set();
  for (let s = 0; s < 100; s++) culpables.add(generarCaso(s).culpable);
  assert.equal(culpables.size, sospechosos.length);
});
