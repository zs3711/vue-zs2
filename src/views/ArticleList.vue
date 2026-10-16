<template>
  <div class="article-list">
    <!-- 搜索 + 热门侧边 -->
    <div class="list-layout">
      <!-- 主列表 -->
      <div class="main-col">
        <!-- 搜索 -->
        <div class="toolbar">
          <el-input
            v-model="keyword"
            :prefix-icon="Search"
            placeholder="搜索文章标题或摘要…"
            clearable
            class="search-input"
          />
          <el-tag type="info" effect="plain">共 {{ filtered.length }} / {{ articleStore.total }} 篇</el-tag>
        </div>

        <!-- 列表 -->
        <div class="article-cards">
          <el-card
            v-for="a in filtered"
            :key="a.id"
            shadow="hover"
            class="article-card"
            @click="goDetail(a.id)"
          >
            <div class="card-head">
              <el-tag size="small" effect="plain" round>#{{ String(a.id).padStart(2, '0') }}</el-tag>
              <span class="date">{{ a.createdAt }}</span>
              <span class="views">👁 {{ a.views }}</span>
            </div>
            <h3 class="title">{{ a.title }}</h3>
            <p class="summary">{{ a.summary }}</p>
            <div class="tags">
              <el-tag
                v-for="t in a.tags"
                :key="t"
                size="small"
                effect="light"
                round
              >{{ t }}</el-tag>
            </div>
          </el-card>
        </div>

        <el-empty v-if="filtered.length === 0" description="未找到匹配的文章" />
      </div>

      <!-- 侧边栏：热门 + 统计 -->
      <div class="side-col">
        <!-- 热门文章 -->
        <el-card shadow="hover" class="side-card">
          <template #header>
            <div class="card-head">
              <el-icon color="#f59e0b"><Star /></el-icon>
              <span>热门文章</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(a, i) in articleStore.hot"
              :key="a.id"
              :type="['danger','warning','primary'][i] || 'info'"
              :timestamp="a.views + ' 次浏览'"
              class="hot-item"
            >
              <el-link type="primary" @click="goDetail(a.id)">{{ a.title }}</el-link>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <!-- 统计 -->
        <el-card shadow="hover" class="side-card">
          <template #header>
            <div class="card-head">
              <el-icon color="#22c55e"><DataAnalysis /></el-icon>
              <span>文章统计</span>
            </div>
          </template>
          <el-statistic title="文章总数" :value="articleStore.total" />
          <el-divider />
          <el-statistic title="总浏览量" :value="totalViews" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { Search, Star, DataAnalysis } from '@element-plus/icons-vue'
import { useArticleStore } from '../stores/articleStore.js'

const router = useRouter()
const articleStore = useArticleStore()
const { total, hot } = storeToRefs(articleStore)

const keyword = ref('')
const filtered = computed(() => articleStore.search(keyword.value))
const totalViews = computed(() =>
  articleStore.articles.reduce((sum, a) => sum + a.views, 0)
)

const goDetail = (id) => {
  router.push({ name: 'articleDetail', params: { id } })
}
</script>

<style scoped>
.list-layout {
  display: grid; grid-template-columns: 1fr 300px; gap: 18px;
}
.toolbar {
  display: flex; gap: 12px; align-items: center; margin-bottom: 18px; flex-wrap: wrap;
}
.search-input { max-width: 400px; flex: 1; min-width: 200px; }

.article-card {
  cursor: pointer; transition: transform 0.25s; margin-bottom: 14px;
}
.article-card:hover { transform: translateY(-3px); }
.card-head {
  display: flex; align-items: center; gap: 10px;
  font-size: 12px; color: var(--c-text-mute); margin-bottom: 8px;
}
.date { flex: 1; }
.title { font-size: 17px; font-weight: 700; margin-bottom: 8px; line-height: 1.4; }
.summary {
  font-size: 13px; color: var(--c-text-soft); line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  margin-bottom: 10px;
}
.tags { display: flex; flex-wrap: wrap; gap: 6px; }

.side-card { margin-bottom: 14px; }
.card-head {
  display: flex; align-items: center; gap: 8px; font-weight: 600;
}
.hot-item :deep(.el-timeline-item__wrapper) { cursor: pointer; }

@media (max-width: 900px) {
  .list-layout { grid-template-columns: 1fr; }
}
</style>
