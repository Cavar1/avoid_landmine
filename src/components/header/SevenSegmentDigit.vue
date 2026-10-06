<script setup lang="ts">
/**
 * 7 段数码管单个数字。纯 SVG path，支持 0~9 与负号。
 * 用 active/inactive 两套 path 的透明度切换，避免整段重绘。
 */
import { computed } from 'vue'

const SEGMENTS = {
  a: 'M2 0h10l2 2-2 2H4L2 2z', // 上横
  b: 'M12 3l2-2v6l-2 2V5z', // 右上
  c: 'M12 11l2-2v6l-2 2v-4z', // 右下
  d: 'M2 18h10l2-2-2-2H4l-2 2z', // 下横
  e: 'M2 11l-2-2v6l2 2v-4z', // 左下
  f: 'M2 3l-2-2v6l2 2V5z', // 左上
  g: 'M4 8h8l2 1-2 1H4l-2-1z', // 中横
} as const

type SegKey = keyof typeof SEGMENTS

const DIGIT_SEGMENTS: Readonly<Record<number, readonly SegKey[]>> = {
  0: ['a', 'b', 'c', 'd', 'e', 'f'],
  1: ['b', 'c'],
  2: ['a', 'b', 'g', 'e', 'd'],
  3: ['a', 'b', 'c', 'd', 'g'],
  4: ['f', 'g', 'b', 'c'],
  5: ['a', 'f', 'g', 'c', 'd'],
  6: ['a', 'f', 'g', 'e', 'c', 'd'],
  7: ['a', 'b', 'c'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  9: ['a', 'b', 'c', 'd', 'f', 'g'],
}

const MINUS_SEGMENTS: readonly SegKey[] = ['g']

const props = defineProps<{
  digit: number | '-'
}>()

const segments = computed<readonly SegKey[]>(() => {
  if (props.digit === '-') return MINUS_SEGMENTS
  return DIGIT_SEGMENTS[props.digit]
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20" class="seven-seg" aria-hidden="true">
    <g v-for="(path, key) in SEGMENTS" :key="key">
      <path
        :d="path"
        fill="var(--c-display-on, #ff2d2d)"
        :opacity="segments.includes(key) ? 1 : 0.06"
      />
      <path
        :d="path"
        fill="var(--c-display-off, #3a0d0d)"
        :opacity="segments.includes(key) ? 0 : 1"
      />
    </g>
  </svg>
</template>

<style scoped>
.seven-seg {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}
</style>
