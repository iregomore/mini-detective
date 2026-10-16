import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generarCaso, dificultades, solucionar, informacionDelCaso, sospechoso, nombreHabitacion,
} from '../src/juego.js';

test('las dificultades son fácil, normal y difícil', () => {
  assert.deepEqual(dificultades, ['facil', 'normal', 'dificil']);
});

test('sin dificultad, el caso es normal y no cambia', () => {
  assert.equal(generarCaso(7).dificultad, 'normal');
  assert.deepEqual(generarCaso(7), generarCaso(7, 'normal'));
});

test('cada dificultad es determinista con la misma semilla', () => {
  for (const dificultad of dificultades) {
    assert.deepEqual(generarCaso(7, dificultad), generarCaso(7, dificultad));
    assert.equal(generarCaso(7, dificultad).dificultad, dificultad);
  }
});

test('una dificultad desconocida da error', () => {
  assert.throws(() => generarCaso(7, 'imposible'));
});

const pistasCon = (caso) => Object.values(caso.pistas).filter(Boolean);
const casosDe = (dificultad, n = 200) => Array.from({ length: n }, (_, s) => generarCaso(s, dificultad));

test('fácil tiene más pistas que normal', () => {
  for (const caso of casosDe('facil')) {
    assert.equal(pistasCon(caso).length, 6, `semilla ${caso.semilla}`);
  }
  for (const caso of casosDe('normal')) assert.ok(pistasCon(caso).length <= 4);
});

test('fácil: la mentira del culpable contradice directamente una pista', () => {
  for (const caso of casosDe('facil')) {
    const [mentira] = caso.respuestas[caso.culpable].donde.hechos;
    const contradice = pistasCon(caso).some((pista) => solucionar([
      { fuente: 'pista', hecho: pista.hecho },
      { fuente: 'pista', hecho: mentira },
    ]).length === 0);
    assert.ok(contradice, `semilla ${caso.semilla}`);
  }
});

test('fácil: las pistas siguen sin descartar el arma ni el lugar del crimen', () => {
  for (const caso of casosDe('facil')) {
    for (const pista of pistasCon(caso)) {
      assert.notEqual(pista.hecho.arma, caso.arma);
      assert.notEqual(pista.hecho.habitacion, caso.habitacion);
    }
  }
});

const informativas = (caso) => pistasCon(caso).filter((p) => !p.enganosa);

test('difícil tiene menos pistas que normal', () => {
  for (const caso of casosDe('dificil')) {
    assert.equal(informativas(caso).length, 2, `semilla ${caso.semilla}`);
  }
  for (const caso of casosDe('normal')) assert.ok(informativas(caso).length >= 3);
});

test('difícil: una pista engañosa señala a un inocente que lo explica', () => {
  for (const caso of casosDe('dificil')) {
    const enganosas = pistasCon(caso).filter((p) => p.enganosa);
    assert.equal(enganosas.length, 1, `semilla ${caso.semilla}`);
    const [{ hecho, texto }] = enganosas;
    assert.notEqual(hecho.persona, caso.culpable);
    assert.ok(texto.includes(sospechoso(hecho.persona).nombre));
    // Apunta lejos de su coartada…
    assert.notEqual(hecho.habitacion, caso.ubicaciones[hecho.persona].habitacion);
    // …y el propio inocente explica por qué está allí su objeto.
    const explicacion = caso.respuestas[hecho.persona].extrano.texto;
    assert.ok(explicacion.includes(nombreHabitacion(hecho.habitacion)), `semilla ${caso.semilla}`);
    // No aporta hechos: quitarla no cambia la solución.
    const sinEngano = informacionDelCaso(caso).filter((i) => i.hecho !== hecho);
    assert.deepEqual(solucionar(sinEngano), solucionar(informacionDelCaso(caso)));
  }
});

test('difícil: la mentira del culpable solo se detecta cruzando dos fuentes', () => {
  for (const caso of casosDe('dificil')) {
    const [mentira] = caso.respuestas[caso.culpable].donde.hechos;
    const comoVerdad = (hecho) => ({ fuente: 'pista', hecho });
    const otros = informacionDelCaso(caso).filter((i) => i.fuente !== caso.culpable).map((i) => i.hecho);
    // Ningún dato suelto la contradice…
    for (const hecho of otros) {
      assert.ok(solucionar([comoVerdad(mentira), comoVerdad(hecho)]).length > 0, `semilla ${caso.semilla}`);
    }
    // …pero hay dos que juntos sí.
    const cruce = otros.some((a, i) => otros.slice(i + 1)
      .some((b) => solucionar([mentira, a, b].map(comoVerdad)).length === 0));
    assert.ok(cruce, `semilla ${caso.semilla}`);
  }
});
