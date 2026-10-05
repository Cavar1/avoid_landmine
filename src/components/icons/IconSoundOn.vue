<script setup lang="ts">
/**
 * 像素风音量开启图标，16×16 矢量网格。
 */
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <!-- 喇叭身 -->
    <path fill="var(--c-text, #1a1a1a)" d="M3 5h3v6H3zM6 3h2v10H6z" />
    <!-- 喇叭口 -->
    <path
      fill="var(--c-text, #1a1a1a)"
      d="M8 1h2v2H8zm2 2h2v2h-2zm2 2h1v6h-1zm-1 6h2v2h-2zm-2 2h2v2H8z"
    />
    <!-- 声波 -->
    <rect x="13" y="4" width="1" height="2" fill="var(--c-text, #1a1a1a)" />
    <rect x="14" y="3" width="1" height="4" fill="var(--c-text, #1a1a1a)" />
    <rect x="13" y="10" width="1" height="2" fill="var(--c-text, #1a1a1a)" />
    <rect x="14" y="9" width="1" height="4" fill="var(--c-text, #1a1a1a)" />
  </svg>
</template>
