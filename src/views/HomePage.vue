<template>
  <div class="home-page">
    <!-- ✨ ElCard：Element Plus 卡片 -->
    <el-card class="user-card" shadow="hover">
      <template #header>
        <div class="card-head">
          <el-icon :size="22" color="#6366f1"><UserFilled /></el-icon>
          <span class="head-title">个人信息</span>
          <el-tag v-if="userStore.loggedIn" type="success" size="small" effect="plain">已登录</el-tag>
        </div>
      </template>

      <div class="user-info">
        <!-- ✨ ElAvatar + ElBadge：头像 + 在线状态 -->
        <el-badge :value="0" :max="99" class="online-badge">
          <el-avatar :size="100" :src="userStore.profile.avatar" />
          <template #content>
            <el-tooltip content="在线" placement="top">
              <span class="online-dot"></span>
            </el-tooltip>
          </template>
        </el-badge>
        <div class="user-main">
          <h2 class="user-name">{{ userStore.profile.name }}</h2>
          <el-descriptions :column="1" border size="small" class="info-desc">
            <el-descriptions-item label="专业班级">{{ userStore.profile.className }}</el-descriptions-item>
            <el-descriptions-item label="个人简介">{{ userStore.profile.intro }}</el-descriptions-item>
            <el-descriptions-item label="联系邮箱">{{ userStore.profile.email }}</el-descriptions-item>
            <el-descriptions-item label="爱好">{{ userStore.profile.hobby }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div class="card-actions">
        <el-button type="primary" :icon="Edit" round @click="editDialogVisible = true">✎ 编辑信息</el-button>
        <el-button :icon="Download" round @click="handleExport">导出资料</el-button>
        <el-button :icon="Refresh" round @click="resetProfile">重置</el-button>
      </div>
    </el-card>

    <!-- ✨ ElCard + ElTimeline：Element Plus 时间线组件（实验明确要求） -->
    <el-card class="timeline-card" shadow="hover">
      <template #header>
        <div class="card-head">
          <el-icon :size="22" color="#ec4899"><Clock /></el-icon>
          <span class="head-title">学习历程</span>
        </div>
      </template>
      <el-timeline class="study-timeline">
        <el-timeline-item
          v-for="(item, i) in timeline"
          :key="i"
          :timestamp="item.time"
          :type="item.type"
          :hollow="item.hollow"
        >
          <div class="tl-title">{{ item.title }}</div>
          <div class="tl-desc">{{ item.desc }}</div>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- ✨ ElInput + ElTag + ElBadge：技能搜索区 -->
    <el-card class="skill-card" shadow="hover">
      <template #header>
        <div class="card-head">
          <el-icon :size="22" color="#22c55e"><Collection /></el-icon>
          <span class="head-title">技能兴趣</span>
          <el-badge :value="skillList.length" class="skill-count" />
        </div>
      </template>
      <el-input
        v-model="searchKeyword"
        :prefix-icon="Search"
        placeholder="搜索技能…"
        clearable
        class="skill-search"
      />
      <div class="skill-tags">
        <transition-group name="tag">
          <el-tag
            v-for="skill in filteredSkill"
            :key="skill.id"
            :type="skill.type"
            effect="light"
            round
            class="skill-tag"
          >
            {{ skill.name }}
          </el-tag>
        </transition-group>
      </div>
      <el-empty v-if="filteredSkill.length === 0" description="未找到匹配的技能" :image-size="60" />
    </el-card>

    <!-- ✨ ElDialog + ElForm + ElFormItem + ElInput + ElButton：编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑个人信息" width="480px" destroy-on-close>
      <el-form :model="editForm" label-width="90px" label-position="right">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="专业班级">
          <el-input v-model="editForm.className" placeholder="请输入专业班级" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="editForm.intro" type="textarea" :rows="2" placeholder="一句话介绍" />
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="editForm.email" placeholder="email@example.com" />
        </el-form-item>
        <el-form-item label="爱好">
          <el-input v-model="editForm.hobby" placeholder="顿号分隔" />
        </el-form-item>
        <el-form-item label="头像URL">
          <el-input v-model="editForm.avatar" placeholder="https://..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">💾 保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/userStore.js'
import {
  UserFilled, Edit, Download, Refresh, Clock, Collection, Search
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

const searchKeyword = ref('')
const editDialogVisible = ref(false)
const editForm = reactive({ ...profile.value })

// ✨ ElTimeline 数据源
const timeline = ref([
  { time: '2024.09', title: '入学计算机科学', desc: '开启大学生涯，系统学习编程基础。', type: 'primary' },
  { time: '2025.03', title: '入门前端三剑客', desc: '掌握 HTML / CSS / JavaScript。', type: 'success' },
  { time: '2025.09', title: '进入 Vue3 组件化', desc: '学习组合式 API、组件通信。', type: 'warning' },
  { time: '2026.05', title: '引入 Pinia 状态管理', desc: '全局状态 + 持久化 + 路由守卫。', type: 'danger', hollow: false },
  { time: '2026.10', title: 'Element Plus 重构', desc: '用 10+ 种 Element Plus 组件全面重构。', type: 'primary', hollow: true }
])

const skillList = ref([
  { id: 1, name: 'Vue3', type: 'primary' },
  { id: 2, name: 'HTML5', type: 'success' },
  { id: 3, name: 'CSS3', type: 'warning' },
  { id: 4, name: 'JavaScript', type: 'danger' },
  { id: 5, name: 'Java', type: 'info' },
  { id: 6, name: '数据库', type: 'primary' },
  { id: 7, name: 'Pinia', type: 'success' },
  { id: 8, name: 'Element Plus', type: 'warning' }
])

const filteredSkill = computed(() => {
  const kw = searchKeyword.value?.trim().toLowerCase()
  if (!kw) return skillList.value
  return skillList.value.filter(s => s.name.toLowerCase().includes(kw))
})

const saveProfile = () => {
  userStore.updateProfile({ ...editForm })
  Object.assign(profile.value, editForm)
  editDialogVisible.value = false
  ElMessage.success('✅ 个人信息已保存')
}
const resetProfile = () => {
  Object.assign(editForm, profile.value)
  ElMessage.info('已重置为当前 Store 数据')
}
const handleExport = () => {
  const data = JSON.stringify(profile.value, null, 2)
  navigator.clipboard?.writeText(data)
  ElMessage.success('资料已复制到剪贴板')
}

// 当 profile 变化时同步 editForm（跨页面同步）
import { watch } from 'vue'
watch(() => profile.value, (v) => {
  Object.assign(editForm, v)
}, { deep: true })
</script>

<style scoped>
.home-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.user-card { grid-column: 1 / -1; }
.timeline-card { min-height: 340px; }
.skill-card { min-height: 340px; }

.card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.head-title { font-size: 16px; }

.user-info {
  display: flex;
  gap: 22px;
  align-items: flex-start;
}
.user-info .online-badge { flex-shrink: 0; }
.online-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #22c55e;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #22c55e;
}
.user-main { flex: 1; }
.user-name {
  font-size: 22px; font-weight: 700; margin-bottom: 10px;
  background: var(--grad-primary);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.info-desc { margin-top: 6px; }

.card-actions {
  display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap;
}

.study-timeline { padding: 4px 0; }
.tl-title { font-weight: 600; font-size: 14px; }
.tl-desc { font-size: 13px; color: var(--c-text-soft); margin-top: 2px; }

.skill-search { margin-bottom: 14px; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag { font-size: 13px; }

.tag-enter-active, .tag-leave-active { transition: all 0.3s; }
.tag-enter-from, .tag-leave-to { opacity: 0; transform: scale(0.8); }

@media (max-width: 768px) {
  .home-page { grid-template-columns: 1fr; }
  .user-info { flex-direction: column; align-items: center; text-align: center; }
}
</style>
