<script setup lang="ts">
/**
 * 单个棋盘格子：按状态渲染数字/旗/问号/雷，并对外抛出翻开与标记事件。
 */
import { computed } from 'vue'
import type { Cell } from '@/types/game'
import IconFlag from '@/components/icons/IconFlag.vue'
import IconQuestion from '@/components/icons/IconQuestion.vue'
import IconMine from '@/components/icons/IconMine.vue'

const props = defineProps<{
  cell: Cell
  isGameOver: boolean
}>()

const emit = defineEmits<{
  (e: 'reveal'): void
  (e: 'flag', event: MouseEvent): void
}>()

const numberColor = computed(() => {
  const { adjacentMines } = props.cell
  if (adjacentMines < 1 || adjacentMines > 8) return 'transparent'
  return `var(--c-${adjacentMines})`
})
</script>

<template>
  <button
    class="cell"
    :class="{
      revealed: cell.state === 'revealed',
      exploded: cell.isExploded,
      'wrong-flag': cell.isWrongFlag,
    }"
    :disabled="cell.state === 'revealed' || isGameOver"
    @click="emit('reveal')"
    @contextmenu.prevent="emit('flag', $event)"
    aria-label="游戏格子"
  >
    <!-- 插旗 -->
    <template v-if="cell.state === 'flagged'">
      <IconFlag class="icon" />
    </template>

    <!-- 问号 -->
    <template v-else-if="cell.state === 'questioned'">
      <IconQuestion class="icon" />
    </template>

    <!-- 已翻开 -->
    <template v-else-if="cell.state === 'revealed'">
      <template v-if="cell.isMine">
        <IconMine class="icon" />
      </template>
      <template v-else-if="cell.adjacentMines > 0">
        <span class="number" :style="{ color: numberColor }">
          {{ cell.adjacentMines }}
        </span>
      </template>
      <template v-else>
        <!-- 空白格不显示任何内容 -->
      </template>
    </template>

    <!-- 未翻开 -->
    <template v-else> </template>
  </button>
</template>

<style scoped>
.cell {
  width: var(--cell-size, 24px);
  height: var(--cell-size, 24px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-pixel);
  font-size: calc(var(--cell-size, 24px) * 0.6);
  line-height: 1;
  /* 未翻开：凸起硬边框 */
  background-color: var(--c-cell-up);
  border: var(--border-w, 3px) solid;
  border-color: var(--c-cell-up-light) var(--c-cell-up-dark) var(--c-cell-up-dark)
    var(--c-cell-up-light);
  padding: 0;
  transition: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.cell:disabled {
  cursor: default;
}

/* 已翻开（凹陷） */
.cell.revealed {
  background-color: var(--c-cell-down);
  border: var(--grid-line, 1px) solid var(--c-grid);
}

/* 爆炸格 */
.cell.exploded {
  background-color: var(--c-cell-explode);
}

/* 插错的旗 */
.cell.wrong-flag {
  background-color: var(--c-cell-wrong);
}

.number {
  font-weight: bold;
  font-size: calc(var(--cell-size, 24px) * 0.58);
  user-select: none;
}

.icon {
  width: calc(var(--cell-size, 24px) * 0.55);
  height: calc(var(--cell-size, 24px) * 0.55);
}

@media (hover: hover) {
  .cell:not(.revealed):not(:disabled):hover {
    background-color: var(--c-cell-hover);
  }
}
</style>
