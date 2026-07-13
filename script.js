// ======================== ESTADO DEL JUEGO ========================
let board = [];
let solution = [];
let fixed = [];
let incorrect = [];
let selectedCell = null;
let timerInterval = null;
let seconds = 0;
let gameStarted = false;
let gameOver = false;
let currentDifficulty = 'medium';

// ======================== DOM REFS ========================
const boardEl = document.getElementById('board');
const timerDisplay = document.getElementById('timerDisplay');
const victoryModal = document.getElementById('victoryModal');
const victoryTime = document.getElementById('victoryTime');
const diffBtns = document.querySelectorAll('.diff-btn');
const numBtns = document.querySelectorAll('.num-btn');

// ======================== ESTRELLAS ========================
function createStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 180; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 1;
    star.style.cssText =
      `left:${Math.random()*100}%;top:${Math.random()*100}%;` +
      `width:${size}px;height:${size}px;` +
      `animation-delay:${Math.random()*4}s;animation-duration:${(Math.random()*3+2)}s`;
    container.appendChild(star);
  }
}

// ======================== LÓGICA SUDOKU ========================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function esValido(board, row, col, num) {
  for (let j = 0; j < 9; j++) {
    if (board[row][j] === num) return false;
  }
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }
  const sr = Math.floor(row / 3) * 3;
  const sc = Math.floor(col / 3) * 3;
  for (let i = sr; i < sr + 3; i++) {
    for (let j = sc; j < sc + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}

function resolver(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (esValido(board, i, j, num)) {
            board[i][j] = num;
            if (resolver(board)) return true;
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generarSudokuCompleto() {
  const b = Array.from({ length: 9 }, () => Array(9).fill(0));
  resolver(b);
  return b;
}

function contarSoluciones(board, limit) {
  let count = 0;
  const b = board.map(r => [...r]);

  function backtrack() {
    if (count >= limit) return;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (b[i][j] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (esValido(b, i, j, num)) {
              b[i][j] = num;
              backtrack();
              b[i][j] = 0;
              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  backtrack();
  return count;
}

function eliminarCeldas(solution, difficulty) {
  const puzzle = solution.map(r => [...r]);
  const fixed = Array.from({ length: 9 }, () => Array(9).fill(true));
  const targets = { easy: 36, medium: 44, hard: 50 };
  const target = targets[difficulty] || 44;
  let removed = 0;

  const positions = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) positions.push([i, j]);
  }
  shuffle(positions);

  for (const [row, col] of positions) {
    if (removed >= target) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    fixed[row][col] = false;

    if (contarSoluciones(puzzle, 2) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
      fixed[row][col] = true;
    }
  }

  return { puzzle, fixed };
}

// ======================== JUEGO ========================
function nuevoJuego(difficulty) {
  detenerCronometro();
  gameOver = false;
  gameStarted = false;
  seconds = 0;
  timerDisplay.textContent = '00:00';
  currentDifficulty = difficulty;

  solution = generarSudokuCompleto();
  const result = eliminarCeldas(solution, difficulty);
  board = result.puzzle.map(r => [...r]);
  fixed = result.fixed.map(r => [...r]);
  incorrect = Array.from({ length: 9 }, () => Array(9).fill(false));

  selectedCell = null;
  renderBoard();
  victoryModal.classList.remove('show');

  diffBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.diff === difficulty);
  });
}

function selectCell(row, col) {
  if (gameOver) return;
  selectedCell = { row, col };
  renderBoard();
  if (!gameStarted) {
    gameStarted = true;
    iniciarCronometro();
  }
}

function enterNumber(num) {
  if (gameOver || !selectedCell) return;
  const { row, col } = selectedCell;
  if (fixed[row][col]) return;

  if (num === 0) {
    board[row][col] = 0;
    incorrect[row][col] = false;
    renderBoard();
    return;
  }

  board[row][col] = num;
  incorrect[row][col] = num !== solution[row][col];
  renderBoard();

  if (checkComplete()) {
    gameOver = true;
    detenerCronometro();
    victoryTime.textContent = timerDisplay.textContent;
    setTimeout(() => victoryModal.classList.add('show'), 300);
  }
}

function giveHint() {
  if (gameOver) return;
  const candidates = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!fixed[i][j] && board[i][j] !== solution[i][j]) {
        candidates.push([i, j]);
      }
    }
  }
  if (candidates.length === 0) return;

  const [row, col] = candidates[Math.floor(Math.random() * candidates.length)];
  board[row][col] = solution[row][col];
  incorrect[row][col] = false;

  if (!gameStarted) {
    gameStarted = true;
    iniciarCronometro();
  }

  renderBoard();

  if (checkComplete()) {
    gameOver = true;
    detenerCronometro();
    victoryTime.textContent = timerDisplay.textContent;
    setTimeout(() => victoryModal.classList.add('show'), 300);
  }
}

function checkComplete() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== solution[i][j]) return false;
    }
  }
  return true;
}

// ======================== TIMER ========================
function iniciarCronometro() {
  detenerCronometro();
  timerInterval = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
  }, 1000);
}

function detenerCronometro() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// ======================== RENDER ========================
function renderBoard() {
  boardEl.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = i;
      cell.dataset.col = j;

      if ((Math.floor(i / 3) + Math.floor(j / 3)) % 2 === 1) {
        cell.classList.add('alternate');
      }
      if (i % 3 === 0) cell.classList.add('border-top');
      if (j % 3 === 0) cell.classList.add('border-left');
      if (i === 8) cell.classList.add('border-bottom');
      if (j === 8) cell.classList.add('border-right');

      const val = board[i][j];
      if (val !== 0) {
        cell.textContent = val;
        if (fixed[i][j]) cell.classList.add('fixed');
        if (incorrect[i][j]) cell.classList.add('incorrect');
      }

      if (selectedCell) {
        const { row, col } = selectedCell;
        const sameRow = i === row;
        const sameCol = j === col;
        const sameBox = Math.floor(i / 3) === Math.floor(row / 3) &&
          Math.floor(j / 3) === Math.floor(col / 3);
        const sameVal = val !== 0 && val === board[row][col] && board[row][col] !== 0;

        if (sameRow || sameCol || sameBox) {
          cell.classList.add('highlighted');
        }
        if (sameVal) {
          cell.classList.add('same-value');
        }
        if (i === row && j === col) {
          cell.classList.add('selected');
        }
      }

      cell.addEventListener('click', () => selectCell(i, j));
      boardEl.appendChild(cell);
    }
  }
}

// ======================== EVENTOS ========================
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => nuevoJuego(btn.dataset.diff));
});

numBtns.forEach(btn => {
  btn.addEventListener('click', () => enterNumber(parseInt(btn.dataset.num)));
});

document.getElementById('newGameBtn').addEventListener('click', () => {
  nuevoJuego(currentDifficulty);
});

document.getElementById('hintBtn').addEventListener('click', giveHint);

document.getElementById('playAgainBtn').addEventListener('click', () => {
  nuevoJuego(currentDifficulty);
});

document.addEventListener('keydown', (e) => {
  if (!selectedCell) return;
  const { row, col } = selectedCell;

  if (e.key >= '1' && e.key <= '9') {
    e.preventDefault();
    enterNumber(parseInt(e.key));
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault();
    enterNumber(0);
  } else if (e.key === 'ArrowUp' && row > 0) {
    e.preventDefault();
    selectCell(row - 1, col);
  } else if (e.key === 'ArrowDown' && row < 8) {
    e.preventDefault();
    selectCell(row + 1, col);
  } else if (e.key === 'ArrowLeft' && col > 0) {
    e.preventDefault();
    selectCell(row, col - 1);
  } else if (e.key === 'ArrowRight' && col < 8) {
    e.preventDefault();
    selectCell(row, col + 1);
  }
});

// ======================== INICIO ========================
createStars();
nuevoJuego('medium');
