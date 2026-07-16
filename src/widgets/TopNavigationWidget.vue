<template>
  <header
    class="fixed top-4 left-4 right-4 z-50 mx-auto max-w-[1600px] rounded-2xl border border-slate-200 bg-white/95 px-5 py-2.5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300"
  >
    <div class="flex items-center justify-between gap-6">
      <!-- 1. Left: Logo & Navigation -->
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-3xl font-black tracking-tighter text-slate-900">
          BBS.
        </router-link>

        <nav class="hidden items-center gap-6 xl:flex">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="group flex items-center gap-1.5 text-[15px] font-medium text-slate-700 transition-colors hover:text-black"
            :class="{ 'font-bold text-black': isActive(item.to) }"
            :title="item.tooltip"
          >
            {{ item.label }}

            <!-- 'New' Badge (e.g. Academy New) -->
            <span
              v-if="item.isNew"
              class="ml-0.5 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white"
            >
              NEW
            </span>
          </router-link>
        </nav>
      </div>

      <!-- 3. Right: Auth & Action Buttons -->
      <div class="flex items-center gap-4">
        <!-- Auth Links -->

        <!-- Be Pro (Solid Black Button) -> Online Count -->
        <div
          class="hidden h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 sm:flex"
        >
          <svg
            class="mr-2 h-4 w-4 text-sky-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM12 14c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z"
            ></path>
          </svg>
          {{ onlineCount }} Online
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-400 xl:hidden"
          @click="toggleMenu"
          aria-label="메뉴 열기"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
          <svg
            v-else
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown -->
    <transition name="slide-down">
      <div v-if="isMobileMenuOpen" class="mt-3 border-t border-slate-100 pt-3 xl:hidden">
        <div class="flex flex-col gap-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors"
            :class="
              isActive(item.to)
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
            @click="closeMenu"
          >
            {{ item.label }}
            <span
              v-if="item.isNew"
              class="ml-2 rounded bg-sky-500 px-1.5 py-0.5 text-[10px] font-bold text-white"
              >NEW</span
            >
          </router-link>

          <div class="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span class="text-sm font-semibold text-slate-600">접속 중인 유저</span>
            <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">{{
              onlineCount
            }}</span>
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

// 레퍼런스의 'Dropdown' 및 'New' 뱃지 UI 트리거 속성 추가
const navItems = [
  { label: '게시판', to: '/board' },
  { label: '축제 캘린더', to: '/festival' },
  { label: '지도', to: '/map' },
  {
    label: '저는 친구가 없어요',
    to: '/meal-friend',
    isNew: true,
    tooltip: '아 점심 누구랑 먹지 들어온지 얼마 안돼서 사람들이랑 친해지고',
  },
  {
    label: '아 떠들고 싶다',
    to: '/chat',
    isNew: true,
    tooltip: '단체 채팅한번 신나게 놀아볼까잉?',
  },
]

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
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
  const duration = 2000
  const end = Date.now() + duration
  const colors = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#ffffff']

  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: colors })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: colors })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

const onlineCount = ref<number>(0)
let ws: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let backoff = 1000

watch(onlineCount, (newVal, oldVal) => {
  if (oldVal !== 0 && newVal > oldVal) {
    triggerFireworks()
  }
})

const WS_URL =
  import.meta.env.VITE_WS_URL ??
  `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/notifications`

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
    } catch (e) {}
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
    try {
      ws.close()
    } catch {}
    ws = null
  }
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
