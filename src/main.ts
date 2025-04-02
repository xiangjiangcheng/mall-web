import { createApp } from 'vue'
import App from './App.vue'
import pinia from './stores'
import 'virtual:uno.css'

// 导入 Element Plus 样式
import 'element-plus/dist/index.css'
// 导入 Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册 pinia
app.use(pinia)
app.mount('#app') 