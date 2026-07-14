<script setup lang="ts">
import ChatbotWidget from '@/widgets/ChatbotWidget.vue';
import FooterWidget from '@/widgets/FooterWidget.vue';
import TopNavigationWidget from '@/widgets/TopNavigationWidget.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <TopNavigationWidget />

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
      <router-view />
    </main>

    <!-- Footer -->
    <FooterWidget class="shrink-0" />

    <!-- Chatbot -->
    <ChatbotWidget />
  </div>
</template>