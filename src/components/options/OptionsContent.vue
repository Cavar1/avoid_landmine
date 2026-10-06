<script setup lang="ts">
/**
 * 「选项」弹窗内容：按选项卡分「游戏记录 / 新游戏 / 设定与偏好 / 关于扫雷」四大分类。
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DifficultyId } from '@/types/game'
import { useRecords } from '@/composables/useRecords'
import { useSettings } from '@/composables/useSettings'
import TabStrip from './TabStrip.vue'
import GroupBox from './GroupBox.vue'
import RecordList from './RecordList.vue'
import DifficultySelect from './DifficultySelect.vue'
import ThemeSwitch from './ThemeSwitch.vue'
import SoundToggle from './SoundToggle.vue'
import LanguageSwitch from './LanguageSwitch.vue'
import IconMine from '@/components/icons/IconMine.vue'

const emit = defineEmits<{
  (e: 'newGame', id: DifficultyId): void
}>()

const { records } = useRecords()
const { theme, soundEnabled, locale, setTheme, toggleSound, setLocale } = useSettings()
const { t } = useI18n()

/** 四个大分类，标签名即原分组标题；随语言变化，故用 computed */
const TABS = computed(() => [
  { id: 'records', label: t('options.records') },
  { id: 'newgame', label: t('options.newGame') },
  { id: 'settings', label: t('options.settings') },
  { id: 'about', label: t('options.about') },
])

/** 英文文案更长，弹窗加宽，避免选项卡与战绩表被挤压 */
const isEnglish = computed(() => locale.value === 'en-US')

const active = ref('records')
</script>

<template>
  <div class="options" :class="{ 'options--en': isEnglish }">
    <TabStrip :tabs="TABS" :active="active" @select="active = $event" />

    <div class="tab-panel w95-tab-panel">
      <!-- 游戏记录 -->
      <section v-if="active === 'records'" role="tabpanel">
        <RecordList :records="records" />
      </section>

      <!-- 新游戏 -->
      <section v-else-if="active === 'newgame'" role="tabpanel">
        <p class="hint">{{ t('newGame.hint') }}</p>
        <DifficultySelect @select="emit('newGame', $event)" />
      </section>

      <!-- 设定与偏好 -->
      <section v-else-if="active === 'settings'" role="tabpanel">
        <GroupBox :title="t('settings.theme')">
          <ThemeSwitch :current="theme" @select="setTheme" />
        </GroupBox>
        <GroupBox class="sub" :title="t('settings.sound')">
          <SoundToggle :enabled="soundEnabled" @toggle="toggleSound" />
        </GroupBox>
        <GroupBox class="sub" :title="t('settings.language')">
          <LanguageSwitch :current="locale" @select="setLocale" />
        </GroupBox>
      </section>

      <!-- 关于扫雷 -->
      <section v-else role="tabpanel">
        <GroupBox :title="t('about.gameplayTitle')">
          <div class="gameplay">
            <IconMine class="gameplay-icon" />
            <p class="gameplay-text">{{ t('about.gameplay') }}</p>
          </div>
        </GroupBox>
        <GroupBox class="sub" :title="t('about.moreInfo')">
          <div class="info-item">
            <p class="info-title">{{ t('about.sourceCode') }}</p>
            <a
              class="info-link w95-link"
              href="https://github.com/Cavar1/minesweeper"
              target="_blank"
              rel="noopener"
            >
              https://github.com/Cavar1/minesweeper
            </a>
          </div>
          <div class="info-item">
            <p class="info-title">{{ t('about.author') }}</p>
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

/* 英文文案（Intermediate / New Game / Played…）更长，加宽避免选项卡与战绩表被挤压 */
.options--en {
  width: 420px;
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
