<script setup lang="ts">
/**
 * 胜负结算浮层：显示胜利/失败横幅并提示是否刷新纪录，提供再来一局按钮。
 */
import type { GameStatus } from '@/types/game'

defineProps<{
  status: GameStatus
  newRecord: boolean
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="status === 'won' || status === 'lost'"
      class="overlay"
      :class="status"
      role="dialog"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="panel px-frame">
        <h2 class="title">
          {{ status === 'won' ? 'YOU WIN!' : 'BOOM!' }}
        </h2>
        <p class="subtitle">
          {{ status === 'won' ? '踩完所有雷了' : '踩到雷了' }}
        </p>
        <p v-if="newRecord" class="new-record">🏆 新纪录！</p>
        <button class="px-btn" @click="emit('restart')">再来一局</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  user-select: none;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 40px;
  text-align: center;
  min-width: 240px;
}

.won .panel {
  --c-frame: #d4edda;
  --c-frame-light: #ffffff;
  --c-frame-dark: #16a34a;
  --c-text: #155724;
}

.lost .panel {
  --c-frame: #f8d7da;
  --c-frame-light: #ffffff;
  --c-frame-dark: #dc2626;
  --c-text: #721c24;
}

.title {
  margin: 0;
  font-size: var(--fs-lg);
  letter-spacing: 2px;
}

.subtitle {
  margin: 0;
  font-size: var(--fs-sm);
  opacity: 0.85;
}

.new-record {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--c-win);
  font-weight: bold;
}

.lost .new-record {
  color: var(--c-lose);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>