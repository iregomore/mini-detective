import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generarCaso, comprobarAcusacion, relatoDelCrimen, sospechoso, nombreArma, nombreHabitacion,
} from '../src/juego.js';
import { armas, habitaciones } from '../src/datos.js';

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

test('el relato describe el arma y la habitación, y varía entre partidas', () => {
  const comienzos = new Set();
  for (let s = 0; s < 100; s++) {
    const otro = generarCaso(s);
    const relato = relatoDelCrimen(otro);
    assert.ok(relato.includes(armas.find((a) => a.id === otro.arma).descripcion), relato);
    assert.ok(relato.includes(habitaciones.find((h) => h.id === otro.habitacion).descripcion), relato);
    assert.ok(relato.includes(sospechoso(otro.culpable).nombre) && relato.includes(otro.victima.nombre));
    comienzos.add(relato.slice(0, 12));
  }
  assert.ok(comienzos.size >= 3);
});
