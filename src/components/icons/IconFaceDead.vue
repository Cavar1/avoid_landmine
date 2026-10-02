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
    <path
      fill="var(--c-face-ink, #1a1a1a)"
      d="M3 4h2v1H3zm1 1h1v1H4zm1 1h1v1H5zm-1 1h1v1H4zm-1-2h1v1H3z"
    />
    <!-- 右 X -->
    <path
      fill="var(--c-face-ink, #1a1a1a)"
      d="M11 4h2v1h-2zm1 1h1v1h-1zm1 1h1v1h-1zm-1 1h1v1h-1zm-1-2h1v1h-1z"
    />
    <!-- 向下嘴巴 -->
    <rect x="4" y="11" width="8" height="2" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="5" y="10" width="2" height="1" fill="var(--c-face-ink, #1a1a1a)" />
    <rect x="9" y="10" width="2" height="1" fill="var(--c-face-ink, #1a1a1a)" />
  </svg>
</template>