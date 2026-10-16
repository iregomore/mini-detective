Trabaja de forma autónoma: no pares a preguntar. Si algo de la spec es ambiguo, toma la decisión más razonable, apúntala en DECISIONES.md (una línea: qué decidiste y por qué) y sigue.
Una tarea cada vez. Al terminarla:
Ejecuta los tests: node --test.
Si pasan, marca la tarea como hecha en TODO.md (- [x]).
Haz un commit con un mensaje claro en español.
Pasa a la siguiente tarea.
Si descubres trabajo nuevo necesario, añádelo al final de TODO.md en lugar de hacerlo a medias.
No marques nada como hecho si los tests fallan. Si te atascas en una tarea, apunta el problema debajo de ella en TODO.md y pasa a la siguiente que no dependa de ella.
Estructura del código
index.html, styles.css: interfaz.
src/juego.js: lógica pura (generar caso, respuestas, comprobar acusación). Sin acceso al DOM.
src/ui.js: conecta la lógica con la interfaz.
src/datos.js: personajes, armas, habitaciones, textos.
test/: tests con node:test y node:assert. Sin dependencias externas.
Estilo
JavaScript moderno (módulos ES), sin frameworks ni compilación.
Nombres de variables y textos del juego en español.
Funciones pequeñas; la lógica del caso debe poder probarse con una semilla fija.
