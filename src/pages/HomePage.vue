<template>
  <div class="max-w-5xl mx-auto py-6">
    <section
      class="mb-8 overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-10 text-center shadow-[0_20px_45px_-24px_rgba(15,23,42,0.3)]"
    >
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">LocalHub</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-800">서울 지역 정보를 한눈에 만나보세요</h1>
      <p class="mt-3 text-base text-slate-600">
        조회수, 좋아요, 카테고리 기반으로 인기 콘텐츠를 확인할 수 있는 대시보드입니다.
      </p>
    </section>

    <div class="mb-6">
      <WeatherWidget />
    </div>

    <div v-if="isLoading" class="flex h-64 items-center justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500"></div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="mb-8 rounded-2xl bg-rose-50 p-6 text-center text-rose-600">
      {{ error }}
      <button @click="refresh" class="ml-4 font-semibold underline hover:text-rose-800">
        다시 시도
      </button>
    </div>

    <!-- API 데이터 렌더링 영역 -->
    <div v-else>
      <StatsSummaryWidget
        :total-posts="summary.total_posts"
        :average-views="summary.average_views"
        :total-likes="summary.total_likes"
      />
      <div class="mb-10 grid gap-6 lg:grid-cols-2">
        <PopularPostsWidget
          title="조회수 Top 5"
          :items="topViews"
          bar-color="#38bdf8"
          label="views"
        />
        <PopularPostsWidget
          title="좋아요 Top 5"
          :items="topLikes"
          bar-color="#fb923c"
          label="likes"
        />
        <CategoryDistributionWidget :items="categories" />
      </div>
    </div>

    <section
      class="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.3)]"
    >
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
import StatsSummaryWidget from '@/widgets/StatsSummaryWidget.vue'
import WeatherWidget from '@/widgets/WeatherWidget.vue'
import PopularPostsWidget from '@/widgets/PopularPostsWidget.vue'
import CategoryDistributionWidget from '@/widgets/CategoryDistributionWidget.vue'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

const { isLoading, error, summary, topViews, topLikes, categories, refresh } = useDashboard()
</script>
