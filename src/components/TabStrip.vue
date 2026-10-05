<script setup lang="ts">
/**
 * 95 选项卡条：渲染一排标签按钮，点击抛出新选项（内容面板由使用方渲染）。
 */
defineProps<{
  tabs: readonly { id: string; label: string }[]
  active: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()
</script>

<template>
  <div class="w95-tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="w95-tab"
      role="tab"
      :aria-selected="tab.id === active"
      @click="emit('select', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
