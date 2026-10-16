import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sospechosos, frase } from '../src/datos.js';
import { crearAleatorio } from '../src/juego.js';

const claves = ['relacion', 'conPareja', 'conOtro', 'solo', 'vioArma', 'vioLugar', 'nadaRaro', 'opinion', 'acusa'];

test('hay 8 personajes con nombre, profesión, rasgo y forma de hablar', () => {
  assert.equal(sospechosos.length, 8);
  assert.equal(new Set(sospechosos.map((s) => s.id)).size, 8);
  assert.equal(new Set(sospechosos.map((s) => s.nombre)).size, 8);
  for (const s of sospechosos) {
    for (const campo of ['nombre', 'rol', 'profesion', 'rasgo', 'habla']) {
      assert.ok(s[campo]?.length > 0, `${s.id}.${campo}`);
    }
  }
});

test('cada personaje tiene su voz para todas las respuestas', () => {
  for (const s of sospechosos) {
    for (const clave of claves) assert.ok(s.voz[clave]?.length > 0, `${s.id}.${clave}`);
  }
});

test('las frases siempre incluyen los datos que necesita el jugador', () => {
  const aleatorio = crearAleatorio(1);
  for (const s of sospechosos) {
    for (let i = 0; i < 20; i++) {
      const pareja = frase(s, 'conPareja', aleatorio, 'el lugar X', 'Fulano');
      assert.ok(pareja.includes('el lugar X') && pareja.includes('Fulano'), pareja);
      const otro = frase(s, 'conOtro', aleatorio, 'el lugar X', 'Fulano');
      assert.ok(otro.includes('el lugar X') && otro.includes('Fulano'), otro);
      assert.ok(frase(s, 'solo', aleatorio, 'el lugar X').includes('el lugar X'));
      assert.ok(frase(s, 'vioArma', aleatorio, 'el objeto Y').toLowerCase().includes('el objeto y'));
      assert.ok(frase(s, 'vioLugar', aleatorio, 'el lugar X').includes('el lugar X'));
      assert.ok(frase(s, 'opinion', aleatorio, 'Fulano').includes('Fulano'));
      assert.ok(frase(s, 'acusa', aleatorio, 'Fulano').includes('Fulano'));
    }
  }
});

test('las formas de hablar son distintas entre personajes', () => {
  const aleatorio = crearAleatorio(2);
  const textos = sospechosos.map((s) => frase(s, 'conPareja', aleatorio, 'la cocina', 'Fulano'));
  assert.equal(new Set(textos).size, sospechosos.length);
});
