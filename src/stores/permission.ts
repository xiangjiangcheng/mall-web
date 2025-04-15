import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { useUserStore } from '@/stores/user'

const modules = import.meta.glob("@/views/**/**.vue");

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { 
      title: '登录',
      icon: 'Monitor',
      affix: true,
      keepAlive: true
    }
  }
]

export const usePermissionStore = defineStore("permission", () => {
  // 储所有路由，包括静态路由和动态路由
  const routes = ref<RouteRecordRaw[]>([]);

  // 添加动态路由
  function addRoutes(routesData: any[]) {
    const dynamicRoutes = generateRoutes(routesData)

    routes.value = [...constantRoutes, ...dynamicRoutes];

    routes.value.forEach(route => {
      router.addRoute(route)
    })
    const userStore = useUserStore();
    userStore.setMenus(routes.value)
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
      parsedRoutes.push(normalizedRoute);
    });

    return parsedRoutes;
  };
  
  return {
    routes,
    addRoutes,
  };
})