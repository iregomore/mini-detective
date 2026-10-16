// Conecta la lógica del juego con la interfaz.
import {
  generarCaso, introduccion, explorar, interrogar, nombreHabitacion,
} from './juego.js';
import { habitaciones, sospechosos, preguntas } from './datos.js';

const $ = (selector) => document.querySelector(selector);

const estado = { caso: null, exploradas: new Set(), sospechoso: null };

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
  document.querySelectorAll('.pestana').forEach((b) => {
    b.classList.toggle('activa', b.dataset.pantalla === nombre);
  });
  $('#navegacion').hidden = nombre === 'inicio';
  window.scrollTo(0, 0);
}

function crearBoton(texto, alPulsar) {
  const boton = document.createElement('button');
  boton.className = 'boton';
  boton.textContent = texto;
  boton.addEventListener('click', alPulsar);
  return boton;
}

function titular(texto) {
  const fuerte = document.createElement('strong');
  fuerte.textContent = `${texto}: `;
  return fuerte;
}

const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

function pintarHabitaciones(elegida) {
  const lista = $('#lista-habitaciones');
  lista.replaceChildren(...habitaciones.map((h) => {
    const boton = crearBoton(mayuscula(h.nombre), () => registrar(h.id));
    boton.classList.toggle('elegido', h.id === elegida);
    if (estado.exploradas.has(h.id)) {
      const marca = document.createElement('span');
      marca.className = 'marca';
      marca.textContent = 'registrada';
      boton.append(marca);
    }
    return boton;
  }));
}

function registrar(habitacion) {
  estado.exploradas.add(habitacion);
  const hallazgo = $('#hallazgo');
  hallazgo.replaceChildren(titular(mayuscula(nombreHabitacion(habitacion))), explorar(estado.caso, habitacion));
  hallazgo.hidden = false;
  pintarHabitaciones(habitacion);
}

const presentar = (s) => `${s.nombre}, ${s.rol}`;

function pintarSospechosos() {
  $('#lista-sospechosos').replaceChildren(...sospechosos.map((s) => {
    const boton = crearBoton(presentar(s), () => elegirSospechoso(s.id));
    boton.classList.toggle('elegido', s.id === estado.sospechoso);
    return boton;
  }));
}

function elegirSospechoso(id) {
  estado.sospechoso = id;
  const elegido = sospechosos.find((s) => s.id === id);
  $('#titulo-preguntas').textContent = `Preguntas para ${presentar(elegido)}`;
  $('#respuesta').hidden = true;
  $('#bloque-preguntas').hidden = false;
  pintarSospechosos();
  pintarPreguntas();
  $('#bloque-preguntas').scrollIntoView({ behavior: 'smooth' });
}

function pintarPreguntas(elegida) {
  $('#lista-preguntas').replaceChildren(...preguntas.map((p) => {
    const boton = crearBoton(p.texto, () => preguntar(p.id));
    boton.classList.toggle('elegido', p.id === elegida);
    return boton;
  }));
}

function preguntar(pregunta) {
  const nombre = sospechosos.find((s) => s.id === estado.sospechoso).nombre;
  const respuesta = $('#respuesta');
  respuesta.replaceChildren(titular(nombre), `«${interrogar(estado.caso, estado.sospechoso, pregunta)}»`);
  respuesta.hidden = false;
  pintarPreguntas(pregunta);
}

function nuevaPartida(semilla) {
  estado.caso = generarCaso(semilla);
  estado.exploradas = new Set();
  $('#hallazgo').hidden = true;
  pintarHabitaciones();
  estado.sospechoso = null;
  $('#bloque-preguntas').hidden = true;
  pintarSospechosos();
  $('#introduccion').textContent = introduccion(estado.caso);
  mostrarPantalla('inicio');
}

document.querySelectorAll('.pestana').forEach((b) => {
  b.addEventListener('click', () => mostrarPantalla(b.dataset.pantalla));
});

$('#boton-empezar').addEventListener('click', () => mostrarPantalla('mansion'));

nuevaPartida(semillaInicial());
