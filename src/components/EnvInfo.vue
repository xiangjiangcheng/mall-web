<script setup lang="ts">
import { isDev, isProd, isStaging, getEnv, getAppTitle, getApiUrl, getWsUrl, isUseProxy, isUseMock } from '@/utils/env'

// 获取当前环境
const currentEnv = getEnv()

// 获取应用标题
const appTitle = getAppTitle()

// 获取 API 地址
const apiUrl = getApiUrl()

// 获取 WebSocket 地址
const wsUrl = getWsUrl()

// 是否启用代理
const useProxy = isUseProxy()

// 是否启用 Mock
const useMock = isUseMock()
</script>

<template>
  <div class="env-info">
    <h2>环境信息</h2>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="当前环境">
        <el-tag :type="isDev() ? 'success' : isProd() ? 'danger' : 'warning'">
          {{ currentEnv }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="应用标题">{{ appTitle }}</el-descriptions-item>
      <el-descriptions-item label="API 地址">{{ apiUrl }}</el-descriptions-item>
      <el-descriptions-item label="WebSocket 地址">{{ wsUrl }}</el-descriptions-item>
      <el-descriptions-item label="是否启用代理">
        <el-tag :type="useProxy ? 'success' : 'info'">
          {{ useProxy ? '是' : '否' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="是否启用 Mock">
        <el-tag :type="useMock ? 'success' : 'info'">
          {{ useMock ? '是' : '否' }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style lang="scss" scoped>
.env-info {
  padding: $spacing-base;
  margin: $spacing-base;
  border-radius: $border-radius-base;
  background-color: $background-color-base;
  box-shadow: $box-shadow-base;
  
  h2 {
    margin-bottom: $spacing-base;
    color: $text-primary;
  }
}
</style> 