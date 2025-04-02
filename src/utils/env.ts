/**
 * 获取环境变量
 * @param key 环境变量键名
 * @returns 环境变量值
 */
export function getEnvValue(key: keyof ImportMetaEnv): string {
  return import.meta.env[key]
}

/**
 * 获取环境变量（带类型转换）
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 环境变量值（带类型转换）
 */
export function getEnvValueWithType<T>(key: keyof ImportMetaEnv, defaultValue: T): T {
  const value = import.meta.env[key]
  
  if (value === undefined) {
    return defaultValue
  }
  
  // 根据默认值类型进行转换
  if (typeof defaultValue === 'boolean') {
    return (value === 'true') as unknown as T
  }
  
  if (typeof defaultValue === 'number') {
    return Number(value) as unknown as T
  }
  
  return value as unknown as T
}

/**
 * 是否为开发环境
 */
export const isDev = () => import.meta.env.DEV

/**
 * 是否为生产环境
 */
export const isProd = () => import.meta.env.PROD

/**
 * 是否为测试环境
 */
export const isStaging = () => import.meta.env.MODE === 'staging'

/**
 * 获取当前环境
 */
export const getEnv = () => import.meta.env.MODE

/**
 * 获取应用标题
 */
export const getAppTitle = () => getEnvValue('VITE_APP_TITLE')

/**
 * 获取 API 地址
 */
export const getApiUrl = () => getEnvValue('VITE_APP_API_URL')

/**
 * 获取 WebSocket 地址
 */
export const getWsUrl = () => getEnvValue('VITE_APP_WS_URL')

/**
 * 是否启用代理
 */
export const isUseProxy = () => getEnvValueWithType('VITE_APP_USE_PROXY', false)

/**
 * 是否启用 Mock
 */
export const isUseMock = () => getEnvValueWithType('VITE_APP_USE_MOCK', false) 