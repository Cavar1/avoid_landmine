<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { DifficultyId } from '@/types/game'
import { useMinesweeper } from '@/composables/useMinesweeper'
import { useTimer } from '@/composables/useTimer'
import { useSound } from '@/composables/useSound'
import { useRecords } from '@/composables/useRecords'
import { useSettings } from '@/composables/useSettings'
import GameBoard from '@/components/GameBoard.vue'
import GameHeader from '@/components/GameHeader.vue'
import DifficultySelect from '@/components/DifficultySelect.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import SoundToggle from '@/components/SoundToggle.vue'
import RecordList from '@/components/RecordList.vue'
import DialogHost from '@/components/DialogHost.vue'
import GameResultContent from '@/components/GameResultContent.vue'
import { useDialogs } from '@/composables/useDialogs'

// ============================================================
// 组装核心 composables
// ============================================================

const settings = useSettings()
const records = useRecords()
const sound = useSound()
const timer = useTimer()

const game = useMinesweeper({
  onFirstReveal: () => {
    timer.start()
  },
  onReveal: () => {
    sound.playReveal()
  },
  onFlagToggle: () => {
    sound.playFlag()
  },
  onMineHit: () => {
    timer.stop()
    sound.playMineHit()
  },
  onWin: (difficulty) => {
    timer.stop()
    sound.playWin()
    // 提交成绩
    const elapsed = timer.seconds.value
    if (elapsed > 0) {
      const isNew = records.submitTime(difficulty.id, elapsed)
      if (isNew) newRecord.value = true
    }
  },
  onRestart: () => {
    timer.reset()
    newRecord.value = false
  },
})

// ============================================================
// 局部状态
// ============================================================

const newRecord = ref(false)
const { open: openDialog, close: closeDialog } = useDialogs()

/** 当前结算弹窗 id，重开时用于自动收起 */
let resultDialogId: number | null = null

// ============================================================
// 计算属性
// ============================================================

const isGameOver = computed(() => game.isGameOver.value)
const elapsedSeconds = computed(() => timer.seconds.value)

// ============================================================
// 事件处理
// ============================================================

function handleReveal(row: number, col: number) {
  game.reveal(row, col)
}

function handleFlag(row: number, col: number) {
  game.toggleFlag(row, col)
}

function handleRestart() {
  game.restart()
}

function handleDifficultySelect(id: DifficultyId) {
  game.restart(id)
}

function handleThemeSelect(theme: typeof settings.settings.value.theme) {
  settings.setTheme(theme)
}

function handleSoundToggle() {
  settings.toggleSound()
  sound.enabled.value = settings.settings.value.soundEnabled
}

// ============================================================
// 结算弹窗：胜负状态变化时弹出，重开时自动收起
// ============================================================

watch(
  () => game.status.value,
  (status) => {
    if (status === 'won' || status === 'lost') {
      const snapshot = { status, newRecord: newRecord.value }
      resultDialogId = openDialog({
        title: status === 'won' ? 'YOU WIN!' : 'BOOM!',
        kind: 'info',
        confirmText: '再来一局',
        closable: false,
        comp: GameResultContent,
        compProps: snapshot,
        onConfirm: handleRestart,
      })
    } else if (resultDialogId !== null) {
      closeDialog(resultDialogId)
      resultDialogId = null
    }
  },
)

// ============================================================
// 主题应用：把 settings.theme 同步到 <html data-theme>
// ============================================================

watch(
  () => settings.theme.value,
  (theme) => {
    document.documentElement.dataset.theme = theme
  },
  { immediate: true },
)

onMounted(() => {
  // 解锁 AudioContext（浏览器自动播放策略要求首次在用户手势后调用）
  sound.unlock()
})
</script>

<template>
  <main class="shell">
    <!-- 标题 -->
    <header class="page-header">
      <h1 class="title">AVOID LANDMINE</h1>
      <p class="subtitle">扫 雷</p>
    </header>

    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <DifficultySelect :current="game.difficultyId.value" @select="handleDifficultySelect" />
      <div class="toolbar-right">
        <ThemeSwitch :current="settings.theme.value" @select="handleThemeSelect" />
        <SoundToggle :enabled="settings.soundEnabled.value" @toggle="handleSoundToggle" />
      </div>
    </div>

    <!-- 游戏主体区域 -->
    <div class="game-area">
      <!-- 头部：雷数 / 笑脸 / 计时 -->
      <GameHeader
        :remaining-mines="game.remainingMines.value"
        :elapsed-seconds="elapsedSeconds"
        :status="game.status.value"
        @restart="handleRestart"
      />

      <!-- 棋盘 -->
      <div class="board-wrap" @click="sound.unlock()">
        <GameBoard
          :board="game.board.value"
          :is-game-over="isGameOver"
          @reveal="handleReveal"
          @flag="handleFlag"
        />
      </div>
    </div>

    <!-- 最佳记录 -->
    <RecordList :records="records.records.value" />

    <!-- 全局弹窗挂载点 -->
    <DialogHost />
  </main>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  min-height: 100vh;
  user-select: none;
}

/* 标题 */
.page-header {
  text-align: center;
  user-select: none;
}

.page-header .title {
  margin: 0;
  font-size: var(--fs-lg);
  letter-spacing: 3px;
  color: var(--c-text-invert);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
}

.page-header .subtitle {
  margin: 6px 0 0;
  font-size: var(--fs-sm);
  letter-spacing: 10px;
  color: var(--c-text-invert);
  opacity: 0.85;
}

/* 工具栏 */
.toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 480px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 游戏主体 */
.game-area {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.board-wrap {
  overflow-x: auto;
  max-width: 100vw;
  padding-top: 4px;
}

/* 棋盘滚动条像素化 */
.board-wrap::-webkit-scrollbar {
  height: 8px;
}

.board-wrap::-webkit-scrollbar-track {
  background: var(--c-cell-down);
}

.board-wrap::-webkit-scrollbar-thumb {
  background: var(--c-cell-up-dark);
  border: 1px solid var(--c-cell-up);
}
</style>