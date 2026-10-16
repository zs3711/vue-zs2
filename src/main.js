import { createApp } from 'vue'
import { createPinia } from 'pinia'
// ✨ Element Plus：包体 + 样式 + 暗色主题 CSS
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// ✨ Element Plus 图标：全局注册
import * as ElIcons from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router/index.js'
import './style.css'

const app = createApp(App)

// ✨ Pinia（必须在 Element Plus 之前？不影响，只要在 router 之前即可）
const pinia = createPinia()
app.use(pinia)

// ✨ Element Plus 全局注册 + 中文语言包
app.use(ElementPlus, { locale: zhCn })

// ✨ 把所有图标注册为全局组件，模板里可直接用
for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component)
}

app.use(router)
app.mount('#app')
