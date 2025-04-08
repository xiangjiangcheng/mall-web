import { defineStore } from 'pinia'
import type { TabItem, TabsState } from '@/types/tabs'

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => ({
    visitedTabs: [],
    cachedTabs: []
  }),
  
  actions: {
    // 添加标签页
    addTab(tab: TabItem) {
      if (this.visitedTabs.some(v => v.path === tab.path)) return
      this.visitedTabs.push(tab)
      if (tab.name) {
        this.cachedTabs.push(tab.name)
      }
    },
    
    // 删除标签页
    removeTab(tab: TabItem) {
      const index = this.visitedTabs.findIndex(v => v.path === tab.path)
      if (index > -1) {
        this.visitedTabs.splice(index, 1)
        if (tab.name) {
          const cachedIndex = this.cachedTabs.indexOf(tab.name)
          if (cachedIndex > -1) {
            this.cachedTabs.splice(cachedIndex, 1)
          }
        }
      }
    },
    
    // 关闭其他标签页
    closeOtherTabs(tab: TabItem) {
      this.visitedTabs = this.visitedTabs.filter(v => v.path === tab.path)
      this.cachedTabs = this.cachedTabs.filter(v => v === tab.name)
    },
    
    // 关闭所有标签页
    closeAllTabs() {
      this.visitedTabs = []
      this.cachedTabs = []
    },
    
    // 刷新标签页
    refreshTab(tab: TabItem) {
      return tab.fullPath
    }
  }
}) 