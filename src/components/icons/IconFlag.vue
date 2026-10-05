<script setup lang="ts">
/**
 * 像素风旗帜图标，16×16 矢量网格。
 */
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
    <!-- 旗杆 -->
    <rect x="2" y="1" width="2" height="14" fill="var(--c-flag-ink, #1a1a1a)" />
    <!-- 旗面 -->
    <path fill="var(--c-flag, #d81b1b)" d="M4 1h9v2H4zm0 2h8v2H4zm0 2h6v2H4z" />
    <!-- 底座 -->
    <rect x="1" y="13" width="5" height="2" fill="var(--c-flag-ink, #1a1a1a)" />
  </svg>
</template>
