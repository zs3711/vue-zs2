<template>
  <div class="about-page">
    <!-- ✨ ElCard + ElStatistic + ElIcon：关于页头部 -->
    <el-card class="about-hero" shadow="hover">
      <div class="hero-content">
        <el-avatar :size="84" :src="userStore.profile.avatar" />
        <div class="hero-info">
          <h1 class="name">{{ userStore.profile.name }}</h1>
          <el-tag type="primary" effect="dark" round>前端学习者 · Vue3 实践者</el-tag>
          <p class="desc">{{ userStore.profile.intro }}</p>
        </div>
      </div>
    </el-card>

    <!-- ✨ ElStatistic + ElIcon：数据统计 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6" v-for="s in stats" :key="s.label">
        <el-card shadow="hover" class="stat-card">
          <el-icon class="stat-ico" :size="24"><component :is="s.icon" /></el-icon>
          <el-statistic :value="s.num" :suffix="s.suffix">
            <template #label>{{ s.label }}</template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- ✨ ElProgress：技能进度条 -->
    <el-card class="skill-card" shadow="hover">
      <template #header>
        <div class="card-head">
          <el-icon :size="22" color="#22c55e"><TrendCharts /></el-icon>
          <span class="head-title">技能栈熟练度</span>
        </div>
      </template>
      <div class="skill-list">
        <div class="skill-row" v-for="sk in skills" :key="sk.name">
          <span class="skill-name">{{ sk.name }}</span>
          <el-progress
            :percentage="sk.level"
            :color="sk.color"
            :stroke-width="10"
            :show-text="true"
          />
        </div>
      </div>
    </el-card>

    <!-- ✨ ElTimeline：学习历程（与首页同组件，不同数据） -->
    <el-card class="tl-card" shadow="hover">
      <template #header>
        <div class="card-head">
          <el-icon :size="22" color="#ec4899"><Clock /></el-icon>
          <span class="head-title">学习历程</span>
        </div>
      </template>
      <el-timeline class="about-timeline">
        <el-timeline-item
          v-for="(t, i) in timeline"
          :key="i"
          :timestamp="t.time"
          :type="t.type"
          :hollow="t.hollow"
        >
          <div class="tl-title">{{ t.title }}</div>
          <div class="tl-desc">{{ t.desc }}</div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore.js'
import {
  TrendCharts, Clock, Timer, Folder, Collection, User, Star
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

// ✨ ElStatistic 数据源
const stats = [
  { icon: Timer, num: '1+', suffix: '年', label: '学习经验' },
  { icon: Folder, num: 5, suffix: '个', label: '完成项目' },
  { icon: Collection, num: 10, suffix: '+', label: 'Element Plus组件' },
  { icon: Star, num: '∞', suffix: '', label: '学习热情' }
]

// ✨ ElProgress 数据源
const skills = [
  { name: 'HTML5', level: 88, color: '#22c55e' },
  { name: 'CSS3', level: 82, color: '#6366f1' },
  { name: 'JavaScript', level: 75, color: '#f59e0b' },
  { name: 'Vue3', level: 70, color: '#ec4899' },
  { name: 'Pinia', level: 68, color: '#8b5cf6' },
  { name: 'Element Plus', level: 65, color: '#3b82f6' }
]

// ✨ ElTimeline 数据源
const timeline = [
  { time: '2024.09', title: '入学计算机科学', desc: '开启大学生涯，系统学习编程基础。', type: 'primary' },
  { time: '2025.03', title: '入门前端三剑客', desc: '掌握 HTML / CSS / JavaScript。', type: 'success' },
  { time: '2025.09', title: '进入 Vue3 组件化', desc: '学习组合式 API、组件通信。', type: 'warning' },
  { time: '2026.05', title: '引入 Pinia 状态管理', desc: '全局状态 + 持久化 + 路由守卫。', type: 'danger' },
  { time: '2026.10', title: 'Element Plus 重构', desc: '用 10+ 种组件全面重构 UI。', type: 'primary', hollow: true }
]
</script>

<style scoped>
.about-hero { margin-bottom: 18px; }
.hero-content {
  display: flex; gap: 22px; align-items: center;
}
.hero-info h1 {
  font-size: 28px; font-weight: 800; margin: 6px 0 8px;
  background: var(--grad-primary);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-info .desc {
  margin-top: 10px;
  color: var(--c-text-soft);
  line-height: 1.8;
}

.stats-row { margin-bottom: 18px; }
.stat-card { text-align: center; }
.stat-card .stat-ico {
  color: var(--c-primary); margin-bottom: 8px;
}

.skill-card { margin-bottom: 18px; }
.card-head {
  display: flex; align-items: center; gap: 8px; font-weight: 600;
}
.head-title { font-size: 16px; }
.skill-list { display: grid; gap: 14px; }
.skill-row { display: grid; grid-template-columns: 100px 1fr; gap: 12px; align-items: center; }
.skill-name { font-weight: 500; color: var(--c-text); }

.about-timeline { padding: 4px 0; }
.tl-title { font-weight: 600; font-size: 14px; }
.tl-desc { font-size: 13px; color: var(--c-text-soft); margin-top: 2px; }

@media (max-width: 600px) {
  .hero-content { flex-direction: column; text-align: center; }
  .skill-row { grid-template-columns: 1fr; }
}
</style>
