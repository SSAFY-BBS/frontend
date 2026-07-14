<template>
  <div class="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
    <!-- Collapsed State (Floating Button) -->
    <button 
      v-if="!isOpen" 
      @click="isOpen = true"
      class="w-14 h-14 bg-white border-2 border-sky-500 rounded-full flex flex-col items-center justify-center text-sky-500 shadow-lg hover:bg-sky-50 transition"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
      <span class="text-xs mt-1 font-bold">챗봇</span>
    </button>

    <!-- Expanded State (Chat Window) -->
    <div v-else class="w-full max-w-xs sm:max-w-md sm:w-96 h-[32rem] bg-white border rounded-lg shadow-xl flex flex-col overflow-hidden fixed sm:static bottom-0 right-0 left-0 mx-auto">
      <!-- Header -->
      <div class="bg-sky-500 text-white p-3 flex justify-between items-center">
        <span class="font-bold">LocalHub 챗봇</span>
        <button @click="isOpen = false" class="text-white hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Chat History -->
      <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50" ref="chatContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="['max-w-[80%] rounded-lg p-3 text-sm', msg.isMine ? 'bg-sky-100 text-gray-800 self-end' : 'bg-gray-200 text-gray-800 self-start']">
          {{ msg.text }}
        </div>
        <div v-if="isTyping" class="max-w-[80%] rounded-lg p-3 text-sm bg-gray-200 self-start">응답을 준비 중입니다...</div>
      </div>

      <!-- Input Area -->
      <div class="p-3 border-t bg-white flex gap-2">
        <input 
          v-model="inputMsg" 
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="메시지를 입력하세요" 
          class="flex-1 border rounded p-2 text-sm focus:outline-none focus:border-sky-500" 
        />
        <button @click="sendMessage" class="bg-sky-500 text-white px-4 rounded text-sm hover:bg-sky-600 transition">전송</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { sendChatMessage } from '@/features/chat/api';

const isOpen = ref(false);
const inputMsg = ref('');
const chatContainer = ref<HTMLElement | null>(null);

const messages = ref<{ text: string; isMine: boolean }[]>([]);
const isTyping = ref(false);

// load history from localStorage
const loadHistory = () => {
  try {
    const raw = localStorage.getItem('localhub_chat_history');
    if (raw) messages.value = JSON.parse(raw);
    if (!messages.value.length) messages.value.push({ text: '안녕하세요! 궁금한 지역 정보를 물어보세요.', isMine: false });
  } catch (e) {
    messages.value = [{ text: '안녕하세요! 궁금한 지역 정보를 물어보세요.', isMine: false }];
  }
};

const saveHistory = () => {
  localStorage.setItem('localhub_chat_history', JSON.stringify(messages.value));
};

loadHistory();

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!inputMsg.value.trim()) return;

  const userMsg = inputMsg.value;
  messages.value.push({ text: userMsg, isMine: true });
  inputMsg.value = '';
  scrollToBottom();

  try {
    isTyping.value = true;
    const reply = await sendChatMessage(userMsg, '서울')
    isTyping.value = false;
    messages.value.push({ text: reply, isMine: false });
    saveHistory();
  } catch (error) {
    isTyping.value = false;
    messages.value.push({ text: '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.', isMine: false });
  }
  scrollToBottom();
};
</script>