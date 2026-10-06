<script setup lang="ts">
/**
 * 战绩表：按难度列出开局次数、胜局、负局与最快用时。
 */
import { useI18n } from 'vue-i18n'
import type { GameRecords } from '@/types/game'
import { DIFFICULTY_ORDER } from '@/utils/constants'

defineProps<{
  records: GameRecords
}>()

const { t } = useI18n()

/** 秒数格式化为 mm:ss，无记录显示 --- */
function formatTime(seconds: number | null): string {
  if (seconds === null) return '---'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
</script>

<template>
  <div class="record-list" :aria-label="t('records.label')">
    <div class="record-row head">
      <span class="cell label">{{ t('records.difficulty') }}</span>
      <span class="cell">{{ t('records.played') }}</span>
      <span class="cell">{{ t('records.wins') }}</span>
      <span class="cell">{{ t('records.losses') }}</span>
      <span class="cell">{{ t('records.best') }}</span>
    </div>
    <div v-for="id in DIFFICULTY_ORDER" :key="id" class="record-row">
      <span class="cell label">{{ t(`difficulty.${id}`) }}</span>
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
  /* 数字列按英文表头（Played / Won / Lost / Best）宽度预留，中文更宽松 */
  grid-template-columns: 1fr 64px 40px 40px 60px;
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
