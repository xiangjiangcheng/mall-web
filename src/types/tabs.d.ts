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
}

export interface TabsState {
  visitedTabs: TabItem[]
  cachedTabs: string[]
} 