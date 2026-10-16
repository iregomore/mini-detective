// Conecta la lógica del juego con la interfaz.
import { generarCaso, introduccion } from './juego.js';

const $ = (selector) => document.querySelector(selector);

const estado = { caso: null };

function semillaInicial() {
  const deUrl = Number(new URLSearchParams(location.search).get('semilla'));
  return Number.isInteger(deUrl) && deUrl > 0 ? deUrl : semillaAleatoria();
}

function semillaAleatoria() {
  return Math.floor(Math.random() * 2 ** 31) + 1;
}

function mostrarPantalla(nombre) {
  document.querySelectorAll('.pantalla').forEach((p) => {
    p.hidden = p.id !== `pantalla-${nombre}`;
  });
  window.scrollTo(0, 0);
}

function nuevaPartida(semilla) {
  estado.caso = generarCaso(semilla);
  $('#introduccion').textContent = introduccion(estado.caso);
  mostrarPantalla('inicio');
}

$('#boton-empezar').addEventListener('click', () => mostrarPantalla('mansion'));

nuevaPartida(semillaInicial());
