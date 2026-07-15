import { ref, onMounted } from 'vue'
import { dashboardApi, type DashboardStats } from '@/features/dashboard/api'

// 카테고리별 고정 색상 매핑
const CATEGORY_COLORS: Record<string, string> = {
  tour: '#38bdf8', // 관광지 (Sky)
  food: '#f472b6', // 맛집 (Pink)
  festival: '#fbbf24', // 축제 (Amber)
}

export function useDashboard() {
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const summary = ref<DashboardStats['summary']>({
    total_posts: 0,
    average_views: 0,
    total_likes: 0,
  })
  const topViews = ref<DashboardStats['top_views']>([])
  const topLikes = ref<DashboardStats['top_likes']>([])
  const categories = ref<Array<{ label: string; value: number; color: string }>>([])

  const fetchDashboardData = async () => {
    isLoading.value = true
    error.value = null
    try {
      const data = await dashboardApi.getStats()

      summary.value = data.summary
      topViews.value = data.top_views
      topLikes.value = data.top_likes

      // 카테고리 데이터에 색상 정보 주입
      categories.value = data.categories.map((cat) => ({
        ...cat,
        color: CATEGORY_COLORS[cat.label] || '#94a3b8', // 기본 색상(Slate)
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchDashboardData()
  })

  return {
    isLoading,
    error,
    summary,
    topViews,
    topLikes,
    categories,
    refresh: fetchDashboardData,
  }
}
