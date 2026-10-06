<script setup lang="ts">
/**
 * 难度按钮组：点击即向上抛出所选难度（用于「新游戏」）。
 */
import { useI18n } from 'vue-i18n'
import type { DifficultyId } from '@/types/game'
import { DIFFICULTY_ORDER } from '@/utils/constants'

const emit = defineEmits<{
  (e: 'select', id: DifficultyId): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="difficulty-select" role="group" :aria-label="t('select.difficulty')">
    <button
      v-for="id in DIFFICULTY_ORDER"
      :key="id"
      type="button"
      class="px-btn"
      @click="emit('select', id)"
    >
      {{ t(`difficulty.${id}`) }}
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
