/**
 * localStorage 的安全封装。
 *
 * 隐私模式 / 存储被禁用 / 非浏览器环境下退化为内存 Map，
 * 读写失败一律静默处理，绝不因存储问题打断游戏。
 */

const memoryStore = new Map<string, string>()

function readRaw(key: string): string | null {
  try {
    const value = globalThis.localStorage?.getItem(key)
    if (typeof value === 'string') return value
  } catch {
    // 忽略：存储不可访问，回退到内存
  }
  return memoryStore.get(key) ?? null
}

function writeRaw(key: string, value: string): void {
  memoryStore.set(key, value)
  try {
    globalThis.localStorage?.setItem(key, value)
  } catch {
    // 忽略：内存中已保存
  }
}

/** 读取并解析 JSON；键不存在或内容损坏时返回 fallback */
export function readJson<T>(key: string, fallback: T): T {
  const raw = readRaw(key)
  if (raw === null) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** 序列化并写入 JSON */
export function writeJson(key: string, value: unknown): void {
  try {
    writeRaw(key, JSON.stringify(value))
  } catch {
    // 忽略：序列化失败（如循环引用）
  }
}