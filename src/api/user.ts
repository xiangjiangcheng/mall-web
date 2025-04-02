import { get, post } from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { LoginParams, LoginResult } from '@/types/login'

const AUTH_BASE_URL = '/api/v1/auth'

/**
 * 用户登录
 * @param data 登录参数
 * @returns 登录结果
 */
export function login(data: LoginParams): Promise<ApiResponse<LoginResult>> {
  return post<ApiResponse<LoginResult>>(AUTH_BASE_URL+'/login', data)
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<ApiResponse<LoginResult['userInfo']>> {
  return get<ApiResponse<LoginResult['userInfo']>>('/user/info')
}

/**
 * 用户登出
 * @returns 登出结果
 */
export function logout(): Promise<ApiResponse<null>> {
  return post<ApiResponse<null>>('/auth/logout')
}

/**
 * 获取验证码
 * @returns 验证码信息
 */
export function getCaptcha(): Promise<ApiResponse<{ captchaKey: string; captchaImg: string }>> {
  return get<ApiResponse<{ captchaKey: string; captchaImg: string }>>('/auth/captcha')
} 