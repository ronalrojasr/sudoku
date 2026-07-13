# Sudoku Espacial — AGENTS.md

## Stack

Vanilla HTML/CSS/JS. Tests con Vitest + jsdom.

## Comandos

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta tests una vez |
| `npm run test:watch` | Tests en modo watch |
| `index.html` | Abrir en navegador para jugar |

## Arquitectura

| Archivo | Rol |
|---|---|
| `index.html` | Estructura DOM, carga fuentes Google (Orbitron + JetBrains Mono) |
| `style.css` | Tema espacial con estrellas animadas vía CSS, responsive |
| `script.js` | Todo el estado y lógica del juego (~360 líneas) |

## Convenciones del código

- **Idioma mixto**: nombres de variables y funciones del juego en español (`nuevoJuego`, `seleccionarCelda`, `generarSudokuCompleto`), términos técnicos en inglés (`renderBoard`, `fixed`, `boardEl`)
- **Estado global**: `board[9][9]`, `solution[9][9]`, `fixed[9][9]`, `incorrect[9][9]`, `selectedCell`, `seconds`
- **Timer**: usa `iniciarCronometro` / `detenerCronometro` (no `startTimer`/`stopTimer`)
- **Renderizado completo**: cada acción regenera el tablero entero (`renderBoard()`)

## Particularidades

- No requiere servidor ni instalación
- Las fuentes se cargan desde Google Fonts (requiere internet la primera vez)

## Tests

Los tests están en `tests/` y cubren la lógica pura del juego:
- `shuffle`, `esValido`, `resolver`, `generarSudokuCompleto`
- `contarSoluciones`, `eliminarCeldas`, `checkComplete`
- 21 tests que validan reglas de Sudoku y generación de puzzles
