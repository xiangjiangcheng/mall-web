<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useCounterStore } from '@/stores/counter'

const userStore = useUserStore()
const { username, avatar, token } = storeToRefs(userStore)
const counterStore = useCounterStore()

defineProps({
  msg: String,
})

// userStore.setToken('123456')
const count = ref(0)
</script>

<template>
  <h1 class="text-blue">{{ msg }}</h1>

  <h2>
    username: {{ username }} <br>
    token: {{ userStore.token }}
  </h2>

  <h2>
    count: {{ counterStore.count }}
    double: {{ counterStore.double }}
  </h2>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR Shuaishuai
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  <div>
    <el-button type="success"><i-ep-SuccessFilled />Success</el-button>
    <el-button type="info"><i-ep-InfoFilled />Info</el-button>
    <el-button type="warning"><i-ep-WarningFilled />Warning</el-button>
    <el-button type="danger"><i-ep-WarnTriangleFilled />Danger</el-button>
  </div>

  <div class="my-component">
    customer component

  </div>
</template>
<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}

.my-component {
  color: $my-color;
}
</style>
