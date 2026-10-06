<script setup lang="ts">
/**
 * 音效开关按钮：图标 + 开/关文字，点击即切换。
 */
import { useI18n } from 'vue-i18n'
import IconSoundOn from '@/components/icons/IconSoundOn.vue'
import IconSoundOff from '@/components/icons/IconSoundOff.vue'

defineProps<{
  enabled: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const { t } = useI18n()
</script>

<template>
  <button
    type="button"
    class="px-btn sound-toggle"
    role="switch"
    :aria-checked="enabled"
    :aria-label="enabled ? t('sound.enabled') : t('sound.disabled')"
    @click="emit('toggle')"
  >
    <IconSoundOn v-if="enabled" class="icon" />
    <IconSoundOff v-else class="icon" />
    <span>{{ enabled ? t('sound.on') : t('sound.off') }}</span>
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
