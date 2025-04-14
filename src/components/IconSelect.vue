<template>

  <div class="icon-select">
    <el-icon v-if="props.modelValue">
      <component :is="props.modelValue" />
    </el-icon>
  
    <label v-else>请选择图标</label>
    <el-input v-model="search" placeholder="搜索图标" />
    <div class="icon-list">
      <div
        v-for="icon in filteredIcons"
        :key="icon"
        class="icon-item"
        @click="selectIcon(icon)"
      >
        <el-icon>
          <component :is="getIconComponent(icon)" />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')
const icons = ref(Object.keys(ElementPlusIconsVue))

const filteredIcons = computed(() => {
  const result = icons.value.filter(icon => icon.includes(search.value))
  return result
})

const getIconComponent = (icon: string) => {
  return ElementPlusIconsVue[icon as keyof typeof ElementPlusIconsVue]
}

const selectIcon = (icon: string) => {
  emit('update:modelValue', icon)
}
</script>
<script lang="ts">
  export default {
    name: 'IconSelect'
  }
</script>
<style scoped>
.icon-select {
  max-height: 300px;
  overflow-y: auto;
}
.icon-list {
  display: flex;
  flex-wrap: wrap;
}
.icon-item {
  cursor: pointer;
  margin: 5px;
  display: flex;
  align-items: center;
}
.icon-item span {
  margin-left: 5px; /* 图标与文本之间的间距 */
}
</style>