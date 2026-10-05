import { ref } from 'vue'
import type { BestRecords, DifficultyId } from '@/types/game'
import { DIFFICULTY_ORDER, STORAGE_KEYS } from '@/utils/constants'
import { readJson, writeJson } from '@/utils/storage'

function emptyRecords(): BestRecords {
  return { beginner: null, intermediate: null, expert: null }
}

/** 归一化：只接受有限的非负数字，其余一律视为无记录 */
function normalize(raw: unknown): BestRecords {
  const result = emptyRecords()
  if (typeof raw !== 'object' || raw === null) return result

  const source = raw as Record<string, unknown>
  for (const id of DIFFICULTY_ORDER) {
    const value = source[id]
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      result[id] = Math.floor(value)
    }
  }
  return result
}

/** 各难度最佳用时（秒）的读写与持久化 */
export function useRecords() {
  const records = ref<BestRecords>(normalize(readJson<unknown>(STORAGE_KEYS.records, null)))

  function bestTime(id: DifficultyId): number | null {
    return records.value[id]
  }

  /** 提交成绩；仅当优于已有记录时才更新并持久化，返回是否刷新了记录 */
  function submitTime(id: DifficultyId, seconds: number): boolean {
    if (!Number.isFinite(seconds) || seconds < 0) return false

    const current = records.value[id]
    if (current !== null && seconds >= current) return false

    records.value[id] = Math.floor(seconds)
    writeJson(STORAGE_KEYS.records, records.value)
    return true
  }

  function clearRecords(): void {
    records.value = emptyRecords()
    writeJson(STORAGE_KEYS.records, records.value)
  }

  return { records, bestTime, submitTime, clearRecords }
}
