import { get, post } from '@/utils/request'

const AUTH_BASE_URL = '/api/v1/auth'

/**
 * 用户登录
 * @param data FormData格式的登录参数
 * @returns 登录结果
 */
export function login(data: FormData) {
  return post(`${AUTH_BASE_URL}/login`, data)
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