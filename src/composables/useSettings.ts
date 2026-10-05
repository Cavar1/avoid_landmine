import { computed, ref, watch } from 'vue'
import type { GameSettings, ThemeId } from '@/types/game'
import { DEFAULT_THEME, STORAGE_KEYS, THEME_ORDER } from '@/utils/constants'
import { readJson, writeJson } from '@/utils/storage'

const DEFAULT_SETTINGS: GameSettings = {
  theme: DEFAULT_THEME,
  soundEnabled: true,
}

/** 归一化：非法值一律回退到默认，避免损坏的存储把 UI 带崩 */
function normalize(raw: unknown): GameSettings {
  if (typeof raw !== 'object' || raw === null) return { ...DEFAULT_SETTINGS }

  const source = raw as Record<string, unknown>
  const theme = THEME_ORDER.includes(source.theme as ThemeId)
    ? (source.theme as ThemeId)
    : DEFAULT_SETTINGS.theme
  const soundEnabled =
    typeof source.soundEnabled === 'boolean' ? source.soundEnabled : DEFAULT_SETTINGS.soundEnabled

  return { theme, soundEnabled }
}

/**
 * 主题与音效开关的持久化设置。
 *
 * 本 composable 只管理状态，不触碰 DOM；
 * 把主题写到 <html data-theme> 由 UI 层（App.vue）负责。
 */
export function useSettings() {
  const settings = ref<GameSettings>(normalize(readJson<unknown>(STORAGE_KEYS.settings, null)))

  const theme = computed(() => settings.value.theme)
  const soundEnabled = computed(() => settings.value.soundEnabled)

  function setTheme(next: ThemeId): void {
    settings.value.theme = next
  }

  function setSoundEnabled(next: boolean): void {
    settings.value.soundEnabled = next
  }

  function toggleSound(): void {
    settings.value.soundEnabled = !settings.value.soundEnabled
  }

  // 任何字段变化即写入 localStorage
  watch(settings, (value) => writeJson(STORAGE_KEYS.settings, value), { deep: true })

  return { settings, theme, soundEnabled, setTheme, setSoundEnabled, toggleSound }
}
