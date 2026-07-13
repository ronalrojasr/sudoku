import { describe, it, expect, beforeAll } from 'vitest'

const {
  shuffle,
  esValido,
  resolver,
  generarSudokuCompleto,
  contarSoluciones,
  eliminarCeldas,
  checkComplete,
} = globalThis

const { __setBoard, __setSolution, __setGameOver } = globalThis

function array9x9() {
  return Array.from({ length: 9 }, () => Array(9).fill(0))
}

function isValidSudoku(board) {
  for (let i = 0; i < 9; i++) {
    const rowSet = new Set()
    const colSet = new Set()
    for (let j = 0; j < 9; j++) {
      const rv = board[i][j]
      const cv = board[j][i]
      if (rv < 1 || rv > 9) return false
      if (cv < 1 || cv > 9) return false
      rowSet.add(rv)
      colSet.add(cv)
    }
    if (rowSet.size !== 9) return false
    if (colSet.size !== 9) return false
  }
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const boxSet = new Set()
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          boxSet.add(board[br * 3 + r][bc * 3 + c])
        }
      }
      if (boxSet.size !== 9) return false
    }
  }
  return true
}

describe('shuffle', () => {
  it('preserva la longitud del array', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle([...arr])).toHaveLength(5)
  })

  it('contiene todos los elementos originales', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = shuffle([...arr])
    expect([...result].sort((a, b) => a - b)).toEqual(arr)
  })

  it('devuelve el mismo array (mutación in situ)', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = shuffle(arr)
    expect(result).toBe(arr)
  })
})

describe('esValido', () => {
  it('retorna true para una colocación válida', () => {
    const board = array9x9()
    expect(esValido(board, 0, 0, 5)).toBe(true)
  })

  it('retorna false si el número ya está en la misma fila', () => {
    const board = array9x9()
    board[0][4] = 5
    expect(esValido(board, 0, 0, 5)).toBe(false)
  })

  it('retorna false si el número ya está en la misma columna', () => {
    const board = array9x9()
    board[4][0] = 5
    expect(esValido(board, 0, 0, 5)).toBe(false)
  })

  it('retorna false si el número ya está en el mismo cuadro 3×3', () => {
    const board = array9x9()
    board[1][1] = 5
    expect(esValido(board, 0, 0, 5)).toBe(false)
  })

  it('retorna true si hay el mismo número fuera de fila/columna/cuadro', () => {
    const board = array9x9()
    board[8][8] = 5
    expect(esValido(board, 0, 0, 5)).toBe(true)
  })
})

describe('resolver', () => {
  it('resuelve un tablero vacío', () => {
    const board = array9x9()
    expect(resolver(board)).toBe(true)
    expect(isValidSudoku(board)).toBe(true)
  })

  it('resuelve un tablero parcialmente lleno', () => {
    const board = array9x9()
    board[0][0] = 1
    board[0][1] = 2
    board[0][2] = 3
    expect(resolver(board)).toBe(true)
    expect(isValidSudoku(board)).toBe(true)
    expect(board[0][0]).toBe(1)
    expect(board[0][1]).toBe(2)
    expect(board[0][2]).toBe(3)
  })
})

describe('generarSudokuCompleto', () => {
  it('genera un tablero 9×9', () => {
    const b = generarSudokuCompleto()
    expect(b).toHaveLength(9)
    b.forEach(row => expect(row).toHaveLength(9))
  })

  it('genera un sudoku válido y completo', () => {
    const b = generarSudokuCompleto()
    expect(isValidSudoku(b)).toBe(true)
  })

  it('genera tableros distintos en llamadas sucesivas', () => {
    const a = generarSudokuCompleto()
    const b = generarSudokuCompleto()
    const flatA = a.flat().join('')
    const flatB = b.flat().join('')
    expect(flatA).not.toBe(flatB)
  })
})

describe('contarSoluciones', () => {
  it('cuenta exactamente 1 solución para un tablero completo', () => {
    const b = generarSudokuCompleto()
    expect(contarSoluciones(b, 2)).toBe(1)
  })

  it('cuenta múltiples soluciones para un tablero vacío', () => {
    const b = array9x9()
    expect(contarSoluciones(b, 10)).toBeGreaterThan(1)
  })
})

describe('eliminarCeldas', () => {
  let solution

  beforeAll(() => {
    solution = generarSudokuCompleto()
  })

  it('retorna puzzle y fixed con estructura correcta', () => {
    const result = eliminarCeldas(solution, 'medium')
    expect(result).toHaveProperty('puzzle')
    expect(result).toHaveProperty('fixed')
    expect(result.puzzle).toHaveLength(9)
    expect(result.fixed).toHaveLength(9)
  })

  it('elimina celdas según dificultad easy (≤36)', () => {
    const { fixed } = eliminarCeldas(solution, 'easy')
    const removed = fixed.flat().filter(v => !v).length
    expect(removed).toBeLessThanOrEqual(36)
    expect(removed).toBeGreaterThanOrEqual(30)
  })

  it('elimina celdas según dificultad medium (≤44)', () => {
    const { fixed } = eliminarCeldas(solution, 'medium')
    const removed = fixed.flat().filter(v => !v).length
    expect(removed).toBeLessThanOrEqual(44)
    expect(removed).toBeGreaterThanOrEqual(38)
  })

  it('elimina celdas según dificultad hard (≤50)', () => {
    const { fixed } = eliminarCeldas(solution, 'hard')
    const removed = fixed.flat().filter(v => !v).length
    expect(removed).toBeLessThanOrEqual(50)
    expect(removed).toBeGreaterThanOrEqual(44)
  })
})

describe('checkComplete', () => {
  it('retorna false si el tablero no coincide con la solución', () => {
    const solution = generarSudokuCompleto()
    const board = solution.map(r => [...r])
    board[0][0] = 0
    __setBoard(board)
    __setSolution(solution)
    expect(checkComplete()).toBe(false)
  })

  it('retorna true si el tablero coincide con la solución', () => {
    const solution = generarSudokuCompleto()
    const board = solution.map(r => [...r])
    __setBoard(board)
    __setSolution(solution)
    expect(checkComplete()).toBe(true)
  })
})
