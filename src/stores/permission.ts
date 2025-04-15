import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const modules = import.meta.glob("@/views/**/**.vue");

// 添加动态路由
export function addRoutes(routesData: any[]) {
  const asyncRoutes = generateRoutes(routesData)
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