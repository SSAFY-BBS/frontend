<script setup lang="ts">
import ChatbotWidget from '@/widgets/ChatbotWidget.vue';
</script>

<template>
  <!-- 전역 공통 헤더 (필요 시 widgets/HeaderWidget.vue 등으로 분리 가능) -->
  <header class="bg-gray-100 p-4 border-b">
    <div class="max-w-5xl mx-auto flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold text-sky-500">LocalHub</router-link>
      <nav>
        <router-link to="/board" class="text-gray-600 hover:text-sky-500 font-medium">게시판</router-link>
      </nav>
    </div>
  </header>

  <!-- URL에 따라 매핑된 페이지 컴포넌트가 렌더링되는 영역 -->
  <main class="min-h-screen">
    <router-view />
  </main>

  <!-- 전역 플로팅 챗봇 위젯 -->
  <ChatbotWidget />
</template>

<style scoped>
/* Tailwind를 사용하므로 추가 scoped CSS는 최소화합니다. */
</style>