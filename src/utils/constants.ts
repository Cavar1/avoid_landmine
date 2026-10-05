/**
 * 全局常量：难度配置、主题表、计时上限、存储键名与数字配色。
 */
import type { Difficulty, DifficultyId, ThemeId } from '@/types/game'

/** 三档难度（对齐经典 Windows 扫雷） */
export const DIFFICULTIES: Readonly<Record<DifficultyId, Difficulty>> = {
  beginner: { id: 'beginner', label: '初级', rows: 9, cols: 9, mines: 10 },
  intermediate: { id: 'intermediate', label: '中级', rows: 16, cols: 16, mines: 40 },
  expert: { id: 'expert', label: '高级', rows: 16, cols: 30, mines: 99 },
}

/** 难度展示顺序 */
export const DIFFICULTY_ORDER: readonly DifficultyId[] = ['beginner', 'intermediate', 'expert']

export const DEFAULT_DIFFICULTY: DifficultyId = 'beginner'

/** 主题展示顺序 */
export const THEME_ORDER: readonly ThemeId[] = ['classic', 'dark', 'vivid']

export const THEME_LABELS: Readonly<Record<ThemeId, string>> = {
  classic: '经典',
  dark: '暗夜',
  vivid: '糖果',
}

export const DEFAULT_THEME: ThemeId = 'classic'

/** 计时器与数码管上限（超过后停表，与经典行为一致） */
export const MAX_TIME = 999

/** localStorage 键名，带版本号便于将来迁移 */
export const STORAGE_KEYS = {
  records: 'minesweeper:records:v1',
  settings: 'minesweeper:settings:v1',
} as const

/** 1~8 的经典数字配色，映射到 CSS 变量 */
export const NUMBER_COLORS: Readonly<Record<number, string>> = {
  1: 'var(--c-1)',
  2: 'var(--c-2)',
  3: 'var(--c-3)',
  4: 'var(--c-4)',
  5: 'var(--c-5)',
  6: 'var(--c-6)',
  7: 'var(--c-7)',
  8: 'var(--c-8)',
}