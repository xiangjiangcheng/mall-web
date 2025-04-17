import { MenuForm } from '@/types/api'
import { get, post, put, del } from '@/utils/request'
const MENU_BASE_URL = '/api/v1/menus'

/**
 * 获取权限树
 */
export function getPermissionTree() {
  return get(`${MENU_BASE_URL}/tree`)
}

/**
 * 获取菜单列表
 */
export function getMenuList() {
  return get(`${MENU_BASE_URL}/list`)
}

/**
 * 获取菜单详情
 */
export function getMenuDetail(id: number) {
  return get(`${MENU_BASE_URL}/${id}/form`)
}

/**
 * 添加菜单
 */
export function addMenu(data: MenuForm) {
  return post(MENU_BASE_URL, data)
}

/**
 * 修改菜单
 */
export function updateMenu(id: number, data: MenuForm) {
  return put(`${MENU_BASE_URL}/${id}`, data)
}

/**
 * 删除菜单
 */
export function deleteMenu(id: number) {
  return del(`${MENU_BASE_URL}/${id}`)
} 

/**
 * 获取菜单路由列表
 */
export function routes() {
  return get(`${MENU_BASE_URL}/routes`)
} 

  /**
   * 获取菜单下拉数据源
   *
   * @returns 菜单下拉数据源
   */
export function getOptions(onlyParent?: boolean) {
  return get(`${MENU_BASE_URL}/options`, { onlyParent: onlyParent })
}