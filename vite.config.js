import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Unocss from 'unocss/vite'

const pathSrc = path.resolve(__dirname, 'src')
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({}),
        ],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: path.resolve(pathSrc, "types", "auto-imports.d.ts"), // 指定自动导入函数TS类型声明文件路径
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ["ep"] // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
          }),
        ],
        dts: path.resolve(pathSrc, "types", "components.d.ts"), // 指定自动导入组件TS类型声明文件路径
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true,
      }),
      Unocss()
    ],
    resolve: {
      alias: {
        '@': pathSrc,
        '@components': path.resolve(pathSrc, 'components'),
        '@assets': path.resolve(pathSrc, 'assets'),
        '@views': path.resolve(pathSrc, 'views'),
        '@utils': path.resolve(pathSrc, 'utils'),
        '@stores': path.resolve(pathSrc, 'stores'),
      }
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true, // 自动打开浏览器
      // 反向代理解决跨域
      proxy: env.VITE_APP_USE_PROXY === 'true' ? {
        // 代理以/dev-api开头的请求
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          // e.g. http://localhost:3000/dev-api/api/v1/users/me  ->  http://localhost:8999/api/v1/users/me
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
      } : {}
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      // 生产环境移除 console
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      }
    }
  }
})
