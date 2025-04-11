<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card class="search-wrapper">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item>
          <el-input
            v-model="queryParams.keywords"
            placeholder="用户名/昵称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区 -->
    <el-card class="table-wrapper">
      <template #header>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </template>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="userList"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            {{ scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="handleUpdate(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

  <!-- 添加/修改对话框 -->
  <el-drawer 
    v-model="dialog.visible" 
    :title="dialog.title"
    :direction="direction">
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
            <el-radio :value="0">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="form.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getUserList, getUserDetail, addUser, updateUser, deleteUser, updateUserStatus } from '@/api/user'
import { getRoleList } from '@/api/role'
import type { User, UserForm, Role } from '@/types/api'
import type { DrawerProps } from 'element-plus'

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keywords: ''
})

// 用户列表数据
const userList = ref<User[]>([])
const total = ref(0)
const loading = ref(false)

// 角色选项
const roleOptions = ref<Role[]>([])

// 对话框数据
const direction = ref<DrawerProps['direction']>('rtl')
const dialog = reactive({
  visible: false,
  title: ''
})

// 表单数据
const form = reactive<UserForm>({
  username: '',
  nickname: '',
  mobile: '',
  gender: 0,
  status: 1,
  roleIds: []
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  roleIds: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 表单ref
const dialogForm = ref<FormInstance>()

// 获取用户列表
const getList = async () => {
  loading.value = true
  try {
    const { data } = await getUserList(queryParams)
    userList.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取用户详情
const getDetail = async(id: number) => {
  return await getUserDetail(id).then(res => {
    return res.data
  })
}

// 获取角色列表
const getRoles = async () => {
  try {
    const { data } = await getRoleList({ pageNum: 1, pageSize: 100 })
    roleOptions.value = data.list
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

// 查询操作
const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

// 重置查询
const resetQuery = () => {
  queryParams.keywords = ''
  handleQuery()
}

// 处理每页数量变化
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  getList()
}

// 新增用户
const handleAdd = () => {
  dialog.title = '新增用户'
  dialog.visible = true
  // 清空表单
  Object.assign(form, {
    id: undefined,
    username: '',
    nickname: '',
    mobile: '',
    gender: 0,
    status: 1,
    roleIds: []
  })
}

// 修改用户
const handleUpdate = async (row: User) => {
  dialog.title = '修改用户'
  dialog.visible = true
  try {
    const user = await getDetail(row.id)
    Object.assign(form, user)
  } catch (error) {
    console.error('获取用户详情失败:', error)
  }
}

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm('确认要删除该用户吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  })
}

// 修改用户状态
const handleStatusChange = async (row: User) => {
  try {
    await updateUserStatus(row.id, row.status)
    ElMessage.success('修改成功')
  } catch (error) {
    console.error('修改状态失败:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!dialogForm.value) return
  
  console.log("handleSubmit: " + JSON.stringify(form))
  await dialogForm.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          await updateUser(form.id, form)
        } else {
          await addUser(form)
        }
        ElMessage.success('保存成功')
        dialog.visible = false
        getList()
      } catch (error) {
        console.error('保存用户失败:', error)
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  if (!dialogForm.value) return
  dialogForm.value.resetFields()
}

// 初始化
onMounted(() => {
  getList()
  getRoles()
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  
  .search-wrapper {
    margin-bottom: 20px;
  }
  
  .table-wrapper {
    margin-bottom: 20px;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}
</style> 