import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'
import { isUseProxy, getApiUrl } from '@/utils/env'
import router from "@/router";

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  // 根据是否使用代理设置 baseURL
  baseURL: isUseProxy() ? import.meta.env.VITE_APP_BASE_API : getApiUrl(),
  // 超时时间
  timeout: 10000,
  // 请求头
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在请求发送之前做一些处理，例如添加 token
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    const status = response.status;
    // 根据自定义错误码判断请求是否成功
    if (status === 200 && res.code === "00000") {
      return res
    }
    
    // 处理业务错误
    ElMessage({
      message: res.msg || '系统错误',
      type: 'error',
      duration: 5 * 1000
    })
    
    // 未登录或 token 过期
    if (res.code === "A0230") {
      handleSessionExpired();
    }
    
    return Promise.reject(new Error(res.msg || '系统错误'))
  },
  (error) => {
    console.error('响应错误:', error)
    const { response } = error
    
    // 处理 HTTP 错误
    if (response) {
      const { status } = response
      const code = response.data?.code
      const msg = response.data?.message
      if (code === "A0230") {
        handleSessionExpired();
        return Promise.reject(new Error('登录状态已过期，请重新登录'))
      }

      let message = '系统错误'
      
      switch (status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '未授权，请登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址出错'
          break
        case 408:
          message = '请求超时'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 501:
          message = '服务未实现'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        case 505:
          message = 'HTTP版本不受支持'
          break
        default:
          message = `连接出错(${status})`
      }

      message = msg || "系统出错";
      ElMessage({
        message,
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      // 处理网络错误
      ElMessage({
        message: '网络连接异常，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      });
    }
    return Promise.reject(error.message)
  }
)

function handleSessionExpired() {
  ElNotification({
    title: '系统提示',
    message: h('i', { style: 'color: teal' }, '登录状态已过期，请重新登录'),
    duration: 3 * 1000
  })
  
  removeToken();
  router.push("/login");
}

// 封装 GET 请求
export function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.get(url, { params, ...config })
}

// 封装 POST 请求
export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  // 如果data是FormData类型，自动设置Content-Type
  const headers = data instanceof FormData 
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' }

  return service.post(url, data, { 
    headers,
    ...config 
  })
}

// 封装 PUT 请求
export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.put(url, data, config)
}

// 封装 DELETE 请求
export function del<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.delete(url, { params, ...config })
}

// 导出 axios 实例
export default service 