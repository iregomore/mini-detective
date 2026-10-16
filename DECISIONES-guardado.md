# Decisiones — Guardar partida

- El archivo de tareas se llama TODO-Guardado.md (con mayúscula); es el que se pidió como TODO-guardado.md. Lo uso tal cual, sin renombrarlo.
- Trabajo en la rama v2-contenido porque así se pidió explícitamente, aunque las tareas sean las de guardado.
- Se guardan solo la semilla y los identificadores (habitaciones registradas, pares sospechoso/pregunta y la acusación a medio elegir); los textos se regeneran desde la semilla al cargar. Ocupa poco y no se desincroniza con el caso.
- La partida guardada lleva `version: 1`; si la versión no coincide o los datos están dañados, se ignora (cargarPartida devuelve null).
- Las funciones aceptan el almacén como parámetro (por defecto localStorage) para poder probarlas con uno simulado.
- Si localStorage no existe o lanza (modo privado, cuota llena, acceso bloqueado), guardar devuelve false y cargar devuelve null: el juego sigue funcionando sin guardar.
