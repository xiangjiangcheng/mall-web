// Token 键名
const TOKEN_KEY = 'access_token'
const USER_INFO_KEY = 'user_info'

/**
 * 获取 token
 * @returns token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置 token
 * @param token token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 移除 token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 判断是否有 token
 * @returns 是否有 token
 */
export function hasToken(): boolean {
  return !!getToken()
}

// UserInfo 相关操作
export function getUserInfo(): any {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

export function setUserInfo(userInfo: any): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

export function removeUserInfo(): void {
  localStorage.removeItem(USER_INFO_KEY)
} 