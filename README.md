# Mini Detective

Juego de deducción corto para el navegador del móvil. Ha habido un asesinato en una mansión: explora las habitaciones, interroga a los sospechosos y acusa al culpable, el arma y el lugar.

Cada partida es distinta. Para repetir un caso concreto, añade `?semilla=N` a la URL (por ejemplo `?semilla=77`).

## Jugar en local

Los módulos ES necesitan un servidor (no funciona abriendo el archivo directamente):

```sh
python3 -m http.server 8000
# y abre http://localhost:8000
```

## Tests

```sh
node --test
```

Sin dependencias externas. Incluye un test de 1.000 semillas que comprueba que cada caso tiene solución única, que el culpable miente de forma detectable y que ninguna pista sola basta.

## Publicar en GitHub Pages

El workflow `.github/workflows/pages.yml` ejecuta los tests y publica la web en cada push a `main` (también se puede lanzar a mano desde la pestaña *Actions*).

Configuración necesaria, una sola vez:

1. En el repositorio, ve a **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.
3. Haz push a `main` (o lanza el workflow a mano). La URL aparecerá en el resumen del workflow, normalmente `https://<usuario>.github.io/mini-detective/`.

Todas las rutas de la web son relativas, así que funciona dentro del subdirectorio de Pages.

## Estructura

- `index.html`, `styles.css`: interfaz.
- `src/juego.js`: lógica pura (generar caso, respuestas, solucionador, comprobar acusación).
- `src/ui.js`: conecta la lógica con la interfaz.
- `src/datos.js`: personajes, armas, habitaciones y textos.
- `test/`: tests con `node:test`.
