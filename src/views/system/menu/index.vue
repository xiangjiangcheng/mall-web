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
            <el-tag v-if="scope.row.type === MenuTypeEnum.CATALOG" type="success">目录</el-tag>
            <el-tag v-else-if="scope.row.type === MenuTypeEnum.MENU" type="warning">菜单</el-tag>
            <el-tag v-else-if="scope.row.type === MenuTypeEnum.EXTLINK" type="info">外链</el-tag>
            <el-tag v-else type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="routePath" label="路由路径" />
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
            :props="{ label: 'name', children: 'children', value: 'id' }"
            placeholder="请选择上级菜单"
            check-strictly
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :value="MenuTypeEnum.CATALOG">目录</el-radio>
            <el-radio :value="MenuTypeEnum.MENU">菜单</el-radio>
            <el-radio :value="MenuTypeEnum.EXTLINK">外链</el-radio>
            <el-radio :value="MenuTypeEnum.BUTTON">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="routePath" v-if="form.type === MenuTypeEnum.CATALOG || form.type === MenuTypeEnum.MENU">
          <template #label>
            <div class="flex-y-center">
              路由路径
              <el-tooltip placement="bottom" effect="light">
                <template #content>
                  定义应用中不同页面对应的 URL 路径，目录需以 / 开头，菜单项不用。例如：系统管理目录
                  /system，系统管理下的用户管理菜单 user。
                </template>
                <el-icon class="ml-1 cursor-pointer">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="form.routePath" placeholder="请输入路由路径如：/system" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="form.type === MenuTypeEnum.MENU">
          <el-input v-model="form.component" placeholder="请输入组件路径, 如：system/user/index" />
        </el-form-item>
        <el-form-item label="权限标识" prop="perm"  v-if="form.type === MenuTypeEnum.BUTTON">
          <el-input v-model="form.perm" placeholder="请输入权限标识, 如：sys:user:list" />
        </el-form-item>
        <el-form-item label="外链地址" prop="externalLink" v-if="form.type === MenuTypeEnum.EXTLINK">
          <el-input v-model="form.externalLink" placeholder="请输入外链地址" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.type === MenuTypeEnum.CATALOG || form.type === MenuTypeEnum.MENU">
          <!-- 图标选择器 -->
          <icon-select v-model="form.icon" />
        </el-form-item>
        <el-form-item label="显示状态" prop="visible">
          <el-radio-group v-model="form.visible">
            <el-radio :value="1">显示</el-radio>
            <el-radio :value="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect" v-if="form.type === MenuTypeEnum.MENU">
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
import { MenuTypeEnum } from '@/enums/menu.enum'
import IconSelect from '@/components/IconSelect.vue'
import type { DrawerProps } from 'element-plus'
// 菜单列表数据
const menuList = ref<Menu[]>([])
const loading = ref(false)

// 抽屉数据
const direction = ref<DrawerProps['direction']>('rtl')
const drawer = reactive({
  visible: false,
  title: ''
})

// 表单数据
const form = reactive<MenuForm>({
  parentId: 0,
  name: '',
  type: MenuTypeEnum.CATALOG,
  routePath: '',
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
  routePath: [
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
    type: MenuTypeEnum.CATALOG,
    routePath: '',
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
    const data = await getMenuList()
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
  const data = await getMenuDetail(id)
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
    type: MenuTypeEnum.CATALOG,
    routePath: '',
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
  padding: 2px;
  
  .table-wrapper {
    margin-bottom: 20px;
  }
}
</style> 