<template>
  <div class="login-page">
    <!-- ✨ ElCard + ElForm + ElInput + ElButton + ElIcon：Element Plus 登录表单 -->
    <el-card shadow="hover" class="login-card">
      <div class="login-header">
        <el-icon :size="32" color="#6366f1"><Lock /></el-icon>
        <h2>欢迎回来</h2>
        <p>登录以进入后台管理</p>
      </div>

      <el-form :model="form" label-width="0" class="login-form" @submit.prevent="doLogin">
        <el-form-item>
          <el-input
            v-model="form.username"
            placeholder="👤 请输入用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            :type="showPwd ? 'text' : 'password'"
            placeholder="🔑 请输入密码"
            :prefix-icon="Key"
            size="large"
            show-password
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码？</el-link>
        </div>

        <el-button
          type="primary"
          size="large"
          round
          :loading="loading"
          :icon="Promotion"
          class="submit-btn"
          @click="doLogin"
        >
          {{ loading ? '登录中…' : '🚀 登 录' }}
        </el-button>

        <el-alert
          type="info"
          :closable="false"
          show-icon
          title="实验项目：任意输入即可模拟登录"
          class="tip"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, User, Key, Promotion } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/userStore.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({ username: '', password: '', remember: true })
const showPwd = ref(false)
const loading = ref(false)

const doLogin = async () => {
  loading.value = true
  const result = await userStore.login({
    username: form.username,
    password: form.password
  })
  loading.value = false
  if (!result.ok) {
    ElMessage.error(result.msg)
    return
  }
  ElMessage.success('登录成功！')
  const redirectPath = route.query.redirect || '/admin/info'
  router.replace(redirectPath)
}
</script>

<style scoped>
.login-page {
  display: grid; place-items: center; min-height: 70vh; padding: 20px 0;
}
.login-card {
  width: 100%; max-width: 420px;
}
.login-header {
  text-align: center; padding: 20px 0 14px;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, #8b5cf6 100%);
  color: #fff;
  margin: -20px -20px 20px;
  border-radius: var(--el-card-border-radius) var(--el-card-border-radius) 0 0;
  padding: 24px;
}
.login-header :deep(.el-icon) {
  font-size: 38px; margin-bottom: 8px;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
}
.login-header h2 { font-size: 22px; font-weight: 700; margin-bottom: 4px; color: #fff; }
.login-header p { font-size: 13px; opacity: 0.9; color: #fff; }

.login-form { padding: 10px 24px 20px; }
.form-options {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; font-size: 13px;
}
.submit-btn { width: 100%; font-size: 15px; letter-spacing: 0.1em; }
.tip { margin-top: 14px; }
</style>
