/**
 * 全局类型定义：格子、游戏状态、难度、主题与持久化设置。
 */

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

/** 单档难度的战绩 */
export interface DifficultyRecord {
  /** 开局次数（含失败） */
  played: number
  /** 胜局数 */
  wins: number
  /** 负局数 */
  losses: number
  /** 最快用时（秒）；无记录为 null */
  bestTime: number | null
}

/** 各难度战绩 */
export type GameRecords = Record<DifficultyId, DifficultyRecord>

/** 持久化设置 */
export interface GameSettings {
  theme: ThemeId
  soundEnabled: boolean
}
