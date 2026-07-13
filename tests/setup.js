import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

document.body.innerHTML = `
  <div id="board"></div>
  <div id="timerDisplay">00:00</div>
  <div id="victoryModal"></div>
  <div id="victoryTime"></div>
  <div id="stars"></div>
  <button id="newGameBtn"></button>
  <button id="hintBtn"></button>
  <button id="playAgainBtn"></button>
  <button class="diff-btn" data-diff="easy">Easy</button>
  <button class="diff-btn" data-diff="medium">Medium</button>
  <button class="diff-btn" data-diff="hard">Hard</button>
  <button class="num-btn" data-num="1">1</button>
  <button class="num-btn" data-num="2">2</button>
  <button class="num-btn" data-num="3">3</button>
  <button class="num-btn" data-num="4">4</button>
  <button class="num-btn" data-num="5">5</button>
  <button class="num-btn" data-num="6">6</button>
  <button class="num-btn" data-num="7">7</button>
  <button class="num-btn" data-num="8">8</button>
  <button class="num-btn" data-num="9">9</button>
`

const scriptPath = path.join(__dirname, '..', 'script.js')
const scriptContent = fs.readFileSync(scriptPath, 'utf-8')

const helpers = `
globalThis.__setBoard = (b) => { board = b; };
globalThis.__getBoard = () => board;
globalThis.__setSolution = (s) => { solution = s; };
globalThis.__getSolution = () => solution;
globalThis.__setGameOver = (v) => { gameOver = v; };
globalThis.__getGameOver = () => gameOver;
`

;(0, eval)(scriptContent + '\n' + helpers)
