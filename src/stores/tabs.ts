import { defineStore } from 'pinia'
import type { TabItem, TabsState } from '@/types/tabs'

const TABS_KEY = 'visited_tabs'

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => {
    // 从 localStorage 获取已保存的标签页
    const savedTabs = localStorage.getItem(TABS_KEY)
    const visitedTabs = savedTabs ? JSON.parse(savedTabs) : []
    
    return {
      visitedTabs,
      cachedTabs: visitedTabs.map((tab: TabItem) => tab.name).filter(Boolean)
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
      this.saveTabs()
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
        this.saveTabs()
      }
    },
    
    // 关闭其他标签页
    closeOtherTabs(tab: TabItem) {
      this.visitedTabs = this.visitedTabs.filter(
        (item) => item.path === '/dashboard' || item.path === tab.path
      )
      this.cachedTabs = this.visitedTabs.map(tab => tab.name).filter(Boolean)
      this.saveTabs()
    },
    
    // 关闭所有标签页
    closeAllTabs(keepHome = false) {
      if (keepHome) {
        this.visitedTabs = this.visitedTabs.filter((item) => item.path === '/dashboard')
      } else {
        this.visitedTabs = []
      }
      this.cachedTabs = this.visitedTabs.map(tab => tab.name).filter(Boolean)
      this.saveTabs()
    },
    
    // 刷新标签页
    refreshTab(tab: TabItem) {
      return tab.fullPath
    },

    // 保存标签页到 localStorage
    saveTabs() {
      localStorage.setItem(TABS_KEY, JSON.stringify(this.visitedTabs))
    },

    // 初始化首页标签
    initHomeTab(tab: TabItem) {
      if (!this.visitedTabs.some(v => v.path === '/dashboard')) {
        this.addTab(tab)
      }
    }
  }
}) 