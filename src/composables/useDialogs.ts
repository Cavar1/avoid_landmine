/**
 * 弹窗管理：用模块级数组保存所有弹窗，支持命令式弹出多个。
 *
 * 文案字段一律存 **i18n key**（不是已翻译的字符串）：翻译推迟到 PxDialog 渲染时进行，
 * 这样弹窗开着的时候切换语言，标题与按钮也会实时更新。
 */
import { markRaw, ref } from 'vue'

/** 弹窗形态：询问（双按钮）/ 信息（单按钮） */
export type DialogKind = 'confirm' | 'info'

/** 内容组件类型：允许组件对象或异步组件 */
export type DialogComponent = object | Function

export interface DialogOptions {
  /** 标题的 i18n key，默认 'common.prompt' */
  titleKey?: string
  /** 形态，默认 info */
  kind?: DialogKind
  /** 确定按钮的 i18n key，默认 'common.confirm' */
  confirmKey?: string
  /** 取消按钮的 i18n key，默认 'common.cancel' */
  cancelKey?: string
  /** 内容区插入的组件（有默认插槽时以插槽为准） */
  comp?: DialogComponent | null
  /** 传给内容组件的 props */
  compProps?: Record<string, unknown>
  /** 是否允许通过遮罩 / × / ESC 关闭，默认 true */
  closable?: boolean
  /** 点确定时回调；返回 false 可阻止关闭（用于校验拦截） */
  onConfirm?: () => void | boolean
  /** 关闭（取消/遮罩/×/ESC）时回调 */
  onCancel?: () => void
}

export interface DialogItem {
  id: number
  titleKey: string
  kind: DialogKind
  confirmKey: string
  cancelKey: string
  comp: DialogComponent | null
  compProps: Record<string, unknown>
  closable: boolean
  zIndex: number
  onConfirm?: () => void | boolean
  onCancel?: () => void
}

/** 全局弹窗列表（模块级单例，所有调用方共享） */
const dialogs = ref<DialogItem[]>([])

let seed = 0
const Z_BASE = 1000

/** 从列表中移除并返回该弹窗（不触发任何回调） */
function remove(id: number): DialogItem | undefined {
  const index = dialogs.value.findIndex((item) => item.id === id)
  if (index === -1) return undefined
  return dialogs.value.splice(index, 1)[0]
}

/** 打开一个弹窗，返回其 id */
function open(options: DialogOptions = {}): number {
  const id = ++seed
  dialogs.value.push({
    id,
    titleKey: options.titleKey ?? 'common.prompt',
    kind: options.kind ?? 'info',
    confirmKey: options.confirmKey ?? 'common.confirm',
    cancelKey: options.cancelKey ?? 'common.cancel',
    // markRaw 避免组件对象被响应式深度代理
    comp: options.comp ? (markRaw(options.comp) as DialogComponent) : null,
    compProps: options.compProps ?? {},
    closable: options.closable ?? true,
    zIndex: Z_BASE + id, // 后开的盖在上面
    onConfirm: options.onConfirm,
    onCancel: options.onCancel,
  })
  return id
}

/** 关闭弹窗（走取消路径，触发 onCancel） */
function close(id: number): void {
  remove(id)?.onCancel?.()
}

/** 确认弹窗：执行 onConfirm，返回非 false 时才关闭 */
function confirm(id: number): void {
  const dialog = dialogs.value.find((item) => item.id === id)
  if (!dialog) return
  if (dialog.onConfirm?.() === false) return
  remove(id)
}

export function useDialogs() {
  return { dialogs, open, close, confirm }
}
