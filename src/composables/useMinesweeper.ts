import { computed, ref } from 'vue'
import type { Cell, CellState, Difficulty, DifficultyId, GameStatus } from '@/types/game'
import { DEFAULT_DIFFICULTY, DIFFICULTIES } from '@/utils/constants'
import {
  calcAdjacentMines,
  checkWin,
  countFlags,
  createEmptyBoard,
  floodReveal,
  placeMines,
  revealAllMines,
} from '@/utils/board'

/**
 * 游戏事件回调：仅供 UI 层接入音效与动画。
 * 逻辑层不关心具体表现，因此以回调而非直接调用 useSound 解耦。
 */
export interface MinesweeperEvents {
  /** 首次翻开（此时棋盘刚完成布雷） */
  onFirstReveal?: (difficulty: Difficulty) => void
  /** 成功翻开若干非雷格 */
  onReveal?: () => void
  /** 右键标记状态变化，true 表示变化后是旗（否为问号或未标记） */
  onFlagToggle?: (flagged: boolean) => void
  /** 踩到雷 */
  onMineHit?: () => void
  /** 胜利 */
  onWin?: (difficulty: Difficulty) => void
  /** 重新开局（含切换难度） */
  onRestart?: () => void
}

function createBoard(id: DifficultyId): Cell[][] {
  const { rows, cols } = DIFFICULTIES[id]
  return createEmptyBoard(rows, cols)
}

/** 右键循环：未翻开 → 插旗 → 问号 → 未翻开 */
const FLAG_CYCLE: Readonly<Record<CellState, CellState>> = {
  hidden: 'flagged',
  flagged: 'questioned',
  questioned: 'hidden',
  revealed: 'revealed',
}

/**
 * 扫雷核心状态机。
 *
 * 时间轴：idle --首次翻开(布雷)--> playing --踩雷--> lost
 *                                       \--非雷格全部翻开--> won
 * 插旗不触发布雷，也不启动计时。
 */
export function useMinesweeper(events: MinesweeperEvents = {}) {
  const difficultyId = ref<DifficultyId>(DEFAULT_DIFFICULTY)
  const board = ref<Cell[][]>(createBoard(DEFAULT_DIFFICULTY))
  const status = ref<GameStatus>('idle')
  /** 是否已布雷：首个格子被翻开时才会布雷 */
  const minesPlaced = ref(false)
  /** 踩中的那一颗雷的坐标，用于高亮 */
  const explodedAt = ref<{ row: number; col: number } | null>(null)

  const difficulty = computed(() => DIFFICULTIES[difficultyId.value])
  const isGameOver = computed(() => status.value === 'won' || status.value === 'lost')
  /** 剩余雷数 = 总雷数 − 已插旗数，可为负数（插旗多于实际雷数时） */
  const remainingMines = computed(() => difficulty.value.mines - countFlags(board.value))

  /** 重开：不带参数则沿用当前难度 */
  function restart(id: DifficultyId = difficultyId.value): void {
    difficultyId.value = id
    board.value = createBoard(id)
    status.value = 'idle'
    minesPlaced.value = false
    explodedAt.value = null
    events.onRestart?.()
  }

  /** 左键翻开 */
  function reveal(row: number, col: number): void {
    if (isGameOver.value) return

    const cell = board.value[row][col]
    if (cell.state === 'revealed' || cell.state === 'flagged') return

    if (!minesPlaced.value) {
      placeMines(board.value, difficulty.value.mines, row, col)
      calcAdjacentMines(board.value)
      minesPlaced.value = true
      status.value = 'playing'
      events.onFirstReveal?.(difficulty.value)
    }

    // placeMines 就地修改同一批格子对象，cell 引用仍然有效
    if (cell.isMine) {
      explodedAt.value = { row, col }
      revealAllMines(board.value, row, col)
      status.value = 'lost'
      events.onMineHit?.()
      return
    }

    floodReveal(board.value, row, col)
    events.onReveal?.()

    if (checkWin(board.value, difficulty.value.mines)) {
      status.value = 'won'
      events.onWin?.(difficulty.value)
    }
  }

  /** 右键：插旗 / 问号 / 取消，三态循环 */
  function toggleFlag(row: number, col: number): void {
    if (isGameOver.value) return

    const cell = board.value[row][col]
    if (cell.state === 'revealed') return

    cell.state = FLAG_CYCLE[cell.state]
    events.onFlagToggle?.(cell.state === 'flagged')
  }

  return {
    board,
    status,
    difficulty,
    difficultyId,
    isGameOver,
    remainingMines,
    explodedAt,
    reveal,
    toggleFlag,
    restart,
  }
}