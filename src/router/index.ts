import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'
import Layout from '@/layout/index.vue'
import { routes } from '@/api/menu'
const modules = import.meta.glob("@/views/**/**.vue");

// 白名单路由
const whiteList = ['/login']

// 基础路由
const constantRoutes: RouteRecordRaw[] = [
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
        meta: { title: '首页', icon: 'Monitor' }
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
// 添加动态路由
export function addRoutes(routesData: any[]) {
  const asyncRoutes = generateRoutes(routesData)
  console.log("asyncRoutes:",asyncRoutes)
  asyncRoutes.forEach(route => {
    router.addRoute(route)
  })
}

/**
 * 获取后台动态路由数据，解析并注册到全局路由
 *
 * @returns Promise<RouteRecordRaw[]> 解析后的动态路由列表
 */
function generateRoutes(data: any[]) {
  return parseDynamicRoutes(data);
}

/**
 * 解析后端返回的路由数据并转换为 Vue Router 兼容的路由配置
 *
 * @param rawRoutes 后端返回的原始路由数据
 * @returns 解析后的路由配置数组
 */
const parseDynamicRoutes = (rawRoutes: any[]): RouteRecordRaw[] => {
  const parsedRoutes: RouteRecordRaw[] = [];

  rawRoutes.forEach((route) => {
    console.log("modules:",modules)
    const normalizedRoute = { ...route } as RouteRecordRaw;
    // 处理组件路径
    normalizedRoute.component =
      normalizedRoute.component?.toString() === "Layout"
        ? Layout
        : modules[`/src/views/${normalizedRoute.component}.vue`] ||
          modules["/src/views/error/404.vue"];

    // 递归解析子路由
    if (normalizedRoute.children) {
      normalizedRoute.children = parseDynamicRoutes(route.children);
    }
    console.log("normalizedRoute push:",normalizedRoute)
    parsedRoutes.push(normalizedRoute);
  });

  return parsedRoutes;
};

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
      if (userStore.menus.length === 0) {
        try {
          // 获取动态路由
          const { data } = await routes()
          userStore.setMenus(data)
          // 添加动态路由
          addRoutes(data)
          // 重新导航到目标路由
          next({ ...to, replace: true })
        } catch (error) {
          console.error('获取动态路由失败:', error)
          next()
        }
      } else {
        // 添加标签页
        if (to.meta.title) {
          const tabsStore = useTabsStore()
          // 初始化首页标签
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
          // 添加当前页标签
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

export default router 