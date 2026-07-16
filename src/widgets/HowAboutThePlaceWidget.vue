<template>
  <section class="py-12 bg-slate-50/50">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">이런 서울 컨텐츠는 어때요?</h2>
      </div>

      <div v-if="isLoading" class="flex justify-center py-32">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 7개 아이템 렌더링 -->
        <article
          v-for="item in recommendedItems"
          :key="item.contentid"
          class="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <!-- 썸네일 영역 -->
          <div class="relative h-48 w-full overflow-hidden bg-slate-100">
            <!-- 이미지가 존재할 때 -->
            <template v-if="item.firstimage">
              <img
                :src="item.firstimage"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <!-- 그라데이션 오버레이 -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              ></div>
            </template>

            <!-- 이미지가 없을 때 (회색 SSAFY 텍스트) -->
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-3xl font-black text-slate-300 tracking-widest select-none"
                >SSAFY</span
              >
            </div>
          </div>

          <!-- 콘텐츠 영역 -->
          <div class="p-5 flex flex-col flex-1">
            <span class="text-[10px] font-bold text-sky-600 mb-1.5 tracking-wider uppercase">
              {{ item.cat2 || 'SEOUL' }}
            </span>

            <h3
              class="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors"
            >
              {{ item.title }}
            </h3>

            <!-- 장소 정보 렌더링 -->
            <p class="text-xs text-slate-500 mb-4 line-clamp-1 flex items-center gap-1">
              <svg
                class="w-3.5 h-3.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <!-- addr1 값이 없으면 논리합 연산자로 안내 문구 대체 -->
              {{ item.addr1 || '장소 정보가 없습니다.' }}
            </p>

            <div class="mt-auto pt-4 flex flex-wrap gap-2">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600 whitespace-nowrap"
              >
                # {{ item.searchDescription || '지역 명소' }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchRandomPlaces, fetchSearchCategory, type TourItem } from '@/features/places/api'

const recommendedItems = ref<TourItem[]>([])
const isLoading = ref(true)

const loadRecommendations = async () => {
  isLoading.value = true
  try {
    // 1. API 모듈을 통해 7개의 무작위 서울 콘텐츠 페치
    const baseItems = await fetchRandomPlaces(7)

    // 2. 각 아이템의 title을 기반으로 검색 API 호출
    const itemsWithCategory = await Promise.all(
      baseItems.map(async (item) => {
        // fetchSearchCategory로 함수명 변경 (api 모듈 수정 사항 반영)
        const category = await fetchSearchCategory(item.title)

        // 데이터 속성명은 템플릿과 호환성을 위해 searchDescription 유지 또는 searchCategory로 통일
        return { ...item, searchDescription: category }
      }),
    )

    recommendedItems.value = itemsWithCategory
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
