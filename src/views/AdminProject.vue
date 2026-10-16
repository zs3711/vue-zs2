<template>
  <div class="admin-project">
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <h2><el-icon :size="20" color="#6366f1"><FolderOpened /></el-icon> 管理项目</h2>
      <el-button type="primary" :icon="Plus" round @click="openAdd">+ 新增项目</el-button>
    </div>

    <!-- 统计区 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="8">
        <el-card shadow="hover">
          <el-statistic title="项目总数" :value="projectStore.total">
            <template #prefix><el-icon><Folder /></el-icon></template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8">
        <el-card shadow="hover">
          <el-statistic title="完成度最高" :value="topFirst?.progress || 0" suffix="%">
            <template #prefix><el-icon><TrendCharts /></el-icon></template>
          </el-statistic>
          <p class="top-name">{{ topFirst?.name || '—' }}</p>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8">
        <el-card shadow="hover">
          <el-statistic title="标签数" :value="allTags.length">
            <template #prefix><el-icon><PriceTag /></el-icon></template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- ✨ ElTable + ElTag + ElButton + ElPopconfirm + ElDialog + ElForm：完整 CRUD -->
    <el-card shadow="hover" class="table-card">
      <!-- 表格 -->
      <el-table :data="projectStore.projects" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="stack" label="技术栈" width="180" />
        <el-table-column label="进度" width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="10" />
          </template>
        </el-table-column>
        <el-table-column label="标签" width="180">
          <template #default="{ row }">
            <el-tag
              v-for="t in row.tags" :key="t"
              size="small" effect="light" round
              style="margin-right:4px;margin-bottom:4px"
            >{{ t }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" :icon="Edit" link @click="openEdit(row)">编辑</el-button>
            <el-popconfirm title="确认删除该项目？" @confirm="onRemove(row)">
              <template #reference>
                <el-button type="danger" size="small" :icon="Delete" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="projectStore.projects.length === 0" description="暂无项目" />
    </el-card>

    <!-- ✨ ElDialog + ElForm：新增/编辑弹窗 -->
    <el-dialog
      v-model="showModal"
      :title="editing ? '编辑项目' : '新增项目'"
      width="520px"
      destroy-on-close
    >
      <el-form :model="form" label-width="90px">
        <el-form-item label="项目名称" required>
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="封面URL">
          <el-input v-model="form.cover" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="一句话描述" />
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model="form.stack" placeholder="如 Vue3 + Vite" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tagsStr" placeholder="逗号分隔" />
        </el-form-item>
        <el-form-item label="进度">
          <el-slider v-model="form.progress" :show-stops="true" :step="5" />
          <span style="color:var(--c-text-mute);font-size:12px">{{ form.progress }}%</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="primary" @click="submit">{{ editing ? '保存' : '新增' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus, Edit, Delete, Folder, TrendCharts, PriceTag, FolderOpened
} from '@element-plus/icons-vue'
import { useProjectStore } from '../stores/projectStore.js'

const projectStore = useProjectStore()
const topFirst = computed(() => projectStore.topThree[0])
const allTags = computed(() => {
  const set = new Set()
  projectStore.projects.forEach(p => p.tags.forEach(t => set.add(t)))
  return [...set]
})

const showModal = ref(false)
const editing = ref(false)
const editId = ref(null)

const emptyForm = () => ({
  name: '', cover: 'https://picsum.photos/id/1003/600/360',
  desc: '', stack: '', tagsStr: '', progress: 0
})
const form = ref(emptyForm())

const parseTags = (s) => String(s).split(/[,，]/).map(t => t.trim()).filter(Boolean)

const openAdd = () => { form.value = emptyForm(); editing.value = false; showModal.value = true }
const openEdit = (p) => {
  editing.value = true; editId.value = p.id
  form.value = {
    name: p.name, cover: p.cover, desc: p.desc, stack: p.stack,
    tagsStr: (p.tags || []).join(', '), progress: p.progress
  }
  showModal.value = true
}
const submit = () => {
  const payload = {
    name: form.value.name, cover: form.value.cover,
    desc: form.value.desc, stack: form.value.stack,
    tags: parseTags(form.value.tagsStr), progress: Number(form.value.progress)
  }
  if (editing.value) {
    projectStore.update(editId.value, payload)
    ElMessage.success('✅ 项目已更新')
  } else {
    projectStore.add(payload)
    ElMessage.success('✅ 项目已新增')
  }
  showModal.value = false
}
const onRemove = (p) => {
  projectStore.remove(p.id)
  ElMessage.success('✅ 项目已删除')
}
</script>

<style scoped>
.toolbar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
}
.toolbar h2 {
  display: flex; align-items: center; gap: 8px;
  font-size: 20px; font-weight: 700;
}
.stats-row { margin-bottom: 16px; }
.top-name { margin-top: 4px; font-size: 13px; color: var(--c-text-soft); }
.table-card { margin-top: 4px; }
</style>
