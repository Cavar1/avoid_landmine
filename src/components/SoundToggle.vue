<script setup lang="ts">
/**
 * 音效开关按钮：图标 + 开/关文字，点击即切换。
 */
import IconSoundOn from './icons/IconSoundOn.vue'
import IconSoundOff from './icons/IconSoundOff.vue'

defineProps<{
  enabled: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
  <button
    type="button"
    class="px-btn sound-toggle"
    role="switch"
    :aria-checked="enabled"
    :aria-label="enabled ? '音效开启' : '音效关闭'"
    @click="emit('toggle')"
  >
    <IconSoundOn v-if="enabled" class="icon" />
    <IconSoundOff v-else class="icon" />
    <span>音效：{{ enabled ? '开' : '关' }}</span>
  </button>
</template>

<style scoped>
.sound-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.icon {
  width: 16px;
  height: 16px;
}
</style>