<template>
  <div class="admin-info">
    <!-- ✨ ElCard + ElForm + ElFormItem：Element Plus 表单组件 -->
    <el-card shadow="hover">
      <template #header>
        <div class="card-head">
          <el-icon :size="22" color="#6366f1"><UserFilled /></el-icon>
          <span>修改个人信息</span>
          <el-tag type="warning" size="small" effect="plain">编辑与首页同步</el-tag>
        </div>
      </template>

      <el-form
        :model="editForm"
        label-width="100px"
        label-position="right"
        class="info-form"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-input v-model="editForm.avatar" placeholder="头像 URL" class="avatar-input" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="姓名">
              <el-input v-model="editForm.name" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="专业班级">
              <el-input v-model="editForm.className" placeholder="专业班级" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个人简介">
          <el-input v-model="editForm.intro" type="textarea" :rows="2" placeholder="一句话介绍" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="联系邮箱">
              <el-input v-model="editForm.email" placeholder="email@example.com" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="爱好">
              <el-input v-model="editForm.hobby" placeholder="顿号分隔" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" :icon="Check" round @click="save">💾 保存修改</el-button>
          <el-button :icon="Refresh" round @click="reset">重置为 Store 当前值</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { Plus, Check, Refresh, UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/userStore.js'

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

const editForm = reactive({ ...profile.value })

const save = () => {
  userStore.updateProfile({ ...editForm })
  Object.assign(profile.value, editForm)
  ElMessage.success('✅ 个人信息已保存（已同步到首页）')
}
const reset = () => {
  Object.assign(editForm, profile.value)
  ElMessage.info('已重置为 Store 当前值')
}
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    editForm.avatar = e.target.result
  }
  reader.readAsDataURL(file)
  return false // 阻止自动上传
}

watch(() => profile.value, (v) => Object.assign(editForm, v), { deep: true })
</script>

<style scoped>
.card-head {
  display: flex; align-items: center; gap: 10px; font-weight: 600;
}
.avatar-uploader :deep(.el-upload) {
  width: 80px; height: 80px;
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; transition: border-color 0.2s;
}
.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--c-primary);
}
.avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
.avatar-uploader-icon { font-size: 24px; color: var(--c-text-mute); }
.avatar-input { flex: 1; }
:deep(.el-form-item--default) { display: flex; gap: 12px; align-items: center; }
</style>
