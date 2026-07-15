<template>
  <div class="max-w-5xl mx-auto py-6">
    <section class="mb-8 overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-10 text-center shadow-[0_20px_45px_-24px_rgba(15,23,42,0.3)]">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">LocalHub</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-800">서울 지역 정보를 한눈에 만나보세요</h1>
      <p class="mt-3 text-base text-slate-600">
        조회수, 좋아요, 카테고리 기반으로 인기 콘텐츠를 확인할 수 있는 대시보드입니다.
      </p>
    </section>

    <div class="mb-6">
      <WeatherWidget />
    </div>

    <StatsSummaryWidget
      :total-posts="totalPosts"
      :average-views="averageViews"
      :total-likes="totalLikes"
    />

    <div class="mb-10 grid gap-6 lg:grid-cols-2">
      <PopularPostsWidget
        title="조회수 Top 5"
        :items="topByViews"
        bar-color="#38bdf8"
        label="views"
      />
      <PopularPostsWidget
        title="좋아요 Top 5"
        :items="topByLikes"
        bar-color="#fb923c"
        label="likes"
      />
      <CategoryDistributionWidget :items="categoryItems" />
    </div>

    <section class="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.3)]">
      <h2 class="text-lg font-bold text-slate-800">카테고리 바로가기</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-3">
        <router-link
          to="/board?category=tour"
          class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50"
        >
          <img
            src="/images/tourist_spot.webp"
            alt="관광지"
            class="mb-2 h-20 w-full rounded-xl object-cover shadow-sm"
          />
          <span class="font-medium text-slate-700">관광지</span>
        </router-link>

        <router-link
          to="/board?category=food"
          class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50"
        >
          <img
            src="/images/restaurant.jpg"
            alt="맛집"
            class="mb-2 h-20 w-full rounded-xl object-cover shadow-sm"
          />
          <span class="font-medium text-slate-700">맛집</span>
        </router-link>

        <router-link
          to="/board?category=festival"
          class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50"
        >
          <img
            src="/images/festival.jpg"
            alt="축제·행사"
            class="mb-2 h-20 w-full rounded-xl object-cover shadow-sm"
          />
          <span class="font-medium text-slate-700">축제·행사</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import StatsSummaryWidget from '@/widgets/StatsSummaryWidget.vue'
import WeatherWidget from '@/widgets/WeatherWidget.vue'
import PopularPostsWidget from '@/widgets/PopularPostsWidget.vue'
import CategoryDistributionWidget from '@/widgets/CategoryDistributionWidget.vue'

type Category = 'tour' | 'food' | 'festival'

interface MockPost {
  title: string
  views: number
  likes: number
  category: Category
}

const mockPosts = ref<MockPost[]>([
  { title: '서울숲 야간 산책 코스', views: 1820, likes: 124, category: 'tour' },
  { title: '한강공원 피크닉 추천', views: 1605, likes: 98, category: 'food' },
  { title: '2026 서울 축제 일정 정리', views: 1480, likes: 111, category: 'festival' },
  { title: '경복궁 야간 개장 정보', views: 1320, likes: 87, category: 'tour' },
  { title: '성수동 맛집 리스트', views: 1260, likes: 92, category: 'food' },
  { title: '청계천 밤 산책 포인트', views: 1180, likes: 74, category: 'tour' },
])

const totalPosts = computed(() => mockPosts.value.length)
const averageViews = computed(() =>
  Math.round(mockPosts.value.reduce((sum, post) => sum + post.views, 0) / mockPosts.value.length)
)
const totalLikes = computed(() => mockPosts.value.reduce((sum, post) => sum + post.likes, 0))

const topByViews = computed(() =>
  [...mockPosts.value]
    .map(post => ({ title: post.title, value: post.views }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
)

const topByLikes = computed(() =>
  [...mockPosts.value]
    .map(post => ({ title: post.title, value: post.likes }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
)

const categoryItems = computed(() => [
  { label: 'tour', value: mockPosts.value.filter(post => post.category === 'tour').length, color: '#38bdf8' },
  { label: 'food', value: mockPosts.value.filter(post => post.category === 'food').length, color: '#fb923c' },
  { label: 'festival', value: mockPosts.value.filter(post => post.category === 'festival').length, color: '#818cf8' },
])
</script>
