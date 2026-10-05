<script setup lang="ts">
/**
 * 战绩表：按难度列出开局次数、胜局、负局与最快用时。
 */
import type { GameRecords } from '@/types/game'
import { DIFFICULTY_ORDER, DIFFICULTIES } from '@/utils/constants'

defineProps<{
  records: GameRecords
}>()

function formatTime(t: number | null): string {
  if (t === null) return '---'
  const m = Math.floor(t / 60)
  const s = t % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
</script>

<template>
  <div class="record-list" aria-label="游戏记录">
    <div class="record-row head">
      <span class="cell label">难度</span>
      <span class="cell">次数</span>
      <span class="cell">胜</span>
      <span class="cell">负</span>
      <span class="cell">最快</span>
    </div>
    <div v-for="id in DIFFICULTY_ORDER" :key="id" class="record-row">
      <span class="cell label">{{ DIFFICULTIES[id].label }}</span>
      <span class="cell">{{ records[id].played }}</span>
      <span class="cell">{{ records[id].wins }}</span>
      <span class="cell">{{ records[id].losses }}</span>
      <span class="cell">{{ formatTime(records[id].bestTime) }}</span>
    </div>
  </div>
</template>

<style scoped>
.record-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: var(--fs-sm);
}

.record-row {
  display: grid;
  grid-template-columns: 1fr 44px 32px 32px 56px;
  gap: 8px;
  align-items: center;
}

.head {
  color: var(--c-text-dim);
}

.cell {
  color: var(--c-text);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.cell.label {
  text-align: left;
}

.head .cell {
  color: var(--c-text-dim);
}
</style>
