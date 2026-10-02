import { describe, expect, it } from 'vitest'
import type { Cell } from '@/types/game'
import {
  calcAdjacentMines,
  checkWin,
  countFlags,
  countRevealed,
  createEmptyBoard,
  floodReveal,
  placeMines,
  revealAllMines,
} from '@/utils/board'

/** 用字符画构造棋盘：'*' 为雷，其余为空格 */
function fromMap(lines: string[]): Cell[][] {
  const board = createEmptyBoard(lines.length, lines[0].length)
  lines.forEach((line, row) => {
    const chars = [...line]
    chars.forEach((ch, col) => {
      board[row][col].isMine = ch === '*'
    })
  })
  return board
}

/** 固定序列随机源，保证洗牌结果可复现 */
function seqRng(values: number[]): () => number {
  let i = 0
  return () => values[i++ % values.length]
}

/** 取出所有雷的坐标（排序后便于比较） */
function minesOf(board: Cell[][]): string[] {
  const out: string[] = []
  for (const rowCells of board) {
    for (const cell of rowCells) {
      if (cell.isMine) out.push(`${cell.row}:${cell.col}`)
    }
  }
  return out.sort()
}

function mineCountOf(board: Cell[][]): number {
  return minesOf(board).length
}

describe('createEmptyBoard', () => {
  it('按行列生成棋盘，初始值合法', () => {
    const board = createEmptyBoard(3, 4)

    expect(board).toHaveLength(3)
    expect(board[0]).toHaveLength(4)
    for (const rowCells of board) {
      for (const cell of rowCells) {
        expect(cell.isMine).toBe(false)
        expect(cell.adjacentMines).toBe(0)
        expect(cell.state).toBe('hidden')
        expect(cell.isExploded).toBe(false)
        expect(cell.isWrongFlag).toBe(false)
      }
    }
    // 坐标与自身位置一致
    expect(board[2][3].row).toBe(2)
    expect(board[2][3].col).toBe(3)
  })

  it('行列非法时抛错', () => {
    expect(() => createEmptyBoard(0, 5)).toThrow(RangeError)
    expect(() => createEmptyBoard(5, 0)).toThrow(RangeError)
    expect(() => createEmptyBoard(3.5, 5)).toThrow(RangeError)
  })
})

describe('placeMines', () => {
  it('放置的雷数正确', () => {
    const board = createEmptyBoard(9, 9)
    placeMines(board, 10, 4, 4)

    expect(mineCountOf(board)).toBe(10)
  })

  it('首击格及其 8 邻域始终无雷（随机多次）', () => {
    const [safeRow, safeCol] = [4, 4]

    for (let round = 0; round < 30; round++) {
      const board = createEmptyBoard(9, 9)
      placeMines(board, 10, safeRow, safeCol)

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          expect(board[safeRow + dr][safeCol + dc].isMine).toBe(false)
        }
      }
    }
  })

  it('边角首击同样安全（邻域自动裁剪越界）', () => {
    const board = createEmptyBoard(9, 9)
    placeMines(board, 10, 0, 0)

    expect(board[0][0].isMine).toBe(false)
    expect(board[0][1].isMine).toBe(false)
    expect(board[1][0].isMine).toBe(false)
    expect(board[1][1].isMine).toBe(false)
  })

  it('注入相同随机源时结果可复现', () => {
    const values = [0.11, 0.42, 0.73, 0.05, 0.99, 0.31, 0.6, 0.27]

    const a = createEmptyBoard(9, 9)
    placeMines(a, 10, 4, 4, seqRng(values))
    const b = createEmptyBoard(9, 9)
    placeMines(b, 10, 4, 4, seqRng(values))

    expect(minesOf(a)).toEqual(minesOf(b))
    expect(mineCountOf(a)).toBe(10)
  })

  it('棋盘过小时退化为仅排除首击格', () => {
    const board = createEmptyBoard(2, 2)
    // 2×2 全部 4 格都在首击邻域内，必须退化才能放下 3 颗雷
    placeMines(board, 3, 0, 0)

    expect(mineCountOf(board)).toBe(3)
    expect(board[0][0].isMine).toBe(false)
  })

  it('雷数非法或超出可用格子时抛错', () => {
    expect(() => placeMines(createEmptyBoard(3, 3), -1, 0, 0)).toThrow(RangeError)
    expect(() => placeMines(createEmptyBoard(3, 3), 2.5, 0, 0)).toThrow(RangeError)
    expect(() => placeMines(createEmptyBoard(2, 2), 5, 0, 0)).toThrow(RangeError)
    expect(() => placeMines(createEmptyBoard(1, 1), 1, 0, 0)).toThrow(RangeError)
  })

  it('零雷棋盘不会放置任何雷', () => {
    const board = createEmptyBoard(5, 5)
    placeMines(board, 0, 2, 2)

    expect(mineCountOf(board)).toBe(0)
  })
})

describe('calcAdjacentMines', () => {
  it('逐格统计 8 邻域雷数', () => {
    const board = fromMap(['*..', '...', '..*'])
    calcAdjacentMines(board)

    const numbers = board.map((rowCells) => rowCells.map((cell) => cell.adjacentMines))
    expect(numbers).toEqual([
      [0, 1, 0],
      [1, 2, 1],
      [0, 1, 0],
    ])
  })

  it('雷格自身也统计相邻雷数', () => {
    const board = fromMap(['**', '..'])
    calcAdjacentMines(board)

    expect(board[0][0].adjacentMines).toBe(1)
    expect(board[0][1].adjacentMines).toBe(1)
    expect(board[1][0].adjacentMines).toBe(2)
  })
})

describe('floodReveal', () => {
  it('全空棋盘一次翻开全部格子', () => {
    const board = fromMap(['...', '...', '...'])
    calcAdjacentMines(board)

    floodReveal(board, 1, 1)

    expect(countRevealed(board)).toBe(9)
  })

  it('非零格只翻开自身，不向外扩散', () => {
    const board = fromMap(['*..', '...'])
    calcAdjacentMines(board)

    floodReveal(board, 0, 1)

    expect(countRevealed(board)).toBe(1)
    expect(board[0][1].state).toBe('revealed')
  })

  it('不会翻开雷格', () => {
    const board = fromMap(['*.', '..'])
    calcAdjacentMines(board)

    floodReveal(board, 0, 1)

    expect(board[0][0].state).toBe('hidden')
    expect(board[0][0].isMine).toBe(true)
  })

  it('插旗的格子被跳过且不会被越过', () => {
    const board = fromMap(['...', '...', '...'])
    calcAdjacentMines(board)
    board[2][2].state = 'flagged'

    floodReveal(board, 0, 0)

    expect(board[2][2].state).toBe('flagged')
    expect(countRevealed(board)).toBe(8)
    expect(countFlags(board)).toBe(1)
  })

  it('问号格视为未标记，会被正常翻开', () => {
    const board = fromMap(['...', '...', '...'])
    calcAdjacentMines(board)
    board[2][2].state = 'questioned'

    floodReveal(board, 0, 0)

    expect(board[2][2].state).toBe('revealed')
    expect(countRevealed(board)).toBe(9)
  })

  it('重复调用是幂等的', () => {
    const board = fromMap(['...', '...', '...'])
    calcAdjacentMines(board)

    floodReveal(board, 0, 0)
    const first = countRevealed(board)
    floodReveal(board, 0, 0)

    expect(countRevealed(board)).toBe(first)
  })
})

describe('revealAllMines', () => {
  it('揭晓全部雷，只有踩中的那颗标记 isExploded', () => {
    const board = fromMap(['*.', '.*'])
    calcAdjacentMines(board)

    revealAllMines(board, 1, 1)

    expect(countRevealed(board)).toBe(2)
    expect(board[0][0].isExploded).toBe(false)
    expect(board[1][1].isExploded).toBe(true)
  })

  it('标记插错的旗，放过插对的旗', () => {
    const board = fromMap(['*.', '..'])
    calcAdjacentMines(board)
    board[0][0].state = 'flagged' // 插对
    board[1][1].state = 'flagged' // 插错

    revealAllMines(board, 0, 0)

    expect(board[0][0].isWrongFlag).toBe(false)
    expect(board[1][1].isWrongFlag).toBe(true)
  })
})

describe('checkWin', () => {
  it('非雷格全部翻开即胜利', () => {
    const board = fromMap(['*..', '...', '..*'])
    calcAdjacentMines(board)
    const mineCount = 2

    // 手动翻开 7 个非雷格中的 6 个 —— 差一格
    let revealed = 0
    for (const rowCells of board) {
      for (const cell of rowCells) {
        if (!cell.isMine && revealed < 6) {
          cell.state = 'revealed'
          revealed++
        }
      }
    }

    expect(checkWin(board, mineCount)).toBe(false)

    // 补上最后一格
    board[2][1].state = 'revealed'
    expect(checkWin(board, mineCount)).toBe(true)
  })

  it('雷被翻开也不影响判定（只数非雷格）', () => {
    const board = fromMap(['*', '.'])
    calcAdjacentMines(board)
    board[0][0].state = 'revealed'

    expect(checkWin(board, 1)).toBe(false)

    board[1][0].state = 'revealed'
    expect(checkWin(board, 1)).toBe(true)
  })
})