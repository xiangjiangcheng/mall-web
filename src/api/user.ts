import { UserForm } from '@/types/api'
import { get, post, put, del } from '@/utils/request'

const USER_BASE_URL = '/api/v1/users'

/**
 * 获取用户分页列表
 */
export function getUserList(params: {
  pageNum: number
  pageSize: number
  keywords?: string
}) {
  return get(`${USER_BASE_URL}/page`, params)
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: number) {
  return get(`${USER_BASE_URL}/${id}`)
}

/**
 * 添加用户
 */
export function addUser(data: UserForm) {
  return post(`${USER_BASE_URL}`, data)
}

/**
 * 修改用户
 */
export function updateUser(id: number, data: UserForm) {
  return put(`${USER_BASE_URL}/${id}`, data)
}

/**
 * 删除用户
 */
export function deleteUser(id: number) {
  return del(`${USER_BASE_URL}/${id}`)
}

/**
 * 修改用户状态
 */
export function updateUserStatus(id: number, status: number) {
  return put(`${USER_BASE_URL}/${id}/status`, { status })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo() {
    return get(`${USER_BASE_URL}/me`)
  }
  
  /**
   * 更新用户信息
   */
  export function updateUserInfo(id: number, data: any) {
    return put(`${USER_BASE_URL}/${id}`, data)
  } 