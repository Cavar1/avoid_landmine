<script setup lang="ts">
/**
 * 通用像素弹窗外壳：标题栏 + 可插组件的内容区 + 询问/信息两种按钮形态。
 */
import { computed, useSlots } from 'vue'

withDefaults(
  defineProps<{
    title: string
    /** confirm = 询问（取消 + 确定）；info = 信息（仅确定） */
    kind?: 'confirm' | 'info'
    confirmText?: string
    cancelText?: string
    /** 内容组件（无默认插槽时使用，配合命令式调用） */
    comp?: object | Function | string | null
    compProps?: Record<string, unknown>
    zIndex?: number
    /** 是否允许通过遮罩 / ESC 关闭 */
    closable?: boolean
  }>(),
  {
    kind: 'info',
    confirmText: '确定',
    cancelText: '取消',
    comp: null,
    compProps: () => ({}),
    zIndex: 1000,
    closable: true,
  },
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const slots = useSlots()
const hasSlot = computed(() => Boolean(slots.default))
</script>

<template>
  <Teleport to="body">
    <div class="mask" :style="{ zIndex }" @click.self="closable && emit('cancel')">
      <div class="panel px-frame" role="dialog" aria-modal="true">
        <!-- 标题栏 -->
        <div class="title-bar">
          <h3 class="title">{{ title }}</h3>
        </div>

        <!-- 内容空间：插槽优先，其次动态组件 -->
        <div class="body">
          <slot v-if="hasSlot" />
          <component :is="comp" v-else-if="comp" v-bind="compProps" />
        </div>

        <!-- 按钮区 -->
        <div class="footer">
          <slot name="footer">
            <button v-if="kind === 'confirm'" type="button" class="px-btn" @click="emit('cancel')">
              {{ cancelText }}
            </button>
            <button type="button" class="px-btn" @click="emit('confirm')">
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0);
  user-select: none;
}

/* 面板：随内容弹性伸缩，硬阴影黑块 */
.panel {
  display: flex;
  flex-direction: column;
  width: fit-content;
  min-width: 200px;
  max-width: min(90vw, 480px);
  max-height: 90vh;
  box-shadow: var(--shadow-dialog);
}

.title-bar {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background-color: var(--c-dialog-title-bg);
  color: var(--c-dialog-title-text);
}

.title {
  margin: 0;
  font-size: var(--fs-sm);
  letter-spacing: 1px;
}

.body {
  padding: 20px 16px;
  overflow: auto;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 16px 16px;
}
</style>
