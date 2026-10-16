import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, introduccion } from '../src/juego.js';
import { habitaciones, sospechosos, enLetras } from '../src/datos.js';

test('la introducción nombra a la víctima y dónde apareció', () => {
  const caso = generarCaso(4);
  const texto = introduccion(caso);
  assert.ok(texto.includes(caso.victima.nombre));
  assert.ok(texto.includes(caso.hallazgo));
});

test('la introducción concuerda con el género de la víctima', () => {
  for (let s = 0; s < 50; s++) {
    const caso = generarCaso(s);
    assert.ok(introduccion(caso).includes(`aparecido ${caso.victima.muerto} ${caso.victima.nombre}`));
  }
});

test('la introducción usa las cantidades de datos.js', () => {
  const texto = introduccion(generarCaso(4)).toLowerCase();
  assert.ok(texto.includes(`${enLetras(habitaciones.length)} habitaciones`));
  assert.ok(texto.includes(`${enLetras(sospechosos.length)} personas`));
});
