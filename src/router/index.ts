import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useTabsStore } from '@/stores/tabs'

// 白名单路由
const whiteList = ['/login']

const routes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'Monitor' }
      },
      {
        path: 'profile',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人信息' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index.vue'),
        name: 'User',
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        name: 'Role',
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  
  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，跳转到首页
      next({ path: '/' })
    } else {
      // 添加标签页
      if (to.meta.title) {
        const tabsStore = useTabsStore()
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
      next()
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

export default router 