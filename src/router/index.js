import { createRouter, createWebHashHistory } from 'vue-router'
// ✨ 实验四：Pinia Store 配合路由守卫
// 注意：是导入 useUserStore 这个函数，不是调用它；
// 真正调用放在 beforeEach 内部，确保此时 Pinia 已初始化
import { useUserStore } from '../stores/userStore.js'

// 导入页面组件
import HomePage from '../views/HomePage.vue'
import AboutPage from '../views/AboutPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import ProjectPage from '../views/ProjectPage.vue'
import ProjectList from '../views/ProjectList.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import LoginPage from '../views/LoginPage.vue'
import AdminLayout from '../views/AdminLayout.vue'
import AdminInfo from '../views/AdminInfo.vue'
import AdminProject from '../views/AdminProject.vue'

// ✨ 实验四新增：文章模块
import ArticlePage from '../views/ArticlePage.vue'
import ArticleList from '../views/ArticleList.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import AdminArticle from '../views/AdminArticle.vue'

const routes = [
  // 重定向：访问根路径跳转到首页
  {
    path: '/',
    redirect: { name: 'home' }
  },
  // 首页
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    meta: { title: '个人主页', requiresAuth: false }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { title: '关于我', requiresAuth: false }
  },
  // 嵌套路由：项目模块
  {
    path: '/project',
    name: 'project',
    component: ProjectPage,
    meta: { title: '项目中心', requiresAuth: false },
    children: [
      { path: '', redirect: { name: 'projectList' } },
      { path: 'list', name: 'projectList', component: ProjectList, meta: { title: '项目列表' } },
      { path: 'detail/:id', name: 'projectDetail', component: ProjectDetail, meta: { title: '项目详情' } }
    ]
  },
  // ✨ 嵌套路由：文章模块（实验四新增）
  {
    path: '/article',
    name: 'article',
    component: ArticlePage,
    meta: { title: '文章中心', requiresAuth: false },
    children: [
      { path: '', redirect: { name: 'articleList' } },
      { path: 'list', name: 'articleList', component: ArticleList, meta: { title: '文章列表' } },
      { path: 'detail/:id', name: 'articleDetail', component: ArticleDetail, meta: { title: '文章详情' } }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: '登录', requiresAuth: false }
  },
  // 后台管理 嵌套路由，需要权限
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    meta: { title: '后台管理', requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'adminInfo' } },
      { path: 'info', name: 'adminInfo', component: AdminInfo, meta: { title: '修改个人信息', requiresAuth: true } },
      { path: 'project', name: 'adminProject', component: AdminProject, meta: { title: '管理项目', requiresAuth: true } },
      // ✨ 实验四新增：文章管理
      { path: 'article', name: 'adminArticle', component: AdminArticle, meta: { title: '管理文章', requiresAuth: true } }
    ]
  },
  // 404 通配路由，放路由表最后
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: NotFoundPage,
    meta: { title: '页面不存在', requiresAuth: false }
  }
]

const router = createRouter({
  // ✨ createWebHashHistory 适配 GitHub Pages 子路径部署
  // history 模式在 Pages 上刷新子路由会 404，hash 模式不会
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// ✨ 全局路由守卫 beforeEach
// 使用 Pinia Store 配合：在守卫函数内部调用 useUserStore，
// 因为此时 Pinia 已经初始化（main.js 中先 pinia 再 router）
router.beforeEach((to, from, next) => {
  // 修改浏览器页面标题
  document.title = to.meta.title || 'Vue状态管理实验'

  // —— Pinia Store 配合路由守卫 ——
  // 守卫函数内部调用 useUserStore，此时 Pinia 已就绪
  if (to.meta.requiresAuth) {
    const userStore = useUserStore()
    if (!userStore.loggedIn) {
      // 未登录，跳转到登录页，并把原目标路径作为 redirect 参数
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
