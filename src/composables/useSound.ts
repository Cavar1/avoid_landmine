import { ref } from 'vue'

/** 单个音符的描述 */
interface ToneSpec {
  freq: number
  /** 相对于当前时刻的延迟（秒） */
  delay: number
  /** 持续时长（秒） */
  duration: number
  type?: OscillatorType
  /** 峰值音量 0~1 */
  peak?: number
}

/**
 * 用 Web Audio API 实时合成音效，不依赖任何音频素材（保持项目零二进制资源）。
 *
 * 浏览器自动播放策略要求首次播放必须发生在用户手势之后；
 * 所有播放入口都由点击/按键触发，因此无需额外解锁流程（unlock 仅作保险）。
 * 任何环节失败都会静默降级为无声，不影响游戏。
 */
export function useSound() {
  const enabled = ref(true)
  let ctx: AudioContext | null = null

  function context(): AudioContext | null {
    if (typeof window === 'undefined') return null

    if (ctx) {
      if (ctx.state === 'suspended') void ctx.resume()
      return ctx
    }

    const Ctor = window.AudioContext
    if (!Ctor) return null

    try {
      ctx = new Ctor()
      return ctx
    } catch {
      return null
    }
  }

  /** 一个带指数衰减包络的方波/锯齿音符 */
  function tone({ freq, delay, duration, type = 'square', peak = 0.07 }: ToneSpec): void {
    const audio = context()
    if (!audio) return

    const at = audio.currentTime + delay
    const osc = audio.createOscillator()
    const gain = audio.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, at)
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.linearRampToValueAtTime(peak, at + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration)

    osc.connect(gain).connect(audio.destination)
    osc.start(at)
    osc.stop(at + duration + 0.02)
  }

  /** 低通滤波的白噪声爆裂声 */
  function noiseBurst(duration: number, peak: number): void {
    const audio = context()
    if (!audio) return

    const frames = Math.floor(audio.sampleRate * duration)
    const buffer = audio.createBuffer(1, frames, audio.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1

    const source = audio.createBufferSource()
    source.buffer = buffer

    const filter = audio.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1400, audio.currentTime)
    filter.frequency.exponentialRampToValueAtTime(120, audio.currentTime + duration)

    const gain = audio.createGain()
    gain.gain.setValueAtTime(peak, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration)

    source.connect(filter).connect(gain).connect(audio.destination)
    source.start()
  }

  /** 翻开格子：短促 tick */
  function playReveal(): void {
    if (!enabled.value) return
    tone({ freq: 880, delay: 0, duration: 0.05, peak: 0.05 })
  }

  /** 插旗 / 取消旗：双音 blip */
  function playFlag(): void {
    if (!enabled.value) return
    tone({ freq: 1046, delay: 0, duration: 0.045, peak: 0.06 })
    tone({ freq: 1397, delay: 0.05, duration: 0.055, peak: 0.06 })
  }

  /** 踩雷：噪声爆裂 + 低频下坠 */
  function playMineHit(): void {
    if (!enabled.value) return
    noiseBurst(0.4, 0.28)
    tone({ freq: 72, delay: 0, duration: 0.42, type: 'sawtooth', peak: 0.16 })
  }

  /** 胜利：上行琶音 */
  function playWin(): void {
    if (!enabled.value) return
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, index) => {
      tone({ freq, delay: index * 0.11, duration: 0.16, peak: 0.06 })
    })
  }

  /** 首次用户手势时调用，提前创建 AudioContext（可选） */
  function unlock(): void {
    context()
  }

  return { enabled, playReveal, playFlag, playMineHit, playWin, unlock }
}
