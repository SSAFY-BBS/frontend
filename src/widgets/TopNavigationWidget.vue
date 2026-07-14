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

      <div class="flex items-center gap-3">
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

        <!-- Online count badge -->
        <div class="hidden items-center gap-2 rounded-md bg-slate-50 px-3 py-1 text-sm text-slate-600 md:flex">
          <svg class="h-4 w-4 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM12 14c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z"></path></svg>
          <span class="text-xs text-slate-500">접속</span>
          <span class="ml-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">{{ onlineCount }}</span>
        </div>

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
          <div class="mt-2 flex items-center gap-2 px-2">
            <svg class="h-4 w-4 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM12 14c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z"></path></svg>
            <span class="text-sm text-slate-600">접속 <span class="font-semibold">{{ onlineCount }}</span></span>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import confetti from 'canvas-confetti'

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

const triggerFireworks = () => {
  const duration = 2000; // 2초간 지속
  const end = Date.now() + duration;

  // LocalHub의 테마 컬러(하늘색 계열)를 폭죽 색상으로 지정
  const colors = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

// --- WebSocket + online count logic ---
const onlineCount = ref<number>(0)
let ws: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let backoff = 1000

watch(onlineCount, (newVal, oldVal) => {
  // 초기 로딩(oldVal이 0)일 때는 터뜨리지 않고, 누군가 새로 들어왔을 때만 트리거
  if (oldVal !== 0 && newVal > oldVal) {
    triggerFireworks();
  }
});

const WS_URL = import.meta.env.VITE_WS_URL ?? `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/notifications`

const connectWS = () => {
  try {
    ws = new WebSocket(WS_URL)
  } catch (e) {
    scheduleReconnect()
    return
  }

  ws.onopen = () => {
    backoff = 1000
  }

  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data)
      if (data && data.type === 'online_count' && typeof data.online_count === 'number') {
        onlineCount.value = data.online_count
      }
    } catch (e) {
      // ignore malformed messages
    }
  }

  ws.onclose = () => {
    scheduleReconnect()
  }

  ws.onerror = () => {
    ws?.close()
  }
}

const scheduleReconnect = () => {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectWS()
  }, backoff)
  backoff = Math.min(backoff * 2, 16000)
}

onMounted(() => {
  connectWS()
})

onBeforeUnmount(() => {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  reconnectTimer = null
  if (ws) {
    try { ws.close() } catch {}
    ws = null
  }
})
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