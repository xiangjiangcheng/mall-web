<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="密码">
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="captchaCode">
        <el-input v-model="loginForm.captchaCode" placeholder="验证码">
          <template #prefix>
            <el-icon><Picture /></el-icon>
          </template>
          <template #append>
            <img :src="captchaBase64" alt="验证码" class="captcha-img" @click="getCaptcha" />
          </template>
        </el-input>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width: 100%" @click="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Picture } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref()
const loading = ref(false)
const captchaBase64 = ref('')

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captchaCode: '',
  captchaKey: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 获取验证码
const getCaptcha = async () => {
  try {
    const res = await userStore.getCaptchaAction()
    if (res?.data) {
      captchaBase64.value = res.data.captchaBase64
      loginForm.captchaKey = res.data.captchaKey
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
    ElMessage.error('获取验证码失败')
  }
}

// 登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    await userStore.loginAction(loginForm)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    // ElMessage.error('登录失败')
    getCaptcha()
  } finally {
    loading.value = false
  }
}

// 初始化验证码
getCaptcha()
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  
  .login-form {
    width: 400px;
    padding: 40px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .title {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }
    
    .captcha-img {
      height: 32px;
      cursor: pointer;
    }
  }
}
</style> 