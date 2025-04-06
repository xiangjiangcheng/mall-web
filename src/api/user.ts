import { get, post } from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { LoginParams, LoginResult } from '@/types/login'
import request from '@/utils/request'

const AUTH_BASE_URL = '/api/v1/auth'
const USER_BASE_URL = '/api/v1/users'

/**
 * 用户登录
 * @param data FormData格式的登录参数
 * @returns 登录结果
 */
export function login(data: FormData) {
  return post(`${AUTH_BASE_URL}/login`, data)
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo() {
  return get(`${USER_BASE_URL}/me`)
}

/**
 * 用户登出
 * @returns 登出结果
 */
export function logout() {
  return get(`${AUTH_BASE_URL}/logout`)
}

/**
 * 获取验证码
 * @returns 验证码信息
 */
export function getCaptcha() {
  return get(`${AUTH_BASE_URL}/captcha`)
}

/**
 * 更新用户信息
 */
export function updateUserInfo(id: number, data: any) {
  return request({
    url: `${USER_BASE_URL}/${id}`,
    method: 'put',
    data
  })
} 