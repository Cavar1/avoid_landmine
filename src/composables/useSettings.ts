/**
 * 主题、音效开关与界面语言的持久化设置。
 * 模块级单例：主界面与「选项」弹窗共享同一份状态。
 * 本 composable 只管理状态，不触碰 DOM；主题写入 <html data-theme>、语言写入 i18n 与
 * 页面元信息均由 App.vue 负责。
 */
import { computed, ref, watch } from 'vue'
import type { GameSettings, LocaleId, ThemeId } from '@/types/game'
import { detectBrowserLocale } from '@/i18n'
import { DEFAULT_THEME, LOCALE_ORDER, STORAGE_KEYS, THEME_ORDER } from '@/utils/constants'
import { readJson, writeJson } from '@/utils/storage'

const DEFAULT_SETTINGS: GameSettings = {
  theme: DEFAULT_THEME,
  soundEnabled: true,
  locale: detectBrowserLocale(),
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
  const locale = LOCALE_ORDER.includes(source.locale as LocaleId)
    ? (source.locale as LocaleId)
    : DEFAULT_SETTINGS.locale

  return { theme, soundEnabled, locale }
}

const settings = ref<GameSettings>(normalize(readJson<unknown>(STORAGE_KEYS.settings, null)))

const theme = computed(() => settings.value.theme)
const soundEnabled = computed(() => settings.value.soundEnabled)
const locale = computed(() => settings.value.locale)

function setTheme(next: ThemeId): void {
  settings.value.theme = next
}

function setSoundEnabled(next: boolean): void {
  settings.value.soundEnabled = next
}

function toggleSound(): void {
  settings.value.soundEnabled = !settings.value.soundEnabled
}

function setLocale(next: LocaleId): void {
  settings.value.locale = next
}

// 任何字段变化即写入 localStorage
watch(settings, (value) => writeJson(STORAGE_KEYS.settings, value), { deep: true })

export function useSettings() {
  return {
    settings,
    theme,
    soundEnabled,
    locale,
    setTheme,
    setSoundEnabled,
    toggleSound,
    setLocale,
  }
}
