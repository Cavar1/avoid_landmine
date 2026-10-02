<script setup lang="ts">
import type { Cell } from '@/types/game'
import CellTile from './CellTile.vue'

const props = defineProps<{
  board: Cell[][]
  isGameOver: boolean
}>()

const emit = defineEmits<{
  (e: 'reveal', row: number, col: number): void
  (e: 'flag', row: number, col: number): void
}>()
</script>

<template>
  <div
    class="board-wrap"
    role="grid"
    aria-label="扫雷棋盘"
  >
    <div
      v-for="(row, r) in board"
      :key="r"
      class="board-row"
      role="row"
    >
      <CellTile
        v-for="(cell, c) in row"
        :key="c"
        :cell="cell"
        :is-game-over="isGameOver"
        @reveal="emit('reveal', r, c)"
        @flag="emit('flag', r, c)"
      />
    </div>
  </div>
</template>

<style scoped>
.board-wrap {
  display: inline-flex;
  flex-direction: column;
  user-select: none;
  /* 内嵌凹陷边框 */
  border: var(--border-w, 3px) solid;
  border-color: var(--c-cell-up-dark) var(--c-cell-up-light) var(--c-cell-up-light) var(--c-cell-up-dark);
}

.board-row {
  display: flex;
}
</style>