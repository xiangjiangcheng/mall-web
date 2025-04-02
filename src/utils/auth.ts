// Token 键名
const TOKEN_KEY = 'token'

/**
 * 获取 token
 * @returns token
 */
export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
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