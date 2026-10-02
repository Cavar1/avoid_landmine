<script setup lang="ts">
/**
 * 像素风雷（炸弹）图标，16×16 矢量网格。
 * viewBox="0 0 16 16"，使用时通过 CSS 控制实际大小。
 */
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <!-- 十字刺 -->
    <path
      fill="var(--c-mine, #1a1a1a)"
      d="M7 0h2v3H7zM7 13h2v3H7zM0 7h3v2H0zM13 7h3v2h-3z"
    />
    <!-- 对角刺 -->
    <path
      fill="var(--c-mine, #1a1a1a)"
      d="M2.5 2.5L4 4 2.8 5.2 1.3 3.7zM11 11l1.5 1.5-1.5 1.5-1.5-1.5zM14 2.5L12.5 4 13.7 5.2 15.2 3.7zM5 11l-1.5 1.5 1.5 1.5 1.5-1.5z"
    />
    <!-- 雷主体 -->
    <rect x="4" y="4" width="8" height="8" fill="var(--c-mine, #1a1a1a)" />
    <!-- 高光 -->
    <rect x="5" y="5" width="2" height="2" fill="var(--c-mine-light, #f4f4f4)" />
  </svg>
</template>