<template>
  <div class="project-list">
    <!-- ✨ ElInput + ElButton：搜索区 -->
    <div class="list-toolbar">
      <el-input
        v-model="keyword"
        :prefix-icon="Search"
        placeholder="搜索项目名称或描述…"
        clearable
        class="search-input"
      />
      <el-tag type="info" effect="plain">共 {{ filtered.length }} / {{ projectStore.total }} 个</el-tag>
    </div>

    <!-- ✨ ElRow + ElCol：网格布局 -->
    <el-row :gutter="18" class="project-grid">
      <el-col
        v-for="item in filtered"
        :key="item.id"
        :xs="24" :sm="12" :md="8"
        class="project-col"
      >
        <!-- ✨ ElCard：项目卡片 -->
        <el-card shadow="hover" class="project-card" :body-style="{ padding: 0 }">
          <img :src="item.cover" class="card-cover" />
          <div class="card-body">
            <div class="card-head">
              <el-tag size="small" effect="plain">#{{ String(item.id).padStart(2, '0') }}</el-tag>
              <el-tag :type="item.progress >= 80 ? 'success' : item.progress >= 50 ? 'warning' : 'info'" size="small">
                {{ item.progress }}%
              </el-tag>
            </div>
            <h3 class="card-title">{{ item.name }}</h3>
            <p class="card-desc">{{ item.desc }}</p>
            <el-progress :percentage="item.progress" :stroke-width="8" class="card-progress" />
            <div class="card-tags">
              <el-tag
                v-for="t in item.tags"
                :key="t"
                :type="tagType(t)"
                size="small"
                effect="light"
                round
              >{{ t }}</el-tag>
            </div>
            <el-button type="primary" :icon="View" round class="card-btn" @click="goDetail(item.id)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="filtered.length === 0" description="未找到匹配的项目" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Search, View } from '@element-plus/icons-vue'
import { useProjectStore } from '../stores/projectStore.js'

const router = useRouter()
const projectStore = useProjectStore()
const { total } = storeToRefs(projectStore)

const keyword = ref('')

const filtered = computed(() => {
  const kw = keyword.value?.trim().toLowerCase()
  if (!kw) return projectStore.projects
  return projectStore.projects.filter(
    p => p.name.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw)
  )
})

const tagColors = ['primary', 'success', 'warning', 'danger', 'info']
const tagType = (t) => {
  let sum = 0
  for (const c of t) sum += c.charCodeAt(0)
  return tagColors[sum % tagColors.length]
}

const goDetail = (id) => router.push({ name: 'projectDetail', params: { id } })
</script>

<style scoped>
.list-toolbar {
  display: flex; gap: 12px; align-items: center; margin-bottom: 18px; flex-wrap: wrap;
}
.search-input { max-width: 400px; flex: 1; min-width: 200px; }

.project-col { margin-bottom: 18px; }
.project-card {
  transition: transform 0.3s;
  height: 100%;
}
.project-card:hover { transform: translateY(-4px); }
.card-cover {
  width: 100%; height: 140px; object-fit: cover; display: block;
}
.card-body { padding: 16px 18px 18px; }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.card-title { font-size: 16px; font-weight: 700; margin: 4px 0 6px; }
.card-desc {
  font-size: 13px; color: var(--c-text-soft); line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  margin-bottom: 10px;
}
.card-progress { margin-bottom: 10px; }
.card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.card-btn { width: 100%; }
</style>
