# Decisiones — Dificultad

- Trabajo en la rama v2-dificultad (la pidió el usuario) y sigo TODO-dificultad.md; como en TODO.md, marco las tareas hechas como «- [x]».
- `generarCaso(semilla, dificultad = 'normal')`: el segundo parámetro es opcional para no romper a quien ya llama con una sola semilla. Una dificultad desconocida lanza un error en vez de caer en «normal» en silencio. El caso guarda `dificultad`.
- La lista `dificultades` se exporta desde juego.js para que la interfaz y los tests usen los mismos identificadores.
- Los textos nuevos de fácil y difícil viven en `textosDificultad`, dentro de juego.js, porque datos.js queda fuera de mi zona de trabajo. Se pueden mover a datos.js más adelante sin cambiar la lógica.
- Nuevo tipo de hecho `cuantos` (habitación, número): cuántas personas estuvieron exactamente en una habitación. El solucionador lo trata como un cupo y, como el culpable estaba solo en la habitación del crimen, cualquier número distinto de 1 descarta esa habitación.
- Fácil: 5 pistas (todas las habitaciones tienen algo) y un solo descarte para los testigos. Una de las dos habitaciones libres pasa a tener la pista «aquí no entró nadie» (`cuantos` 0) en lugar de su descarte normal, y el culpable dice que estuvo allí solo: la pista lo contradice sin necesidad de cruzar nada más.
- En fácil el culpable no finge además lo del arma: una sola mentira, clara.
- Cambié el reparto de hechos de testigos a listas (un testigo puede contar más de una cosa) y separé la coartada del culpable en «plan de mentira» + respuestas. Normal sigue haciendo las mismas tiradas en el mismo orden: comprobé que las 1.000 semillas generan exactamente los mismos casos que antes.
