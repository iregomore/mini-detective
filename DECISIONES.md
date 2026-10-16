# Decisiones

- TODO.md usa "[ ]" sin guion; al completar una tarea la marco como "- [x]" (formato que pide CLAUDE.md).
- Añado package.json con "type": "module" (sin dependencias) para que node use módulos ES en src/ y test/.
- Generador pseudoaleatorio mulberry32: pequeño, determinista y sin dependencias.
- 5 sospechosos, 5 armas y 5 habitaciones; la víctima es un personaje aparte (no es sospechoso).
- El cadáver aparece fuera de las 5 habitaciones (vestíbulo, jardín, pasillo): así la habitación del crimen hay que deducirla.
- Modelo lógico: las pistas y los inocentes siempre dicen la verdad; solo el culpable miente. Así un solucionador puede probar cada hipótesis ignorando las declaraciones del sospechoso acusado.
- Escena: los 4 inocentes estaban por parejas en dos habitaciones distintas de la del crimen; el culpable estaba solo en la habitación del crimen.
- Cada pista descarta un arma o una habitación (nunca un sospechoso), así que ninguna pista sola resuelve el caso. Hay 3 o 4 pistas; el resto de habitaciones están vacías.
- Los descartes que no van a habitaciones los aporta algún inocente al responder «¿Viste algo extraño?».
- Mentira detectable del culpable: dice que estaba en la habitación de una pareja de inocentes (solo o «con» uno de ellos), pero la pareja afirma que solo estaban ellos dos. A veces además dice que vio el arma del crimen sin usar (también se detecta: contradice los descartes de las demás armas).
- «¿Qué relación tenías?» y «¿Quién crees que lo hizo?» son ambientación: no aportan hechos al solucionador. Las opiniones de los inocentes son impresiones («actuaba raro»), no afirmaciones falsas.
- Las respuestas mentirosas llevan `miente: true` para los tests; la interfaz no lo muestra.
- Solucionador por fuerza bruta (125 combinaciones): para cada sospechoso ignora sus declaraciones y comprueba que el resto de hechos es coherente con que estuviera solo en la habitación del crimen y los demás, fuera de ella.
