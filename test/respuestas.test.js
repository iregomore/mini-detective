import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCaso } from '../src/juego.js';
import { sospechosos, preguntas } from '../src/datos.js';

test('cada sospechoso responde a las 4 preguntas', () => {
  const caso = generarCaso(11);
  for (const s of sospechosos) {
    for (const p of preguntas) {
      const respuesta = caso.respuestas[s.id][p.id];
      assert.ok(respuesta.texto.length > 0, `${s.id} / ${p.id}`);
      assert.ok(Array.isArray(respuesta.hechos));
    }
  }
});

test('solo el culpable miente, y lo hace al menos una vez', () => {
  for (let s = 0; s < 200; s++) {
    const caso = generarCaso(s);
    for (const [id, respuestas] of Object.entries(caso.respuestas)) {
      const mentiras = Object.values(respuestas).filter((r) => r.miente).length;
      if (id === caso.culpable) assert.ok(mentiras >= 1);
      else assert.equal(mentiras, 0);
    }
  }
});

test('la coartada del culpable choca con la de un inocente', () => {
  for (let s = 0; s < 200; s++) {
    const caso = generarCaso(s);
    const [mentira] = caso.respuestas[caso.culpable].donde.hechos;
    const testigos = Object.entries(caso.ubicaciones)
      .filter(([, u]) => u.habitacion === mentira.habitacion);
    assert.equal(testigos.length, 2, 'hay una pareja de inocentes en esa habitación');
    for (const [, u] of testigos) assert.ok(!u.con.includes(caso.culpable));
  }
});

test('los inocentes aportan los descartes que no están en las habitaciones', () => {
  const caso = generarCaso(3);
  const enPistas = Object.values(caso.pistas).filter(Boolean).length;
  const enTestigos = Object.keys(caso.ubicaciones)
    .filter((id) => caso.respuestas[id].extrano.hechos.length).length;
  assert.equal(enPistas + enTestigos, 6);
});
