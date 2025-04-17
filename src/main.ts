import { createApp } from 'vue'
import App from './App.vue'
import pinia from './stores'
import router from './router'
import 'virtual:uno.css'
import { InstallCodeMirror } from "codemirror-editor-vue3"; 

// 导入 Element Plus 样式
import 'element-plus/dist/index.css'
// 导入 Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册 Element Plus 图标
app.config.globalProperties.$icons = []
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.config.globalProperties.$icons.push(key)
  app.component(key, component)
}

// 注册 pinia
app.use(pinia)
app.use(router)
app.use(InstallCodeMirror); 
app.mount('#app') 