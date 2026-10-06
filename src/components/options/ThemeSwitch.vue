<script setup lang="ts">
/**
 * 主题切换按钮组。
 */
import { useI18n } from 'vue-i18n'
import type { ThemeId } from '@/types/game'
import { THEME_ORDER } from '@/utils/constants'

defineProps<{
  current: ThemeId
}>()

const emit = defineEmits<{
  (e: 'select', theme: ThemeId): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="theme-switch" role="group" :aria-label="t('select.theme')">
    <button
      v-for="theme in THEME_ORDER"
      :key="theme"
      class="px-btn theme-btn"
      :class="{ active: theme === current }"
      :aria-pressed="theme === current"
      @click="emit('select', theme)"
    >
      {{ t(`theme.${theme}`) }}
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
}
</style>
