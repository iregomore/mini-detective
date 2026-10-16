// Datos del juego: personajes, armas, habitaciones y textos.

const numeros = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
export const enLetras = (n) => numeros[n] ?? String(n);
const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

export const victimas = [
  { nombre: 'Lord Alistair Pemberton', muerto: 'muerto', descripcion: 'el anciano dueño de la mansión' },
  { nombre: 'Doña Remedios Villalba', muerto: 'muerta', descripcion: 'la rica viuda que daba la fiesta' },
  { nombre: 'Ezequiel Mora', muerto: 'muerto', descripcion: 'un famoso coleccionista de arte' },
  { nombre: 'Inés de Altamira', muerto: 'muerta', descripcion: 'la condesa, heredera de la fortuna familiar' },
  { nombre: 'Don Fermín Castro', muerto: 'muerto', descripcion: 'el banquero más temido de la ciudad' },
];

// Sospechosos. Cada uno tiene su forma de hablar: `voz` reúne, para cada tipo de respuesta,
// una o varias frases. Lo que dicen siempre contiene los datos que el jugador necesita
// (habitación, persona o arma), aunque cambien las palabras.
//   relacion: texto. conPareja(habitacion, pareja), conOtro(habitacion, otro), solo(habitacion),
//   vioArma(arma), vioLugar(habitacion), nadaRaro: texto, opinion(otro) y acusa(otro).
export const sospechosos = [
  {
    id: 'mayordomo',
    nombre: 'Benito',
    rol: 'el mayordomo',
    profesion: 'mayordomo de la casa desde hace veinte años',
    rasgo: 'discreto y orgulloso de su oficio',
    habla: 'ceremonioso, trata a todo el mundo de usted',
    voz: {
      relacion: ['Tuve el honor de servir en esta casa durante veinte años. Tenía un carácter exigente, pero justo, si me permite decirlo.'],
      conPareja: [(h, p) => `Con su permiso: me encontraba en ${h} con ${p}. Solo estábamos los dos, se lo aseguro.`],
      conOtro: [(h, o) => `Me encontraba en ${h} con ${o}, que podrá confirmárselo sin duda.`],
      solo: [(h) => `Me encontraba en ${h}, sin compañía. Un mayordomo necesita silencio para repasar la plata.`],
      vioArma: [(a) => `Si me permite: vi ${a} en su sitio toda la noche. Nadie se acercó, respondo de ello.`],
      vioLugar: [(h) => `Pasé por ${h} a esa hora y no había nadie. Allí no ocurrió nada, puede creerme.`],
      nadaRaro: ['Lamento no serle de más ayuda: no observé nada fuera de lo corriente.'],
      opinion: [(o) => `No me corresponde juzgar… aunque ${o} se comportaba de un modo muy poco habitual esta noche.`],
      acusa: [(o) => `Con todo respeto, yo vigilaría a ${o}. Nunca me ha inspirado confianza.`],
    },
  },
  {
    id: 'sobrina',
    nombre: 'Clara',
    rol: 'la sobrina',
    profesion: 'estudiante de Derecho',
    rasgo: 'impulsiva y algo mimada',
    habla: 'juvenil y atropellada, con muchas muletillas',
    voz: {
      relacion: ['Soy su única sobrina, o sea, me pagaba la carrera. Me agobiaba un poco con las notas, pero bueno.'],
      conPareja: [(h, p) => `Estaba en ${h} con ${p}, en plan, toda la noche. Solo estábamos los dos, ¿vale?`],
      conOtro: [(h, o) => `Estaba en ${h} con ${o}, pregúntale, de verdad, te lo va a decir.`],
      solo: [(h) => `Estaba en ${h}, sola. Necesitaba estar a mi bola un rato, ¿vale?`],
      vioArma: [(a) => `O sea, vi ${a} en su sitio toda la noche. Nadie le puso un dedo encima, te lo juro.`],
      vioLugar: [(h) => `Pasé por ${h} a esa hora y no había nadie, en serio. Allí no pasó nada.`],
      nadaRaro: ['Pues… no, nada raro. Estaba con el móvil, la verdad.'],
      opinion: [(o) => `Ni idea… pero ${o} hacía cosas superraras esta noche, en plan, rarísimas.`],
      acusa: [(o) => `Yo diría que ${o}. Es que da mal rollo, te lo digo ya.`],
    },
  },
  {
    id: 'socio',
    nombre: 'Rodrigo',
    rol: 'el socio',
    profesion: 'socio en el negocio familiar',
    rasgo: 'ambicioso y arrogante',
    habla: 'seco y directo, con jerga de negocios',
    voz: {
      relacion: ['Socios. Llevábamos juntos el negocio desde hace años. Números, contratos, nada personal.'],
      conPareja: [(h, p) => `Le seré franco: estaba en ${h} con ${p}. Solo estábamos los dos. Siguiente pregunta.`],
      conOtro: [(h, o) => `Estaba en ${h} con ${o}. Puede confirmarlo. No me haga perder el tiempo.`],
      solo: [(h) => `Estaba en ${h}, sin compañía, revisando contratos. Mi tiempo vale dinero.`],
      vioArma: [(a) => `Sí: vi ${a} en su sitio durante toda la noche. Nadie se acercó. Dato objetivo.`],
      vioLugar: [(h) => `Pasé por ${h} a esa hora y no había nadie. Allí no ocurrió nada, se lo garantizo.`],
      nadaRaro: ['No. Nada fuera de lo normal. ¿Algo más?'],
      opinion: [(o) => `No tengo pruebas, pero a ${o} le temblaban las manos esta noche. Y los nervios delatan.`],
      acusa: [(o) => `${o}. Sin dudarlo. Siempre ha tenido algo que esconder.`],
    },
  },
  {
    id: 'medica',
    nombre: 'Lucía',
    rol: 'la médica',
    profesion: 'médica de cabecera de la familia',
    rasgo: 'metódica y fría',
    habla: 'precisa y clínica, da horas exactas',
    voz: {
      relacion: ['Era mi paciente. Pasaba consulta en la casa cada semana: tensión alta, nada más.'],
      conPareja: [(h, p) => `Entre las diez y las once estuve en ${h} con ${p}. Solo estábamos los dos. Es un dato exacto.`],
      conOtro: [(h, o) => `Estuve en ${h} con ${o}, de diez a once. Puede confirmarlo.`],
      solo: [(h) => `Estuve en ${h}, sola, de diez a once. Repasaba historiales clínicos.`],
      vioArma: [(a) => `Observé ${a} en su sitio durante toda la noche. Nadie se aproximó en ningún momento.`],
      vioLugar: [(h) => `Pasé por ${h} a las diez y media y no había nadie. Allí no ocurrió nada.`],
      nadaRaro: ['Nada reseñable. Y suelo fijarme en los detalles.'],
      opinion: [(o) => `No haré un diagnóstico sin pruebas, pero ${o} mostraba signos claros de ansiedad esta noche.`],
      acusa: [(o) => `Si he de apostar, ${o}. Su comportamiento no es el de una persona sana.`],
    },
  },
  {
    id: 'jardinero',
    nombre: 'Tomás',
    rol: 'el jardinero',
    profesion: 'jardinero de la finca',
    rasgo: 'callado y desconfiado',
    habla: 'escueto, de pocas palabras y algún refrán',
    voz: {
      relacion: ['Le cuido los jardines. Apenas hablábamos. Cada uno a lo suyo.'],
      conPareja: [(h, p) => `En ${h}. Con ${p}. Solo estábamos los dos.`],
      conOtro: [(h, o) => `En ${h}, con ${o}. Que lo diga.`],
      solo: [(h) => `En ${h}. Sin compañía. Mejor solo que mal acompañado.`],
      vioArma: [(a) => `${mayuscula(a)}, en su sitio. Toda la noche. Nadie se acercó.`],
      vioLugar: [(h) => `Pasé por ${h}. No había nadie. Allí no pasó nada.`],
      nadaRaro: ['No. Nada.'],
      opinion: [(o) => `No sé. Pero ${o} hacía cosas raras esta noche. Muy raras.`],
      acusa: [(o) => `${o}. Cría cuervos…`],
    },
  },
  {
    id: 'cocinera',
    nombre: 'Amparo',
    rol: 'la cocinera',
    profesion: 'cocinera de la mansión',
    rasgo: 'cotilla y de buen corazón',
    habla: 'castiza y exclamativa, llama «hijo» o «hija» a cualquiera',
    voz: {
      relacion: ['¡Ay, treinta años dándole de comer! Tenía mal genio, pero mis croquetas no las perdonaba.'],
      conPareja: [(h, p) => `¡Pues en ${h}, con ${p}! Solo estábamos los dos, hijo, nadie más.`],
      conOtro: [(h, o) => `En ${h}, con ${o}. ¡Pregúntale, pregúntale, que te lo dice!`],
      solo: [(h) => `En ${h}, sola, hijo, que una también necesita un rato de paz.`],
      vioArma: [(a) => `¡Uy, sí! Vi ${a} en su sitio toda la noche. Nadie se acercó, que yo lo veo todo.`],
      vioLugar: [(h) => `Pasé por ${h} a esa hora y allí no había ni un alma. No pasó nada, te lo digo yo.`],
      nadaRaro: ['¡Ay, no, hijo! Y mira que yo me entero de todo.'],
      opinion: [(o) => `Yo no digo nada… pero ${o} andaba con unas prisas esta noche… ¿eh? Muy raras.`],
      acusa: [(o) => `¡${o}, seguro! Siempre andaba metiendo la nariz donde no debía.`],
    },
  },
  {
    id: 'chofer',
    nombre: 'Julián',
    rol: 'el chófer',
    profesion: 'chófer de la familia',
    rasgo: 'nervioso y leal',
    habla: 'titubeante, se le traban las palabras',
    voz: {
      relacion: ['Y-yo conducía para la familia a todas partes. Era… era buena persona. Casi siempre.'],
      conPareja: [(h, p) => `E-estaba en ${h} con ${p}. Solo… solo estábamos los dos, de verdad.`],
      conOtro: [(h, o) => `Estaba en ${h} con… con ${o}. Puede confirmarlo, s-seguro.`],
      solo: [(h) => `Estaba en ${h}, sin compañía. Yo… yo estaba esperando por si hacía falta el coche.`],
      vioArma: [(a) => `V-vi ${a} en su sitio toda la noche. Nadie… nadie se acercó.`],
      vioLugar: [(h) => `Pasé por ${h} a esa hora y… no había nadie. Allí no pasó nada, creo… no, seguro.`],
      nadaRaro: ['N-no… nada raro. Bueno, nada que yo viera.'],
      opinion: [(o) => `No… no quiero acusar a nadie, pero ${o} hacía cosas muy raras esta noche.`],
      acusa: [(o) => `Yo… yo creo que ${o}. Me da miedo, la verdad.`],
    },
  },
  {
    id: 'pintora',
    nombre: 'Valeria',
    rol: 'la pintora',
    profesion: 'pintora encargada del retrato de la familia',
    rasgo: 'dramática y excéntrica',
    habla: 'teatral y llena de metáforas',
    voz: {
      relacion: ['Me encargó su retrato. Posaba con la paciencia de una estatua… un rostro difícil, pero fascinante.'],
      conPareja: [(h, p) => `Estaba en ${h} con ${p}, como dos figuras en un cuadro. Solo estábamos los dos.`],
      conOtro: [(h, o) => `Estaba en ${h} con ${o}, que es testigo de mi inocencia. Puede confirmarlo.`],
      solo: [(h) => `Estaba en ${h}, sola con mis pensamientos. La inspiración no admite compañía.`],
      vioArma: [(a) => `Vi ${a} en su sitio toda la noche, inmóvil como en una naturaleza muerta. Nadie se acercó.`],
      vioLugar: [(h) => `Pasé por ${h} a esa hora: vacío, silencioso como un lienzo en blanco. Allí no ocurrió nada.`],
      nadaRaro: ['Nada extraño… salvo la luna, que esta noche tenía un color de sangre.'],
      opinion: [(o) => `Hay algo turbio en la mirada de ${o} esta noche. Una sombra que no sabría pintar.`],
      acusa: [(o) => `${o}, sin duda. Lo veo en sus ojos: el alma tiene colores que no mienten.`],
    },
  },
];

export const armas = [
  { id: 'candelabro', nombre: 'el candelabro', descripcion: 'un pesado candelabro de plata de tres brazos' },
  { id: 'cuchillo', nombre: 'el cuchillo', descripcion: 'un cuchillo de trinchar con mango de hueso' },
  { id: 'cuerda', nombre: 'la cuerda', descripcion: 'un cordón grueso arrancado de las cortinas' },
  { id: 'veneno', nombre: 'el veneno', descripcion: 'un frasquito de arsénico sin etiqueta' },
  { id: 'llave', nombre: 'la llave inglesa', descripcion: 'una llave inglesa que olvidó el fontanero' },
  { id: 'atizador', nombre: 'el atizador', descripcion: 'el atizador de hierro de la chimenea' },
  { id: 'abrecartas', nombre: 'el abrecartas', descripcion: 'un abrecartas de bronce con forma de daga' },
];

export const habitaciones = [
  { id: 'biblioteca', nombre: 'la biblioteca', descripcion: 'estanterías hasta el techo y un sillón de cuero junto a la chimenea' },
  { id: 'cocina', nombre: 'la cocina', descripcion: 'fogones de hierro, ollas de cobre y olor a guiso' },
  { id: 'salon', nombre: 'el salón', descripcion: 'un piano de cola y grandes ventanales sobre el jardín' },
  { id: 'estudio', nombre: 'el estudio', descripcion: 'un escritorio de caoba cubierto de papeles y un reloj de pared' },
  { id: 'invernadero', nombre: 'el invernadero', descripcion: 'plantas exóticas, cristales empañados y un calor húmedo' },
  { id: 'comedor', nombre: 'el comedor', descripcion: 'una mesa larga para veinte comensales bajo una lámpara de araña' },
  { id: 'bodega', nombre: 'la bodega', descripcion: 'barricas de vino, telarañas y una única bombilla' },
];

export const lugaresHallazgo = [
  'tendido en el vestíbulo, al pie de la escalera',
  'en el jardín, junto a la fuente',
  'en el pasillo del primer piso',
];

export const motivos = [
  'quería cobrar la herencia cuanto antes',
  'iba a quedarse sin trabajo y sin herencia',
  'le debía una fortuna que no podía pagar',
  'había descubierto un secreto que podía arruinarle',
];

export const preguntas = [
  { id: 'donde', texto: '¿Dónde estabas a la hora del crimen?' },
  { id: 'relacion', texto: '¿Qué relación tenías con la víctima?' },
  { id: 'extrano', texto: '¿Viste algo extraño?' },
  { id: 'quien', texto: '¿Quién crees que lo hizo?' },
];

// Textos de las pistas que se encuentran en las habitaciones.
export const textosPista = {
  noArma: (arma) => `Encuentras ${arma} en su sitio, sin una mancha ni rastro de uso. No es el arma del crimen.`,
  noLugarAqui: () => 'Todo está en perfecto orden y el polvo de los muebles no se ha movido. Aquí no ocurrió el crimen.',
  noLugarOtro: (habitacion) => `Encuentras una nota de la doncella: «Estuve limpiando ${habitacion} toda la noche y allí no pasó nada».`,
  nada: 'Buscas por todas partes, pero aquí no hay nada.',
};

// Frase de un personaje para un tipo de respuesta; si tiene varias versiones, elige una al azar.
export function frase(personaje, clave, aleatorio, ...datos) {
  const versiones = personaje.voz[clave];
  const elegida = versiones[Math.floor(aleatorio() * versiones.length)];
  return typeof elegida === 'function' ? elegida(...datos) : elegida;
}

export const textosResultado = {
  gana: '¡Caso resuelto!',
  pierde: 'El culpable se ha salido con la suya',
  acierto: (parte, nombre) => `${parte}: ${nombre} ✓`,
  fallo: (parte, nombre) => `${parte}: ${nombre} ✗`,
  relato: ({ culpable, rol, victima, arma, habitacion, motivo, hallazgo, mentira }) =>
    `${culpable}, ${rol}, mató a ${victima} con ${arma} en ${habitacion} porque ${motivo}. `
    + `Después, para despistar, dejó el cuerpo ${hallazgo}. `
    + `Mintió al decir: «${mentira.replace(/\.$/, '')}».`,
};

export const textosIntro = {
  titulo: 'Mini Detective',
  introduccion: ({ victima, muerto, descripcion, hallazgo, numHabitaciones, numSospechosos }) =>
    `Esta noche ha aparecido ${muerto} ${victima}, ${descripcion}. `
    + `Encontraron el cuerpo ${hallazgo}, pero el crimen ocurrió en alguna de las ${enLetras(numHabitaciones)} habitaciones de la mansión. `
    + `${mayuscula(enLetras(numSospechosos))} personas estaban en la casa y una de ellas es culpable. `
    + 'Explora las habitaciones, interroga a los sospechosos y acusa cuando lo tengas claro. '
    + 'Recuerda: las pistas no mienten y los inocentes dicen la verdad… pero el culpable, no.',
};
