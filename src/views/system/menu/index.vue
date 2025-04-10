<template>
  <div class="app-container">
    <!-- 操作按钮区 -->
    <el-card class="table-wrapper">
      <template #header>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </template>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{ children: 'children' }"
        style="width: 100%"
      >
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="scope">
            <el-icon v-if="scope.row.icon">
              <component :is="scope.row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 1" type="success">目录</el-tag>
            <el-tag v-else-if="scope.row.type === 2" type="warning">菜单</el-tag>
            <el-tag v-else type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column prop="perm" label="权限标识" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="visible" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.visible === 1 ? 'success' : 'danger'">
              {{ scope.row.visible === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="handleAdd(scope.row)"
            >
              新增
            </el-button>
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
    </el-card>

    <!-- 添加/修改抽屉 -->
    <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      :direction="direction"
      size="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.parentId"
            :data="menuOptions"
            :props="{ label: 'name', children: 'children' }"
            placeholder="请选择上级菜单"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path" v-if="form.type !== 3">
          <el-input v-model="form.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="form.type === 2">
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="perm" v-if="form.type === 3">
          <el-input v-model="form.perm" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.type !== 3">
          <el-input v-model="form.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="显示状态" prop="visible">
          <el-radio-group v-model="form.visible">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect" v-if="form.type === 1">
          <el-input v-model="form.redirect" placeholder="请输入重定向路径" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer.visible = false">取 消</el-button>
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
import { getMenuList, getMenuDetail, addMenu, updateMenu, deleteMenu } from '@/api/menu'
import type { Menu, MenuForm } from '@/types/api'

// 菜单列表数据
const menuList = ref<Menu[]>([])
const loading = ref(false)

// 抽屉数据
const drawer = reactive({
  visible: false,
  title: ''
})

// 表单数据
const form = reactive<MenuForm>({
  parentId: 0,
  name: '',
  type: 1,
  path: '',
  component: '',
  perm: '',
  visible: 1,
  sort: 0,
  icon: '',
  redirect: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ],
  perm: [
    { required: true, message: '请输入权限标识', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  visible: [
    { required: true, message: '请选择显示状态', trigger: 'change' }
  ]
}

// 表单ref
const formRef = ref<FormInstance>()

// 菜单选项
const menuOptions = ref<Menu[]>([
  {
    id: 0,
    parentId: 0,
    name: '主目录',
    type: 1,
    path: '',
    component: '',
    perm: '',
    visible: 1,
    sort: 0,
    icon: '',
    redirect: '',
    children: []
  }
])

// 获取菜单列表
const getList = async () => {
  loading.value = true
  try {
    const { data } = await getMenuList()
    menuList.value = data
    menuOptions.value[0].children = data
  } catch (error) {
    console.error('获取菜单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取菜单详情
const getDetail = async (id: number) => {
  const { data } = await getMenuDetail(id)
  return data
}

// 新增菜单
const handleAdd = (row?: Menu) => {
  drawer.title = '新增菜单'
  drawer.visible = true
  Object.assign(form, {
    id: undefined,
    parentId: row?.id || 0,
    name: '',
    type: 1,
    path: '',
    component: '',
    perm: '',
    visible: 1,
    sort: 0,
    icon: '',
    redirect: ''
  })
}

// 修改菜单
const handleUpdate = async (row: Menu) => {
  drawer.title = '修改菜单'
  drawer.visible = true
  const menuDetail = await getDetail(row.id)
  Object.assign(form, menuDetail)
}

// 删除菜单
const handleDelete = (row: Menu) => {
  ElMessageBox.confirm('确认要删除该菜单吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteMenu(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除菜单失败:', error)
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          await updateMenu(form.id, form)
        } else {
          await addMenu(form)
        }
        ElMessage.success('保存成功')
        drawer.visible = false
        getList()
      } catch (error) {
        console.error('保存菜单失败:', error)
      }
    }
  })
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  
  .table-wrapper {
    margin-bottom: 20px;
  }
}
</style> 