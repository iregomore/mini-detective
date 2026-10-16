// Lógica pura del juego. Sin acceso al DOM.
import {
  victimas, sospechosos, armas, habitaciones, lugaresHallazgo, motivos, textosPista, textosRespuesta, textosResultado, textosIntro,
} from './datos.js';

// Generador pseudoaleatorio determinista (mulberry32).
export function crearAleatorio(semilla) {
  let estado = semilla >>> 0;
  return function aleatorio() {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function elegir(lista, aleatorio) {
  return lista[Math.floor(aleatorio() * lista.length)];
}

export function barajar(lista, aleatorio) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export const nombreArma = (id) => armas.find((a) => a.id === id).nombre;
export const nombreHabitacion = (id) => habitaciones.find((h) => h.id === id).nombre;
export const sospechoso = (id) => sospechosos.find((s) => s.id === id);

export const dificultades = ['facil', 'normal', 'dificil'];

export function generarCaso(semilla, dificultad = 'normal') {
  if (!dificultades.includes(dificultad)) throw new Error(`Dificultad desconocida: ${dificultad}`);
  const aleatorio = crearAleatorio(semilla);
  const caso = {
    semilla,
    dificultad,
    victima: elegir(victimas, aleatorio),
    hallazgo: elegir(lugaresHallazgo, aleatorio),
    culpable: elegir(sospechosos, aleatorio).id,
    arma: elegir(armas, aleatorio).id,
    habitacion: elegir(habitaciones, aleatorio).id,
    motivo: elegir(motivos, aleatorio),
  };
  const escena = planificarEscena(caso, aleatorio);
  if (dificultad === 'facil') prepararFacil(escena);
  const { hechosPistas, hechosTestigos } = repartirHechos(escena, dificultad, aleatorio);
  caso.ubicaciones = escena.ubicaciones;
  caso.pistas = colocarPistas(hechosPistas, aleatorio);
  caso.respuestas = generarRespuestas(caso, escena, hechosTestigos, aleatorio);
  return caso;
}

// Textos propios de las dificultades fácil y difícil (datos.js queda fuera de esta zona de trabajo).
export const textosDificultad = {
  nadieAqui: () => 'La alfombra está recién cepillada y no tiene ni una huella: aquí no ha entrado nadie en toda la noche.',
  nadieOtro: (habitacion) => `Encuentras una nota de la doncella: «Cerré ${habitacion} con llave al anochecer y nadie ha entrado desde entonces».`,
  cuantosAqui: (numero) => `Hay ${numero} copas usadas y ${numero} sillas apartadas de la mesa: aquí estuvieron exactamente ${numero} personas, ni una más.`,
  cuantosOtro: (habitacion, numero) => `Encuentras una nota de la doncella: «Llevé ${numero} copas a ${habitacion}, una por persona, y en toda la noche no entró nadie más».`,
};

// Los cuatro inocentes estaban por parejas en dos habitaciones que no son la del crimen.
// Las demás armas y habitaciones se descartan con hechos repartidos entre pistas y testigos.
function planificarEscena(caso, aleatorio) {
  const otrasHabitaciones = barajar(
    habitaciones.map((h) => h.id).filter((id) => id !== caso.habitacion),
    aleatorio,
  );
  const inocentes = barajar(
    sospechosos.map((s) => s.id).filter((id) => id !== caso.culpable),
    aleatorio,
  );
  const ubicaciones = {};
  for (let i = 0; i < inocentes.length; i += 2) {
    const [uno, otro] = [inocentes[i], inocentes[i + 1]];
    const habitacion = otrasHabitaciones[i / 2];
    ubicaciones[uno] = { habitacion, con: [otro] };
    ubicaciones[otro] = { habitacion, con: [uno] };
  }
  const libres = otrasHabitaciones.slice(inocentes.length / 2);
  const eliminaciones = [
    ...armas.filter((a) => a.id !== caso.arma).map((a) => ({ tipo: 'noArma', arma: a.id })),
    ...libres.map((id) => ({ tipo: 'noLugar', habitacion: id })),
  ];
  return { ubicaciones, libres, eliminaciones, forzadas: [] };
}

// Fácil: en una habitación libre no entró nadie (lo dice una pista), y el culpable
// dirá que estuvo allí. Ese hecho sustituye al descarte de esa habitación.
function prepararFacil(escena) {
  const [vacia] = escena.libres;
  escena.forzadas = [{ tipo: 'cuantos', habitacion: vacia, numero: 0 }];
  escena.eliminaciones = escena.eliminaciones.filter((h) => h.habitacion !== vacia);
  escena.mentira = { habitacion: vacia, con: [] };
}

// Cuántos hechos van a las habitaciones; el resto, a lo que vieron los inocentes.
const pistasPorDificultad = {
  facil: () => 5,
  normal: (aleatorio) => 3 + Math.floor(aleatorio() * 2),
  dificil: () => 2,
};

function repartirHechos(escena, dificultad, aleatorio) {
  const hechos = barajar(escena.eliminaciones, aleatorio);
  const enPistas = pistasPorDificultad[dificultad](aleatorio) - escena.forzadas.length;
  return {
    hechosPistas: [...escena.forzadas, ...hechos.slice(0, enPistas)],
    hechosTestigos: hechos.slice(enPistas),
  };
}

function colocarPistas(hechos, aleatorio) {
  const lugares = barajar(habitaciones.map((h) => h.id), aleatorio);
  const pistas = Object.fromEntries(lugares.map((id) => [id, null]));
  hechos.forEach((hecho, i) => {
    pistas[lugares[i]] = { hecho, texto: textoPista(hecho, lugares[i]) };
  });
  return pistas;
}

function textoPista(hecho, dondeEsta) {
  if (hecho.tipo === 'noArma') return textosPista.noArma(nombreArma(hecho.arma));
  const aqui = hecho.habitacion === dondeEsta;
  const lugar = nombreHabitacion(hecho.habitacion);
  if (hecho.tipo === 'cuantos' && hecho.numero === 0) {
    return aqui ? textosDificultad.nadieAqui() : textosDificultad.nadieOtro(lugar);
  }
  if (hecho.tipo === 'cuantos') {
    return aqui ? textosDificultad.cuantosAqui(hecho.numero) : textosDificultad.cuantosOtro(lugar, hecho.numero);
  }
  return aqui ? textosPista.noLugarAqui() : textosPista.noLugarOtro(lugar);
}

const nombreSospechoso = (id) => sospechoso(id).nombre;

// Los hechos de los testigos se reparten en orden: si hay más hechos que inocentes,
// alguno cuenta dos cosas.
function generarRespuestas(caso, escena, hechosTestigos, aleatorio) {
  const inocentes = Object.keys(caso.ubicaciones);
  const testigos = barajar(inocentes, aleatorio);
  const vistos = testigos.map(() => []);
  hechosTestigos.forEach((hecho, i) => vistos[i % testigos.length].push(hecho));
  const respuestas = {};
  inocentes.forEach((id) => {
    respuestas[id] = respuestasInocente(caso, id, vistos[testigos.indexOf(id)], aleatorio);
  });
  const mentira = escena.mentira
    ? { ...escena.mentira, finge: false, acusado: elegir(inocentes, aleatorio) }
    : mentiraNormal(caso, aleatorio);
  respuestas[caso.culpable] = respuestasCulpable(caso, mentira);
  return respuestas;
}

function respuestasInocente(caso, id, vistos, aleatorio) {
  const { habitacion, con } = caso.ubicaciones[id];
  const sospechado = elegir(sospechosos.filter((s) => s.id !== id), aleatorio).id;
  return {
    donde: {
      texto: textosRespuesta.dondeConPareja(nombreHabitacion(habitacion), nombreSospechoso(con[0])),
      hechos: [{ tipo: 'estaba', persona: id, habitacion, con }],
    },
    relacion: { texto: sospechoso(id).relacion, hechos: [] },
    extrano: vistos.length
      ? { texto: unirTextos(vistos.map(textoVisto)), hechos: vistos }
      : { texto: textosRespuesta.nadaRaro, hechos: [] },
    quien: { texto: textosRespuesta.opinionInocente(nombreSospechoso(sospechado)), hechos: [] },
  };
}

function textoVisto(hecho) {
  if (hecho.tipo === 'noArma') return textosRespuesta.vioArma(nombreArma(hecho.arma));
  return textosRespuesta.vioLugar(nombreHabitacion(hecho.habitacion));
}

// Une varias frases de un testigo: «… Y otra cosa: …».
function unirTextos(textos) {
  return textos.map((texto, i) => {
    if (i === 0) return texto;
    const sinSi = texto.replace(/^Sí: /, '');
    return `Y otra cosa: ${sinSi.charAt(0).toLowerCase()}${sinSi.slice(1)}`;
  }).join(' ');
}

// Normal: el culpable miente sobre dónde estaba de forma que contradice a algún inocente,
// y a veces también finge que el arma del crimen no se usó.
function mentiraNormal(caso, aleatorio) {
  const inocente = elegir(Object.keys(caso.ubicaciones), aleatorio);
  const { habitacion } = caso.ubicaciones[inocente];
  const finge = aleatorio() < 0.5;
  const acompanado = aleatorio() < 0.5;
  return { habitacion, con: acompanado ? [inocente] : [], finge, acusado: inocente };
}

function respuestasCulpable(caso, { habitacion, con, solos, finge, acusado }) {
  const id = caso.culpable;
  const lugar = nombreHabitacion(habitacion);
  const coartada = { tipo: 'estaba', persona: id, habitacion, con };
  if (solos === false) coartada.solos = false;
  return {
    donde: {
      texto: con.length
        ? textosRespuesta.dondeConOtro(lugar, nombreSospechoso(con[0]))
        : textosRespuesta.dondeSinCompania(lugar),
      hechos: [coartada],
      miente: true,
    },
    relacion: { texto: sospechoso(id).relacion, hechos: [] },
    extrano: finge
      ? {
        texto: textosRespuesta.vioArma(nombreArma(caso.arma)),
        hechos: [{ tipo: 'noArma', arma: caso.arma }],
        miente: true,
      }
      : { texto: textosRespuesta.nadaRaro, hechos: [] },
    quien: { texto: textosRespuesta.opinionCulpable(nombreSospechoso(acusado)), hechos: [] },
  };
}

// Toda la información que el jugador puede reunir: pistas y respuestas, con su fuente.
export function informacionDelCaso(caso) {
  const informacion = [];
  for (const pista of Object.values(caso.pistas)) {
    if (pista) informacion.push({ fuente: 'pista', hecho: pista.hecho });
  }
  for (const [id, respuestas] of Object.entries(caso.respuestas)) {
    for (const respuesta of Object.values(respuestas)) {
      for (const hecho of respuesta.hechos) informacion.push({ fuente: id, hecho });
    }
  }
  return informacion;
}

// Devuelve las combinaciones (culpable, arma, habitación) compatibles con la información.
// Hipótesis: las pistas y los inocentes dicen la verdad; el culpable puede mentir.
export function solucionar(informacion) {
  const compatibles = [];
  for (const s of sospechosos) {
    const hechos = informacion.filter((i) => i.fuente !== s.id).map((i) => i.hecho);
    for (const a of armas) {
      for (const h of habitaciones) {
        if (esCompatible(hechos, s.id, a.id, h.id)) {
          compatibles.push({ culpable: s.id, arma: a.id, habitacion: h.id });
        }
      }
    }
  }
  return compatibles;
}

function esCompatible(hechos, culpable, arma, habitacion) {
  const ubicacion = {};
  const grupos = {};
  const cupos = {};
  const situar = (persona, lugar) => {
    if (ubicacion[persona] && ubicacion[persona] !== lugar) return false;
    ubicacion[persona] = lugar;
    return true;
  };
  for (const hecho of hechos) {
    if (hecho.tipo === 'noArma' && hecho.arma === arma) return false;
    if (hecho.tipo === 'noLugar' && hecho.habitacion === habitacion) return false;
    // El culpable estaba solo en la habitación del crimen: allí hubo exactamente una persona.
    if (hecho.tipo === 'cuantos') {
      if (hecho.habitacion === habitacion && hecho.numero !== 1) return false;
      cupos[hecho.habitacion] = Math.min(cupos[hecho.habitacion] ?? Infinity, hecho.numero);
    }
    if (hecho.tipo === 'estaba') {
      // Por defecto quien declara dice que solo estaban ellos; con `solos: false`, no lo asegura.
      if (hecho.solos !== false) {
        const grupo = [hecho.persona, ...hecho.con].sort().join(',');
        if (grupos[hecho.habitacion] && grupos[hecho.habitacion] !== grupo) return false;
        grupos[hecho.habitacion] = grupo;
      }
      if (![hecho.persona, ...hecho.con].every((p) => situar(p, hecho.habitacion))) return false;
    }
  }
  for (const [persona, lugar] of Object.entries(ubicacion)) {
    if ((persona === culpable) !== (lugar === habitacion)) return false;
    if (grupos[lugar] && !grupos[lugar].split(',').includes(persona)) return false;
  }
  for (const [lugar, cupo] of Object.entries(cupos)) {
    const presentes = Object.values(ubicacion).filter((l) => l === lugar).length;
    if (presentes > cupo) return false;
  }
  return true;
}

export function comprobarAcusacion(caso, acusacion) {
  const aciertos = {
    culpable: acusacion.culpable === caso.culpable,
    arma: acusacion.arma === caso.arma,
    habitacion: acusacion.habitacion === caso.habitacion,
  };
  return {
    gana: aciertos.culpable && aciertos.arma && aciertos.habitacion,
    aciertos,
    relato: relatoDelCrimen(caso),
  };
}

export function relatoDelCrimen(caso) {
  const culpable = sospechoso(caso.culpable);
  return textosResultado.relato({
    culpable: culpable.nombre,
    rol: culpable.rol,
    victima: caso.victima.nombre,
    arma: nombreArma(caso.arma),
    habitacion: nombreHabitacion(caso.habitacion),
    motivo: caso.motivo,
    hallazgo: caso.hallazgo,
    mentira: caso.respuestas[caso.culpable].donde.texto,
  });
}

export function introduccion(caso) {
  return textosIntro.introduccion({
    victima: caso.victima.nombre,
    muerto: caso.victima.muerto,
    descripcion: caso.victima.descripcion,
    hallazgo: caso.hallazgo,
  });
}

// Lo que el jugador encuentra al explorar una habitación.
export function explorar(caso, habitacion) {
  const pista = caso.pistas[habitacion];
  return pista ? pista.texto : textosPista.nada;
}

export function interrogar(caso, sospechosoId, preguntaId) {
  return caso.respuestas[sospechosoId][preguntaId].texto;
}

// Cuaderno del jugador: lo que ha descubierto, en el orden en que lo descubrió y sin repetir.
export function crearCuaderno() {
  return { pistas: [], respuestas: [] };
}

export function anotarPista(cuaderno, habitacion, texto) {
  if (cuaderno.pistas.some((p) => p.habitacion === habitacion)) return cuaderno;
  return { ...cuaderno, pistas: [...cuaderno.pistas, { habitacion, texto }] };
}

export function anotarRespuesta(cuaderno, sospechosoId, preguntaId, texto) {
  const repetida = cuaderno.respuestas
    .some((r) => r.sospechoso === sospechosoId && r.pregunta === preguntaId);
  if (repetida) return cuaderno;
  const respuesta = { sospechoso: sospechosoId, pregunta: preguntaId, texto };
  return { ...cuaderno, respuestas: [...cuaderno.respuestas, respuesta] };
}
