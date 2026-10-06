<script setup lang="ts">
/**
 * 页面装配：只保留游戏头部与棋盘，其余功能收进右键弹出的「选项」弹窗。
 */
import { computed, onMounted, watch } from 'vue'
import type { DifficultyId } from '@/types/game'
import { useMinesweeper } from '@/composables/useMinesweeper'
import { useTimer } from '@/composables/useTimer'
import { useSound } from '@/composables/useSound'
import { useRecords } from '@/composables/useRecords'
import { useSettings } from '@/composables/useSettings'
import { useDialogs } from '@/composables/useDialogs'
import GameBoard from '@/components/board/GameBoard.vue'
import GameHeader from '@/components/header/GameHeader.vue'
import DialogHost from '@/components/dialog/DialogHost.vue'
import OptionsContent from '@/components/options/OptionsContent.vue'

// ============================================================
// 组装核心 composables
// ============================================================

const settings = useSettings()
const records = useRecords()
const sound = useSound()
const timer = useTimer()

const game = useMinesweeper({
  onFirstReveal: (difficulty) => {
    timer.start()
    records.recordStart(difficulty.id)
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
    records.recordLoss(game.difficultyId.value)
  },
  onWin: (difficulty) => {
    timer.stop()
    sound.playWin()
    records.recordWin(difficulty.id, timer.seconds.value)
  },
  onRestart: () => {
    timer.reset()
  },
})

// ============================================================
// 「选项」弹窗
// ============================================================

const { open: openDialog, close: closeDialog } = useDialogs()

/** 当前「选项」弹窗 id，起新局时用于收起 */
let optionsDialogId: number | null = null

function handleOpenOptions(): void {
  optionsDialogId = openDialog({
    title: '选项',
    kind: 'info',
    confirmText: '关闭',
    comp: OptionsContent,
    compProps: { onNewGame: handleNewGame },
    onConfirm: () => {
      optionsDialogId = null
    },
    onCancel: () => {
      optionsDialogId = null
    },
  })
}

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

/** 选项弹窗里选了难度：立即开新局并收起弹窗 */
function handleNewGame(id: DifficultyId) {
  game.restart(id)
  if (optionsDialogId !== null) {
    closeDialog(optionsDialogId)
    optionsDialogId = null
  }
}

// ============================================================
// 主题与音效同步
// ============================================================

// 把 settings.theme 同步到 <html data-theme>
watch(
  () => settings.theme.value,
  (theme) => {
    document.documentElement.dataset.theme = theme
  },
  { immediate: true },
)

// 无论从哪里改 settings.soundEnabled，音效实例都跟着走
watch(
  () => settings.soundEnabled.value,
  (enabled) => {
    sound.enabled.value = enabled
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
    <div class="game-area">
      <!-- 头部：雷数 / 笑脸（左键重开 · 右键选项） / 计时 -->
      <GameHeader
        :remaining-mines="game.remainingMines.value"
        :elapsed-seconds="elapsedSeconds"
        :status="game.status.value"
        @restart="handleRestart"
        @options="handleOpenOptions"
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

    <!-- 全局弹窗挂载点 -->
    <DialogHost />
  </main>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  min-height: 100vh;
  user-select: none;
}

.game-area {
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
