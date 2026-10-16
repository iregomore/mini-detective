import { test } from 'node:test';
import assert from 'node:assert/strict';
import { armas, habitaciones } from '../src/datos.js';

for (const [nombre, lista] of [['armas', armas], ['habitaciones', habitaciones]]) {
  test(`hay 7 ${nombre}, cada una con nombre y descripción breve`, () => {
    assert.equal(lista.length, 7);
    assert.equal(new Set(lista.map((x) => x.id)).size, 7);
    for (const x of lista) {
      assert.match(x.nombre, /^(el|la) /, `${x.id}: el nombre lleva artículo`);
      assert.ok(x.descripcion.length > 0 && x.descripcion.length <= 80, `${x.id}: descripción breve`);
    }
  });
}
