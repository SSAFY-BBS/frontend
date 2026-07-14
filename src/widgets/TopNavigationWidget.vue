<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <router-link to="/" class="group flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-lg font-black text-white shadow-[0_10px_24px_-12px_rgba(14,116,144,0.65)] transition-transform duration-300 group-hover:scale-105">
          L
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-bold tracking-tight text-slate-800">LocalHub</span>
          <span class="text-[11px] font-medium uppercase tracking-[0.28em] text-sky-600">Seoul info</span>
        </div>
      </router-link>

      <nav class="hidden items-center gap-2 md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-sky-50 hover:text-sky-700"
          :class="isActive(item.to) ? 'bg-sky-500 text-white shadow-[0_10px_24px_-14px_rgba(14,116,144,0.7)]' : ''"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <button
        class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-sky-300 hover:text-sky-700 md:hidden"
        @click="toggleMenu"
        aria-label="메뉴 열기"
      >
        <svg v-if="!isMobileMenuOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </svg>
      </button>
    </div>

    <transition name="slide-down">
      <div
        v-if="isMobileMenuOpen"
        class="border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_10px_30px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl md:hidden"
      >
        <div class="mx-auto flex max-w-5xl flex-col gap-2">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300"
            :class="isActive(item.to)
              ? 'bg-sky-500 text-white shadow-[0_10px_24px_-14px_rgba(14,116,144,0.7)]'
              : 'bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-700'"
            @click="closeMenu"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navItems = [
  { label: '홈', to: '/' },
  { label: '게시판', to: '/board' },
  { label: '축제 캘린더', to: '/festival' },
]

const isActive = (to: string) => {
  if (to === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(to)
}

const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMenu = () => {
  isMobileMenuOpen.value = false
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>