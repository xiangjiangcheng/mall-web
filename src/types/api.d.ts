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

// 角色类型定义
export interface Role {
  id: number
  name: string
  code: string
  sort: number
  status: number
  description?: string
  createTime: string
  updateTime: string
}

// 角色列表响应类型
export interface RolePageResult {
  list: Role[]
  total: number
}

// 角色表单类型
export interface RoleForm {
  id?: number
  name: string
  code: string
  sort: number
  status: number
  description?: string
}