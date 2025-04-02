/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 应用名称
  readonly VITE_APP_TITLE: string
  
  // 基础 API 路径
  readonly VITE_APP_BASE_API: string
  
  // 上传文件路径
  readonly VITE_APP_UPLOAD_URL: string
  
  // 上传图片路径
  readonly VITE_APP_UPLOAD_IMAGE_URL: string
  
  // 上传视频路径
  readonly VITE_APP_UPLOAD_VIDEO_URL: string
  
  // 上传音频路径
  readonly VITE_APP_UPLOAD_AUDIO_URL: string
  
  // API 地址
  readonly VITE_APP_API_URL: string
  
  // WebSocket 地址
  readonly VITE_APP_WS_URL: string
  
  // 是否启用代理
  readonly VITE_APP_USE_PROXY: string
  
  // 是否启用 Mock
  readonly VITE_APP_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 