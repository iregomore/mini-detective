// Datos del juego: personajes, armas, habitaciones y textos.

export const victimas = [
  { nombre: 'Lord Alistair Pemberton', descripcion: 'el anciano dueño de la mansión' },
  { nombre: 'Doña Remedios Villalba', descripcion: 'la rica viuda que daba la fiesta' },
  { nombre: 'El doctor Ezequiel Mora', descripcion: 'un famoso coleccionista de arte' },
  { nombre: 'La condesa Inés de Altamira', descripcion: 'la heredera de la fortuna familiar' },
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
