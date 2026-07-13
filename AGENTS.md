# Sudoku Espacial — AGENTS.md

## Stack

Vanilla HTML/CSS/JS. Sin dependencias, sin build system, sin servidor.

## Comandos

No hay — el juego se abre directamente `index.html` en el navegador.

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
- Sin tests, sin linter, sin typecheck
- Las fuentes se cargan desde Google Fonts (requiere internet la primera vez)
- Si se añade build system o tests, actualizar este archivo
