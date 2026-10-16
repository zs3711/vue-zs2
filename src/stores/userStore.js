import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// =====================================================================
// userStore —— 用户信息 + 登录状态
// 核心：state（ref）、getters（computed）、actions（同步/异步）
// 持久化：手动实现 —— state 初始化时从 localStorage 读，
//       actions 修改 state 后同步写入 localStorage
// =====================================================================

const STORAGE_KEY = 'userStore_state'

// 从 localStorage 恢复的初始值
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
const saved = loadFromStorage()

export const useUserStore = defineStore('user', () => {
  // ---------- state（ref） ----------
  const isLogin = ref(saved?.isLogin ?? false)
  const username = ref(saved?.username ?? '')
  // 个人主页展示/编辑的用户信息
  const profile = ref(
    saved?.profile ?? {
      avatar: 'https://picsum.photos/id/22/130/130',
      name: '周帅',
      className: '24计科一班',
      intro: '喜欢前端开发，学习Vue3框架',
      email: 'liming@example.com',
      hobby: '打球、看书'
    }
  )

  // ---------- getters（computed） ----------
  // 是否已登录（boolean）
  const loggedIn = computed(() => isLogin.value)
  // 显示名（登录时用 username，否则用 profile.name）
  const displayName = computed(() => username.value || profile.value.name)

  // ---------- actions（函数） ----------
  // 登录（模拟异步，符合真实 API 场景）
  const login = async ({ username: uname, password }) => {
    // 模拟接口延迟
    await new Promise(resolve => setTimeout(resolve, 400))
    if (!uname || !password) {
      return { ok: false, msg: '用户名和密码不能为空' }
    }
    username.value = uname
    isLogin.value = true
    persist()
    return { ok: true, msg: '登录成功' }
  }

  // 登出
  const logout = () => {
    isLogin.value = false
    username.value = ''
    persist()
  }

  // 更新个人信息（HomePage / AdminInfo 共用）
  const updateProfile = (patch) => {
    Object.assign(profile.value, patch)
    persist()
  }

  // 内部：持久化写入 localStorage
  const persist = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isLogin: isLogin.value,
          username: username.value,
          profile: profile.value
        })
      )
    } catch {
      /* 忽略 QuotaExceededError */
    }
  }

  return {
    // 暴露 state、getters、actions
    isLogin,
    username,
    profile,
    loggedIn,
    displayName,
    login,
    logout,
    updateProfile
  }
})
