<template>
  <div class="notfound">
    <!-- ✨ ElResult：Element Plus 结果组件 -->
    <el-result
      icon="warning"
      title="404"
      sub-title="你访问的页面不存在，可能已被移动或删除。"
    >
      <template #extra>
        <el-button type="primary" :icon="HomeFilled" round @click="goHome">🏠 回到首页</el-button>
        <el-button :icon="Briefcase" round @click="goProject">💼 项目中心</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { HomeFilled, Briefcase } from '@element-plus/icons-vue'

const router = useRouter()
const goHome = () => router.replace({ name: 'home' })
const goProject = () => router.replace({ name: 'projectList' })
</script>

<style scoped>
.notfound { padding: 40px 20px; }
</style>
