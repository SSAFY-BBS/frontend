const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export interface DashboardStats {
  summary: {
    total_posts: number
    average_views: number
    total_likes: number
  }
  top_views: { title: string; value: number }[]
  top_likes: { title: string; value: number }[]
  categories: { label: string; value: number }[]
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`)
    if (!response.ok) {
      throw new Error('대시보드 데이터를 불러오는데 실패했습니다.')
    }
    return response.json()
  },
}
