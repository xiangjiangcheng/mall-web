import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'
import Layout from '@/layout/index.vue'

// 白名单路由
const whiteList = ['/login']

// 基础路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { 
          title: '首页', 
          icon: 'Monitor',
          affix: true,
          keepAlive: true
        }
      },
      {
        path: 'profile',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人信息' }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  
  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，跳转到首页
      next({ path: '/' })
    } else {
      // 检查是否已加载动态路由
      const userStore = useUserStore()
      // 如果已登录但路由未加载（可能是刷新页面），重新加载动态路由
      if (!userStore.hasLoadedRoutes) {
        try {
          await userStore.loadDynamicRoutes()
          // 重新导航到目标路由，确保能匹配到新添加的路由
          next({ ...to, replace: true })
          return
        } catch (error) {
          ElMessage.error('获取动态路由失败，请重新登录')
          userStore.resetState()
          next(`/login?redirect=${to.path}`)
        }
      } else {
        // 添加标签页
        if (to.meta.title) {
          const tabsStore = useTabsStore()
          // 初始化首页标签
          initHomeTab(tabsStore)
          // 添加当前页标签
          addCurrentTab(tabsStore, to)
          tabsStore.setActiveTab(to.path)
        }
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 未登录可以访问白名单页面
      next()
    } else {
      // 未登录跳转到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

function initHomeTab(tabsStore: any) {
  tabsStore.initHomeTab({
    path: '/dashboard',
    title: '首页',
    name: 'Dashboard',
    fullPath: '/dashboard',
    query: {},
    params: {},
    meta: {
      title: '首页',
      icon: 'HomeFilled'
    }
  })
}

function addCurrentTab(tabsStore: any, to: any) {
  tabsStore.addTab({
    path: to.path,
    title: to.meta.title as string,
    name: to.name as string,
    fullPath: to.fullPath,
    query: to.query,
    params: to.params,
    meta: {
      title: to.meta.title as string,
      icon: to.meta.icon as string
    }
  })
}

export default router 