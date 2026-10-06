<script setup lang="ts">
/**
 * 难度按钮组：点击即向上抛出所选难度（用于「新游戏」）。
 */
import type { DifficultyId } from '@/types/game'
import { DIFFICULTY_ORDER, DIFFICULTIES } from '@/utils/constants'

const emit = defineEmits<{
  (e: 'select', id: DifficultyId): void
}>()
</script>

<template>
  <div class="difficulty-select" role="group" aria-label="选择难度">
    <button
      v-for="id in DIFFICULTY_ORDER"
      :key="id"
      type="button"
      class="px-btn"
      @click="emit('select', id)"
    >
      {{ DIFFICULTIES[id].label }}
    </button>
  </div>
</template>

<style scoped>
.difficulty-select {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
