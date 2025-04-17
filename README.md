# Vue 3 + Vite + Element-Plus

真的，Coursor 太太太强大了！

整个项目基本由coursor 从0到1，一步一步搭建，搭建的过程中遇到了很多问题，解决问题的同时，也让我更加深入了解vue+ts的语法，用法，每个模块工作原理，以及如何去排查问题！！！

最快捷的学习方法，就是模仿+实践！一味的通读文档，只会逐渐失去学习的兴趣，最终放弃！？ @前端菜鸟（我寄几）

# 技术栈
Vue3 + Vite + TypeScript + Element-Plus：从零到一构建企业级后台管理系统


-- npm i sortablejs @types/sortablejs 拖拽

# DOC
1.unocss查找： https://unocss.dev/interactive/
2.svg图标： 访问 iconfont 下载所需的 SVG 图标，并将其复制到 src/assets/icons 目录下 https://www.iconfont.cn/
```sh
使用方法
<template>
  <!-- 默认尺寸 1em，颜色 currentColor ,继承父级的文本颜色 -->
  <div class="i-svg:home"></div>

  <!-- 自定义颜色和尺寸 -->
  <div class="i-svg:home text-xl text-blue-500"></div>   
</template>
```
# 项目结构



# Set up - 从0到1
```
搭建过程参考此文档： https://youlai.blog.csdn.net/article/details/130191394

1. 引入 Element Plus 自动导入
2. 整合 Element Plus
3. 整合 SCSS
4. 整合 UnoCSS
5. 整合 Pinia
6. 引入多环境配置
7. 整合 Axios
8. 静态路由 vue-router
9. 动态路由： 需要用户登录，根据用户拥有的角色进行权限校验后进行初始化
10. 使用 @unocss/preset-icons 文档：https://youlai.blog.csdn.net/article/details/145499595

```


