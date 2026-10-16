Tareas v2 — Agente B: Guardar partida
Zona de trabajo: src/ui.js y un nuevo src/guardado.js. No toques src/datos.js; cambios en src/juego.js solo si son imprescindibles y mínimos.
Decisiones en DECISIONES-guardado.md.
- [x] src/guardado.js: guardar y cargar el estado de la partida (semilla, pistas encontradas, respuestas obtenidas) en localStorage, envuelto en try/catch para que el juego funcione aunque falle.
- [x] Tests de guardado.js con un localStorage simulado.
- [x] Guardar automáticamente después de cada acción del jugador.
- [x] Al abrir el juego, si hay una partida a medias, ofrecer "Continuar" o "Nueva partida".
- [x] Al terminar una partida (ganada o perdida), borrar la partida guardada.
- [x] Contador simple de partidas ganadas y jugadas, visible en la pantalla de inicio.
