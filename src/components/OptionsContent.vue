<script setup lang="ts">
/**
 * 「选项」弹窗内容：按选项卡分「游戏记录 / 新游戏 / 设定与偏好 / 关于扫雷」四大分类。
 */
import { ref } from 'vue'
import type { DifficultyId } from '@/types/game'
import { useRecords } from '@/composables/useRecords'
import { useSettings } from '@/composables/useSettings'
import TabStrip from './TabStrip.vue'
import GroupBox from './GroupBox.vue'
import RecordList from './RecordList.vue'
import DifficultySelect from './DifficultySelect.vue'
import ThemeSwitch from './ThemeSwitch.vue'
import SoundToggle from './SoundToggle.vue'
import IconMine from './icons/IconMine.vue'

const emit = defineEmits<{
  (e: 'newGame', id: DifficultyId): void
}>()

const { records } = useRecords()
const { theme, soundEnabled, setTheme, toggleSound } = useSettings()

/** 四个大分类，标签名即原分组标题 */
const TABS: readonly { id: string; label: string }[] = [
  { id: 'records', label: '游戏记录' },
  { id: 'newgame', label: '新游戏' },
  { id: 'settings', label: '设定与偏好' },
  { id: 'about', label: '关于扫雷' },
]

const active = ref('records')

const GAMEPLAY =
  '格子下面埋设了不少地雷，走一步看一步，利用安全区的线索，识破并绕开那些可怕的地雷，直到排除所有安全区，即可赢得游戏胜利。'
</script>

<template>
  <div class="options">
    <TabStrip :tabs="TABS" :active="active" @select="active = $event" />

    <div class="tab-panel w95-tab-panel">
      <!-- 游戏记录 -->
      <section v-if="active === 'records'" role="tabpanel">
        <RecordList :records="records" />
      </section>

      <!-- 新游戏 -->
      <section v-else-if="active === 'newgame'" role="tabpanel">
        <p class="hint">点击以下选项，将立即开启新游戏，并放弃本局游戏。</p>
        <DifficultySelect @select="emit('newGame', $event)" />
      </section>

      <!-- 设定与偏好 -->
      <section v-else-if="active === 'settings'" role="tabpanel">
        <GroupBox title="主题">
          <ThemeSwitch :current="theme" @select="setTheme" />
        </GroupBox>
        <GroupBox class="sub" title="声音">
          <SoundToggle :enabled="soundEnabled" @toggle="toggleSound" />
        </GroupBox>
      </section>

      <!-- 关于扫雷 -->
      <section v-else role="tabpanel">
        <GroupBox title="玩法">
          <div class="gameplay">
            <IconMine class="gameplay-icon" />
            <p class="gameplay-text">{{ GAMEPLAY }}</p>
          </div>
        </GroupBox>
        <GroupBox class="sub" title="更多信息">
          <div class="info-item">
            <p class="info-title">扫雷的源代码</p>
            <p class="info-link w95-link--disabled">（暂未提供）</p>
          </div>
          <div class="info-item">
            <p class="info-title">作者</p>
            <a class="info-link w95-link" href="https://cavar.dev" target="_blank" rel="noopener">
              https://cavar.dev
            </a>
          </div>
        </GroupBox>
      </section>
    </div>
  </div>
</template>

<style scoped>
.options {
  display: flex;
  flex-direction: column;
  width: 320px;
}

/* 内容面板固定最小高度：切换标签时弹窗不跳变 */
.tab-panel {
  min-height: 200px;
}

.sub {
  margin-top: 8px;
}

/* 新游戏 */
.hint {
  margin: 0 0 10px;
  font-size: var(--fs-sm);
  line-height: 1.6;
}

/* 玩法 */
.gameplay {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.gameplay-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.gameplay-text {
  margin: 0;
  font-size: var(--fs-sm);
  line-height: 1.6;
}

/* 更多信息 */
.info-item + .info-item {
  margin-top: 10px;
}

.info-title,
.info-link {
  margin: 0;
  font-size: var(--fs-sm);
  line-height: 1.6;
}

.info-link {
  display: inline-block;
  font-size: var(--fs-xs);
}
</style>
