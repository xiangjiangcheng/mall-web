import { get, post, put, del } from '@/utils/request'
const ROLE_BASE_URL = '/api/v1/roles'

/**
 * 获取角色分页列表
 */
export function getRoleList(params: {
  pageNum: number
  pageSize: number
  keywords?: string
}) {
  return get(`${ROLE_BASE_URL}/page`, params)
}

/**
 * 获取角色详情
 */
export function getRoleDetail(id: number) {
  return get(`${ROLE_BASE_URL}/${id}`)
}

/**
 * 添加角色
 */
export function addRole(data: {
  name: string
  code: string
  sort: number
  status: number
  description?: string
}) {
  return post(`${ROLE_BASE_URL}`, data)
}

/**
 * 修改角色
 */
export function updateRole(id: number, data: {
  name: string
  code: string
  sort: number
  status: number
  description?: string
}) {
  return put(`${ROLE_BASE_URL}/${id}`, data)
}

/**
 * 删除角色
 */
export function deleteRole(id: number) {
  return del(`${ROLE_BASE_URL}/${id}`)
}

/**
 * 修改角色状态
 */
export function updateRoleStatus(id: number, status: number) {
  return put(`${ROLE_BASE_URL}/${id}/status`, { status })
} 