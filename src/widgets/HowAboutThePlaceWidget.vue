<template>
  <section class="py-12">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">이런 서울 컨텐츠는 어때요?</h2>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 7개 아이템 렌더링 (마지막 아이템은 lg 사이즈에서 3칸 차지 등 그리드 조정 가능) -->
        <article
          v-for="item in recommendedItems"
          :key="item.contentid"
          class="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div class="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              :src="item.firstimage || '/images/placeholder.jpg'"
              :alt="item.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div class="p-5 flex flex-col flex-1">
            <span class="text-[10px] font-bold text-sky-600 mb-1 tracking-wider uppercase">
              {{ item.cat2 || 'SEOUL' }}
            </span>
            <h3 class="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{{ item.title }}</h3>
            <p class="text-xs text-slate-500 mb-4 line-clamp-1">{{ item.addr1 }}</p>

            <!-- 검색 API를 통해 가져온 상세 설명 -->
            <p class="text-sm text-slate-600 line-clamp-3 mt-auto">
              {{ item.searchDescription || '설명을 불러오는 중입니다...' }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// API 응답 타입 정의
interface TourItem {
  contentid: string
  title: string
  addr1: string
  firstimage: string
  cat2: string
  searchDescription?: string // 검색 API로 추가될 속성
}

const recommendedItems = ref<TourItem[]>([])
const isLoading = ref(true)

// 네이버 검색 API(백과사전 또는 지역) 호출 모의 함수
// 실제 환경에서는 CORS 문제로 인해 프론트엔드에서 직접 호출이 불가능할 수 있습니다.
const fetchSearchDescription = async (query: string): Promise<string> => {
  try {
    // 주의: 프론트엔드에서 API 키를 직접 사용하는 것은 보안상 금지됩니다.
    // 하단 '실무 관점' 섹션의 BFF 패턴 설명을 참조하십시오.
    const response = await fetch(`/api/search/naver?query=${encodeURIComponent(query)}`)
    if (!response.ok) return '상세 정보를 찾을 수 없습니다.'

    const data = await response.json()
    // 네이버 API 응답의 첫 번째 항목 요약 텍스트 반환 (HTML 태그 제거)
    return (
      data.items[0]?.description.replace(/(<([^>]+)>)/gi, '') || '상세 정보를 찾을 수 없습니다.'
    )
  } catch (error) {
    return '설명 로드 실패'
  }
}

const loadRecommendations = async () => {
  isLoading.value = true
  try {
    // 1. 백엔드에서 7개의 무작위 서울 콘텐츠 페치
    const response = await fetch('/api/places/random?limit=7')
    const data = await response.json()
    const baseItems: TourItem[] = data.items

    // 2. 각 아이템의 title을 기반으로 검색 API 동시 호출 (Promise.all)
    const itemsWithDescriptions = await Promise.all(
      baseItems.map(async (item) => {
        const description = await fetchSearchDescription(item.title)
        return { ...item, searchDescription: description }
      }),
    )

    recommendedItems.value = itemsWithDescriptions
  } catch (error) {
    console.error('추천 콘텐츠 로드 실패:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadRecommendations()
})
</script>
