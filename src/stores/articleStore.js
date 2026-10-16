import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// =====================================================================
// articleStore —— 文章/博客模块（实验四新增）
// 实现增删改查 + localStorage 持久化
// =====================================================================

const STORAGE_KEY = 'articleStore_state'

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const seed = [
  {
    id: 1,
    title: 'Vue3 组合式 API 快速上手',
    summary: '从 setup、ref/reactive、computed 到 watch，一篇读懂组合式 API 的核心用法。',
    author: '周帅',
    content: `# Vue3 组合式 API\n\n组合式 API 是 Vue3 的核心升级，让逻辑可以按功能组织而非按选项类型组织。\n\n## 1. setup\nsetup 是组合式 API 的入口，在组件创建之前执行，此时还没有 this。\n\n## 2. ref / reactive\n- ref 用于基本类型，访问时需要 .value\n- reactive 用于对象类型，会自动递归代理\n\n## 3. computed\n计算属性带缓存，依赖不变则不会重新计算。\n\n## 4. watch\n监听响应式数据的变化，可以做副作用处理。`,
    tags: ['Vue3', '前端'],
    createdAt: '2026-10-01',
    views: 128
  },
  {
    id: 2,
    title: 'Pinia 状态管理实战',
    summary: '为什么用 Pinia 替代 Vuex？Pinia 的 Store 如何组织 state/getters/actions？',
    author: '周帅',
    content: `# Pinia 状态管理\n\nPinia 是 Vue3 官方推荐的状态管理库，API 简洁，支持 TypeScript，没有 mutation。\n\n## 核心概念\n- state：响应式数据（ref / reactive）\n- getters：基于 state 的计算属性（computed）\n- actions：修改 state 的方法，支持异步\n\n## storeToRefs\n对 Store 解构时用 storeToRefs 保持响应式。\n\n## 持久化\nPinia 本身不提供持久化，需要手动实现或用插件。`,
    tags: ['Pinia', 'Vue3'],
    createdAt: '2026-10-08',
    views: 96
  },
  {
    id: 3,
    title: '浅谈 CSS 变量与暗色主题',
    summary: '用 CSS 变量 + body class 切换实现明暗主题，附实践经验。',
    author: '周帅',
    content: `# CSS 变量与暗色主题\n\n## CSS 变量的优势\n- 运行时可读写\n- 继承机制\n- 可以做组件化设计令牌\n\n## 实现暗色主题\nbody { transition: background 0.3s; }\nbody.dark-mode { --c-bg: #0f172a; }\n\n## 配合 Pinia\n主题状态存 Store，切换时同时修改 body class 和 Store state。`,
    tags: ['CSS', '主题'],
    createdAt: '2026-10-10',
    views: 64
  }
]

const saved = loadFromStorage()

export const useArticleStore = defineStore('article', () => {
  // ---------- state ----------
  const articles = ref(saved?.articles ?? seed)
  // 当前查看的文章 id
  const currentId = ref(saved?.currentId ?? null)

  // ---------- getters ----------
  // 文章总数
  const total = computed(() => articles.value.length)
  // 按 id 查找
  const byId = computed(() => {
    return (id) => articles.value.find(a => a.id === Number(id))
  })
  // 按浏览量排序的热门文章
  const hot = computed(() =>
    [...articles.value].sort((a, b) => b.views - a.views).slice(0, 5)
  )
  // 按关键词搜索标题/摘要
  const search = computed(() => {
    return (keyword) => {
      const kw = keyword?.trim().toLowerCase()
      if (!kw) return articles.value
      return articles.value.filter(
        a =>
          a.title.toLowerCase().includes(kw) ||
          a.summary.toLowerCase().includes(kw)
      )
    }
  })

  // ---------- actions ----------
  const nextId = () =>
    articles.value.reduce((max, a) => Math.max(max, a.id), 0) + 1

  const add = (data) => {
    const now = new Date()
      .toISOString()
      .slice(0, 10)
    articles.value.unshift({
      id: nextId(),
      createdAt: now,
      views: 0,
      tags: [],
      author: '周帅',
      ...data
    })
    persist()
  }

  const update = (id, patch) => {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value[idx] = { ...articles.value[idx], ...patch, id }
      persist()
    }
  }

  const remove = (id) => {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value.splice(idx, 1)
      persist()
      return true
    }
    return false
  }

  const setCurrentId = (id) => {
    currentId.value = id
    persist()
  }

  // 浏览量 +1
  const incrementViews = (id) => {
    const a = articles.value.find(x => x.id === id)
    if (a) {
      a.views++
      persist()
    }
  }

  const persist = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          articles: articles.value,
          currentId: currentId.value
        })
      )
    } catch {
      /* 忽略 */
    }
  }

  return {
    articles,
    currentId,
    total,
    byId,
    hot,
    search,
    add,
    update,
    remove,
    setCurrentId,
    incrementViews
  }
})
