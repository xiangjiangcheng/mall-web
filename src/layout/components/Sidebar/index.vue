<template>
  <div class="sidebar-container">
    <!-- logo + 系统名称  -->
    <div class="logo-container">
      <div class="logo-wrapper">
        <img src="@/assets/logo.png" alt="logo" class="logo">
        <span class="system-name">商城后台管理系统</span>
      </div>
    </div>
    
    <!-- 动态菜单 -->
    <el-menu
      :default-active="route.path"
      class="el-menu-vertical"
      :router="true"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <template v-for="menu in menus" :key="menu.path">
        <!-- 没有子菜单的情况 -->
        <el-menu-item v-if="!menu.children || menu.children.length === 0" :index="resolveFullPath(menu.path, '')">
          <el-icon v-if="menu.meta?.icon"><component :is="menu.meta.icon" /></el-icon>
          <span>{{ menu.meta?.title }}</span>
        </el-menu-item>
        
        <!-- 有子菜单的情况 -->
        <el-sub-menu v-else :index="resolveFullPath(menu.path, '')">
          <template #title>
            <el-icon v-if="menu.meta?.icon"><component :is="menu.meta.icon" /></el-icon>
            <span>{{ menu.meta?.title }}</span>
          </template>
          
          <template v-for="child in menu.children" :key="child.path">
            <el-menu-item :index="resolveFullPath(child.path, menu.path)">
              <el-icon v-if="child.meta?.icon"><component :is="child.meta.icon" /></el-icon>
              <span>{{ child.meta?.title }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import type { MenuInstance } from "element-plus";
import type { RouteRecordRaw } from "vue-router";
import { isExternal } from '@/utils/index'
import path from 'path-browserify'

const route = useRoute()
const userStore = useUserStore()

// 从用户store中获取菜单数据
const menus = computed(() => userStore.menus)

/**
 * 获取完整路径
 *
 * @param routePath 当前路由的相对路径  /user
 * @param parentPath 父级路由路径
 * @returns 完整的路由路径
 */
function resolveFullPath(routePath: string, parentPath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  
  // 如果父路径为空，直接返回当前路径
  if (!parentPath) {
    return routePath;
  }
  
  // 拼接父路径和当前路径
  return path.join(parentPath, routePath);
}
</script>

<script lang="ts">
export default {
  name: 'Sidebar'
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  width: 210px;
  background-color: #304156;
  transition: width 0.3s;
  
  .logo-container {
    height: 60px;
    background-color: #304156;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .logo-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0 15px;

      .logo {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }

      .system-name {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .el-menu {
    border-right: none;
    
    .el-menu-item, .el-sub-menu__title {
      &:hover {
        background-color: #263445;
      }
      
      &.is-active {
        background-color: #263445;
      }
    }
  }
}
</style> 