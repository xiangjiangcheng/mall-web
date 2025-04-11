<template>
  <div class="icon-select">
    <el-input v-model="search" placeholder="搜索图标" />
    <div class="icon-list">
      <div
        v-for="icon in filteredIcons"
        :key="icon"
        class="icon-item"
        @click="selectIcon(icon)"
      >
        <el-icon :component="getIconComponent(icon)" />
        <span>{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: '',
      icons: Object.keys(ElementPlusIconsVue),
    }
  },
  computed: {
    filteredIcons() {
      return this.icons.filter(icon => icon.includes(this.search))
    }
  },
  methods: {
    getIconComponent(icon) {
      return ElementPlusIconsVue[icon]
    },
    selectIcon(icon) {
      this.$emit('update:modelValue', icon)
    }
  }
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