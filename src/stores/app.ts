import { defineStore } from 'pinia'

interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  device: 'desktop' | 'mobile'
  size: 'default' | 'medium' | 'small' | 'mini'
  theme: 'light' | 'dark'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      opened: localStorage.getItem('sidebarStatus') ? !!+localStorage.getItem('sidebarStatus')! : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: localStorage.getItem('size') as AppState['size'] || 'default',
    theme: localStorage.getItem('theme') as AppState['theme'] || 'light'
  }),
  
  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if (this.sidebar.opened) {
        localStorage.setItem('sidebarStatus', '1')
      } else {
        localStorage.setItem('sidebarStatus', '0')
      }
    },
    
    closeSidebar(withoutAnimation: boolean) {
      localStorage.setItem('sidebarStatus', '0')
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    
    toggleDevice(device: AppState['device']) {
      this.device = device
    },
    
    setSize(size: AppState['size']) {
      this.size = size
      localStorage.setItem('size', size)
    },
    
    setTheme(theme: AppState['theme']) {
      this.theme = theme
      localStorage.setItem('theme', theme)
    }
  }
}) 