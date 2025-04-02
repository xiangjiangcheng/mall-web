import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import 'virtual:uno.css';
import pinia from './stores'

const app = createApp(App)
app.use(pinia)
app.mount('#app') 