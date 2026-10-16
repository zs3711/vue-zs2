<template>
  <div class="admin-article">
    <div class="toolbar">
      <h2><el-icon :size="20" color="#ec4899"><Document /></el-icon> 管理文章</h2>
      <el-button type="primary" :icon="Plus" round @click="openAdd">+ 新增文章</el-button>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="8">
        <el-card shadow="hover">
          <el-statistic title="文章总数" :value="articleStore.total">
            <template #prefix><el-icon><Document /></el-icon></template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8">
        <el-card shadow="hover">
          <el-statistic title="总浏览量" :value="totalViews">
            <template #prefix><el-icon><View /></el-icon></template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8">
        <el-card shadow="hover">
          <el-statistic title="热门TOP1" :value="hotFirst?.title || '—'" />
        </el-card>
      </el-col>
    </el-row>

    <!-- ✨ ElTable + ElTag + ElDialog + ElForm -->
    <el-card shadow="hover">
      <el-table :data="articleStore.articles" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="author" label="作者" width="100" />
        <el-table-column prop="createdAt" label="日期" width="110" />
        <el-table-column prop="views" label="浏览" width="80" align="center" />
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
            <el-popconfirm title="确认删除该文章？" @confirm="onRemove(row)">
              <template #reference>
                <el-button type="danger" size="small" :icon="Delete" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="showModal"
      :title="editing ? '编辑文章' : '新增文章'"
      width="560px"
      destroy-on-close
    >
      <el-form :model="form" label-width="90px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="摘要" required>
          <el-input v-model="form.summary" placeholder="一句话摘要" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author" placeholder="作者" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tagsStr" placeholder="逗号分隔" />
        </el-form-item>
        <el-form-item label="正文" required>
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="# 标题&#10;## 二级标题&#10;正文内容..."
          />
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
import { Plus, Edit, Delete, Document, View } from '@element-plus/icons-vue'
import { useArticleStore } from '../stores/articleStore.js'

const articleStore = useArticleStore()
const hotFirst = computed(() => articleStore.hot[0])
const totalViews = computed(() =>
  articleStore.articles.reduce((sum, a) => sum + a.views, 0)
)

const showModal = ref(false)
const editing = ref(false)
const editId = ref(null)

const emptyForm = () => ({
  title: '', summary: '', author: '', content: '', tagsStr: ''
})
const form = ref(emptyForm())

const parseTags = (s) => String(s).split(/[,，]/).map(t => t.trim()).filter(Boolean)

const openAdd = () => { form.value = emptyForm(); editing.value = false; showModal.value = true }
const openEdit = (a) => {
  editing.value = true; editId.value = a.id
  form.value = {
    title: a.title, summary: a.summary, author: a.author,
    content: a.content, tagsStr: (a.tags || []).join(', ')
  }
  showModal.value = true
}
const submit = () => {
  const payload = {
    title: form.value.title, summary: form.value.summary,
    author: form.value.author, content: form.value.content,
    tags: parseTags(form.value.tagsStr)
  }
  if (editing.value) {
    articleStore.update(editId.value, payload)
    ElMessage.success('✅ 文章已更新')
  } else {
    articleStore.add(payload)
    ElMessage.success('✅ 文章已新增')
  }
  showModal.value = false
}
const onRemove = (a) => {
  articleStore.remove(a.id)
  ElMessage.success('✅ 文章已删除')
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
</style>
