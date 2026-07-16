<template>
  <!-- 최상위 컨테이너를 viewport 우측 하단에 고정 -->
  <div class="fixed bottom-4 right-4 z-[100] sm:bottom-6 sm:right-6 flex flex-col items-end">
    <!-- 상태 1: 플로팅 버튼 -->
    <transition name="scale-fade">
      <button
        v-if="!isOpen"
        @click="isOpen = true"
        class="w-14 h-14 bg-white border-2 border-sky-500 rounded-full flex flex-col items-center justify-center text-sky-500 shadow-lg hover:bg-sky-50 transition-colors"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          ></path>
        </svg>
        <span class="text-[10px] mt-0.5 font-bold">챗봇</span>
      </button>
    </transition>

    <!-- 상태 2: 챗봇 윈도우 -->
    <transition name="slide-up">
      <div
        v-if="isOpen"
        class="absolute bottom-0 right-0 w-[calc(100vw-2rem)] sm:w-96 h-[32rem] bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden origin-bottom-right"
      >
        <!-- Header -->
        <div class="bg-sky-500 text-white p-4 flex justify-between items-center shrink-0">
          <div class="flex items-center gap-2">
            <span class="font-bold tracking-wide">BBS 챗봇</span>
          </div>
          <button @click="isOpen = false" class="text-white hover:text-sky-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Chat History -->
        <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50" ref="chatContainer">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="[
              'max-w-[85%] rounded-2xl p-3 text-[13px] leading-relaxed shadow-sm',
              msg.isMine
                ? 'bg-sky-500 text-white self-end rounded-tr-sm'
                : 'bg-white text-slate-700 self-start border border-slate-100 rounded-tl-sm',
            ]"
          >
            {{ msg.text }}
          </div>
          <div
            v-if="isTyping"
            class="max-w-[85%] rounded-2xl p-3 text-[13px] bg-white text-slate-500 self-start border border-slate-100 rounded-tl-sm flex items-center gap-1.5 shadow-sm"
          >
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
          <input
            v-model="inputMsg"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="메시지를 입력하세요"
            class="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-shadow"
          />
          <button
            @click="sendMessage"
            class="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors whitespace-nowrap"
          >
            전송
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { sendChatMessage } from '@/features/chat/api'

const isOpen = ref(false)
const inputMsg = ref('')
const chatContainer = ref<HTMLElement | null>(null)

const messages = ref<{ text: string; isMine: boolean }[]>([])
const isTyping = ref(false)

const loadHistory = () => {
  try {
    const raw = localStorage.getItem('localhub_chat_history')
    if (raw) messages.value = JSON.parse(raw)
    if (!messages.value.length)
      messages.value.push({ text: '안녕하세요! 궁금한 지역 정보를 물어보세요.', isMine: false })
  } catch (e) {
    messages.value = [{ text: '안녕하세요! 궁금한 지역 정보를 물어보세요.', isMine: false }]
  }
}

const saveHistory = () => {
  localStorage.setItem('localhub_chat_history', JSON.stringify(messages.value))
}

loadHistory()

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputMsg.value.trim()) return

  const userMsg = inputMsg.value
  messages.value.push({ text: userMsg, isMine: true })
  inputMsg.value = ''
  scrollToBottom()

  try {
    isTyping.value = true
    const reply = await sendChatMessage(userMsg, '서울')
    isTyping.value = false
    messages.value.push({ text: reply, isMine: false })
    saveHistory()
  } catch (error) {
    isTyping.value = false
    console.error('챗봇 API 에러 상세:', error)
    messages.value.push({
      text: '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      isMine: false,
    })
  }
  scrollToBottom()
}
</script>

<style scoped>
/* 1. 버튼 애니메이션 (Fade & Scale) */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

/* 2. 챗봇 윈도우 애니메이션 (Slide & Scale from Bottom Right) */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
