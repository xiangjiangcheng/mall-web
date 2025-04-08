import { get, post, put, del } from '@/utils/request'

const USER_BASE_URL = '/api/v1/users'

export const getUserPage = (currentPage: number, pageSize: number) => {
  return get(`${USER_BASE_URL}/page?currentPage=${currentPage}&pageSize=${pageSize}`)
}

export const addUser = (data: any) => {
  return post(`${USER_BASE_URL}/add`, data)
}

export const updateUser = (id: number, data: any) => {
  return put(`${USER_BASE_URL}/update/${id}`, data)
}

export const deleteUser = (id: number) => {
  return del(`${USER_BASE_URL}/delete/${id}`)
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