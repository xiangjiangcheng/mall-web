export interface TabItem {
  path: string
  title: string
  name: string
  fullPath: string
  query?: any
  params?: any
  meta?: {
    title: string
    icon?: string
  }
  children?: TabItem[]
}

export interface TabsState {
  visitedTabs: TabItem[]
  cachedTabs: string[]
  activeTab: string
  tabs: TabItem[]
} 