<template>
  <!-- 전체 래퍼: 스크롤이 가능하도록 h-screen 제거, 배경색 지정 -->
  <div class="relative w-full bg-black font-sans selection:bg-sky-500 selection:text-white">
    <!-- 1. 인트로 애니메이션 오버레이 (Fixed, Z-50) -->
    <div
      v-if="isOverlayRendered"
      :class="[
        'fixed inset-0 z-50 flex items-center justify-center bg-slate-900 text-white transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)]',
        isOverlayHiding ? '-translate-y-full' : 'translate-y-0',
      ]"
    >
      <div class="overflow-hidden">
        <h1 class="text-7xl font-black uppercase tracking-tighter md:text-9xl">
          {{ currentWord }}
        </h1>
      </div>
    </div>

    <!-- 2. 히어로 섹션 (Sticky, Z-10) -->
    <!-- 스크롤 시 화면 상단에 고정되며, 하단 콘텐츠가 이 위를 덮고 올라감 -->
    <section class="sticky top-0 left-0 w-full h-screen overflow-hidden z-10 touch-pan-y">
      <!-- 인피니티 드래그 캐러셀 영역 -->
      <div class="absolute inset-0 z-0">
        <div
          class="flex w-full h-full will-change-transform"
          :style="{
            transform: `translate3d(${-(currentIndex * 100) + dragOffset}%, 0, 0)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
          @transitionend="onTransitionEnd"
        >
          <!-- 복제된 마지막 이미지 (무한 루프용) 부터 원본, 복제된 첫 이미지 순서로 렌더링 -->
          <div
            v-for="(img, i) in extendedImages"
            :key="i"
            class="w-full h-full shrink-0 bg-cover bg-center pointer-events-none"
            :style="{ backgroundImage: `url(${img})` }"
          >
            <div class="absolute inset-0 bg-black/20"></div>
          </div>
        </div>
      </div>

      <!-- 하단 네비게이션 인디케이터 (Dots) -->
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        <button
          v-for="(_, i) in bgImages"
          :key="i"
          class="h-2 rounded-full transition-all duration-300"
          :class="getRealIndex() === i ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'"
          @click="goToSlide(i)"
          :aria-label="`${i + 1}번째 슬라이드로 이동`"
        ></button>
      </div>

      <!-- 비대칭 폴리곤 박스 (기존 레이아웃 유지) -->
      <div
        class="absolute bottom-0 left-0 z-20 w-[90%] max-w-[500px] bg-[#ff8fab] p-12 pt-24 pb-16 text-black"
        style="clip-path: polygon(0 20%, 100% 0, 100% 100%, 0% 100%)"
      >
        <p class="text-lg font-medium leading-relaxed mb-10 w-[80%]">
          서울 싸피인들 만의<br />
          다양한 스팟 정보들을<br />
          이 곳에서 확인해보세요 !
        </p>
        <a
          href="https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex w-fit items-center gap-4 bg-white text-black px-5 py-3 font-bold text-xs tracking-[0.15em] uppercase transition-colors hover:bg-slate-100"
        >
          SSAFY 공식 홈페이지
          <span class="border-l border-slate-300 pl-4 text-lg">↘</span>
        </a>
      </div>

      <!-- 대형 타이포그래피 (기존 레이아웃 유지) -->
      <div class="absolute bottom-16 right-8 md:right-16 z-20 text-right pointer-events-none">
        <h1 class="text-[9vw] leading-[0.85] font-bold tracking-tighter text-white">
          SSAFY<br />
          SEOUL<br />
          COMMUNITY
        </h1>
      </div>
    </section>

    <!-- 3. 메인 콘텐츠 섹션 (Relative, Z-30) -->
    <!-- 히어로 섹션 아래에 위치하며, 스크롤 다운 시 Z-index에 의해 히어로 섹션을 덮음 -->
    <section
      class="relative z-30 w-full min-h-screen bg-slate-50 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pt-12 pb-24"
    >
      <!-- 시각적 유도를 위한 상단 노치 바 (Scroll Indicator) -->
      <div
        class="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-300 rounded-full"
      ></div>

      <!-- 기존 제공된 대시보드 콘텐츠 -->
      <div
        class="max-w-5xl mx-auto py-6 transition-all duration-1000 delay-500 ease-out"
        :class="isOverlayHiding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
      >
        <section
          class="mb-8 overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-10 text-center shadow-[0_20px_45px_-24px_rgba(15,23,42,0.3)]"
        >
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            SSAFY Seoul Community
          </p>
          <h1 class="mt-2 text-3xl font-bold text-slate-800">
            서울에서만 만날 수 있는 정보를 가져가세요!
          </h1>
        </section>

        <div class="mb-6">
          <WeatherWidget />
        </div>

        <div v-if="isLoading" class="flex h-64 items-center justify-center">
          <div
            class="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500"
          ></div>
        </div>

        <div v-else-if="error" class="mb-8 rounded-2xl bg-rose-50 p-6 text-center text-rose-600">
          {{ error }}
          <button @click="refresh" class="ml-4 font-semibold underline hover:text-rose-800">
            다시 시도
          </button>
        </div>

        <div v-else>
          <HowAboutThePlaceWidget />
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import StatsSummaryWidget from '@/widgets/StatsSummaryWidget.vue'
import WeatherWidget from '@/widgets/WeatherWidget.vue'
import HowAboutThePlaceWidget from '@/widgets/HowAboutThePlaceWidget.vue'
import PopularPostsWidget from '@/widgets/PopularPostsWidget.vue'
import CategoryDistributionWidget from '@/widgets/CategoryDistributionWidget.vue'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

const { isLoading, error, summary, topViews, topLikes, categories, refresh } = useDashboard()

// --- 상태 관리 ---
const isOverlayRendered = ref(true)
const isOverlayHiding = ref(false)
const currentWord = ref('')

let carouselTimer: ReturnType<typeof setInterval>

onMounted(() => {
  const flashWords = [
    'Samsung',
    'Software',
    'AI Academy',
    'For',
    'Youth',
    'Seoul',
    'Community',
    'SSAFY',
  ]
  let wordIndex = 0

  const wordInterval = setInterval(() => {
    currentWord.value = flashWords[wordIndex] ?? 'SSAFY'
    wordIndex++

    if (wordIndex === flashWords.length) {
      clearInterval(wordInterval)

      setTimeout(() => {
        isOverlayHiding.value = true

        setTimeout(() => {
          isOverlayRendered.value = false
        }, 1200)
      }, 600)
    }
  }, 160)

  carouselTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % bgImages.length
  }, 5000)
})

onUnmounted(() => {
  clearInterval(carouselTimer)
})

// --- Carousel Logic ---
const bgImages = ['/images/carousel_1.png', '/images/carousel_2.jpg', '/images/carousel_3.png']

// 무한 루프 착시를 위한 앞뒤 복제 배열 구성 (3-1-2-3-1 구조)
const extendedImages = computed(() => [bgImages[bgImages.length - 1], ...bgImages, bgImages[0]])

const currentIndex = ref(1) // 실제 1번 이미지(배열의 인덱스 1)부터 시작
const isDragging = ref(false)
const isTransitioning = ref(false)
const startX = ref(0)
const dragOffset = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

// 사용자에게 보여지는 실제 인덱스 (0, 1, 2) 계산
const getRealIndex = () => {
  if (currentIndex.value === 0) return bgImages.length - 1
  if (currentIndex.value === extendedImages.value.length - 1) return 0
  return currentIndex.value - 1
}

// 1. 포인터 입력 시작
const onPointerDown = (e: PointerEvent) => {
  if (isTransitioning.value) return
  isDragging.value = true
  startX.value = e.clientX
  stopAutoPlay()
}

// 2. 포인터 드래그 이동
const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  const diff = e.clientX - startX.value
  // 이동 거리를 뷰포트 너비 대비 퍼센트로 변환
  dragOffset.value = (diff / window.innerWidth) * 100
}

// 3. 포인터 입력 종료 및 스냅(Snap) 계산
const onPointerUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  isTransitioning.value = true

  // 15% 이상 드래그 시 슬라이드 전환, 그 미만이면 원상복구
  if (dragOffset.value < -15) {
    currentIndex.value++
  } else if (dragOffset.value > 15) {
    currentIndex.value--
  }

  dragOffset.value = 0
  startAutoPlay()
}

// 4. 트랜지션 종료 시 무한 루프 트릭 처리
const onTransitionEnd = () => {
  isTransitioning.value = false

  // 복제된 마지막 슬라이드(0)에 도달하면 실제 마지막 슬라이드로 몰래 이동
  if (currentIndex.value === 0) {
    currentIndex.value = bgImages.length
  }
  // 복제된 첫 슬라이드(N+1)에 도달하면 실제 첫 슬라이드로 몰래 이동
  else if (currentIndex.value === extendedImages.value.length - 1) {
    currentIndex.value = 1
  }
}

// 네비게이션 인디케이터 클릭 이동
const goToSlide = (realIndex: number) => {
  if (isTransitioning.value) return
  currentIndex.value = realIndex + 1
  isTransitioning.value = true
  stopAutoPlay()
  startAutoPlay()
}

// 자동 재생 제어
const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayTimer = setInterval(() => {
    if (!isDragging.value && !isTransitioning.value) {
      isTransitioning.value = true
      currentIndex.value++
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
}

onMounted(() => startAutoPlay())
onUnmounted(() => stopAutoPlay())
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease-in-out;
  position: absolute;
  width: 100%;
  height: 100%;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
