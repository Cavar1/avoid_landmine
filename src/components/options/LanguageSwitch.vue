<script setup lang="ts">
/**
 * 语言切换按钮组：显示各语言的母语名，点击抛出新语言。
 */
import { useI18n } from 'vue-i18n'
import type { LocaleId } from '@/types/game'
import { LOCALE_ORDER, LOCALE_LABELS } from '@/utils/constants'

defineProps<{
  current: LocaleId
}>()

const emit = defineEmits<{
  (e: 'select', locale: LocaleId): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="language-switch" role="group" :aria-label="t('select.language')">
    <button
      v-for="locale in LOCALE_ORDER"
      :key="locale"
      class="px-btn language-btn"
      :class="{ active: locale === current }"
      :aria-pressed="locale === current"
      @click="emit('select', locale)"
    >
      {{ LOCALE_LABELS[locale] }}
    </button>
  </div>
</template>

<style scoped>
.language-switch {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.px-btn.active {
  background-color: var(--c-accent);
  color: var(--c-accent-ink);
}
</style>
