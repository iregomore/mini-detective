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
  const contiene = (texto, ...datos) => datos.every((d) => texto.toLowerCase().includes(d.toLowerCase()));
  for (const s of sospechosos) {
    for (let i = 0; i < 30; i++) {
      assert.ok(contiene(frase(s, 'conPareja', aleatorio, 'el lugar X', 'Fulano'), 'el lugar X', 'Fulano'));
      assert.ok(contiene(frase(s, 'conOtro', aleatorio, 'el lugar X', 'Fulano'), 'el lugar X', 'Fulano'));
      assert.ok(contiene(frase(s, 'solo', aleatorio, 'el lugar X'), 'el lugar X'));
      assert.ok(contiene(frase(s, 'vioArma', aleatorio, 'el objeto Y'), 'el objeto Y'));
      assert.ok(contiene(frase(s, 'vioLugar', aleatorio, 'el lugar X'), 'el lugar X'));
      assert.ok(contiene(frase(s, 'opinion', aleatorio, 'Fulano'), 'Fulano'));
      assert.ok(contiene(frase(s, 'acusa', aleatorio, 'Fulano'), 'Fulano'));
    }
  }
});

test('las frases conservan el sentido que usa el solucionador', () => {
  for (const s of sospechosos) {
    for (const f of s.voz.conPareja) assert.match(f('X', 'Y'), /solo estábamos los dos/i, s.id);
    for (const f of s.voz.conOtro) assert.match(f('X', 'Y'), /confirm|pregúnt|que lo diga/i, s.id);
    for (const f of s.voz.solo) assert.match(f('X'), /sin compañía|sola\b/i, s.id);
    for (const f of s.voz.vioArma) assert.match(f('X'), /en su sitio/i, s.id);
    for (const f of s.voz.vioLugar) assert.match(f('X'), /no (ocurrió|pasó) nada/i, s.id);
  }
});

test('cada respuesta tiene al menos tres versiones por personaje', () => {
  for (const s of sospechosos) {
    for (const clave of claves) {
      assert.ok(s.voz[clave].length >= 3, `${s.id}.${clave}`);
      const textos = s.voz[clave].map((v) => (typeof v === 'function' ? v('A', 'B') : v));
      assert.equal(new Set(textos).size, textos.length, `${s.id}.${clave}: versiones repetidas`);
    }
  }
});

test('la misma pregunta al mismo personaje suena distinta entre partidas', async () => {
  const { generarCaso } = await import('../src/juego.js');
  const textos = {};
  for (let semilla = 0; semilla < 300; semilla++) {
    const caso = generarCaso(semilla);
    for (const [id, respuestas] of Object.entries(caso.respuestas)) {
      textos[id] ??= new Set();
      textos[id].add(respuestas.relacion.texto);
    }
  }
  for (const s of sospechosos) assert.ok(textos[s.id].size >= 2, s.id);
});

test('las formas de hablar son distintas entre personajes', () => {
  const aleatorio = crearAleatorio(2);
  const textos = sospechosos.map((s) => frase(s, 'conPareja', aleatorio, 'la cocina', 'Fulano'));
  assert.equal(new Set(textos).size, sospechosos.length);
});
