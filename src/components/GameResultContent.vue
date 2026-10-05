<script setup lang="ts">
/**
 * 胜负结算内容：显示结算副标题与是否刷新纪录，插入弹窗内容区。
 */
defineProps<{
  status: 'won' | 'lost'
  newRecord: boolean
}>()
</script>

<template>
  <div class="result" :class="status">
    <p class="subtitle">{{ status === 'won' ? '踩完所有雷了' : '踩到雷了' }}</p>
    <p v-if="newRecord" class="new-record">🏆 新纪录！</p>
  </div>
</template>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.subtitle {
  margin: 0;
  font-size: var(--fs-sm);
  opacity: 0.85;
}

.new-record {
  margin: 0;
  font-size: var(--fs-sm);
  font-weight: bold;
  color: var(--c-win);
}

.result.lost .new-record {
  color: var(--c-lose);
}
</style>
