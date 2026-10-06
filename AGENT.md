# AGENT.md — 认识这个项目

## 这是什么

**扫雷**：一个跑在浏览器里的经典扫雷游戏，**像素风 / Windows 95 复古外观**。纯前端单页应用，无后端、无数据库、无排行榜。

玩家看到的：一个 `GameHeader`（剩余雷数 · 笑脸 · 计时数码管）+ 一个棋盘。**左键笑脸重开，右键笑脸**弹出「选项」弹窗（游戏记录 / 新游戏 / 设定与偏好 / 关于扫雷四个选项卡）。

玩法规则（对齐经典 Windows 扫雷）：

- 三档难度：初级 9×9/10 雷、中级 16×16/40 雷、高级 16×30/99 雷。
- **首击必安全**：第一次翻开时才布雷，且排除首击格及其 8 邻域。
- 左键翻开；右键在 未翻开 → 插旗 → 问号 → 未翻开 之间循环。
- 剩余雷数 = 总雷数 − 已插旗数，**可为负**；计时上限 999 秒（到顶停表）。
- 胜负只由 header 表情与棋盘呈现，**不弹结算窗**。

## 快速开始

```bash
pnpm install
pnpm dev          # 开发服务器 http://localhost:5173
pnpm typecheck    # vue-tsc 类型检查
pnpm test         # vitest 跑纯逻辑单测
pnpm build        # 类型检查 + 构建到 dist/
pnpm format       # prettier 格式化
```

## 技术栈与关键决策

Vue 3.5 + TypeScript + Vite 8，pnpm 管理。**运行时依赖只有 vue 与 vue-i18n**。

| 决策   | 选择                                        | 原因                                 |
| ------ | ------------------------------------------- | ------------------------------------ |
| 语言   | TypeScript（`strict`）                      | 类型定义集中在 `src/types/game.ts`   |
| 样式   | 原生 CSS + CSS 变量，**无预处理器**         | 主题只需覆写同名变量                 |
| 图标   | **手写内联 SVG 组件**                       | 无图标库、无字体图标，纯 `path` 绘制 |
| 音频   | Web Audio API 实时合成                      | 不引入任何音频素材文件               |
| 持久化 | localStorage（`utils/storage.ts` 安全封装） | 不可用时静默退化为内存               |
| 弹窗   | 自研 `PxDialog` + `useDialogs` 命令式调用   | 统一像素风，避免第三方样式冲突       |
| 多语言 | **vue-i18n**（中 / 英，`legacy: false`）    | 文案集中管理，切换即时生效并持久化   |

**明确不做**：和弦操作（双击/中键快速展开）、自定义棋盘尺寸、联机/排行榜/用户系统、**任何 UI 组件库（Element Plus 等一律不引入，会破坏像素风）**。

## 目录结构

```
minesweeper/
├─ AGENT.md                        # 本文件
├─ index.html                      # 挂载点 + 像素字体 Press Start 2P
├─ vite.config.ts                  # 别名 @ → src
└─ src/
   ├─ main.ts                      # 入口：装 i18n，按序引入 variables → themes → base
   ├─ App.vue                      # 页面装配：header + board + DialogHost
   ├─ i18n/                        # 多语言：createI18n 实例与文案表
   │  ├─ index.ts                  # 实例装配 + detectBrowserLocale()
   │  └─ locales/                  # zh-CN.ts（兼作结构基准）/ en-US.ts
   ├─ types/game.ts                # Cell / GameStatus / Difficulty / GameRecords / ThemeId / LocaleId
   ├─ utils/
   │  ├─ constants.ts              # 难度表、主题/语言表、storage 键名、数字配色
   │  ├─ storage.ts                # localStorage 安全读写（readJson / writeJson）
   │  ├─ board.ts                  # 棋盘纯函数（布雷/邻雷计数/洪泛展开/胜负判定）
   │  └─ board.spec.ts             # 上述纯函数的单测
   ├─ composables/
   │  ├─ useMinesweeper.ts         # 核心状态机（+ useMinesweeper.spec.ts）
   │  ├─ useTimer.ts               # 计时器（999 上限）
   │  ├─ useSound.ts               # Web Audio 合成音效 + 静音开关
   │  ├─ useRecords.ts             # 战绩（开局/胜/负/最快）——模块级单例
   │  ├─ useSettings.ts            # 主题与音效开关——模块级单例
   │  └─ useDialogs.ts             # 弹窗数组管理（open / close / confirm）——模块级单例
   ├─ components/
   │  ├─ board/                    # 棋盘区域
   │  │  ├─ GameBoard.vue
   │  │  └─ CellTile.vue
   │  ├─ header/                   # 顶部信息栏 + 数码管（SVG 7 段）
   │  │  ├─ GameHeader.vue
   │  │  ├─ SevenSegmentCounter.vue
   │  │  └─ SevenSegmentDigit.vue
   │  ├─ dialog/                   # 通用弹窗外壳与挂载点
   │  │  ├─ PxDialog.vue
   │  │  └─ DialogHost.vue
   │  ├─ options/                  # 「选项」弹窗内容、95 基元与弹窗内控件
   │  │  ├─ OptionsContent.vue  TabStrip.vue  GroupBox.vue
   │  │  └─ RecordList.vue  DifficultySelect.vue  ThemeSwitch.vue  SoundToggle.vue
   │  └─ icons/                    # IconMine / IconFlag / IconQuestion /
   │                               # IconFaceSmile|Dead|Win / IconStopwatch / IconSoundOn|Off
   └─ styles/
      ├─ variables.css             # 调色板、字号(--fs-*)、边框宽、z-index 等变量
      ├─ themes.css                # classic / dark / vivid 三套主题覆写
      └─ base.css                  # reset + 像素渲染基线 + 公共基元
```

## 架构分层（改代码前先认层）

```
utils/board.ts  纯函数，零 Vue 依赖，可单测
      ↓
composables/    状态机与副作用，不写 DOM 结构
      ↓
components/     只做呈现，数据靠 props 进、事件靠 emit 出
      ↓
App.vue         装配层：接线、把 settings.theme 同步到 <html data-theme>
```

几条硬约定：

1. **棋盘逻辑一律写在 `utils/board.ts`**，保持纯函数、无 Vue 依赖，改完必须补/跑 `pnpm test`。
2. **逻辑层不认识表现层**：`useMinesweeper` 通过 `MinesweeperEvents` 回调（`onFirstReveal` / `onReveal` / `onFlagToggle` / `onMineHit` / `onWin` / `onRestart`）通知事件，音效、计时、战绩都在 `App.vue` 里接。
3. **跨组件共享的状态用模块级单例 composable**（`useRecords` / `useSettings` / `useDialogs` 都是把 `ref` 提到模块作用域再 `export function useXxx()` 返回）。新增这类共享状态时**照抄这个模式**，不要每次调用新建实例。
4. **composable 只管状态，不碰 DOM**（如 `useSettings` 不写 `data-theme`，由 `App.vue` 的 `watch` 负责）。
5. 弹窗用命令式：`useDialogs().open({ titleKey, kind, comp, compProps, onConfirm })`，组件对象会被 `markRaw` 包裹；`DialogHost` 在 `App.vue` 挂一次。
6. **弹窗文案传 i18n key 而不是译文**：`titleKey` / `confirmKey` / `cancelKey` 存进 `DialogItem`，由 `PxDialog` 在渲染时用 `t()` 解析。若在 `open()` 时就 `t()` 掉，拿到的是快照字符串，弹窗开着切语言不会实时更新。

## 开发规范

**命名与格式**（Prettier 已配置：无分号、单引号、`printWidth: 100`、尾逗号 all、LF）

- 组件文件 `PascalCase.vue`；composable `useXxx.ts`；工具函数文件小写。
- TS 缩进 2 空格；CSS 类名 kebab-case。
- `tsconfig` 开了 `noUnusedLocals` / `noUnusedParameters` / `verbatimModuleSyntax`——**类型导入必须写 `import type`**，不留未使用变量，否则 `pnpm typecheck` 直接失败。

**注释**

- 每个代码文件（`.ts` / `.vue`）**开头写块注释，一两句说清这个文件干什么**。
- 行内注释只解释「为什么」，不解释「是什么」。

**组件写法**（见 [GameHeader.vue](src/components/header/GameHeader.vue)、[TabStrip.vue](src/components/options/TabStrip.vue)）

- `<script setup lang="ts">` + 泛型 `defineProps<{...}>()` + 调用签名的 `defineEmits`。
- 呈现型组件保持"哑"：不自己读写全局状态，靠 props / emit。
- 无障碍属性顺手写：`role`、`aria-label`、`aria-selected`、`aria-pressed`。

**样式**

- 颜色、字号、边框宽**一律走 CSS 变量**，不要硬编码色值；新变量加在 `variables.css`，三套主题的差异在 `themes.css` 覆写。
- 主题切换靠 `<html data-theme="classic|dark|vivid">`。
- 像素风铁律：**直角（不用 `border-radius`）、整数像素尺寸、`image-rendering: pixelated`、不做过渡动画（`transition: none`）**。
- 3D 凹凸 = 2px/3px 边框 + 左上高光色 / 右下阴影色（`--c-*-light` / `--c-*-dark`）。
- 可复用基元写在 `base.css`：`.px-btn`、`.w95-group`、`.w95-tabs` / `.w95-tab` / `.w95-tab-panel`、`.w95-link`。组件私有样式放 `<style scoped>`。

**持久化**

- 只在 `utils/storage.ts` 读写，键名统一放在 `STORAGE_KEYS`（`utils/constants.ts`，**带版本号**，如 `minesweeper:records:v2`）。
- 从存储读回来的数据**必须先 `normalize`**，非法值静默回退默认，绝不因脏数据把 UI 带崩。

**多语言**

- 文案一律写进 `src/i18n/locales/`，组件里禁止再出现中英文字面量。
- `zh-CN.ts` 是消息结构基准，`en-US.ts` 用 `const enUS: typeof zhCN` 约束——**缺 key / 多 key 都由 `pnpm typecheck` 拦下**，无需额外测试。
- 组件内取文案用 `useI18n().t`；非组件处（如 `useDialogs`）用 `i18n.global.t`。
- `settings.locale` 是语言唯一真源（持久化在 `GameSettings`），`i18n.global.locale` / `<html lang>` / 页面标题都只是它的投影，由 `App.vue` 的 `watch` 同步。
- 语言名一律以母语书写（`LOCALE_LABELS`），不随当前语言翻译。
- 英文文案比中文长，新增/修改文案后要在英文下复查弹窗与棋盘**不破版**（`.options--en` 已为英文加宽弹窗）。

## 验证方式

1. `pnpm typecheck`、`pnpm test`、`pnpm build` 三项零报错。
2. 浏览器实测（`pnpm dev`）关键路径：三档难度切换、首击必安全、右键三态循环、踩雷翻开全部雷并锁定、胜利记录落盘、右键笑脸弹「选项」且四个选项卡切换不跳变、主题与音效即时生效、中英切换即时生效并持久化（含 `<html lang>` 与标签页标题）、窄屏不破版（高级难度可横向滚动）。
