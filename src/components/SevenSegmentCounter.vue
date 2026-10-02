<script setup lang="ts">
/**
 * 三位数码管计数器。自动处理负数（显示负号）与超出范围（截断到 ±999）。
 */
import { computed } from 'vue'
import SevenSegmentDigit from './SevenSegmentDigit.vue'

const props = defineProps<{
  value: number
}>()

const clamped = computed(() => Math.max(-99, Math.min(999, props.value)))

const digits = computed(() => {
  const v = clamped.value
  const negative = v < 0
  const abs = Math.abs(v)
  const d1 = Math.floor(abs / 100)
  const d2 = Math.floor((abs % 100) / 10)
  const d3 = abs % 10

  if (negative) {
    return ['-' as const, d2, d3]
  }
  return [d1, d2, d3]
})
</script>

<template>
  <div class="counter" role="status" aria-live="polite" aria-atomic="true">
    <div class="digit-wrap" v-for="(d, i) in digits" :key="i">
      <SevenSegmentDigit :digit="d" />
    </div>
  </div>
</template>

<style scoped>
.counter {
  display: inline-flex;
  gap: 2px;
  padding: 4px;
  background-color: var(--c-display-bg);
  border: 2px solid;
  border-color: var(--c-display-off) var(--c-display-on) var(--c-display-on) var(--c-display-off);
  user-select: none;
}

.digit-wrap {
  width: 16px;
  height: 20px;
  flex-shrink: 0;
}
</style>