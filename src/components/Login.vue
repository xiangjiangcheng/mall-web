<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getCaptcha } from '@/api/user'
import type { LoginParams } from '@/types/login'

const userStore = useUserStore()

// 登录表单
const loginForm = ref<LoginParams>({
  username: '',
  password: '',
  captcha: '',
  captchaKey: ''
})

// 验证码图片
const captchaBase64 = ref('')

// 加载状态
const loading = ref(false)

// 获取验证码
const getcaptchaBase64 = async () => {
  try {
    const res = await getCaptcha()
    captchaBase64.value = res.data.captchaBase64
    loginForm.value.captchaKey = res.data.captchaKey
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

// 登录
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  
  if (!loginForm.value.captcha) {
    ElMessage.warning('请输入验证码')
    return
  }
  
  loading.value = true
  try {
    await userStore.loginAction(loginForm.value)
    ElMessage.success('登录成功')
    // 登录成功后跳转到首页
    // router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    // 登录失败后刷新验证码
    getcaptchaBase64()
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取验证码
onMounted(() => {
  getcaptchaBase64()
})
</script>

<template>
  <div class="api-demo">
    <h2>API 请求示例</h2>
    
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>用户登录</span>
        </div>
      </template>
      
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        
        <el-form-item label="验证码">
          <div class="captcha-container">
            <el-input v-model="loginForm.captcha" placeholder="请输入验证码" />
            <img v-if="captchaBase64" :src="captchaBase64" class="captcha-img" @click="getcaptchaBase64" alt="验证码" />
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
          <el-button @click="getcaptchaBase64">刷新验证码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.api-demo {
  padding: $spacing-base;
  margin: $spacing-base;
  
  h2 {
    margin-bottom: $spacing-base;
    color: $text-primary;
  }
  
  .login-card {
    max-width: 500px;
    margin: 0 auto;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .captcha-container {
      display: flex;
      align-items: center;
      
      .el-input {
        flex: 1;
      }
      
      .captcha-img {
        height: 40px;
        margin-left: $spacing-base;
        cursor: pointer;
      }
    }
  }
}
</style>  -->