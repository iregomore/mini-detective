import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, solucionar, informacionDelCaso } from '../src/juego.js';

const SEMILLAS = 1000;
const casos = Array.from({ length: SEMILLAS }, (_, semilla) => generarCaso(semilla));

test('1.000 semillas: la solución es única y es la del caso', () => {
  for (const caso of casos) {
    const resultado = solucionar(informacionDelCaso(caso));
    assert.deepEqual(resultado, [
      { culpable: caso.culpable, arma: caso.arma, habitacion: caso.habitacion },
    ], `semilla ${caso.semilla}`);
  }
});

test('1.000 semillas: el culpable miente de forma detectable', () => {
  for (const caso of casos) {
    // Si creyéramos todo lo que dice el culpable, ninguna combinación encajaría.
    const creyendoATodos = informacionDelCaso(caso).map((i) => ({ ...i, fuente: 'pista' }));
    assert.equal(solucionar(creyendoATodos).length, 0, `semilla ${caso.semilla}`);
  }
});

test('1.000 semillas: ninguna pista sola basta', () => {
  for (const caso of casos) {
    for (const dato of informacionDelCaso(caso)) {
      assert.ok(solucionar([dato]).length > 1, `semilla ${caso.semilla}`);
    }
  }
});

test('1.000 semillas: hace falta explorar e interrogar', () => {
  for (const caso of casos) {
    const informacion = informacionDelCaso(caso);
    const soloPistas = informacion.filter((i) => i.fuente === 'pista');
    const soloRespuestas = informacion.filter((i) => i.fuente !== 'pista');
    assert.ok(solucionar(soloPistas).length > 1, `semilla ${caso.semilla}`);
    assert.ok(solucionar(soloRespuestas).length > 1, `semilla ${caso.semilla}`);
  }
});
