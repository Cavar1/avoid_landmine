<script setup lang="ts">
import type { DifficultyId } from '@/types/game'
import { DIFFICULTY_ORDER, DIFFICULTIES } from '@/utils/constants'

defineProps<{
  current: DifficultyId
}>()

const emit = defineEmits<{
  (e: 'select', id: DifficultyId): void
}>()
</script>

<template>
  <div class="difficulty-select" role="group" aria-label="选择难度">
    <button
      v-for="id in DIFFICULTY_ORDER"
      :key="id"
      class="px-btn"
      :class="{ active: id === current }"
      :aria-pressed="id === current"
      @click="emit('select', id)"
    >
      {{ DIFFICULTIES[id].label }}
    </button>
  </div>
</template>

<style scoped>
.difficulty-select {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.px-btn.active {
  background-color: var(--c-accent);
  color: var(--c-accent-ink);
  border-color: var(--c-accent-ink) var(--c-accent-ink) var(--c-accent-ink) var(--c-accent-ink);
}
</style>