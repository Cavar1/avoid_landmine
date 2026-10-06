/**
 * 多语言装配：创建 vue-i18n 实例（中/英），默认语言跟随浏览器。
 */
import { createI18n } from 'vue-i18n'
import type { LocaleId } from '@/types/game'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

/** 依据浏览器语言推断默认语言：中文环境用中文，其余一律英文 */
export function detectBrowserLocale(): LocaleId {
  const lang = typeof navigator === 'undefined' ? '' : navigator.language
  return lang.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectBrowserLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})
