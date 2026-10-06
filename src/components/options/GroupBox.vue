<script setup lang="ts">
/**
 * 95 分组框：细边框 + 标题压在边框上（原生 fieldset/legend），内容走默认插槽。
 */
defineProps<{
  title: string
}>()
</script>

<template>
  <fieldset class="w95-group">
    <legend>{{ title }}</legend>
    <slot />
  </fieldset>
</template>