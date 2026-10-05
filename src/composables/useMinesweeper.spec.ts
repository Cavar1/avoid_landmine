/**
 * 扫雷核心状态机单元测试：初始状态、翻开、插旗与胜负流程。
 */
import { describe, expect, it, vi } from 'vitest'
import type { Cell } from '@/types/game'
import { useMinesweeper } from '@/composables/useMinesweeper'

function findCell(board: Cell[][], predicate: (cell: Cell) => boolean): Cell {
  for (const rowCells of board) {
    for (const cell of rowCells) {
      if (predicate(cell)) return cell
    }
  }
  throw new Error('未找到符合条件的格子')
}

function revealedCountOf(board: Cell[][]): number {
  return board.flat().filter((cell) => cell.state === 'revealed').length
}

function mineCountOf(board: Cell[][]): number {
  return board.flat().filter((cell) => cell.isMine).length
}

describe('useMinesweeper 初始状态', () => {
  it('默认初级难度、idle 状态、剩余雷数等于总雷数', () => {
    const game = useMinesweeper()

    expect(game.status.value).toBe('idle')
    expect(game.difficultyId.value).toBe('beginner')
    expect(game.difficulty.value).toMatchObject({ rows: 9, cols: 9, mines: 10 })
    expect(game.board.value).toHaveLength(9)
    expect(game.board.value[0]).toHaveLength(9)
    expect(game.remainingMines.value).toBe(10)
    expect(game.isGameOver.value).toBe(false)
    expect(game.explodedAt.value).toBeNull()
    expect(revealedCountOf(game.board.value)).toBe(0)
    expect(mineCountOf(game.board.value)).toBe(0)
  })
})

describe('useMinesweeper 首次翻开', () => {
  it('首次翻开才布雷，并进入 playing', () => {
    const game = useMinesweeper()

    game.reveal(4, 4)

    expect(game.status.value).toBe('playing')
    expect(mineCountOf(game.board.value)).toBe(10)
    expect(game.board.value[4][4].state).toBe('revealed')
  })

  it('首击格必为 0 且其 8 邻域无雷', () => {
    const game = useMinesweeper()

    game.reveal(4, 4)

    expect(game.board.value[4][4].adjacentMines).toBe(0)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        expect(game.board.value[4 + dr][4 + dc].isMine).toBe(false)
      }
    }
  })

  it('onFirstReveal 只在首次翻开时触发一次', () => {
    const onFirstReveal = vi.fn()
    const game = useMinesweeper({ onFirstReveal })

    game.reveal(4, 4)
    expect(onFirstReveal).toHaveBeenCalledTimes(1)

    const safe = findCell(game.board.value, (cell) => !cell.isMine && cell.state === 'hidden')
    game.reveal(safe.row, safe.col)

    expect(onFirstReveal).toHaveBeenCalledTimes(1)
    expect(mineCountOf(game.board.value)).toBe(10)
  })
})

describe('useMinesweeper 插旗', () => {
  it('三态循环 hidden → flagged → questioned → hidden，并联动剩余雷数', () => {
    const onFlagToggle = vi.fn()
    const game = useMinesweeper({ onFlagToggle })

    game.toggleFlag(0, 0)
    expect(game.board.value[0][0].state).toBe('flagged')
    expect(game.remainingMines.value).toBe(9)

    game.toggleFlag(0, 0)
    expect(game.board.value[0][0].state).toBe('questioned')
    expect(game.remainingMines.value).toBe(10)

    game.toggleFlag(0, 0)
    expect(game.board.value[0][0].state).toBe('hidden')
    expect(game.remainingMines.value).toBe(10)

    // 每次状态变化都触发，参数表示变化后是否为旗
    expect(onFlagToggle).toHaveBeenCalledTimes(3)
    expect(onFlagToggle.mock.calls.map(([flagged]) => flagged)).toEqual([true, false, false])
  })

  it('插旗不会布雷，也不会离开 idle', () => {
    const game = useMinesweeper()

    game.toggleFlag(0, 0)

    expect(game.status.value).toBe('idle')
    expect(mineCountOf(game.board.value)).toBe(0)
  })

  it('已插旗的格子无法被左键翻开', () => {
    const game = useMinesweeper()

    game.toggleFlag(4, 4)
    game.reveal(4, 4)

    expect(game.board.value[4][4].state).toBe('flagged')
    expect(game.status.value).toBe('idle')
  })

  it('已翻开的格子无法插旗', () => {
    const game = useMinesweeper()

    game.reveal(4, 4)
    game.toggleFlag(4, 4)

    expect(game.board.value[4][4].state).toBe('revealed')
  })

  it('插旗数超过总雷数时剩余雷数可为负', () => {
    const game = useMinesweeper()

    let placed = 0
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 9; col++) {
        if (placed < 11) {
          game.toggleFlag(row, col)
          placed++
        }
      }
    }

    expect(game.remainingMines.value).toBe(-1)
  })
})

describe('useMinesweeper 失败', () => {
  it('踩雷后进入 lost，揭晓全部雷且只标记踩中的那一颗', () => {
    const onMineHit = vi.fn()
    const game = useMinesweeper({ onMineHit })

    game.reveal(4, 4)
    const mine = findCell(game.board.value, (cell) => cell.isMine)
    game.reveal(mine.row, mine.col)

    expect(game.status.value).toBe('lost')
    expect(game.isGameOver.value).toBe(true)
    expect(game.explodedAt.value).toEqual({ row: mine.row, col: mine.col })
    expect(onMineHit).toHaveBeenCalledTimes(1)

    const cells = game.board.value.flat()
    expect(cells.filter((cell) => cell.isMine && cell.state !== 'revealed')).toHaveLength(0)
    expect(cells.filter((cell) => cell.isExploded)).toHaveLength(1)
  })

  it('结束后左键与右键都不再产生任何变化', () => {
    const game = useMinesweeper()
    game.reveal(4, 4)
    const mine = findCell(game.board.value, (cell) => cell.isMine)
    game.reveal(mine.row, mine.col)

    const stateBefore = game.board.value[0][0].state
    game.toggleFlag(0, 0)
    expect(game.board.value[0][0].state).toBe(stateBefore)

    const revealedBefore = revealedCountOf(game.board.value)
    const hidden = findCell(game.board.value, (cell) => !cell.isMine && cell.state === 'hidden')
    game.reveal(hidden.row, hidden.col)
    expect(revealedCountOf(game.board.value)).toBe(revealedBefore)
  })
})

describe('useMinesweeper 胜利', () => {
  it('翻完所有非雷格后进入 won，且 onWin 只触发一次', () => {
    const onWin = vi.fn()
    const game = useMinesweeper({ onWin })

    game.reveal(0, 0)

    const { rows, cols } = game.difficulty.value
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!game.board.value[row][col].isMine) game.reveal(row, col)
      }
    }

    expect(game.status.value).toBe('won')
    expect(game.isGameOver.value).toBe(true)
    expect(onWin).toHaveBeenCalledTimes(1)
    expect(onWin).toHaveBeenCalledWith(game.difficulty.value)
  })
})

describe('useMinesweeper 重开与难度切换', () => {
  it('restart 清空棋盘并回到 idle', () => {
    const onRestart = vi.fn()
    const game = useMinesweeper({ onRestart })

    game.reveal(4, 4)
    game.toggleFlag(0, 0)
    game.restart()

    expect(game.status.value).toBe('idle')
    expect(game.difficultyId.value).toBe('beginner')
    expect(game.remainingMines.value).toBe(10)
    expect(game.explodedAt.value).toBeNull()
    expect(revealedCountOf(game.board.value)).toBe(0)
    expect(mineCountOf(game.board.value)).toBe(0)
    expect(onRestart).toHaveBeenCalledTimes(1)
  })

  it('切换难度后棋盘尺寸与雷数同步变化', () => {
    const game = useMinesweeper()

    game.restart('expert')

    expect(game.difficultyId.value).toBe('expert')
    expect(game.board.value).toHaveLength(16)
    expect(game.board.value[0]).toHaveLength(30)
    expect(game.remainingMines.value).toBe(99)

    game.restart('intermediate')
    expect(game.board.value).toHaveLength(16)
    expect(game.board.value[0]).toHaveLength(16)
    expect(game.remainingMines.value).toBe(40)
  })

  it('失败后可以重新开局', () => {
    const game = useMinesweeper()

    game.reveal(4, 4)
    const mine = findCell(game.board.value, (cell) => cell.isMine)
    game.reveal(mine.row, mine.col)
    expect(game.status.value).toBe('lost')

    game.restart()
    expect(game.status.value).toBe('idle')
    expect(revealedCountOf(game.board.value)).toBe(0)
  })
})
