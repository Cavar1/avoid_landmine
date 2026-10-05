<script setup lang="ts">
/**
 * 主题切换按钮组。
 */
import type { ThemeId } from '@/types/game'
import { THEME_ORDER, THEME_LABELS } from '@/utils/constants'

defineProps<{
  current: ThemeId
}>()

const emit = defineEmits<{
  (e: 'select', theme: ThemeId): void
}>()
</script>

<template>
  <div class="theme-switch" role="group" aria-label="选择主题">
    <button
      v-for="theme in THEME_ORDER"
      :key="theme"
      class="px-btn theme-btn"
      :class="{ active: theme === current }"
      :aria-pressed="theme === current"
      @click="emit('select', theme)"
    >
      {{ THEME_LABELS[theme] }}
    </button>
  </div>
</template>

<style scoped>
.theme-switch {
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