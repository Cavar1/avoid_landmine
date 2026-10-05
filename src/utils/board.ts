import type { Cell } from '@/types/game'

/**
 * 棋盘纯逻辑。本文件不依赖 Vue，全部为可单测的纯函数（就地修改传入的棋盘）。
 *
 * 约定：坐标越界一律安全忽略；调用方负责保证坐标合法。
 */

/** 8 邻域方向偏移 */
const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

/** 随机源；可注入固定序列以便测试复现 */
export type Rng = () => number

function cellKey(row: number, col: number): string {
  return `${row}:${col}`
}

/** 生成 rows × cols 的空棋盘：未布雷，相邻雷数为 0，状态全为 hidden */
export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  if (!Number.isInteger(rows) || rows <= 0) throw new RangeError(`rows 非法: ${rows}`)
  if (!Number.isInteger(cols) || cols <= 0) throw new RangeError(`cols 非法: ${cols}`)

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col): Cell => ({
      row,
      col,
      isMine: false,
      adjacentMines: 0,
      state: 'hidden',
      isExploded: false,
      isWrongFlag: false,
    })),
  )
}

/** 遍历 (row, col) 的 8 邻域（自动跳过越界） */
function forEachNeighbor(
  board: Cell[][],
  row: number,
  col: number,
  fn: (cell: Cell) => void,
): void {
  const rows = board.length
  const cols = board[0].length

  for (const [dr, dc] of DIRECTIONS) {
    const r = row + dr
    const c = col + dc
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      fn(board[r][c])
    }
  }
}

/** 收集所有不在 excluded 中的格子 */
function collectExcluding(board: Cell[][], excluded: ReadonlySet<string>): Cell[] {
  const out: Cell[] = []
  for (const rowCells of board) {
    for (const cell of rowCells) {
      if (!excluded.has(cellKey(cell.row, cell.col))) out.push(cell)
    }
  }
  return out
}

/** Fisher-Yates 洗牌 */
function shuffle<T>(items: T[], rng: Rng): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = items[i]
    items[i] = items[j]
    items[j] = tmp
  }
}

/**
 * 布雷。应在首次翻开时才调用，并传入首击坐标。
 *
 * 首选策略是排除首击格及其 8 邻域，保证首击必为 0（可直接连锁展开）；
 * 若棋盘太小导致可用格子不足，则退化为仅排除首击格；仍不足则抛错。
 */
export function placeMines(
  board: Cell[][],
  mineCount: number,
  safeRow: number,
  safeCol: number,
  rng: Rng = Math.random,
): void {
  const total = board.length * board[0].length

  if (!Number.isInteger(mineCount) || mineCount < 0) {
    throw new RangeError(`mineCount 非法: ${mineCount}`)
  }
  if (mineCount > total) {
    throw new RangeError(`雷数 ${mineCount} 超过格子总数 ${total}`)
  }

  const nearSafe = new Set<string>([cellKey(safeRow, safeCol)])
  forEachNeighbor(board, safeRow, safeCol, (cell) => nearSafe.add(cellKey(cell.row, cell.col)))

  let pool = collectExcluding(board, nearSafe)
  if (pool.length < mineCount) {
    pool = collectExcluding(board, new Set<string>([cellKey(safeRow, safeCol)]))
  }
  if (pool.length < mineCount) {
    throw new RangeError(`可用格子 ${pool.length} 不足以放置 ${mineCount} 颗雷`)
  }

  shuffle(pool, rng)
  for (let i = 0; i < mineCount; i++) {
    pool[i].isMine = true
  }
}

/** 就地计算每一格的相邻雷数（0~8），雷格自身也照常统计 */
export function calcAdjacentMines(board: Cell[][]): void {
  for (const rowCells of board) {
    for (const cell of rowCells) {
      let count = 0
      forEachNeighbor(board, cell.row, cell.col, (neighbor) => {
        if (neighbor.isMine) count++
      })
      cell.adjacentMines = count
    }
  }
}

/**
 * 从 (startRow, startCol) 开始翻开：迭代式（显式栈）展开相邻雷数为 0 的连通区域。
 *
 * - 已插旗的格子不会被翻开，也不会被越过；
 * - 问号格视为未标记，会被正常翻开；
 * - 雷格不会被翻开（踩雷由调用方单独处理）。
 */
export function floodReveal(board: Cell[][], startRow: number, startCol: number): void {
  const stack: Cell[] = [board[startRow][startCol]]

  while (stack.length > 0) {
    const cell = stack.pop() as Cell
    if (cell.state === 'revealed' || cell.state === 'flagged' || cell.isMine) continue

    cell.state = 'revealed'
    cell.isWrongFlag = false

    if (cell.adjacentMines === 0) {
      forEachNeighbor(board, cell.row, cell.col, (neighbor) => {
        if (neighbor.state === 'hidden' || neighbor.state === 'questioned') {
          stack.push(neighbor)
        }
      })
    }
  }
}

/**
 * 失败时揭晓全盘：所有雷置为已翻开（仅踩中的那颗标记 isExploded），
 * 非雷却插了旗的格子标记 isWrongFlag。
 */
export function revealAllMines(board: Cell[][], explodedRow: number, explodedCol: number): void {
  for (const rowCells of board) {
    for (const cell of rowCells) {
      if (cell.isMine) {
        cell.state = 'revealed'
        cell.isExploded = cell.row === explodedRow && cell.col === explodedCol
      } else if (cell.state === 'flagged') {
        cell.isWrongFlag = true
      }
    }
  }
}

/** 当前已插旗数量 */
export function countFlags(board: Cell[][]): number {
  let count = 0
  for (const rowCells of board) {
    for (const cell of rowCells) {
      if (cell.state === 'flagged') count++
    }
  }
  return count
}

/** 当前已翻开格子数量 */
export function countRevealed(board: Cell[][]): number {
  let count = 0
  for (const rowCells of board) {
    for (const cell of rowCells) {
      if (cell.state === 'revealed') count++
    }
  }
  return count
}

/** 胜利判定：所有非雷格都已翻开（雷格翻不翻开都不计数） */
export function checkWin(board: Cell[][], mineCount: number): boolean {
  let safeRevealed = 0
  for (const rowCells of board) {
    for (const cell of rowCells) {
      if (!cell.isMine && cell.state === 'revealed') safeRevealed++
    }
  }
  return safeRevealed === board.length * board[0].length - mineCount
}
