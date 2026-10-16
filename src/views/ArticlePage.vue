<template>
  <div class="page-hero">
    <div class="hero-inner">
      <el-icon :size="28" color="#ec4899"><Document /></el-icon>
      <div>
        <h2 class="hero-title">文章中心</h2>
        <p class="hero-sub">学习笔记与技术分享</p>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<script setup>
import { Document } from '@element-plus/icons-vue'
</script>

<style scoped>
.page-hero { margin-bottom: 18px; }
.hero-inner {
  display: flex; align-items: center; gap: 14px;
  padding: 22px 26px;
  background: var(--c-card);
  border: 1px solid var(--c-border-soft);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: 18px;
}
.hero-title { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
.hero-sub { font-size: 13px; color: var(--c-text-soft); }
</style>
