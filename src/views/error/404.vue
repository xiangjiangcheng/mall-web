<template>
  <div class="error-page">
    <div class="error-code">404</div>
    <div class="error-desc">页面不存在或组件加载失败</div>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
  
  .error-code {
    font-size: 120px;
    font-weight: bold;
    color: #409EFF;
    line-height: 1.2;
  }
  
  .error-desc {
    font-size: 24px;
    color: #606266;
    margin: 20px 0 40px;
  }
}
</style> 