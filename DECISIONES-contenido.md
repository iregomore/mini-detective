# Decisiones — Contenido (v2)

- Hago primero la tarea de adaptar juego.js a cantidades variables: con 8 personajes hay 7 inocentes y el reparto por parejas fallaba. Así cada commit deja los tests en verde.
- Con un número impar de inocentes, uno estaba solo en su habitación (dice «sin compañía»). Su habitación también cuenta como descartada. La mentira del culpable siempre usa la habitación de una pareja, para que siga contradiciendo a dos testigos.
- La introducción recibe el número de habitaciones y sospechosos y los escribe con letras (enLetras en datos.js) en vez de «cinco» fijo.
- Marco las tareas como «- [x]», igual que en TODO.md.
- Personajes nuevos: Amparo (cocinera), Julián (chófer) y Valeria (pintora). Mantengo los ids y nombres de los cinco anteriores para no romper tests ni partidas con semilla.
- Cada personaje tiene `profesion`, `rasgo`, `habla` (descripción de su forma de hablar) y `voz`: sus frases para cada tipo de respuesta. `rol` se queda porque la interfaz lo usa.
- Las frases se eligen con `frase(personaje, clave, aleatorio, ...datos)` en datos.js; juego.js solo cambia la llamada. Así quito los textos genéricos de respuesta (textosRespuesta), que ya no usa nadie.
- Las opiniones sobre otros personajes no llevan adjetivos con género («hacía cosas raras», no «estaba raro»), porque el aludido puede ser hombre o mujer. Las relaciones con la víctima tampoco («Tenía un carácter exigente»).
- Cada frase con información conserva el dato exacto (nombre de habitación, persona o arma) y el sentido («solo estábamos los dos», «sin compañía», «en su sitio»), que es lo que el solucionador modela. Lo comprueba test/personajes.test.js.
- Nuevas habitaciones: el comedor y la bodega. Nuevas armas: el atizador y el abrecartas. Los ids antiguos no cambian.
- Las descripciones (`descripcion`) de armas y habitaciones son de 80 caracteres como máximo, para que quepan en el móvil. No las enseño en las pistas, porque la interfaz no es de mi zona; las uso en el relato final (tarea 4).
- Como ahora hay armas en femenino («la cuerda», «la llave inglesa»), quito los adjetivos y pronombres con género en las frases sobre armas («limpio», «nadie lo tocó» → «sin una mancha», «nadie se acercó»).
- Con 7 inocentes, 7 habitaciones y 7 armas, cada caso tiene 8 descartes (6 armas y 2 habitaciones vacías): 3–4 van a pistas y 4–5 a testigos. Hay 7 inocentes, así que siempre hay testigos suficientes.
