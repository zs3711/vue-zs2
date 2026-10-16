<template>
  <el-container class="app-wrapper">
    <!-- ✨ ElHeader：Element Plus 布局组件 -->
    <el-header class="app-header">
      <div class="header-inner">
        <!-- 品牌 Logo -->
        <div class="brand">
          <el-icon class="brand-logo"><Platform /></el-icon>
          <span class="brand-text">Vue Lab</span>
        </div>

        <!-- ✨ ElMenu：Element Plus 菜单组件，替代原生导航 -->
        <el-menu
          class="nav-menu"
          mode="horizontal"
          :default-active="activeMenu"
          router
          :ellipsis="false"
          background-color="transparent"
          text-color="#6b7280"
          active-text-color="#6366f1"
        >
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon><span>个人主页</span>
          </el-menu-item>
          <el-menu-item index="/about">
            <el-icon><Reading /></el-icon><span>关于我</span>
          </el-menu-item>
          <el-menu-item index="/project/list">
            <el-icon><Briefcase /></el-icon><span>项目中心</span>
          </el-menu-item>
          <el-menu-item index="/article/list">
            <el-icon><Document /></el-icon><span>文章中心</span>
          </el-menu-item>
          <el-menu-item index="/admin/info">
            <el-icon><Setting /></el-icon><span>后台管理</span>
          </el-menu-item>
        </el-menu>

        <!-- 右侧：登录状态 + 主题切换 -->
        <div class="header-right">
          <template v-if="userStore.loggedIn">
            <el-tooltip :content="userStore.displayName" placement="bottom">
              <el-tag type="primary" effect="dark" round class="user-chip">
                <el-icon><User /></el-icon>
                {{ userStore.displayName }}
              </el-tag>
            </el-tooltip>
          </template>
          <el-button v-else type="primary" size="small" round :icon="Lock" @click="goLogin">登录</el-button>

          <!-- ✨ 主题切换：同时控制 Element Plus html.dark 和自定义 body.dark-mode -->
          <el-tooltip :content="isDark ? '切换到亮色' : '切换到暗色'" placement="bottom">
            <el-button
              :icon="isDark ? Sunny : Moon"
              circle
              @click="toggleTheme"
              class="theme-btn"
            />
          </el-tooltip>
        </div>
      </div>
    </el-header>

    <!-- ✨ ElMain：Element Plus 主内容区 -->
    <el-main class="app-main">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </el-main>

    <!-- ✨ ElFooter：Element Plus 页脚 -->
    <el-footer class="app-footer">
      <div class="footer-inner">
        <span class="footer-bar"></span>
        <p>©2026 Vue3 + Pinia + Element Plus · 组件化开发实验</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from './stores/userStore.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 当前激活的菜单项
const activeMenu = computed(() => {
  // 给 ElMenu 的 default-active，需要匹配 index
  const { path, name } = route
  if (path.startsWith('/home')) return '/home'
  if (path.startsWith('/about')) return '/about'
  if (path.startsWith('/project')) return '/project/list'
  if (path.startsWith('/article')) return '/article/list'
  if (path.startsWith('/admin')) return '/admin/info'
  return path
})

const goLogin = () => {
  router.push({ name: 'login' })
}

// ===== 主题切换：同时控制 Element Plus 和自定义 CSS =====
// Element Plus 用 html.dark，自定义 CSS 用 body.dark-mode
// 两者必须同步切换
const isDark = ref(false)
const updateFromDom = () => {
  isDark.value = document.documentElement.classList.contains('dark') ||
                 document.body.classList.contains('dark-mode')
}
let observer = null
onMounted(() => {
  updateFromDom()
  // 持久化：恢复上次主题
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' && !isDark.value) {
    applyTheme(true)
  }
  observer = new MutationObserver(updateFromDom)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
})
onUnmounted(() => observer && observer.disconnect())

const applyTheme = (dark) => {
  if (dark) {
    document.documentElement.classList.add('dark')       // Element Plus 暗色
    document.body.classList.add('dark-mode')             // 自定义 CSS 暗色
  } else {
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('dark-mode')
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

const toggleTheme = () => {
  const next = !isDark.value
  applyTheme(next)
  ElMessage.success(`已切换到${next ? '暗色' : '亮色'}模式`)
}
</script>

<style>
/* ===== Element Plus 主题色覆盖：让默认 #409EFF 匹配项目渐变 ===== */
:root {
  --el-color-primary: #6366f1;
  --el-color-primary-light-3: #818cf8;
  --el-color-primary-light-5: #a5b4fc;
  --el-color-primary-light-7: #c7d2fe;
  --el-color-primary-light-9: #e0e7ff;
  --el-color-primary-dark-2: #4f46e5;
}
html.dark {
  --el-color-primary: #818cf8;
}

.app-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px 10px;
  min-height: 100vh;
}

.app-header {
  padding: 0;
  margin-bottom: 24px;
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 20px;
  background: var(--c-overlay);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--c-border-soft);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 14px;
  z-index: 50;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}
.brand-logo {
  font-size: 22px;
  color: #fff;
  background: var(--grad-primary);
  padding: 6px;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}
.brand-text {
  background: var(--grad-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ElMenu 横向导航适配 */
.nav-menu {
  flex: 1;
  border-bottom: none !important;
  background: transparent !important;
  font-weight: 500;
}
.nav-menu .el-menu-item {
  border-bottom: none !important;
  border-radius: 8px;
  margin: 0 4px;
  height: 40px;
  line-height: 40px;
  transition: all 0.25s;
}
.nav-menu .el-menu-item:hover {
  background: var(--c-card-soft) !important;
}
.nav-menu .el-menu-item.is-active {
  background: var(--grad-primary) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.theme-btn {
  background: var(--c-card-soft);
  border: 1px solid var(--c-border);
  transition: all 0.3s;
}
.theme-btn:hover {
  border-color: var(--c-primary);
  transform: rotate(20deg) scale(1.08);
}

.app-main {
  padding: 0;
  min-height: 60vh;
}

.app-footer {
  padding: 20px 0 10px;
  height: auto !important;
}
.footer-inner {
  text-align: center;
  color: var(--c-text-mute);
  font-size: 13px;
}
.footer-bar {
  display: inline-block;
  width: 48px;
  height: 4px;
  border-radius: var(--r-pill);
  background: var(--grad-primary);
  opacity: 0.6;
  margin-bottom: 10px;
}

/* 页面切换过渡 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 响应式 */
@media (max-width: 768px) {
  .header-inner {
    flex-wrap: wrap;
    padding: 10px 14px;
  }
  .nav-menu {
    order: 3;
    width: 100%;
  }
}
</style>
