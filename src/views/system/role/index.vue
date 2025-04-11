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
              type="primary"
              link
              @click="handleAssignPermission(scope.row)"
            >
              分配权限
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
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
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

    <!-- 分配权限对话框 -->
    <el-drawer 
      v-model="permissionDrawer.visible"
      :title="permissionDrawer.title"
      :direction="direction">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name" disabled />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="permissionTree"
            :data="treeData"
            :props="defaultProps"
            node-key="value"
            show-checkbox
            default-expand-all
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="permissionDrawer.visible = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { 
  getRoleList, 
  getRoleDetail, 
  addRole, 
  updateRole, 
  deleteRole, 
  updateRoleStatus, 
  getRolePermissions as fetchRolePermissions,
  assignPermissions 
} from '@/api/role'
import { getPermissionTree as fetchPermissionTree } from '@/api/menu'
import type { Role, RoleForm } from '@/types/api'
import type { DrawerProps } from 'element-plus'

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

// 分配权限抽屉数据
const direction = ref<DrawerProps['direction']>('rtl')
const permissionDrawer = reactive({
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

// 获取角色详情
const getDetail = async (id: number) => {
  const { data } = await getRoleDetail(id)
  return data
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
const handleUpdate = async (row: Role) => {
  dialog.title = '修改角色'
  dialog.visible = true
  const roleDetail = await getDetail(row.id)
  Object.assign(form, roleDetail)
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

const treeData = ref([])
const permissionTree = ref()
const defaultProps = {
  children: 'children',
  label: 'label',
  value: 'value'
}

// 获取权限树数据
const getPermissionTree = async () => {
  const { data } = await fetchPermissionTree()
  treeData.value = data
}

// 获取角色权限
const getRolePermissions = async (roleId: number) => {
  const { data } = await fetchRolePermissions(roleId)
  // 等待树形数据渲染完成
  await nextTick()
  // 设置选中状态
  data.forEach((menuId: any) => {
     permissionTree.value!.setChecked(menuId, true, false)
  })
 
}

// 打开分配权限抽屉
const handleAssignPermission = async (row: Role) => {
  // 重置数据
  treeData.value = []
  
  permissionDrawer.visible = true
  permissionDrawer.title = `分配权限 - ${row.name}`
  form.name = row.name
  form.id = row.id
  
  // 先获取权限树
  await getPermissionTree()
  // 再获取角色权限
  await getRolePermissions(row.id)
}

// 提交权限分配
const handlePermissionSubmit = async () => {
  if (!form.id) return
  
  const checkedNodes = permissionTree.value?.getCheckedKeys() || []
  const halfCheckedNodes = permissionTree.value?.getHalfCheckedKeys() || []
  const permissionIds = [...checkedNodes, ...halfCheckedNodes]
  
  const { data } = await assignPermissions({
    roleId: form.id,
    menuIds: permissionIds
  })
  
  ElMessage.success('分配权限成功')
  permissionDrawer.visible = false
  getList()
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