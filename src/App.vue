<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatbotWidget from '@/widgets/ChatbotWidget.vue'
import FooterWidget from '@/widgets/FooterWidget.vue'
import TopNavigationWidget from '@/widgets/TopNavigationWidget.vue'

const route = useRoute()

// 루트 경로('/')일 때만 true를 반환하여 메인 페이지 여부를 감지합니다.
const isHomePage = computed(() => route.path === '/')
</script>

<template>
  <div class="flex flex-col min-h-screen relative">
    <!-- 1. Header Area -->
    <!-- 홈 페이지: 히어로 섹션 위로 투명하게 겹치도록 absolute 처리 -->
    <!-- 그 외 페이지: 기존처럼 공간을 차지하는 기본 형태로 유지 -->
    <TopNavigationWidget
      :class="[
        'w-full z-50 transition-colors duration-300',
        isHomePage
          ? 'absolute top-0 left-0 bg-transparent text-white'
          : 'relative bg-white text-slate-800 border-b border-gray-200',
      ]"
    />

    <!-- 2. Main Content Area -->
    <!-- 홈 페이지: max-w와 padding을 제거하여 100vw, 100vh 전체 화면 허용 -->
    <!-- 그 외 페이지: 기존의 max-w-5xl px-4 py-6 제약 박스 유지 -->
    <main class="flex-1 w-full" :class="isHomePage ? '' : 'max-w-5xl mx-auto px-4 py-6'">
      <router-view />
    </main>

    <!-- 3. Footer -->
    <FooterWidget class="shrink-0 relative z-40" />

    <!-- 4. Chatbot -->
    <ChatbotWidget />
  </div>
</template>
