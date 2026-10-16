import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// =====================================================================
// projectStore —— 项目信息 CRUD
// 替代 src/data/projects.js：数据升级为 Pinia Store，
// 配合 getters、持久化，供 ProjectList / ProjectDetail / AdminProject 共用
// =====================================================================

const STORAGE_KEY = 'projectStore_state'

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// 首次启动的种子数据（仅当 localStorage 为空时用）
const seed = [
  {
    id: 1,
    name: '个人信息网页',
    cover: 'https://picsum.photos/id/1011/600/360',
    desc: '基于 Vue3 组件化开发的个人主页，包含用户卡片、技能搜索、明暗主题切换。',
    tags: ['Vue3', '组件化', 'CSS3'],
    progress: 100,
    stack: 'Vue3 + Vite + vue-router'
  },
  {
    id: 2,
    name: '简易待办清单',
    cover: 'https://picsum.photos/id/1015/600/360',
    desc: '一个支持增删改查与本地持久化的待办事项应用，演示组合式 API 的状态管理。',
    tags: ['Vue3', 'localStorage', '响应式'],
    progress: 80,
    stack: 'Vue3 + Composition API'
  },
  {
    id: 3,
    name: '学生成绩查询',
    cover: 'https://picsum.photos/id/1025/600/360',
    desc: '模拟学生成绩录入与查询系统，支持按学号检索、排序与统计。',
    tags: ['Vue3', '计算属性', '过滤排序'],
    progress: 65,
    stack: 'Vue3 + computed'
  }
]

const saved = loadFromStorage()

export const useProjectStore = defineStore('project', () => {
  // ---------- state ----------
  const projects = ref(saved?.projects ?? seed)
  // 当前详情页正在查看的项目 id（可选，展示跨页面状态共享）
  const currentId = ref(saved?.currentId ?? null)

  // ---------- getters（computed） ----------
  // 项目总数
  const total = computed(() => projects.value.length)
  // 按 id 查找
  const byId = computed(() => {
    return (id) => projects.value.find(p => p.id === Number(id))
  })
  // 完成进度最高的 Top3
  const topThree = computed(() =>
    [...projects.value].sort((a, b) => b.progress - a.progress).slice(0, 3)
  )

  // ---------- actions ----------
  const nextId = () =>
    projects.value.reduce((max, p) => Math.max(max, p.id), 0) + 1

  const add = (data) => {
    projects.value.unshift({
      id: nextId(),
      progress: 0,
      tags: [],
      cover: 'https://picsum.photos/id/1003/600/360',
      ...data
    })
    persist()
  }

  const update = (id, patch) => {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      projects.value[idx] = { ...projects.value[idx], ...patch, id }
      persist()
    }
  }

  const remove = (id) => {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      projects.value.splice(idx, 1)
      persist()
      return true
    }
    return false
  }

  const setCurrentId = (id) => {
    currentId.value = id
    persist()
  }

  // 内部：持久化
  const persist = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          projects: projects.value,
          currentId: currentId.value
        })
      )
    } catch {
      /* 忽略 */
    }
  }

  return {
    projects,
    currentId,
    total,
    byId,
    topThree,
    add,
    update,
    remove,
    setCurrentId
  }
})
