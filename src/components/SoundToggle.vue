<script setup lang="ts">
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
    class="px-btn sound-toggle"
    :aria-pressed="enabled"
    :aria-label="enabled ? '音效开启' : '音效关闭'"
    @click="emit('toggle')"
  >
    <IconSoundOn v-if="enabled" />
    <IconSoundOff v-else />
  </button>
</template>

<style scoped>
.sound-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>