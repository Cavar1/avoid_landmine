import { onScopeDispose, ref } from 'vue'
import { MAX_TIME } from '@/utils/constants'

/**
 * 秒级计时器。到达 MAX_TIME 后自动停表（与经典扫雷一致的 999 上限）。
 */
export function useTimer(intervalMs = 1000) {
  const seconds = ref(0)
  const running = ref(false)
  let handle: ReturnType<typeof setInterval> | null = null

  function clearHandle(): void {
    if (handle !== null) {
      clearInterval(handle)
      handle = null
    }
  }

  function stop(): void {
    clearHandle()
    running.value = false
  }

  /** 归零并开始计时 */
  function start(): void {
    clearHandle()
    seconds.value = 0
    running.value = true
    handle = setInterval(() => {
      if (seconds.value >= MAX_TIME) {
        stop()
        return
      }
      seconds.value++
    }, intervalMs)
  }

  /** 归零并停表 */
  function reset(): void {
    stop()
    seconds.value = 0
  }

  onScopeDispose(stop)

  return { seconds, running, start, stop, reset }
}
