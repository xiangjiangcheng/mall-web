/**
 * 通用响应格式
 */
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

/**
 * 分页请求参数
 */
export interface PageParams {
  pageNum: number
  pageSize: number
  [key: string]: any
}

/**
 * 分页响应格式
 */
export interface PageResult<T = any> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}