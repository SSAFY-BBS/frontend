<script setup lang="ts">
import ChatbotWidget from '@/widgets/ChatbotWidget.vue';
import FooterWidget from '@/widgets/FooterWidget.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-bg-default p-4 border-b border-border-default shrink-0">
      <div class="max-w-5xl mx-auto flex justify-between items-center px-4">
        <router-link to="/" class="text-2xl font-bold text-primary">LocalHub</router-link>
        <nav>
          <router-link to="/board" class="text-text-base hover:text-primary font-medium">게시판</router-link>
          <router-link to="/festival" class="text-text-base hover:text-primary font-medium">
            축제 캘린더
          </router-link>
        </nav>
      </div>
    </header>

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