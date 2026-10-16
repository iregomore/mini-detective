import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, comprobarAcusacion, sospechoso, nombreArma, nombreHabitacion } from '../src/juego.js';

const caso = generarCaso(77);
const solucion = { culpable: caso.culpable, arma: caso.arma, habitacion: caso.habitacion };

test('acertar las tres cosas gana', () => {
  const resultado = comprobarAcusacion(caso, solucion);
  assert.equal(resultado.gana, true);
  assert.deepEqual(resultado.aciertos, { culpable: true, arma: true, habitacion: true });
});

test('fallar una sola cosa pierde', () => {
  const otraArma = caso.arma === 'cuerda' ? 'veneno' : 'cuerda';
  const resultado = comprobarAcusacion(caso, { ...solucion, arma: otraArma });
  assert.equal(resultado.gana, false);
  assert.deepEqual(resultado.aciertos, { culpable: true, arma: false, habitacion: true });
});

test('el relato cuenta lo que pasó realmente', () => {
  const { relato } = comprobarAcusacion(caso, solucion);
  assert.ok(relato.includes(sospechoso(caso.culpable).nombre));
  assert.ok(relato.includes(caso.victima.nombre));
  assert.ok(relato.includes(nombreArma(caso.arma)));
  assert.ok(relato.includes(nombreHabitacion(caso.habitacion)));
  assert.ok(relato.includes(caso.respuestas[caso.culpable].donde.texto.replace(/\.$/, '')));
});
