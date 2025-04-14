<script setup>
import { useCounterStore } from '@/stores/counter'
import { useRoute } from 'vue-router'

const counterStore = useCounterStore()
const route = useRoute()
</script>

<template>
  <!-- <div> -->
    <!-- <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <h1 class="text-3xl">vue3-element-admin-父组件</h1>
    <el-button ype="primary" @click="counterStore.increment"> click me  </el-button>
    <HelloWorld msg="Vue + Vite msg" /> -->
    
    <!-- 环境信息组件 -->
    <!-- <EnvInfo /> -->
    
    <!-- API 示例组件 -->
    <!-- <Login /> -->
  <!-- </div> -->
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component :is="Component" v-if="route.meta?.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!route.meta?.keepAlive" />
  </router-view>
</template>
  
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
