/**
 * 各难度战绩（开局次数 / 胜 / 负 / 最快用时）的读写与持久化。
 * 模块级单例：主界面与「选项」弹窗共享同一份数据。
 */
import { ref, watch } from 'vue'
import type { DifficultyId, DifficultyRecord, GameRecords } from '@/types/game'
import { DIFFICULTY_ORDER, STORAGE_KEYS } from '@/utils/constants'
import { readJson, writeJson } from '@/utils/storage'

function emptyRecord(): DifficultyRecord {
  return { played: 0, wins: 0, losses: 0, bestTime: null }
}

function emptyRecords(): GameRecords {
  return { beginner: emptyRecord(), intermediate: emptyRecord(), expert: emptyRecord() }
}

/** 非负整数计数；非法值一律回退 0 */
function toCount(raw: unknown): number {
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0
}

/** 归一化：结构损坏或字段非法时回退到空战绩 */
function normalize(raw: unknown): GameRecords {
  const result = emptyRecords()
  if (typeof raw !== 'object' || raw === null) return result

  const source = raw as Record<string, unknown>
  for (const id of DIFFICULTY_ORDER) {
    const value = source[id]
    if (typeof value !== 'object' || value === null) continue

    const item = value as Record<string, unknown>
    result[id] = {
      played: toCount(item.played),
      wins: toCount(item.wins),
      losses: toCount(item.losses),
      bestTime:
        typeof item.bestTime === 'number' && Number.isFinite(item.bestTime) && item.bestTime > 0
          ? Math.floor(item.bestTime)
          : null,
    }
  }
  return result
}

const records = ref<GameRecords>(normalize(readJson<unknown>(STORAGE_KEYS.records, null)))

// 任何字段变化即写入 localStorage
watch(records, (value) => writeJson(STORAGE_KEYS.records, value), { deep: true })

/** 首次翻开布雷：开局次数 +1 */
function recordStart(id: DifficultyId): void {
  records.value[id].played += 1
}

/** 胜利：胜局 +1，并在更快时刷新最快用时 */
function recordWin(id: DifficultyId, seconds: number): void {
  const item = records.value[id]
  item.wins += 1

  if (!Number.isFinite(seconds) || seconds <= 0) return
  const time = Math.floor(seconds)
  if (item.bestTime === null || time < item.bestTime) item.bestTime = time
}

/** 失败：负局 +1 */
function recordLoss(id: DifficultyId): void {
  records.value[id].losses += 1
}

function clearRecords(): void {
  records.value = emptyRecords()
}

export function useRecords() {
  return { records, recordStart, recordWin, recordLoss, clearRecords }
}