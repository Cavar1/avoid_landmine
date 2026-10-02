/** 单元格状态：未翻开 / 已翻开 / 插旗 / 问号 */
export type CellState = 'hidden' | 'revealed' | 'flagged' | 'questioned'

/** 游戏整体状态 */
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

/** 难度标识 */
export type DifficultyId = 'beginner' | 'intermediate' | 'expert'

/** 主题标识 */
export type ThemeId = 'classic' | 'dark' | 'vivid'

/** 单个格子 */
export interface Cell {
  row: number
  col: number
  /** 是否为雷 */
  isMine: boolean
  /** 相邻 8 格的雷数，取值 0~8 */
  adjacentMines: number
  state: CellState
  /** 输掉时踩中的那一颗雷 */
  isExploded: boolean
  /** 输掉时插错的旗（非雷却被插旗） */
  isWrongFlag: boolean
}

/** 难度配置 */
export interface Difficulty {
  id: DifficultyId
  label: string
  rows: number
  cols: number
  mines: number
}

/** 各难度最佳用时（秒）；无记录为 null */
export type BestRecords = Record<DifficultyId, number | null>

/** 持久化设置 */
export interface GameSettings {
  theme: ThemeId
  soundEnabled: boolean
}