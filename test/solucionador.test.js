import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, solucionar, informacionDelCaso } from '../src/juego.js';
import { sospechosos, armas, habitaciones } from '../src/datos.js';

const total = sospechosos.length * armas.length * habitaciones.length;

test('sin información todas las combinaciones son compatibles', () => {
  assert.equal(solucionar([]).length, total);
});

test('descartar un arma elimina sus combinaciones', () => {
  const resultado = solucionar([{ fuente: 'pista', hecho: { tipo: 'noArma', arma: 'cuerda' } }]);
  assert.equal(resultado.length, total - sospechosos.length * habitaciones.length);
  assert.ok(resultado.every((c) => c.arma !== 'cuerda'));
});

test('una pareja que se da coartada exculpa a sus dos miembros', () => {
  const resultado = solucionar([
    { fuente: 'socio', hecho: { tipo: 'estaba', persona: 'socio', habitacion: 'cocina', con: ['medica'] } },
    { fuente: 'medica', hecho: { tipo: 'estaba', persona: 'medica', habitacion: 'cocina', con: ['socio'] } },
  ]);
  assert.ok(resultado.every((c) => !['socio', 'medica'].includes(c.culpable)));
  assert.ok(resultado.every((c) => c.habitacion !== 'cocina'));
});

test('declaraciones contradictorias entre dos personas implican a una de ellas', () => {
  const resultado = solucionar([
    { fuente: 'socio', hecho: { tipo: 'estaba', persona: 'socio', habitacion: 'cocina', con: [] } },
    { fuente: 'medica', hecho: { tipo: 'estaba', persona: 'medica', habitacion: 'cocina', con: [] } },
  ]);
  assert.ok(resultado.length > 0);
  assert.ok(resultado.every((c) => ['socio', 'medica'].includes(c.culpable)));
});

test('con toda la información de un caso aparece su solución', () => {
  const caso = generarCaso(21);
  const resultado = solucionar(informacionDelCaso(caso));
  assert.ok(resultado.some((c) => c.culpable === caso.culpable
    && c.arma === caso.arma && c.habitacion === caso.habitacion));
});
