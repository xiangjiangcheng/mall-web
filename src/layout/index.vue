<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar-container">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical"
        :router="true"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/system/role">
            <el-icon><UserFilled /></el-icon>
            <span>角色管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 头部 -->
      <div class="navbar">
        <div class="right-menu">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userStore.username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="app-main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Monitor, Setting, User, UserFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'password':
      // TODO: 跳转到修改密码页面
      ElMessageBox.alert('修改密码功能暂未实现', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确认退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await userStore.logoutAction()
      router.push('/login')
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  })
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  
  .sidebar-container {
    width: 210px;
    background-color: #304156;
    transition: width 0.3s;
    
    .el-menu {
      border-right: none;
      background-color: #304156;
      
      .el-menu-item, .el-sub-menu__title {
        color: #bfcbd9;
        
        &:hover {
          color: #fff;
        }
        
        &.is-active {
          color: #409eff;
        }
      }
    }
  }
  
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .navbar {
      height: 50px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 15px;
      
      .right-menu {
        .el-dropdown-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    
    .app-main {
      flex: 1;
      padding: 20px;
      overflow: auto;
    }
  }
}
</style> 