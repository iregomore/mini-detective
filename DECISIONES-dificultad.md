# Decisiones — Dificultad

- Trabajo en la rama v2-dificultad (la pidió el usuario) y sigo TODO-dificultad.md; como en TODO.md, marco las tareas hechas como «- [x]».
- `generarCaso(semilla, dificultad = 'normal')`: el segundo parámetro es opcional para no romper a quien ya llama con una sola semilla. Una dificultad desconocida lanza un error en vez de caer en «normal» en silencio. El caso guarda `dificultad`.
- La lista `dificultades` se exporta desde juego.js para que la interfaz y los tests usen los mismos identificadores.
