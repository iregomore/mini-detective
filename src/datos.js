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
      relacion: [
        'Tuve el honor de servir en esta casa durante veinte años. Tenía un carácter exigente, pero justo, si me permite decirlo.',
        'Serví en esta casa toda mi vida adulta. Ni una queja, ni una confianza: así debe ser.',
        'Me ocupaba de que nada faltara en la mesa. Puntualidad y discreción, era lo único que se me pedía.',
      ],
      conPareja: [
        (h, p) => `Con su permiso: me encontraba en ${h} con ${p}. Solo estábamos los dos, se lo aseguro.`,
        (h, p) => `Permítame precisar: estuve en ${h} acompañado de ${p}. Solo estábamos los dos, ni un alma más.`,
        (h, p) => `En ${h}, con ${p}, atendiendo mis obligaciones. Solo estábamos los dos, tiene usted mi palabra.`,
      ],
      conOtro: [
        (h, o) => `Me encontraba en ${h} con ${o}, que podrá confirmárselo sin duda.`,
        (h, o) => `Estuve en ${h} acompañado de ${o}. Le ruego que se lo pregunte: podrá confirmarlo.`,
        (h, o) => `En ${h}, con ${o}, como manda el protocolo. Podrá confirmárselo.`,
      ],
      solo: [
        (h) => `Me encontraba en ${h}, sin compañía. Un mayordomo necesita silencio para repasar la plata.`,
        (h) => `Estuve en ${h}, sin compañía, puliendo la cubertería. Es una tarea que exige soledad.`,
        (h) => `Me hallaba en ${h}, sin compañía. Un buen mayordomo no molesta ni se deja molestar.`,
      ],
      vioArma: [
        (a) => `Si me permite: vi ${a} en su sitio toda la noche. Nadie se acercó, respondo de ello.`,
        (a) => `Puedo dar fe de que ${a} estuvo en su sitio toda la noche. Nadie se acercó.`,
        (a) => `Al hacer mi ronda vi ${a} en su sitio, como siempre. Nadie se acercó en toda la noche.`,
      ],
      vioLugar: [
        (h) => `Pasé por ${h} a esa hora y no había nadie. Allí no ocurrió nada, puede creerme.`,
        (h) => `Al hacer mi ronda pasé por ${h} a esa hora. No había nadie y allí no ocurrió nada.`,
        (h) => `Revisé ${h} a esa hora, como cada noche: no había nadie. Allí no ocurrió nada, se lo garantizo.`,
      ],
      nadaRaro: [
        'Lamento no serle de más ayuda: no observé nada fuera de lo corriente.',
        'Nada impropio, que yo advirtiera. Y advierto casi todo.',
        'Me temo que no. La velada transcurrió con la normalidad acostumbrada… hasta lo ocurrido.',
      ],
      opinion: [
        (o) => `No me corresponde juzgar… aunque ${o} se comportaba de un modo muy poco habitual esta noche.`,
        (o) => `No es mi lugar señalar a nadie, pero ${o} pidió tres copas de coñac en una hora. Insólito.`,
        (o) => `Prefiero no aventurar… si bien ${o} rehuía mi mirada toda la velada.`,
      ],
      acusa: [
        (o) => `Con todo respeto, yo vigilaría a ${o}. Nunca me ha inspirado confianza.`,
        (o) => `Si me obliga a pronunciarme: ${o}. Hay invitados que no saben comportarse.`,
        (o) => `${o}, me temo. Lo digo con el debido respeto, pero lo digo.`,
      ],
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
      relacion: [
        'Soy su única sobrina, o sea, me pagaba la carrera. Me agobiaba un poco con las notas, pero bueno.',
        'Pues soy su sobrina. La única. Lo cual es superincómodo ahora mismo, ¿no?',
        'Familia, obvio. Me llamaba cada domingo para preguntarme por los exámenes. Era un poco agobio.',
      ],
      conPareja: [
        (h, p) => `Estaba en ${h} con ${p}, en plan, toda la noche. Solo estábamos los dos, ¿vale?`,
        (h, p) => `Vale, a ver: en ${h} con ${p}. Solo estábamos los dos, literal, nadie más.`,
        (h, p) => `Pues en ${h}, con ${p}, hablando de cosas. Solo estábamos los dos, ¿eh? No te rayes.`,
      ],
      conOtro: [
        (h, o) => `Estaba en ${h} con ${o}, pregúntale, de verdad, te lo va a decir.`,
        (h, o) => `En ${h}, con ${o}. Te lo puede confirmar, o sea, es que es verdad.`,
        (h, o) => `A ver, estaba en ${h} con ${o}. Pregúntale y ya, puede confirmarlo.`,
      ],
      solo: [
        (h) => `Estaba en ${h}, sola. Necesitaba estar a mi bola un rato, ¿vale?`,
        (h) => `En ${h}, sola. Estaba agobiadísima y necesitaba desconectar, en plan, un rato.`,
        (h) => `Pues en ${h}, sola, con los cascos puestos. ¿Qué pasa?`,
      ],
      vioArma: [
        (a) => `O sea, vi ${a} en su sitio toda la noche. Nadie le puso un dedo encima, te lo juro.`,
        (a) => `Sí, vi ${a} en su sitio todo el rato, en plan, no se movió. Nadie se acercó.`,
        (a) => `Lo que sí vi fue ${a} en su sitio toda la noche. Literal, nadie se acercó.`,
      ],
      vioLugar: [
        (h) => `Pasé por ${h} a esa hora y no había nadie, en serio. Allí no pasó nada.`,
        (h) => `Pasé por ${h} justo a esa hora y no había nadie, o sea, nada. Allí no pasó nada.`,
        (h) => `Entré en ${h} a esa hora a buscar el cargador y no había nadie. Allí no pasó nada, fijo.`,
      ],
      nadaRaro: [
        'Pues… no, nada raro. Estaba con el móvil, la verdad.',
        'No, la verdad. O sea, todo superaburrido hasta que pasó esto.',
        'Mmm… no. Nada raro. Bueno, el postre, que estaba malísimo.',
      ],
      opinion: [
        (o) => `Ni idea… pero ${o} hacía cosas superraras esta noche, en plan, rarísimas.`,
        (o) => `No sé, ¿vale? Pero ${o} no paraba de mirar el reloj. Muy sospechoso, en plan.`,
        (o) => `Es que no quiero acusar, pero ${o} se ha pasado la noche cuchicheando. Cero normal.`,
      ],
      acusa: [
        (o) => `Yo diría que ${o}. Es que da mal rollo, te lo digo ya.`,
        (o) => `Para mí, ${o}. Es que es obvio, ¿no lo ves?`,
        (o) => `${o}, fijo. Siempre ha ido a por el dinero de la familia, te lo digo yo.`,
      ],
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
      relacion: [
        'Socios. Llevábamos juntos el negocio desde hace años. Números, contratos, nada personal.',
        'Relación profesional. Cincuenta por ciento de las acciones cada uno. Ahora, eso habrá que renegociarlo.',
        'Socios desde hace quince años. No éramos amigos: éramos rentables.',
      ],
      conPareja: [
        (h, p) => `Le seré franco: estaba en ${h} con ${p}. Solo estábamos los dos. Siguiente pregunta.`,
        (h, p) => `En ${h}, con ${p}, cerrando un asunto. Solo estábamos los dos. Fin de la cuestión.`,
        (h, p) => `Vamos al grano: ${h}, con ${p}. Solo estábamos los dos. Compruébelo.`,
      ],
      conOtro: [
        (h, o) => `Estaba en ${h} con ${o}. Puede confirmarlo. No me haga perder el tiempo.`,
        (h, o) => `En ${h}, con ${o}, hablando de inversiones. Puede confirmarlo.`,
        (h, o) => `Vamos al grano: ${h}, con ${o}. Puede confirmarlo cuando quiera.`,
      ],
      solo: [
        (h) => `Estaba en ${h}, sin compañía, revisando contratos. Mi tiempo vale dinero.`,
        (h) => `En ${h}, sin compañía, haciendo llamadas. Los mercados no duermen.`,
        (h) => `Estaba en ${h}, sin compañía. No necesito niñera.`,
      ],
      vioArma: [
        (a) => `Sí: vi ${a} en su sitio durante toda la noche. Nadie se acercó. Dato objetivo.`,
        (a) => `Un hecho: ${a} estuvo en su sitio toda la noche. Nadie se acercó. Lo tengo claro.`,
        (a) => `Vi ${a} en su sitio cada vez que pasé. Toda la noche. Nadie se acercó.`,
      ],
      vioLugar: [
        (h) => `Pasé por ${h} a esa hora y no había nadie. Allí no ocurrió nada, se lo garantizo.`,
        (h) => `Crucé ${h} a esa hora: no había nadie. Allí no ocurrió nada.`,
        (h) => `Un hecho: pasé por ${h} a esa hora y no había nadie. Allí no ocurrió nada.`,
      ],
      nadaRaro: [
        'No. Nada fuera de lo normal. ¿Algo más?',
        'Nada relevante. Y créame, yo sé distinguir lo relevante.',
        'No. Si hubiera visto algo, ya se lo habría dicho. No me gusta perder el tiempo.',
      ],
      opinion: [
        (o) => `No tengo pruebas, pero a ${o} le temblaban las manos esta noche. Y los nervios delatan.`,
        (o) => `Mi olfato me dice que ${o} oculta algo. Y mi olfato rara vez falla.`,
        (o) => `No acuso sin pruebas. Pero ${o} hizo demasiadas preguntas sobre el testamento.`,
      ],
      acusa: [
        (o) => `${o}. Sin dudarlo. Siempre ha tenido algo que esconder.`,
        (o) => `Apuesto por ${o}. Y yo no apuesto para perder.`,
        (o) => `${o}. Tenía deudas, tenía motivos. Haga números.`,
      ],
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
      relacion: [
        'Era mi paciente. Pasaba consulta en la casa cada semana: tensión alta, nada más.',
        'Relación médico-paciente, estrictamente. Le recetaba pastillas para dormir que nunca tomaba.',
        'Le atendía desde hace seis años. Pulso irregular, carácter peor.',
      ],
      conPareja: [
        (h, p) => `Entre las diez y las once estuve en ${h} con ${p}. Solo estábamos los dos. Es un dato exacto.`,
        (h, p) => `Constancia exacta: en ${h}, con ${p}, de las diez a las once menos cinco. Solo estábamos los dos.`,
        (h, p) => `En ${h}, con ${p}. Solo estábamos los dos durante todo el intervalo relevante.`,
      ],
      conOtro: [
        (h, o) => `Estuve en ${h} con ${o}, de diez a once. Puede confirmarlo.`,
        (h, o) => `En ${h}, con ${o}, de diez a once en punto. Puede confirmarlo.`,
        (h, o) => `Con exactitud: en ${h}, con ${o}. Puede confirmarlo.`,
      ],
      solo: [
        (h) => `Estuve en ${h}, sola, de diez a once. Repasaba historiales clínicos.`,
        (h) => `En ${h}, sola, desde las diez y cuarto. Necesitaba ordenar mis notas.`,
        (h) => `Estuve en ${h}, sola. Sesenta minutos sin interrupciones.`,
      ],
      vioArma: [
        (a) => `Observé ${a} en su sitio durante toda la noche. Nadie se aproximó en ningún momento.`,
        (a) => `Constato que ${a} estuvo en su sitio toda la noche. Nadie se acercó.`,
        (a) => `Comprobé dos veces que ${a} seguía en su sitio. Toda la noche. Nadie se acercó.`,
      ],
      vioLugar: [
        (h) => `Pasé por ${h} a las diez y media y no había nadie. Allí no ocurrió nada.`,
        (h) => `A las diez y cuarenta pasé por ${h}. No había nadie. Allí no ocurrió nada.`,
        (h) => `Pasé por ${h} a esa hora exacta: no había nadie. Allí no ocurrió nada, lo afirmo.`,
      ],
      nadaRaro: [
        'Nada reseñable. Y suelo fijarme en los detalles.',
        'Negativo. Ninguna anomalía.',
        'No. Mi observación fue continua y no detecté nada anómalo.',
      ],
      opinion: [
        (o) => `No haré un diagnóstico sin pruebas, pero ${o} mostraba signos claros de ansiedad esta noche.`,
        (o) => `Clínicamente, ${o} sudaba en exceso esta noche. Interprételo como quiera.`,
        (o) => `Observación objetiva: ${o} tenía las pupilas dilatadas y la voz alterada.`,
      ],
      acusa: [
        (o) => `Si he de apostar, ${o}. Su comportamiento no es el de una persona sana.`,
        (o) => `Por eliminación, ${o}. Es la hipótesis más probable.`,
        (o) => `${o}. Los síntomas de la culpa son fáciles de reconocer.`,
      ],
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
      relacion: [
        'Le cuido los jardines. Apenas hablábamos. Cada uno a lo suyo.',
        'Trabajo aquí. Planto, podo, riego. Nada más.',
        'Me pagaba el jornal. Cada uno a lo suyo.',
      ],
      conPareja: [
        (h, p) => `En ${h}. Con ${p}. Solo estábamos los dos.`,
        (h, p) => `${mayuscula(h)}. ${p} también. Solo estábamos los dos.`,
        (h, p) => `Con ${p}, en ${h}. Solo estábamos los dos. Nadie más.`,
      ],
      conOtro: [
        (h, o) => `En ${h}, con ${o}. Que lo diga.`,
        (h, o) => `En ${h}. ${o} estaba conmigo. Puede confirmarlo.`,
        (h, o) => `Con ${o}, en ${h}. Pregúntele.`,
      ],
      solo: [
        (h) => `En ${h}. Sin compañía. Mejor solo que mal acompañado.`,
        (h) => `En ${h}. Sin compañía. Como siempre.`,
        (h) => `${mayuscula(h)}. Sin compañía. Me gusta el silencio.`,
      ],
      vioArma: [
        (a) => `${mayuscula(a)}, en su sitio. Toda la noche. Nadie se acercó.`,
        (a) => `Vi ${a}. En su sitio. Nadie se acercó.`,
        (a) => `${mayuscula(a)} estuvo en su sitio toda la noche. Nadie se acercó.`,
      ],
      vioLugar: [
        (h) => `Pasé por ${h}. No había nadie. Allí no pasó nada.`,
        (h) => `${mayuscula(h)}, a esa hora: nadie. Allí no pasó nada.`,
        (h) => `Crucé ${h}. No había nadie. Allí no pasó nada.`,
      ],
      nadaRaro: [
        'No. Nada.',
        'Nada.',
        'No. Yo miro las plantas, no a la gente.',
      ],
      opinion: [
        (o) => `No sé. Pero ${o} hacía cosas raras esta noche. Muy raras.`,
        (o) => `${o}. Pisó mis rosales esta noche. Y nadie pisa mis rosales sin motivo.`,
        (o) => `No me meto. Pero ${o} salió al jardín a deshoras.`,
      ],
      acusa: [
        (o) => `${o}. Cría cuervos…`,
        (o) => `${o}. A la vista está.`,
        (o) => `${o}. Quien mal anda, mal acaba.`,
      ],
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
      relacion: [
        '¡Ay, treinta años dándole de comer! Tenía mal genio, pero mis croquetas no las perdonaba.',
        '¡Le hacía la cena cada noche desde antes de que tú nacieras, hijo!',
        'Yo cocinaba y se comía lo que yo dijera. ¡Era la única persona de esta casa que me hacía caso!',
      ],
      conPareja: [
        (h, p) => `¡Pues en ${h}, con ${p}! Solo estábamos los dos, hijo, nadie más.`,
        (h, p) => `¡Ay, en ${h}, con ${p}, toda la noche de cháchara! Solo estábamos los dos, te lo juro por mis hijos.`,
        (h, p) => `En ${h}, hijo, con ${p}. Solo estábamos los dos, que no entró ni el gato.`,
      ],
      conOtro: [
        (h, o) => `En ${h}, con ${o}. ¡Pregúntale, pregúntale, que te lo dice!`,
        (h, o) => `En ${h}, con ${o}, ¡que te lo confirme, que te lo puede confirmar!`,
        (h, o) => `¡Pues en ${h}! Con ${o}, mira tú. Puede confirmarlo, hijo.`,
      ],
      solo: [
        (h) => `En ${h}, sola, hijo, que una también necesita un rato de paz.`,
        (h) => `Pues en ${h}, sola, que nadie me ayuda nunca con nada.`,
        (h) => `¡En ${h}, sola, hijo! Fregando, como siempre.`,
      ],
      vioArma: [
        (a) => `¡Uy, sí! Vi ${a} en su sitio toda la noche. Nadie se acercó, que yo lo veo todo.`,
        (a) => `¡Ay, ${a}! Estuvo en su sitio toda la noche, que yo lo vi. Nadie se acercó.`,
        (a) => `Mira, hijo: vi ${a} en su sitio toda la noche, y nadie se acercó, que de mí no se escapa nada.`,
      ],
      vioLugar: [
        (h) => `Pasé por ${h} a esa hora y allí no había ni un alma. No pasó nada, te lo digo yo.`,
        (h) => `Entré en ${h} a esa hora a por unas servilletas y no había nadie. Ahí no pasó nada, hijo.`,
        (h) => `¡Pasé por ${h} a esa hora y ni un alma! No pasó nada allí, te lo digo yo.`,
      ],
      nadaRaro: [
        '¡Ay, no, hijo! Y mira que yo me entero de todo.',
        '¡Nada, hijo! Y eso que tengo un ojo para estas cosas…',
        'Ay, no. Con tanto plato que fregar, ¿qué iba a ver yo?',
      ],
      opinion: [
        (o) => `Yo no digo nada… pero ${o} andaba con unas prisas esta noche… ¿eh? Muy raras.`,
        (o) => `Mira, hijo, ${o} no probó bocado en toda la cena. ¡Eso no es normal!`,
        (o) => `Yo no quiero chismorrear… pero ${o} estuvo hablando por lo bajo toda la noche.`,
      ],
      acusa: [
        (o) => `¡${o}, seguro! Siempre andaba metiendo la nariz donde no debía.`,
        (o) => `¡${o}! Que me lo dice el corazón, y el corazón no se equivoca.`,
        (o) => `Ay, Dios mío… ${o}. Que siempre tuvo un pronto muy malo.`,
      ],
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
      relacion: [
        'Y-yo conducía para la familia a todas partes. Era… era buena persona. Casi siempre.',
        'Era… era quien me pagaba. Doce años al volante para la familia. Y-yo no tengo nada que ver.',
        'Le… le llevaba los recados en coche. Nada más. De verdad.',
      ],
      conPareja: [
        (h, p) => `E-estaba en ${h} con ${p}. Solo… solo estábamos los dos, de verdad.`,
        (h, p) => `En… en ${h}. Con ${p}. Solo estábamos los dos, se… se lo juro.`,
        (h, p) => `Estaba, eh… en ${h}, con ${p}. Solo estábamos los dos, nadie más, ¿eh?`,
      ],
      conOtro: [
        (h, o) => `Estaba en ${h} con… con ${o}. Puede confirmarlo, s-seguro.`,
        (h, o) => `En ${h}, s-sí, con ${o}. Puede confirmarlo, pregúntele, por favor.`,
        (h, o) => `Yo… en ${h}. Con ${o}. Puede confirmarlo, ¿verdad que sí?`,
      ],
      solo: [
        (h) => `Estaba en ${h}, sin compañía. Yo… yo estaba esperando por si hacía falta el coche.`,
        (h) => `En ${h}, sin compañía. Estaba… estaba leyendo el periódico, nada más.`,
        (h) => `Eh… en ${h}. Sin compañía. ¿E-eso es malo?`,
      ],
      vioArma: [
        (a) => `V-vi ${a} en su sitio toda la noche. Nadie… nadie se acercó.`,
        (a) => `Vi… vi ${a} en su sitio. Toda la noche, sí. Nadie se acercó, creo. No: seguro.`,
        (a) => `${mayuscula(a)} estuvo en su sitio toda la noche. Lo… lo vi. Nadie se acercó.`,
      ],
      vioLugar: [
        (h) => `Pasé por ${h} a esa hora y… no había nadie. Allí no pasó nada, creo… no, seguro.`,
        (h) => `P-pasé por ${h} a esa hora. No había nadie. Allí no pasó nada.`,
        (h) => `En ${h} no había nadie a esa hora, lo… lo vi al pasar. Allí no pasó nada.`,
      ],
      nadaRaro: [
        'N-no… nada raro. Bueno, nada que yo viera.',
        'Eh… no. No vi nada raro. ¿Debería haber visto algo?',
        'N-nada. Estaba en lo mío, de verdad.',
      ],
      opinion: [
        (o) => `No… no quiero acusar a nadie, pero ${o} hacía cosas muy raras esta noche.`,
        (o) => `Igual no es nada, pero… ${o} me pidió las llaves del coche esta noche. Y no se las di.`,
        (o) => `Yo… no sé. ${o} me miraba de una forma… muy rara.`,
      ],
      acusa: [
        (o) => `Yo… yo creo que ${o}. Me da miedo, la verdad.`,
        (o) => `Puede que… ${o}. Pero no diga que se lo he dicho yo.`,
        (o) => `${o}. Eso creo. B-bueno, eso me parece.`,
      ],
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
      relacion: [
        'Me encargó su retrato. Posaba con la paciencia de una estatua… un rostro difícil, pero fascinante.',
        'Yo pintaba su retrato. Era un rostro de claroscuros, de los que solo se pintan una vez.',
        'Me encargó un retrato para la posteridad. Qué ironía: ahora será su despedida.',
      ],
      conPareja: [
        (h, p) => `Estaba en ${h} con ${p}, como dos figuras en un cuadro. Solo estábamos los dos.`,
        (h, p) => `En ${h}, con ${p}, envueltos en la penumbra. Solo estábamos los dos.`,
        (h, p) => `${mayuscula(h)} fue nuestro escenario: ${p} y yo. Solo estábamos los dos, como en un díptico.`,
      ],
      conOtro: [
        (h, o) => `Estaba en ${h} con ${o}, que es testigo de mi inocencia. Puede confirmarlo.`,
        (h, o) => `En ${h}, con ${o}, conversando sobre el arte y la muerte. Puede confirmarlo.`,
        (h, o) => `${mayuscula(h)}, con ${o}, bajo la misma lámpara. Puede confirmarlo, sin duda.`,
      ],
      solo: [
        (h) => `Estaba en ${h}, sola con mis pensamientos. La inspiración no admite compañía.`,
        (h) => `En ${h}, sola, buscando la luz exacta para un boceto.`,
        (h) => `${mayuscula(h)}. Sola. El artista es siempre un alma solitaria.`,
      ],
      vioArma: [
        (a) => `Vi ${a} en su sitio toda la noche, inmóvil como en una naturaleza muerta. Nadie se acercó.`,
        (a) => `${mayuscula(a)} permaneció en su sitio toda la noche, como un objeto en un bodegón. Nadie se acercó.`,
        (a) => `Vi ${a} en su sitio, bajo la luz de la luna, toda la noche. Nadie se acercó.`,
      ],
      vioLugar: [
        (h) => `Pasé por ${h} a esa hora: ni un alma, el silencio de un lienzo en blanco. Allí no ocurrió nada.`,
        (h) => `Pasé por ${h} a esa hora y no había nadie: solo sombras quietas. Allí no ocurrió nada.`,
        (h) => `${mayuscula(h)}, a esa hora, no tenía a nadie. Ni un trazo fuera de lugar: allí no ocurrió nada.`,
      ],
      nadaRaro: [
        'Nada extraño… salvo la luna, que esta noche tenía un color de sangre.',
        'Nada… y, sin embargo, todo me pareció extraño esta noche. Pero nada concreto.',
        'No vi nada. Solo sentí un escalofrío, como cuando un cuadro va a salir mal.',
      ],
      opinion: [
        (o) => `Hay algo turbio en la mirada de ${o} esta noche. Una sombra que no sabría pintar.`,
        (o) => `${o} tenía esta noche la paleta de la culpa: grises, ocres, un rojo escondido.`,
        (o) => `Me inquieta ${o}. Hay gestos que un pintor no puede dejar de ver.`,
      ],
      acusa: [
        (o) => `${o}, sin duda. Lo veo en sus ojos: el alma tiene colores que no mienten.`,
        (o) => `${o}. Ese rostro esconde una tragedia, créame.`,
        (o) => `${o}, sin duda. La verdad siempre acaba aflorando, como un pentimento.`,
      ],
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
