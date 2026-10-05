<script setup lang="ts">
/**
 * 记录列表：展示三档难度各自的最佳用时。
 */
import type { BestRecords } from '@/types/game'
import { DIFFICULTY_ORDER, DIFFICULTIES } from '@/utils/constants'

defineProps<{
  records: BestRecords
}>()

function formatTime(t: number | null): string {
  if (t === null) return '---'
  const m = Math.floor(t / 60)
  const s = t % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
</script>

<template>
  <div class="record-list" aria-label="最佳记录">
    <div
      v-for="id in DIFFICULTY_ORDER"
      :key="id"
      class="record-row"
    >
      <span class="label">{{ DIFFICULTIES[id].label }}</span>
      <span class="time">{{ formatTime(records[id]) }}</span>
    </div>
  </div>
</template>

<style scoped>
.record-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--panel-pad, 8px);
  background-color: var(--c-frame);
  border: var(--border-w, 3px) solid;
  border-color: var(--c-frame-light) var(--c-frame-dark) var(--c-frame-dark) var(--c-frame-light);
}

.record-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: var(--fs-sm);
}

.label {
  color: var(--c-text-dim);
}

.time {
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
}
</style>