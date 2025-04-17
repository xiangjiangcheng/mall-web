<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>访问量</span>
              <el-icon><View /></el-icon>
            </div>
          </template>
          <div class="card-body">
            <div class="number">1,234</div>
            <div class="text">今日访问</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户数</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="card-body">
            <div class="number">567</div>
            <div class="text">总用户数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单数</span>
              <el-icon><ShoppingCart /></el-icon>
            </div>
          </template>
          <div class="card-body">
            <div class="number">89</div>
            <div class="text">今日订单</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品数</span>
              <el-icon><Goods /></el-icon>
            </div>
          </template>
          <div class="card-body">
            <div class="number">123</div>
            <div class="text">总商品数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { View, User, ShoppingCart, Goods } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 2px;
  
  .el-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-body {
      text-align: center;
      
      .number {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 10px;
      }
      
      .text {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}
</style> 