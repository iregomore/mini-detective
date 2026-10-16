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
    const otro = caso.victima.muerto === 'muerto' ? 'muerta' : 'muerto';
    const texto = introduccion(caso);
    assert.ok(texto.includes(`aparecido ${caso.victima.muerto}`), texto);
    assert.ok(!texto.includes(otro), texto);
  }
});

test('la introducción tiene ambientación que cambia según la víctima y la partida', () => {
  const porVictima = {};
  for (let s = 0; s < 200; s++) {
    const caso = generarCaso(s);
    const texto = introduccion(caso);
    assert.ok(texto.includes(caso.victima.ambiente), texto);
    (porVictima[caso.victima.nombre] ??= new Set()).add(texto.split('.')[0]);
  }
  for (const [nombre, comienzos] of Object.entries(porVictima)) assert.ok(comienzos.size >= 2, nombre);
});

test('la introducción no desvela el arma ni la habitación del crimen', async () => {
  const { nombreArma, nombreHabitacion } = await import('../src/juego.js');
  for (let s = 0; s < 200; s++) {
    const caso = generarCaso(s);
    const texto = introduccion(caso);
    assert.ok(!texto.includes(nombreArma(caso.arma)), texto);
    assert.ok(!texto.includes(nombreHabitacion(caso.habitacion)), texto);
  }
});

test('la introducción usa las cantidades de datos.js', () => {
  const texto = introduccion(generarCaso(4)).toLowerCase();
  assert.ok(texto.includes(`${enLetras(habitaciones.length)} habitaciones`));
  assert.ok(texto.includes(`${enLetras(sospechosos.length)} personas`));
});
