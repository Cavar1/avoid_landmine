<script setup lang="ts">
/**
 * 像素风胜利脸（胜利后），16×16 矢量网格。
 */
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <!-- 脸底色 -->
    <rect x="1" y="1" width="14" height="14" fill="var(--c-face, #ffd93b)" />
    <!-- 闭眼（倒 U） -->
    <rect x="3" y="5" width="4" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="9" y="5" width="4" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="4" y="6" width="2" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="10" y="6" width="2" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <!-- 大笑嘴巴 -->
    <rect x="3" y="9" width="10" height="3" fill="var(--c-face-ink, #1a1a1a)" />
    <!-- 牙齿 -->
    <rect x="5" y="10" width="6" height="1" fill="var(--c-mine-light, #f4f4f4)" />
  </svg>
</template>