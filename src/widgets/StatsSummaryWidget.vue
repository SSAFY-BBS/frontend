<script setup lang="ts">
defineProps<{
  totalPosts: number
  averageViews: number
  totalLikes: number
}>()
</script>

<template>
  <section class="relative mb-8 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400" />
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Dashboard</p>
        <h2 class="mt-1 text-xl font-bold text-slate-800">서울 지역 인기 지표</h2>
        <p class="mt-2 text-sm text-slate-600">
          조회수·좋아요·카테고리 기준으로 한눈에 보는 콘텐츠 반응도
        </p>
      </div>
      <span class="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
        Mock Data
      </span>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <div class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-18px_rgba(14,116,144,0.55)]">
        <p class="text-sm text-slate-500">총 게시글</p>
        <p class="mt-2 text-2xl font-bold text-slate-800">{{ totalPosts }}</p>
      </div>

      <div class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-18px_rgba(14,116,144,0.55)]">
        <p class="text-sm text-slate-500">평균 조회수</p>
        <p class="mt-2 text-2xl font-bold text-slate-800">{{ averageViews }}</p>
      </div>

      <div class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-18px_rgba(14,116,144,0.55)]">
        <p class="text-sm text-slate-500">좋아요 총합</p>
        <p class="mt-2 text-2xl font-bold text-slate-800">{{ totalLikes }}</p>
      </div>
    </div>
  </section>
</template>