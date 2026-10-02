<script setup lang="ts">
/**
 * 像素风笑脸（游戏中/默认状态），16×16 矢量网格。
 */
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <!-- 脸底色 -->
    <rect x="1" y="1" width="14" height="14" fill="var(--c-face, #ffd93b)" />
    <!-- 眼睛 -->
    <rect x="4" y="5" width="2" height="2" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="10" y="5" width="2" height="2" fill="var(--c-face-ink, #1a1a1a)" />
    <!-- 嘴巴 -->
    <rect x="3" y="10" width="10" height="2" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="4" y="9" width="2" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="10" y="9" width="2" height="1" fill="var(--c-face-ink, #1a1a1a)" />
  </svg>
</template>