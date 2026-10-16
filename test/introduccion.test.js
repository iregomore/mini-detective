import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, introduccion } from '../src/juego.js';

test('la introducción nombra a la víctima y dónde apareció', () => {
  const caso = generarCaso(4);
  const texto = introduccion(caso);
  assert.ok(texto.includes(caso.victima.nombre));
  assert.ok(texto.includes(caso.hallazgo));
});
