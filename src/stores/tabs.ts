import { defineStore } from 'pinia'
import type { TabItem, TabsState } from '@/types/tabs'

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => {
    const visitedTabs: TabItem[] = []
    
    return {
      visitedTabs,
      cachedTabs: visitedTabs.map((tab: TabItem) => tab.name).filter(Boolean),
      activeTab: '',
      tabs: visitedTabs
    }
  },
  
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
      this.visitedTabs = this.visitedTabs.filter(
        (item) => item.path === '/dashboard' || item.path === tab.path
      )
      this.cachedTabs = this.visitedTabs.map(tab => tab.name).filter(Boolean)
    },
    
    // 关闭所有标签页
    closeAllTabs(keepHome = false) {
      console.log('closeAllTabs', keepHome) 
      if (keepHome) {
        this.visitedTabs = this.visitedTabs.filter((item) => item.path === '/dashboard')
      } else {
        this.visitedTabs = []
      }
      this.cachedTabs = this.visitedTabs.map(tab => tab.name).filter(Boolean)
    },
    
    // 刷新标签页
    refreshTab(tab: TabItem) {
      return tab.fullPath
    },


    // 初始化首页标签
    initHomeTab(tab: TabItem) {
      console.log('initHomeTab', tab)
      if (!this.visitedTabs.some(v => v.path === '/dashboard')) {
        this.addTab(tab)
      }
    },

    setActiveTab(path: string) {
      this.activeTab = path
    }
  }
}) 