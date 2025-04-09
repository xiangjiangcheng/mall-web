<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card class="search-wrapper">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item>
          <el-input
            v-model="queryParams.keywords"
            placeholder="角色名称"
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
        :data="roleList"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="sort" label="排序" width="80" />
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
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getRoleList, addRole, updateRole, deleteRole, updateRoleStatus } from '@/api/role'
import type { Role, RoleForm } from '@/types/api'

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keywords: ''
})

// 角色列表数据
const roleList = ref<Role[]>([])
const total = ref(0)
const loading = ref(false)

// 对话框数据
const dialog = reactive({
  visible: false,
  title: ''
})

// 表单数据
const form = reactive<RoleForm>({
  name: '',
  code: '',
  sort: 0,
  status: 1,
  description: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 表单ref
const dialogForm = ref<FormInstance>()

// 获取角色列表
const getList = async () => {
  loading.value = true
  try {
    const { data } = await getRoleList(queryParams)
    roleList.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
  } finally {
    loading.value = false
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

// 新增角色
const handleAdd = () => {
  dialog.title = '新增角色'
  dialog.visible = true
  Object.assign(form, {
    id: undefined,
    name: '',
    code: '',
    sort: 0,
    status: 1,
    description: ''
  })
}

// 修改角色
const handleUpdate = (row: Role) => {
  dialog.title = '修改角色'
  dialog.visible = true
  Object.assign(form, row)
}

// 删除角色
const handleDelete = (row: Role) => {
  ElMessageBox.confirm('确认要删除该角色吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteRole(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除角色失败:', error)
    }
  })
}

// 修改角色状态
const handleStatusChange = async (row: Role) => {
  try {
    await updateRoleStatus(row.id, row.status)
    ElMessage.success('修改成功')
  } catch (error) {
    console.error('修改状态失败:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!dialogForm.value) return
  
  await dialogForm.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          await updateRole(form.id, form)
        } else {
          await addRole(form)
        }
        ElMessage.success('保存成功')
        dialog.visible = false
        getList()
      } catch (error) {
        console.error('保存角色失败:', error)
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