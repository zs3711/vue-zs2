import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  // GitHub Pages 子路径部署时使用 base
  // 开发环境、相对路径部署、或后续替换为你的仓库名均可
  // 部署到 https://<user>.github.io/<repo>/ 时改成 '/<repo>/'
  base: process.env.GITHUB_PAGES_BASE || './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
