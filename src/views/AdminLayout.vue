<template>
  <!-- ✨ ElContainer + ElAside + ElHeader + ElMain：Element Plus 完整布局 -->
  <el-container class="admin-layout">
    <el-aside width="220px" class="admin-aside">
      <div class="aside-header">
        <!-- ✨ ElAvatar + ElBadge -->
        <el-badge type="success" :value="0" :max="99" class="aside-badge">
          <el-avatar :size="44" :src="userStore.profile.avatar">🛡</el-avatar>
          <template #content>
            <el-tooltip content="在线">
              <span class="online-dot"></span>
            </el-tooltip>
          </template>
        </el-badge>
        <div class="aside-user">
          <el-tag type="success" effect="plain" size="small" round>管理员</el-tag>
          <p class="username">{{ userStore.displayName }}</p>
        </div>
      </div>

      <!-- ✨ ElMenu：侧边导航 -->
      <el-menu
        class="admin-menu"
        :default-active="activeMenu"
        router
        background-color="transparent"
        text-color="#6b7280"
        active-text-color="#6366f1"
      >
        <el-menu-item index="/admin/info">
          <el-icon><User /></el-icon>
          <template #title>修改个人信息</template>
        </el-menu-item>
        <el-menu-item index="/admin/project">
          <el-icon><FolderOpened /></el-icon>
          <template #title>管理项目</template>
        </el-menu-item>
        <el-menu-item index="/admin/article">
          <el-icon><Document /></el-icon>
          <template #title>管理文章</template>
        </el-menu-item>
        <el-divider />
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>回到主页</template>
        </el-menu-item>
      </el-menu>

      <!-- ✨ ElButton + ElPopconfirm：退出登录 -->
      <el-popconfirm
        title="确认退出登录？"
        confirm-button-text="退出"
        cancel-button-text="取消"
        :confirm-button-type="'danger'"
        @confirm="onLogout"
      >
        <template #reference>
          <el-button type="danger" plain :icon="SwitchButton" round class="logout-btn">
            退出登录
          </el-button>
        </template>
      </el-popconfirm>
    </el-aside>

    <el-container>
      <el-main class="admin-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/userStore.js'
import {
  User, FolderOpened, Document, HomeFilled, SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const onLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.replace({ name: 'login' })
}
</script>

<style>
.admin-layout { gap: 18px; }
.admin-aside {
  background: var(--c-card);
  border: 1px solid var(--c-border-soft);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
  padding: 18px 12px;
  height: fit-content;
  position: sticky;
  top: 80px;
}
.aside-header {
  display: flex; align-items: center; gap: 10px;
  padding-bottom: 14px; margin-bottom: 12px;
  border-bottom: 1px solid var(--c-border-soft);
}
.aside-user .username {
  font-size: 14px; font-weight: 600; margin-top: 4px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.online-dot {
  position: absolute; right: 0; bottom: 0;
  width: 10px; height: 10px; border-radius: 50%;
  background: #22c55e;
  border: 2px solid var(--c-card);
}
.admin-menu {
  border-right: none !important;
  background: transparent !important;
}
.admin-menu .el-menu-item {
  border-radius: 8px; margin-bottom: 4px;
  transition: all 0.2s;
}
.admin-menu .el-menu-item:hover {
  background: var(--c-card-soft) !important;
}
.admin-menu .el-menu-item.is-active {
  background: var(--grad-primary) !important;
  color: #fff !important;
}
.logout-btn { width: 100%; margin-top: 12px; }
</style>
