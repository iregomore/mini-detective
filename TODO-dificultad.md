Tareas v2 — Agente C: Dificultad
Zona de trabajo: src/juego.js y sus tests. En src/ui.js solo añade el selector de dificultad en la pantalla de inicio. No toques src/datos.js.
Decisiones en DECISIONES-dificultad.md.
- [x] La generación del caso acepta un parámetro dificultad: "facil", "normal" (comportamiento actual) o "dificil".
- [x] Fácil: más pistas, y la mentira del culpable contradice directamente una pista.
- [x] Difícil: menos pistas, alguna pista engañosa que apunta a un inocente (con explicación inocente detectable) y la mentira del culpable solo se detecta cruzando dos fuentes.
[ ] Ampliar el test de 1.000 semillas para cubrir las tres dificultades: solución única en todas.
[ ] Selector de dificultad en la pantalla de inicio (normal por defecto).
[ ] (Zona de contenido, datos.js) textosPista.noArma dice «limpio» también con armas femeninas («la cuerda … limpio»); hay que concordar el género.
