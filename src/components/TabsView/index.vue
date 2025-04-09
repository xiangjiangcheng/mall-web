<template>
  <div class="tabs-view">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          <span v-if="index === breadcrumbs.length - 1">{{ item.title }}</span>
          <a v-else @click="handleBreadcrumbClick(item)">{{ item.title }}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 标签页 -->
    <el-tabs
      v-model="activeTab"
      type="card"
      class="tabs"
      @tab-click="handleClick"
      @tab-remove="handleRemove"
    >
      <el-tab-pane
        v-for="tab in visitedTabs"
        :key="tab.path"
        :label="tab.title"
        :name="tab.path"
        :closable="tab.path !== '/dashboard'"
      >
        <template #label>
          <span class="tab-label" @contextmenu.prevent="handleContextMenu($event, tab)">
            <el-icon v-if="tab.meta?.icon" class="tab-icon">
              <component :is="tab.meta.icon" />
            </el-icon>
            {{ tab.title }}
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    
    <div
      v-if="showContextMenu"
      class="context-menu"
      :style="contextMenuStyle"
      @click.stop
    >
      <div class="menu-content">
        <div class="menu-section">
          <div class="menu-item" @click="handleCommand('refresh')">
            <el-icon><Refresh /></el-icon>
            <span>刷新页面</span>
          </div>
          <div 
            class="menu-item" 
            :class="{ 'is-disabled': currentContextTab?.path === '/dashboard' }"
            @click="currentContextTab?.path !== '/dashboard' && handleCommand('close')"
          >
            <el-icon><Close /></el-icon>
            <span>关闭当前</span>
          </div>
          <div 
            class="menu-item"
            :class="{ 'is-disabled': visitedTabs.length <= 1 }"
            @click="visitedTabs.length > 1 && handleCommand('closeOther')"
          >
            <el-icon><FolderDelete /></el-icon>
            <span>关闭其他</span>
          </div>
          <div 
            class="menu-item"
            :class="{ 'is-disabled': visitedTabs.length <= 1 }"
            @click="visitedTabs.length > 1 && handleCommand('closeAll')"
          >
            <el-icon><Delete /></el-icon>
            <span>关闭所有</span>
          </div>
        </div>
        
        <div class="menu-section" v-if="currentContextTab?.children?.length">
          <div class="menu-title">页面导航</div>
          <template v-for="item in currentContextTab.children" :key="item.path">
            <div class="menu-item" @click="handleNavigate(item)">
              <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
              <span>{{ item.meta?.title }}</span>
            </div>
            <template v-if="item.children?.length">
              <div 
                v-for="child in item.children" 
                :key="child.path"
                class="menu-item sub-item"
                @click="handleNavigate(child)"
              >
                <el-icon v-if="child.meta?.icon"><component :is="child.meta.icon" /></el-icon>
                <span>{{ child.meta?.title }}</span>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'
import type { TabItem } from '@/types/tabs'
import { Close, Refresh, FolderDelete, Delete } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

const activeTab = computed(() => tabsStore.activeTab) // 自动更新选中的标签
const visitedTabs = computed(() => tabsStore.visitedTabs) // 响应式获取标签列表
const currentContextTab = ref<TabItem | null>(null)
const showContextMenu = ref(false)
const contextMenuStyle = ref({
  top: '0px',
  left: '0px'
})

// 计算面包屑导航
const breadcrumbs = computed(() => {
  console.log("breadcrumbs: " + route.matched)
  const matched = route.matched
  return matched.map(item => ({
    path: item.path,
    title: item.meta?.title || item.name
  }))
})

// 处理面包屑点击
const handleBreadcrumbClick = (item: any) => {
  router.push(item.path)
}

// 点击标签页
const handleClick = (tab: any) => {
  const path = tab.props.name
  router.push(path)
}

// 移除标签页
const handleRemove = (name: string | number) => {
  const path = name.toString()
  const tab = visitedTabs.value.find(tab => tab.path === path)
  if (tab) {
    tabsStore.removeTab(tab)
    if (path === route.path) {
      const lastTab = visitedTabs.value[visitedTabs.value.length - 1]
      router.push(lastTab.path)
    }
  }
}

// 处理右键菜单
const handleContextMenu = (e: MouseEvent, tab: TabItem) => {
  currentContextTab.value = tab
  showContextMenu.value = true
  
  // 计算菜单位置
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const menuWidth = 200
  const menuHeight = 300
  
  let left = rect.left
  let top = rect.bottom
  
  // 确保菜单不会超出视口
  if (left + menuWidth > window.innerWidth) {
    left = window.innerWidth - menuWidth
  }
  if (top + menuHeight > window.innerHeight) {
    top = window.innerHeight - menuHeight
  }
  
  contextMenuStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

// 处理导航
const handleNavigate = (item: TabItem) => {
  router.push(item.path)
  showContextMenu.value = false
}

// 处理右键菜单命令
const handleCommand = (command: string) => {
  if (!currentContextTab.value) return

  switch (command) {
    case 'refresh':
      const fullPath = tabsStore.refreshTab(currentContextTab.value)
      router.replace('/redirect' + fullPath)
      break
    case 'close':
      if (currentContextTab.value.path === '/dashboard') return
      handleRemove(currentContextTab.value.path)
      break
    case 'closeOther':
      tabsStore.closeOtherTabs(currentContextTab.value)
      break
    case 'closeAll':
      tabsStore.closeAllTabs()
      router.push('/dashboard')
      break
  }
  
  showContextMenu.value = false
}

// 点击其他地方关闭菜单
document.addEventListener('click', () => {
  showContextMenu.value = false
})
</script>

<style lang="scss" scoped>
.tabs-view {
  position: relative;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  
  .nav-bar {
    padding: 8px 16px;
    border-bottom: 1px solid #ebeef5;
    
    :deep(.el-breadcrumb) {
      line-height: 1.5;
      
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          color: #606266;
          
          a {
            color: #409EFF;
            cursor: pointer;
            
            &:hover {
              color: #66b1ff;
            }
          }
        }
        
        &:last-child {
          .el-breadcrumb__inner {
            color: #303133;
            font-weight: bold;
          }
        }
      }
    }
  }
  
  .tabs {
    :deep(.el-tabs__header) {
      margin: 0;
      border-bottom: none;
    }
    
    :deep(.el-tabs__item) {
      height: 40px;
      line-height: 40px;
      border: 1px solid #d8dce5;
      margin: 0 3px;
      border-radius: 3px 3px 0 0;
      
      &.is-active {
        background: #fff;
        border-bottom-color: #fff;
      }
    }
  }
  
  .tab-label {
    display: flex;
    align-items: center;
    
    .tab-icon {
      margin-right: 4px;
    }
  }
  
  .context-menu {
    position: fixed;
    width: 200px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 3000;
    font-size: 12px;
    
    .menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid #ebeef5;
      
      .menu-title {
        font-weight: bold;
        color: #303133;
      }
      
      .close-btn {
        padding: 0;
      }
    }
    
    .menu-content {
      padding: 8px 0;
      
      .menu-section {
        margin-bottom: 8px;
        
        .menu-title {
          padding: 4px 12px;
          font-size: 12px;
          color: #909399;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.3s;
          
          &:hover {
            background-color: #f5f7fa;
          }
          
          &.is-disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .el-icon {
            margin-right: 8px;
            font-size: 16px;
          }
          
          &.sub-item {
            padding-left: 32px;
          }
        }
      }
    }
  }
}
</style> 