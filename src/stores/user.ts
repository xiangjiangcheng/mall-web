import { defineStore } from 'pinia'
import { login, logout, getCaptcha } from '@/api/auth'
import { getUserInfo, updateUserInfo as updateUserInfoApi } from '@/api/user'
import { getToken, setToken, removeToken, getUserInfo as getStoredUserInfo, setUserInfo as setStoredUserInfo, removeUserInfo } from '@/utils/auth'
import type { LoginParams } from '@/types/login'
import { useTabsStore } from '@/stores/tabs'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  roles: string[]
  permissions: string[]
  mobile?: string
  email?: string
}

interface UserState {
  token: string
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken() || '',
    userInfo: getStoredUserInfo()
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
    nickname: (state) => state.userInfo?.nickname || '',
    avatar: (state) => state.userInfo?.avatar || '',
    roles: (state) => state.userInfo?.roles || [],
    permissions: (state) => state.userInfo?.permissions || []
  },
  
  actions: {
    // 设置 token
    setToken(token: string) {
      this.token = token
      setToken(token)
    },
    
    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      setStoredUserInfo(userInfo)
    },
    
    // 重置状态
    resetState() {
      this.token = ''
      this.userInfo = null
      removeToken()
      removeUserInfo()
      useTabsStore().closeAllTabs()
    },

    // 登录
    async loginAction(loginParams: LoginParams) {
      try {
        const formData = new FormData()
        if (loginParams.username) formData.append('username', loginParams.username)
        if (loginParams.password) formData.append('password', loginParams.password)
        if (loginParams.captchaKey) formData.append('captchaKey', loginParams.captchaKey)
        if (loginParams.captchaCode) formData.append('captchaCode', loginParams.captchaCode)
        
        const { data } = await login(formData)
        const { accessToken } = data
        this.setToken(`${accessToken}`)
        // 登录成功之后，获取用户信息
        await this.getUserInfoAction()
        return data
      } catch (error) {
        this.resetState()
        throw error
      }
    },
    
    // 获取用户信息
    async getUserInfoAction() {
      try {
        const { data } = await getUserInfo()
        this.setUserInfo(data)
        return data
      } catch (error) {
        this.resetState()
        throw error
      }
    },
    
    // 退出登录
    async logoutAction() {
      try {
        await logout()
      } finally {
        this.resetState()
      }
    },
    
    // 获取验证码
    async getCaptchaAction() {
      try {
        const res = await getCaptcha()
        return res
      } catch (error) { 
        return Promise.reject(error)
      }
    },

    // 更新用户信息
    async updateUserInfo(userInfo: Partial<UserInfo>) {
      try {
        const { data } = await updateUserInfoApi(this.userInfo!.id, userInfo)
        this.setUserInfo({ ...this.userInfo, ...data } as UserInfo)
        return data
      } catch (error) {
        throw error
      }
    }
  }
}) 