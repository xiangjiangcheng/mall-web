/**
 * 登录请求参数
 */
export interface LoginParams {
    username: string
    password: string
    captchaCode?: string
    captchaKey?: string
  }
  
  /**
   * 登录响应格式
   */
  export interface LoginResult {
    token: string
    userInfo: {
      id: number
      username: string
      nickname: string
      avatar: string
      roles: string[]
      permissions: string[]
    }
  } 