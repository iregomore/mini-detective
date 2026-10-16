# Decisiones — Guardar partida

- El archivo de tareas se llama TODO-Guardado.md (con mayúscula); es el que se pidió como TODO-guardado.md. Lo uso tal cual, sin renombrarlo.
- Trabajo en la rama v2-contenido porque así se pidió explícitamente, aunque las tareas sean las de guardado.
- Se guardan solo la semilla y los identificadores (habitaciones registradas, pares sospechoso/pregunta y la acusación a medio elegir); los textos se regeneran desde la semilla al cargar. Ocupa poco y no se desincroniza con el caso.
- La partida guardada lleva `version: 1`; si la versión no coincide o los datos están dañados, se ignora (cargarPartida devuelve null).
- Las funciones aceptan el almacén como parámetro (por defecto localStorage) para poder probarlas con uno simulado.
- Si localStorage no existe o lanza (modo privado, cuota llena, acceso bloqueado), guardar devuelve false y cargar devuelve null: el juego sigue funcionando sin guardar.
- Se guarda tras registrar una habitación, hacer una pregunta o elegir algo en la acusación. Empezar una partida sin hacer nada no guarda: no habría nada que continuar.
- El bloque «Continuar / Nueva partida» se crea desde ui.js y se inserta en la pantalla de inicio, para no salir de la zona de trabajo (no toco index.html ni styles.css). Reutiliza las clases .boton, .principal y .ayuda.
- Con partida guardada, la pantalla de inicio muestra un resumen («2 habitaciones registradas y 1 pregunta hecha»), los botones Continuar y Nueva partida, y la introducción de ese caso para recordarlo. Se oculta «Empezar la investigación».
- Continuar lleva a la mansión con el cuaderno, las marcas de «registrada» y la acusación a medio elegir restaurados. No se restaura el sospechoso seleccionado ni la última respuesta mostrada: son estado de pantalla, no de la partida.
- Nueva partida desde el inicio usa la semilla de la URL si la hay (?semilla=N); si no, una aleatoria. Empezarla borra la partida guardada.
- La restauración (restaurarPartida) vive en guardado.js como función pura y probada; ignora identificadores que ya no existan en datos.js, por si el contenido cambia entre versiones. Si aun así falla, se descarta la partida y se empieza una nueva.
- El atributo hidden no oculta «Empezar la investigación» porque .boton fija display: block; lo oculto con style.display desde ui.js en lugar de tocar styles.css.
- La partida guardada se borra en cuanto se acusa (gane o pierda), antes de mostrar el resultado: recargar en la pantalla de resultado ya no ofrece continuar un caso cerrado.
- Estadísticas en una clave aparte (mini-detective:estadisticas) para que borrar la partida no las borre. Cuenta como jugada solo la partida que termina con una acusación; abandonar un caso (Nueva partida sin acusar) no cuenta.
- El contador se muestra al final de la pantalla de inicio («Casos resueltos: 3 de 5 jugados.», o «Todavía no has cerrado ningún caso.» si no hay ninguna). Lo crea ui.js; el texto lo genera textoContador en guardado.js para poder probarlo.
