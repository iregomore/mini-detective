import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso, solucionar, informacionDelCaso, dificultades } from '../src/juego.js';
import { sospechosos, armas, habitaciones } from '../src/datos.js';

const SEMILLAS = 1000;

const casosPorDificultad = Object.fromEntries(dificultades.map((dificultad) => [
  dificultad, Array.from({ length: SEMILLAS }, (_, semilla) => generarCaso(semilla, dificultad)),
]));

for (const dificultad of dificultades) {
  const casos = casosPorDificultad[dificultad];
  const etiqueta = (caso) => `${dificultad}, semilla ${caso.semilla}`;

  test(`1.000 semillas (${dificultad}): la solución es única y es la del caso`, () => {
    for (const caso of casos) {
      const resultado = solucionar(informacionDelCaso(caso));
      assert.deepEqual(resultado, [
        { culpable: caso.culpable, arma: caso.arma, habitacion: caso.habitacion },
      ], etiqueta(caso));
    }
  });

  test(`1.000 semillas (${dificultad}): el culpable miente de forma detectable`, () => {
    for (const caso of casos) {
      // Si creyéramos todo lo que dice el culpable, ninguna combinación encajaría.
      const creyendoATodos = informacionDelCaso(caso).map((i) => ({ ...i, fuente: 'pista' }));
      assert.equal(solucionar(creyendoATodos).length, 0, etiqueta(caso));
    }
  });

  test(`1.000 semillas (${dificultad}): ninguna pista sola basta`, () => {
    for (const caso of casos) {
      for (const dato of informacionDelCaso(caso)) {
        assert.ok(solucionar([dato]).length > 1, etiqueta(caso));
      }
    }
  });

  test(`1.000 semillas (${dificultad}): hace falta explorar e interrogar`, () => {
    for (const caso of casos) {
      const informacion = informacionDelCaso(caso);
      const soloPistas = informacion.filter((i) => i.fuente === 'pista');
      const soloRespuestas = informacion.filter((i) => i.fuente !== 'pista');
      assert.ok(solucionar(soloPistas).length > 1, etiqueta(caso));
      assert.ok(solucionar(soloRespuestas).length > 1, etiqueta(caso));
    }
  });
}

test('1.000 semillas: se usa todo el contenido nuevo (8 sospechosos, 7 armas, 7 habitaciones)', () => {
  assert.deepEqual([sospechosos.length, armas.length, habitaciones.length], [8, 7, 7]);
  const usados = { culpable: new Set(), arma: new Set(), habitacion: new Set(), solo: new Set() };
  for (const caso of casosPorDificultad.normal) {
    usados.culpable.add(caso.culpable);
    usados.arma.add(caso.arma);
    usados.habitacion.add(caso.habitacion);
    for (const [id, u] of Object.entries(caso.ubicaciones)) if (!u.con.length) usados.solo.add(id);
  }
  assert.equal(usados.culpable.size, sospechosos.length);
  assert.equal(usados.arma.size, armas.length);
  assert.equal(usados.habitacion.size, habitaciones.length);
  assert.equal(usados.solo.size, sospechosos.length, 'cualquiera puede ser el inocente sin pareja');
});
