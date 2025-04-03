import { defineStore } from 'pinia'
import { login, getUserInfo, logout, getCaptcha } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import type { LoginParams, LoginResult } from '@/types/login'
import { AxiosRequestConfig } from 'axios'

interface UserState {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
    avatar: string
    roles: string[]
    permissions: string[]
  } | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
    avatar: (state) => state.userInfo?.avatar || '',
    roles: (state) => state.userInfo?.roles || [],
    permissions: (state) => state.userInfo?.permissions || []
  },
  
  actions: {
    // 登录
    async loginAction(loginParams: LoginParams) {
      try {
        const formData = new FormData()
        if (loginParams.username) formData.append('username', loginParams.username)
        if (loginParams.password) formData.append('password', loginParams.password)
        if (loginParams.captchaKey) formData.append('captchaKey', loginParams.captchaKey)
        if (loginParams.captcha) formData.append('captcha', loginParams.captcha)
        
        const res = await login(formData)
        const { tokenType, accessToken } = res.data
        this.token = accessToken
        setToken(tokenType + " " + accessToken)
        return res
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 获取用户信息
    async getUserInfoAction() {
      try {
        const res = await getUserInfo()
        this.userInfo = res.data
        return res
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 登出
    async logoutAction() {
      try {
        const res = await logout()
        this.token = ''
        this.userInfo = null
        removeToken()
        return res
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 重置状态
    resetState() {
      this.token = ''
      this.userInfo = null
      removeToken()
    },

    // 获取验证码
    async getCaptchaAction() {
      try {
        const res = await getCaptcha()
        return res
      } catch (error) { 
        return Promise.reject(error)
      }
    }
  }
}) 