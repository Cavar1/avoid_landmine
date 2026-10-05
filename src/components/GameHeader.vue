<script setup lang="ts">
/**
 * 顶部信息栏：剩余雷数、笑脸重开按钮与计时数码管。
 */
import { computed } from 'vue'
import type { GameStatus } from '@/types/game'
import IconFaceSmile from './icons/IconFaceSmile.vue'
import IconFaceDead from './icons/IconFaceDead.vue'
import IconFaceWin from './icons/IconFaceWin.vue'
import SevenSegmentCounter from './SevenSegmentCounter.vue'

const props = defineProps<{
  remainingMines: number
  elapsedSeconds: number
  status: GameStatus
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()

const statusIcon = computed(() => {
  if (props.status === 'lost') return 'dead'
  if (props.status === 'won') return 'win'
  return 'smile'
})
</script>

<template>
  <header class="header" role="banner">
    <!-- 剩余雷数 -->
    <div class="counter-cell" aria-label="剩余雷数">
      <SevenSegmentCounter :value="remainingMines" />
    </div>

    <!-- 笑脸重开按钮 -->
    <button
      class="face-btn"
      :class="{ dead: status === 'lost', win: status === 'won' }"
      @click="emit('restart')"
      aria-label="重新开始"
      title="重新开始"
    >
      <template v-if="statusIcon === 'smile'"><IconFaceSmile /></template>
      <template v-else-if="statusIcon === 'dead'"><IconFaceDead /></template>
      <template v-else><IconFaceWin /></template>
    </button>

    <!-- 计时器 -->
    <div class="counter-cell" aria-label="游戏时间">
      <SevenSegmentCounter :value="elapsedSeconds" />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: var(--panel-pad, 8px) var(--panel-pad, 8px);
  background-color: var(--c-frame);
  border: var(--border-w, 3px) solid;
  border-color: var(--c-frame-light) var(--c-frame-dark) var(--c-frame-dark) var(--c-frame-light);
}

.counter-cell {
  flex-shrink: 0;
}

.face-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--c-cell-up);
  border: var(--border-w, 3px) solid;
  border-color: var(--c-cell-up-light) var(--c-cell-up-dark) var(--c-cell-up-dark) var(--c-cell-up-light);
  padding: 4px;
  cursor: pointer;
  transition: none;
  flex-shrink: 0;
}

.face-btn:hover {
  background-color: var(--c-cell-hover);
}

.face-btn:active {
  background-color: var(--c-cell-press);
  border-color: var(--c-cell-up-dark) var(--c-cell-up-light) var(--c-cell-up-light) var(--c-cell-up-dark);
  padding: 6px 2px 2px 6px;
}

.face-btn svg {
  width: 100%;
  height: 100%;
}
</style>