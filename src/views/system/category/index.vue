<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button
            v-hasPerm="['sys:category:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['sys:category:delete']"
            type="danger"
            :disabled="removeIds.length === 0"
            @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>
      </div>

      <el-table
          ref="dataTableRef"
          v-loading="loading"
          :data="pageData"
          highlight-current-row
          border
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
                    <el-table-column
                        key="id"
                        label="序号"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="shopId"
                        label="店铺ID"
                        prop="shopId"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="name"
                        label="分类名称"
                        prop="name"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="sort"
                        label="排序"
                        prop="sort"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="status"
                        label="状态"
                        prop="status"
                        min-width="150"
                        align="center"
                    >
                      <template #default="scope">
                       {{ scope.row.status === 1 ? '显示' : '隐藏' }}
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="createTime"
                        label="创建时间"
                        prop="createTime"
                        min-width="150"
                        align="center"
                    />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
                v-hasPerm="['sys:category:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['sys:category:delete']"
                type="danger"
                size="small"
                link
                @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="handleQuery()"
      />
    </el-card>

    <!-- 分类表单弹窗 -->
    <el-drawer
        v-model="dialog.visible"
        :title="dialog.title"
        :direction="direction"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="店铺ID" prop="shopId">
                      <el-input
                          v-model="formData.shopId"
                          placeholder="请输入店铺ID,当前默认1"
                      />
                </el-form-item>

                <el-form-item label="分类名称" prop="name">
                      <el-input
                          v-model="formData.name"
                          placeholder="请输入分类名称"
                      />
                </el-form-item>

                <el-form-item label="排序" prop="sort">
                      <el-input
                          v-model="formData.sort"
                          placeholder="请输入1,2,3..."
                      />
                </el-form-item>

                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="formData.status">
                    <el-radio :value="1">显示</el-radio>
                    <el-radio :value="0">隐藏</el-radio>
                  </el-radio-group>
                </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  defineOptions({
    name: "Category",
    inheritAttrs: false,
  });

  import CategoryAPI, { CategoryPageVO, CategoryForm, CategoryPageQuery } from "@/api/system/category";
  import type { DrawerProps } from 'element-plus'

  const queryFormRef = ref(ElForm);
  const dataFormRef = ref(ElForm);

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  // 对话框数据
  const direction = ref<DrawerProps['direction']>('rtl')
  const queryParams = reactive<CategoryPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 分类表格数据
  const pageData = ref<CategoryPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 分类表单数据
  const formData = reactive<CategoryForm>({
    status: 1,
    sort: 0,
    shopId: 1
  });

  // 分类表单校验规则
  const rules = reactive({
                      id: [{ required: true, message: "请输入分类ID", trigger: "blur" }],
                      shopId: [{ required: true, message: "请输入店铺ID", trigger: "blur" }],
                      name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
  });

  /** 查询分类 */
  function handleQuery() {
    loading.value = true;
          CategoryAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置分类查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  /** 打开分类弹窗 */
  function handleOpenDialog(id?: number) {
    dialog.visible = true;
    if (id) {
      dialog.title = "修改分类";
            CategoryAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
      });
    } else {
      dialog.title = "新增分类";
    }
  }

  /** 提交分类表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;
        if (id) {
                CategoryAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                CategoryAPI.add(formData)
              .then(() => {
                ElMessage.success("新增成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        }
      }
    });
  }

  /** 关闭分类弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    formData.id = undefined;
  }

  /** 删除分类 */
  function handleDelete(id?: number) {
    const ids = [id || removeIds.value].join(",");
    if (!ids) {
      ElMessage.warning("请勾选删除项");
      return;
    }

    ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(
        () => {
          loading.value = true;
                CategoryAPI.deleteByIds(ids)
              .then(() => {
                ElMessage.success("删除成功");
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        },
        () => {
          ElMessage.info("已取消删除");
        }
    );
  }

  onMounted(() => {
    handleQuery();
  });
</script>
