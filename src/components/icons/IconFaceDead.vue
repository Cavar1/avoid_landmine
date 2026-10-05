<script setup lang="ts">
/**
 * 像素风死亡脸（踩雷后），16×16 矢量网格。
 */
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <!-- 脸底色 -->
    <rect x="1" y="1" width="14" height="14" fill="var(--c-face, #ffd93b)" />
    <!-- 左 X -->
    <rect x="4" y="4" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="6" y="4" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="5" y="5" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="4" y="6" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="6" y="6" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <!-- 右 X -->
    <rect x="9" y="4" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="11" y="4" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="10" y="5" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="9" y="6" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="11" y="6" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <!-- 向下嘴巴 -->
    <rect x="4" y="10" width="8" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="3" y="11" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="12" y="11" width="1" height="1" fill="var(--c-face-ink, #1a1a1a)" />
  </svg>
</template>
