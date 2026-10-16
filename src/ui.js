// Conecta la lógica del juego con la interfaz.
import {
  generarCaso, introduccion, explorar, interrogar, nombreHabitacion,
  crearCuaderno, anotarPista, anotarRespuesta, comprobarAcusacion,
  sospechoso, nombreArma,
} from './juego.js';
import {
  habitaciones, sospechosos, armas, preguntas, textosResultado,
} from './datos.js';
import { resumirPartida, guardarPartida } from './guardado.js';

const $ = (selector) => document.querySelector(selector);

const estado = {
  semilla: null, caso: null, sospechoso: null, cuaderno: crearCuaderno(), acusacion: {},
};

function semillaInicial() {
  const deUrl = Number(new URLSearchParams(location.search).get('semilla'));
  return Number.isInteger(deUrl) && deUrl > 0 ? deUrl : semillaAleatoria();
}

function semillaAleatoria() {
  return Math.floor(Math.random() * 2 ** 31) + 1;
}

// Se llama después de cada acción del jugador. Si no se puede guardar, el juego sigue igual.
function guardar() {
  guardarPartida(resumirPartida(estado.semilla, estado.cuaderno, estado.acusacion));
}

function mostrarPantalla(nombre) {
  document.querySelectorAll('.pantalla').forEach((p) => {
    p.hidden = p.id !== `pantalla-${nombre}`;
  });
  if (nombre === 'cuaderno') pintarCuaderno();
  document.querySelectorAll('.pestana').forEach((b) => {
    b.classList.toggle('activa', b.dataset.pantalla === nombre);
  });
  $('#navegacion').hidden = nombre === 'inicio' || nombre === 'resultado';
  window.scrollTo(0, 0);
}

function crearBoton(texto, alPulsar) {
  const boton = document.createElement('button');
  boton.className = 'boton';
  boton.textContent = texto;
  boton.addEventListener('click', alPulsar);
  return boton;
}

function titular(texto, separador = ': ') {
  const fuerte = document.createElement('strong');
  fuerte.textContent = `${texto}${separador}`;
  return fuerte;
}

const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

function pintarHabitaciones(elegida) {
  const lista = $('#lista-habitaciones');
  lista.replaceChildren(...habitaciones.map((h) => {
    const boton = crearBoton(mayuscula(h.nombre), () => registrar(h.id));
    boton.classList.toggle('elegido', h.id === elegida);
    if (estado.cuaderno.pistas.some((p) => p.habitacion === h.id)) {
      const marca = document.createElement('span');
      marca.className = 'marca';
      marca.textContent = 'registrada';
      boton.append(marca);
    }
    return boton;
  }));
}

function registrar(habitacion) {
  const texto = explorar(estado.caso, habitacion);
  estado.cuaderno = anotarPista(estado.cuaderno, habitacion, texto);
  const hallazgo = $('#hallazgo');
  hallazgo.replaceChildren(titular(mayuscula(nombreHabitacion(habitacion))), texto);
  hallazgo.hidden = false;
  pintarHabitaciones(habitacion);
  guardar();
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
    const hecha = estado.cuaderno.respuestas
      .some((r) => r.sospechoso === estado.sospechoso && r.pregunta === p.id);
    if (hecha) boton.classList.add('hecha');
    return boton;
  }));
}

function preguntar(pregunta) {
  const nombre = sospechosos.find((s) => s.id === estado.sospechoso).nombre;
  const texto = interrogar(estado.caso, estado.sospechoso, pregunta);
  estado.cuaderno = anotarRespuesta(estado.cuaderno, estado.sospechoso, pregunta, texto);
  const respuesta = $('#respuesta');
  respuesta.replaceChildren(titular(nombre), `«${texto}»`);
  respuesta.hidden = false;
  pintarPreguntas(pregunta);
  guardar();
}

function entrada(titulo, texto, separador) {
  const parrafo = document.createElement('p');
  parrafo.className = 'nota';
  parrafo.append(titular(titulo, separador), texto);
  return parrafo;
}

function vacio(texto) {
  const parrafo = document.createElement('p');
  parrafo.className = 'ayuda';
  parrafo.textContent = texto;
  return parrafo;
}

function pintarCuaderno() {
  const { pistas, respuestas } = estado.cuaderno;
  $('#cuaderno-pistas').replaceChildren(...(pistas.length
    ? pistas.map((p) => entrada(mayuscula(nombreHabitacion(p.habitacion)), p.texto))
    : [vacio('Todavía no has registrado ninguna habitación.')]));
  const porSospechoso = sospechosos
    .map((s) => ({ s, suyas: respuestas.filter((r) => r.sospechoso === s.id) }))
    .filter(({ suyas }) => suyas.length);
  $('#cuaderno-respuestas').replaceChildren(...(porSospechoso.length
    ? porSospechoso.map(({ s, suyas }) => {
      const bloque = document.createElement('div');
      bloque.className = 'texto-caso';
      const cabecera = document.createElement('h4');
      cabecera.textContent = presentar(s);
      bloque.append(cabecera, ...suyas.map((r) => entrada(
        preguntas.find((p) => p.id === r.pregunta).texto,
        `«${r.texto}»`,
        ' ',
      )));
      return bloque;
    })
    : [vacio('Todavía no has interrogado a nadie.')]));
}

const opcionesAcusacion = {
  culpable: () => sospechosos.map((s) => ({ id: s.id, texto: presentar(s) })),
  arma: () => armas.map((a) => ({ id: a.id, texto: mayuscula(a.nombre) })),
  habitacion: () => habitaciones.map((h) => ({ id: h.id, texto: mayuscula(h.nombre) })),
};

function pintarAcusacion() {
  for (const [parte, opciones] of Object.entries(opcionesAcusacion)) {
    $(`#opciones-${parte}`).replaceChildren(...opciones().map(({ id, texto }) => {
      const boton = crearBoton(texto, () => {
        estado.acusacion = { ...estado.acusacion, [parte]: id };
        pintarAcusacion();
        guardar();
      });
      boton.classList.toggle('elegido', estado.acusacion[parte] === id);
      boton.setAttribute('aria-pressed', String(estado.acusacion[parte] === id));
      return boton;
    }));
  }
  $('#boton-acusar').disabled = Object.keys(opcionesAcusacion)
    .some((parte) => !estado.acusacion[parte]);
}

function acusar() {
  const { gana, aciertos, relato } = comprobarAcusacion(estado.caso, estado.acusacion);
  const nombres = {
    culpable: ['Culpable', sospechoso(estado.acusacion.culpable).nombre],
    arma: ['Arma', nombreArma(estado.acusacion.arma)],
    habitacion: ['Lugar', nombreHabitacion(estado.acusacion.habitacion)],
  };
  $('#titulo-resultado').textContent = gana ? textosResultado.gana : textosResultado.pierde;
  $('#titulo-resultado').className = gana ? 'gana' : 'pierde';
  $('#aciertos').replaceChildren(...Object.entries(nombres).map(([parte, [etiqueta, nombre]]) => {
    const item = document.createElement('li');
    item.className = aciertos[parte] ? 'acierto' : 'fallo';
    item.textContent = (aciertos[parte] ? textosResultado.acierto : textosResultado.fallo)(etiqueta, nombre);
    return item;
  }));
  $('#relato').textContent = relato;
  mostrarPantalla('resultado');
}

function nuevaPartida(semilla) {
  estado.semilla = semilla;
  estado.caso = generarCaso(semilla);
  estado.cuaderno = crearCuaderno();
  $('#hallazgo').hidden = true;
  pintarHabitaciones();
  estado.sospechoso = null;
  $('#bloque-preguntas').hidden = true;
  pintarSospechosos();
  estado.acusacion = {};
  pintarAcusacion();
  $('#introduccion').textContent = introduccion(estado.caso);
  mostrarPantalla('inicio');
}

document.querySelectorAll('.pestana').forEach((b) => {
  b.addEventListener('click', () => mostrarPantalla(b.dataset.pantalla));
});

$('#boton-empezar').addEventListener('click', () => mostrarPantalla('mansion'));
$('#boton-acusar').addEventListener('click', acusar);
$('#boton-nueva').addEventListener('click', () => {
  history.replaceState(null, '', location.pathname);
  nuevaPartida(semillaAleatoria());
});

nuevaPartida(semillaInicial());
