// Datos del juego: personajes, armas, habitaciones y textos.

export const victimas = [
  { nombre: 'Lord Alistair Pemberton', descripcion: 'el anciano dueño de la mansión' },
  { nombre: 'Doña Remedios Villalba', descripcion: 'la rica viuda que daba la fiesta' },
  { nombre: 'Ezequiel Mora', descripcion: 'un famoso coleccionista de arte' },
  { nombre: 'Inés de Altamira', descripcion: 'la condesa, heredera de la fortuna familiar' },
  { nombre: 'Don Fermín Castro', descripcion: 'el banquero más temido de la ciudad' },
];

export const sospechosos = [
  { id: 'mayordomo', nombre: 'Benito', rol: 'el mayordomo', relacion: 'Le serví durante veinte años. Era exigente, pero justo.' },
  { id: 'sobrina', nombre: 'Clara', rol: 'la sobrina', relacion: 'Soy su única sobrina. Me pagaba los estudios.' },
  { id: 'socio', nombre: 'Rodrigo', rol: 'el socio', relacion: 'Llevábamos juntos el negocio familiar desde hace años.' },
  { id: 'medica', nombre: 'Lucía', rol: 'la médica', relacion: 'Era su médica de cabecera. Lo visitaba cada semana.' },
  { id: 'jardinero', nombre: 'Tomás', rol: 'el jardinero', relacion: 'Cuido sus jardines. Apenas hablábamos.' },
];

export const armas = [
  { id: 'candelabro', nombre: 'el candelabro' },
  { id: 'cuchillo', nombre: 'el cuchillo' },
  { id: 'cuerda', nombre: 'la cuerda' },
  { id: 'veneno', nombre: 'el veneno' },
  { id: 'llave', nombre: 'la llave inglesa' },
];

export const habitaciones = [
  { id: 'biblioteca', nombre: 'la biblioteca' },
  { id: 'cocina', nombre: 'la cocina' },
  { id: 'salon', nombre: 'el salón' },
  { id: 'estudio', nombre: 'el estudio' },
  { id: 'invernadero', nombre: 'el invernadero' },
];

export const lugaresHallazgo = [
  'tendido en el vestíbulo, al pie de la escalera',
  'en el jardín, junto a la fuente',
  'en el pasillo del primer piso',
];

export const motivos = [
  'quería cobrar la herencia cuanto antes',
  'iba a ser despedido y desheredado',
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
  noArma: (arma) => `Encuentras ${arma} en su sitio, limpio y sin rastro de uso. No es el arma del crimen.`,
  noLugarAqui: () => 'Todo está en perfecto orden y el polvo de los muebles no se ha movido. Aquí no ocurrió el crimen.',
  noLugarOtro: (habitacion) => `Encuentras una nota de la doncella: «Estuve limpiando ${habitacion} toda la noche y allí no pasó nada».`,
  nada: 'Buscas por todas partes, pero aquí no hay nada.',
};

// Textos de las respuestas de los sospechosos.
export const textosRespuesta = {
  dondeConPareja: (habitacion, pareja) => `Estaba en ${habitacion} con ${pareja}. Solo estábamos los dos.`,
  dondeConOtro: (habitacion, otro) => `Estaba en ${habitacion} con ${otro}. Puede confirmarlo.`,
  dondeSinCompania: (habitacion) => `Estaba en ${habitacion}, sin compañía. Necesitaba tranquilidad.`,
  vioArma: (arma) => `Sí: vi ${arma} en su sitio durante toda la noche. Nadie se acercó.`,
  vioLugar: (habitacion) => `Pasé por ${habitacion} a esa hora y no había nadie. Allí no ocurrió nada.`,
  nadaRaro: 'No, no vi nada fuera de lo normal.',
  opinionInocente: (otro) => `No lo sé… pero ${otro} actuaba de forma muy rara esta noche.`,
  opinionCulpable: (otro) => `Yo apostaría por ${otro}. Nunca me ha dado buena espina.`,
};

export const textosResultado = {
  relato: ({ culpable, rol, victima, arma, habitacion, motivo, hallazgo, mentira }) =>
    `${culpable}, ${rol}, mató a ${victima} con ${arma} en ${habitacion} porque ${motivo}. `
    + `Después, para despistar, dejó el cuerpo ${hallazgo}. `
    + `Mintió al decir: «${mentira.replace(/\.$/, '')}».`,
};
