import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import preloadAssets from 'vite-plugin-preload-assets'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    preloadAssets({
      // 针对字体的预加载配置
      fontsToPreload: [
        { href: '/fonts/Monocraft-Bold-Italic.ttf' },
        { href: '/fonts/Monocraft-Bold.ttf' },
        { href: '/fonts/Monocraft-Italic.ttf' },
        { href: '/fonts/Monocraft-Light-Italic.ttf' },
        { href: '/fonts/Monocraft-Light.ttf' },
        { href: '/fonts/Monocraft.ttf' },
        { href: '/fonts/Press-Start-2P-latin-ext.woff2' },
        { href: '/fonts/Press-Start-2P-latin.woff2' },
        { href: '/fonts/unifont.otf' },
      ],
      preloadGoogleFonts: true,
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
})
