<script setup lang="ts">
/**
 * 像素风计时器图标，16×16 矢量网格。
 */
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <!-- 表盘 -->
    <rect
      x="4"
      y="3"
      width="8"
      height="10"
      rx="0"
      fill="none"
      stroke="var(--c-text, #1a1a1a)"
      stroke-width="1.5"
    />
    <!-- 表冠 -->
    <rect x="7" y="0" width="2" height="2" fill="var(--c-text, #1a1a1a)" />
    <!-- 中心圆 -->
    <rect x="7" y="7" width="2" height="2" fill="var(--c-text, #1a1a1a)" />
    <!-- 指针 -->
    <rect x="8" y="5" width="1.5" height="4" fill="var(--c-text, #1a1a1a)" />
  </svg>
</template>
