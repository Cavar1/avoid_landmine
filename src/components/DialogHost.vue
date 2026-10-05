<script setup lang="ts">
/**
 * 弹窗挂载点：渲染全局弹窗列表
 */
import { onBeforeUnmount, onMounted } from 'vue'
import PxDialog from './PxDialog.vue'
import { useDialogs } from '@/composables/useDialogs'

const { dialogs, close, confirm } = useDialogs()

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return
  // 只关闭最上层（数组末尾）且允许关闭的弹窗
  const top = dialogs.value[dialogs.value.length - 1]
  if (top?.closable) close(top.id)
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <PxDialog
    v-for="dialog in dialogs"
    :key="dialog.id"
    :title="dialog.title"
    :kind="dialog.kind"
    :confirm-text="dialog.confirmText"
    :cancel-text="dialog.cancelText"
    :comp="dialog.comp"
    :comp-props="dialog.compProps"
    :z-index="dialog.zIndex"
    :closable="dialog.closable"
    @confirm="confirm(dialog.id)"
    @cancel="close(dialog.id)"
  />
</template>