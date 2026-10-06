/**
 * 英文（en-US）文案表。类型取自 zh-CN，缺 key / 多 key 都会被 pnpm typecheck 拦下。
 */
import type zhCN from './zh-CN'

const enUS: typeof zhCN = {
  app: {
    title: 'Minesweeper',
    description: 'A pixel-art minesweeper game that runs in your browser',
  },
  common: {
    confirm: 'OK',
    cancel: 'Cancel',
    close: 'Close',
    prompt: 'Notice',
  },
  header: {
    remainingMines: 'Remaining mines',
    gameTime: 'Elapsed time',
    restart: 'Restart, right-click to open options',
    restartHint: 'Left-click: restart · Right-click: options',
  },
  difficulty: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    expert: 'Expert',
  },
  theme: {
    classic: 'Classic',
    dark: 'Dark',
    vivid: 'Candy',
  },
  sound: {
    on: 'Sound: On',
    off: 'Sound: Off',
    enabled: 'Sound on',
    disabled: 'Sound off',
  },
  records: {
    label: 'Records',
    difficulty: 'Level',
    played: 'Played',
    wins: 'Won',
    losses: 'Lost',
    best: 'Best',
  },
  options: {
    title: 'Options',
    records: 'Records',
    newGame: 'New Game',
    settings: 'Settings',
    about: 'About',
  },
  newGame: {
    hint: 'Pick an option below to start a new game right away. Your current game will be abandoned.',
  },
  settings: {
    theme: 'Theme',
    sound: 'Sound',
    language: 'Language',
  },
  select: {
    difficulty: 'Select difficulty',
    theme: 'Select theme',
    language: 'Select language',
  },
  about: {
    gameplayTitle: 'How to play',
    gameplay:
      'Mines are hidden under the tiles. Take it one step at a time, use the clues from the safe areas to spot and avoid the mines, and clear every safe tile to win the game.',
    moreInfo: 'More information',
    sourceCode: 'Source code',
    author: 'Author',
  },
}

export default enUS
