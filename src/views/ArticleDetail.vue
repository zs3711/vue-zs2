<template>
  <div class="detail" v-if="article">
    <el-card shadow="hover" class="detail-card">
      <div class="detail-head">
        <el-tag size="small" effect="plain" round>#{{ String(article.id).padStart(2, '0') }}</el-tag>
        <h1 class="title">{{ article.title }}</h1>
        <div class="meta">
          <el-tag size="small" round :icon="User">{{ article.author }}</el-tag>
          <el-tag size="small" round :icon="Calendar">{{ article.createdAt }}</el-tag>
          <el-tag size="small" round :icon="View">{{ article.views }} 次浏览</el-tag>
        </div>
        <div class="tags">
          <el-tag
            v-for="t in article.tags"
            :key="t"
            size="small"
            effect="light"
            round
          >{{ t }}</el-tag>
        </div>
      </div>

      <el-divider />

      <!-- 正文（简易 Markdown 渲染） -->
      <div class="content" v-html="renderedContent"></div>

      <el-divider />

      <div class="actions">
        <el-button :icon="ArrowLeft" @click="goBack">← 返回上一页</el-button>
        <el-button type="primary" :icon="Back" @click="goList">返回文章列表</el-button>
      </div>
    </el-card>
  </div>

  <el-empty v-else description="该文章不存在">
    <el-button type="primary" @click="goList">回到文章列表</el-button>
  </el-empty>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { User, Calendar, View, ArrowLeft, Back } from '@element-plus/icons-vue'
import { useArticleStore } from '../stores/articleStore.js'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const { byId } = storeToRefs(articleStore)

const articleId = computed(() => Number(route.params.id))
const article = computed(() => byId.value(articleId.value))

// 浏览量 +1
const viewedId = ref(null)
if (article.value && viewedId.value !== articleId.value) {
  articleStore.incrementViews(articleId.value)
  viewedId.value = articleId.value
}

// 简易 Markdown → HTML
const renderedContent = computed(() => {
  if (!article.value) return ''
  return article.value.content
    .split('\n').map(line => {
      if (line.startsWith('## ')) return `<h3>${line.slice(3)}</h3>`
      if (line.startsWith('# ')) return `<h2>${line.slice(2)}</h2>`
      if (line.trim() === '') return '<br>'
      return `<p>${line}</p>`
    }).join('')
})

const goBack = () => router.go(-1)
const goList = () => router.replace({ name: 'articleList' })
</script>

<style scoped>
.detail-card { max-width: 800px; margin: 0 auto; }
.detail-head { text-align: center; padding: 10px 10px 0; }
.title {
  font-size: 26px; font-weight: 800; margin: 10px 0 12px;
  background: var(--grad-primary);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.meta { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 10px; }
.tags { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }

.content { padding: 0 18px; font-size: 15px; line-height: 2; color: var(--c-text); }
.content h2 { font-size: 20px; font-weight: 700; margin: 20px 0 10px; color: var(--c-primary); }
.content h3 { font-size: 17px; font-weight: 600; margin: 16px 0 8px; }
.content p { margin: 6px 0; color: var(--c-text); }
.actions { display: flex; gap: 10px; justify-content: center; }
</style>
