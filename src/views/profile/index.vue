<template>
  <div class="profile-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        class="profile-form"
      >
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" disabled />
        </el-form-item>
        
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/v1/users/me/avatar"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { UserInfo } from '@/stores/user'
import { getToken } from '@/utils/auth'
import type { FormRules } from 'element-plus'

const userStore = useUserStore()
const formRef = ref()

// 表单数据
const userForm = reactive({
  username: userStore.username,
  nickname: userStore.nickname,
  avatar: userStore.avatar,
  mobile: userStore.userInfo?.mobile,
  email: userStore.userInfo?.email
})

// 表单验证规则
const rules = reactive<FormRules>({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  mobile: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email' as const, message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
})

// 上传头像的请求头
const uploadHeaders = {
  Authorization: `Bearer ${getToken()}`
}

// 头像上传成功
const handleAvatarSuccess = (res: any) => {
  userForm.avatar = res.data
  userStore.setUserInfo({ ...userStore.userInfo!, avatar: res.data } as UserInfo)
  ElMessage.success('头像上传成功')
}

// 头像上传前的验证
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    await userStore.updateUserInfo({
      id: userStore.userInfo!.id,
      nickname: userForm.nickname,
      mobile: userForm.mobile,
      email: userForm.email
    })
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    // ElMessage.error('保存失败')
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  
  .profile-form {
    max-width: 600px;
    
    .avatar-uploader {
      :deep(.el-upload) {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        
        &:hover {
          border-color: var(--el-color-primary);
        }
      }
      
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
      }
      
      .avatar {
        width: 100px;
        height: 100px;
        display: block;
      }
    }
  }
}
</style> 