<script setup lang="ts">
/**
 * 像素风胜利脸（胜利后），16×16 矢量网格。
 */
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <!-- 脸底色 -->
    <rect x="1" y="1" width="14" height="14" fill="var(--c-face, #ffd93b)" />
    <!-- 墨镜 -->
    <rect x="0" y="6" width="16" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="1" y="5" width="6" height="4" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="9" y="5" width="6" height="4" fill="var(--c-face-ink, #1a1a1a)" />
    <path d="M4 5h3v2h-1v-1h-2z" fill="var(--c-face-light, #f4f4f4)" />
    <path d="M12 5h3v2h-1v-1h-2z" fill="var(--c-face-light, #f4f4f4)" />
    <!-- 嘴巴 -->
    <rect x="4" y="11" width="8" height="2" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="11" y="10" width="2" height="2" fill="var(--c-face-ink, #1a1a1a)" />
  </svg>
</template>
