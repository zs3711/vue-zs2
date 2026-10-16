<template>
  <div class="detail" v-if="currProject">
    <!-- 封面 -->
    <div class="cover-wrap">
      <img :src="currProject.cover" class="cover" />
      <div class="cover-mask"></div>
      <div class="cover-text">
        <el-tag size="small" effect="plain" round type="info">#{{ String(currProject.id).padStart(2, '0') }}</el-tag>
        <h1 class="pname">{{ currProject.name }}</h1>
      </div>
    </div>

    <el-row :gutter="16">
      <!-- 左侧：详细描述 -->
      <el-col :xs="24" :md="16">
        <!-- ✨ ElDescriptions：描述列表组件 -->
        <el-card shadow="hover">
          <template #header>
            <div class="card-head">
              <el-icon color="#6366f1"><Document /></el-icon>
              <span>项目描述</span>
            </div>
          </template>
          <p class="desc-text">{{ currProject.desc }}</p>

          <el-descriptions :column="2" border size="small" class="desc-list" style="margin-top:16px">
            <el-descriptions-item label="技术栈" :span="2">
              <el-tag type="primary" effect="dark">{{ currProject.stack }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="标签" :span="2">
              <el-tag
                v-for="t in currProject.tags"
                :key="t"
                class="tag-inline"
                effect="light"
                round
              >{{ t }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="完成进度">
              <el-progress :percentage="currProject.progress" :stroke-width="12" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 右侧：统计卡 -->
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="side-card">
          <template #header>
            <div class="card-head">
              <el-icon color="#22c55e"><DataLine /></el-icon>
              <span>项目信息</span>
            </div>
          </template>
          <el-statistic title="项目ID" :value="currProject.id" class="side-stat" />
          <el-statistic title="完成进度" :value="currProject.progress" suffix="%" class="side-stat" />
          <el-statistic title="标签数量" :value="currProject.tags.length" class="side-stat" />
          <el-button type="primary" :icon="ArrowLeft" round style="margin-top:14px;width:100%" @click="goList">返回列表</el-button>
          <el-button :icon="RefreshLeft" round style="width:100%;margin-top:8px" @click="goBack">← 返回上一页</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <!-- 不存在时 -->
  <el-empty v-else description="该项目不存在">
    <el-button type="primary" @click="goList">回到项目列表</el-button>
  </el-empty>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Document, DataLine, ArrowLeft, RefreshLeft } from '@element-plus/icons-vue'
import { useProjectStore } from '../stores/projectStore.js'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const { byId } = storeToRefs(projectStore)

const projectId = computed(() => Number(route.params.id))
const currProject = computed(() => byId.value(projectId.value))

const goBack = () => router.go(-1)
const goList = () => router.replace({ name: 'projectList' })
</script>

<style scoped>
.cover-wrap {
  position: relative; border-radius: var(--r-lg);
  overflow: hidden; height: 220px;
  box-shadow: var(--shadow-md); margin-bottom: 18px;
}
.cover { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover-mask {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 60%, transparent 100%);
}
.cover-text {
  position: absolute; left: 24px; bottom: 20px; color: #fff;
}
.cover-text .el-tag { margin-bottom: 8px; }
.pname { font-size: 26px; font-weight: 800; text-shadow: 0 2px 12px rgba(0,0,0,0.4); }

.card-head {
  display: flex; align-items: center; gap: 8px; font-weight: 600;
}
.desc-text { font-size: 15px; line-height: 1.8; color: var(--c-text); }
.tag-inline { margin-right: 6px; margin-bottom: 6px; }
.side-stat { text-align: center; margin-bottom: 18px; }
</style>
