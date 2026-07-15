<template>
  <div class="max-w-4xl mx-auto py-10 px-4 relative">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-slate-800 mb-2">오늘 누구랑 점심 먹을까</h1>
      <p class="text-slate-500">매칭에 성공하면 반드시 같이 점심을 먹을 것을 엄숙히 선서합니다.</p>
    </div>

    <!-- 중앙 쪽지함 컨테이너 -->
    <div 
      class="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden transition-all"
      :class="{ 'drumroll-active': isMatching }"
    >
      <!-- 4개의 슬롯 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div 
          v-for="index in 4" 
          :key="index"
          class="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center transition-all duration-500"
          :class="[
            getSlotState(index).bgClass, 
            getSlotState(index).borderClass,
            isRevealed ? 'reveal-card' : ''
          ]"
        >
          <!-- 상태 1: 대기 중 -->
          <template v-if="!participants[index - 1]">
            <svg class="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span class="text-sm font-medium text-slate-400">대기 중...</span>
          </template>

          <!-- 상태 2: 익명 쪽지 -->
          <template v-else-if="!isRevealed">
            <svg class="w-10 h-10 text-sky-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span class="text-sm font-bold text-sky-700">익명 쪽지</span>
            <span class="text-xs text-sky-500 mt-1">도착 완료</span>
          </template>

          <!-- 상태 3: 정체 공개 -->
          <template v-else>
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 text-xl">
              🍽️
            </div>
            <span class="text-xs font-bold text-sky-600 mb-1">{{ participants[index - 1]?.group }}</span>
            <span class="text-lg font-bold text-slate-800">{{ participants[index - 1]?.name }}</span>
          </template>
        </div>
      </div>

      <!-- 액션 영역 -->
      <div class="text-center" v-if="!hasJoined">
        <button 
          @click="isModalOpen = true"
          class="bg-sky-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-sky-600 transition-colors"
        >
          밥친구 만들기 (쪽지 넣기)
        </button>
      </div>
      <div class="text-center" v-else-if="!isRevealed">
        <p class="text-slate-600 font-medium animate-pulse">
          {{ isMatching ? '매칭이 완료되었습니다! 결과를 확인합니다...' : `다른 친구들을 기다리고 있습니다... (${participants.length}/4)` }}
        </p>
      </div>
      <div class="text-center" v-else>
        <button 
          @click="resetMatch"
          class="bg-slate-800 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-slate-900 transition-colors"
        >
          새로운 매칭 시작하기
        </button>
      </div>
    </div>

    <!-- 정보 입력 모달 -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="isModalOpen = false"></div>
      <div class="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative z-10">
        <h3 class="text-lg font-bold text-slate-800 mb-4">쪽지 등록하기</h3>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">소속 반</label>
            <input 
              v-model="inputGroup" 
              type="text" 
              class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
              placeholder="예: 1반, A반"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">이름</label>
            <input 
              v-model="inputName" 
              type="text" 
              class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
              placeholder="이름을 입력하세요"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="isModalOpen = false" class="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-200">취소</button>
          <button @click="submitNote" class="flex-1 bg-sky-500 text-white py-2 rounded-lg font-medium hover:bg-sky-600">등록 완료</button>
        </div>
      </div>
    </div>

    <!-- 플래시 오버레이 -->
    <div v-if="isFlashing" class="flash-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMealFriendWS } from '@/features/meal-friend/api/useMealFriendWS';

const isModalOpen = ref(false);
const inputGroup = ref('');
const inputName = ref('');
const hasJoined = ref(false);

// 외부 모듈에서 상태와 함수 주입 (Destructuring)
const { 
  participants, 
  isMatching, 
  isFlashing, 
  isRevealed, 
  submitNoteAPI, 
  resetMatchState 
} = useMealFriendWS();

const getSlotState = (index: number) => {
  const isFilled = !!participants.value[index - 1];
  if (!isFilled) return { bgClass: 'bg-white', borderClass: 'border-2 border-dashed border-slate-200' };
  if (!isRevealed.value) return { bgClass: 'bg-sky-50', borderClass: 'border-2 border-solid border-sky-200' };
  return { bgClass: 'bg-white shadow-md', borderClass: 'border border-slate-200' };
};

const submitNote = () => {
  if (!inputGroup.value.trim() || !inputName.value.trim()) {
    alert('소속 반과 이름을 모두 입력해주세요.');
    return;
  }

  // API 호출 후 성공 여부에 따라 UI 분기 처리
  const isSuccess = submitNoteAPI(inputGroup.value, inputName.value);
  if (isSuccess) {
    hasJoined.value = true;
    isModalOpen.value = false;
  } else {
    alert('서버와 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.');
  }
};

const resetMatch = () => {
  resetMatchState();
  inputGroup.value = '';
  inputName.value = '';
  hasJoined.value = false;
};
</script>

<style scoped>
/* 기존 애니메이션 CSS 유지 */
.drumroll-active { animation: drumroll 4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes drumroll {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.02); filter: brightness(0.9); }
  75% { transform: scale(1.03) translate(1px, -1px); filter: brightness(0.85); box-shadow: 0 0 10px rgba(14, 165, 233, 0.3); }
  85% { transform: scale(1.04) translate(-2px, 2px); filter: brightness(0.8); box-shadow: 0 0 20px rgba(14, 165, 233, 0.5); }
  92% { transform: scale(1.05) translate(3px, -3px); filter: brightness(0.7); box-shadow: 0 0 40px rgba(14, 165, 233, 0.7); }
  96% { transform: scale(1.06) translate(-4px, 4px); filter: brightness(0.6); box-shadow: 0 0 60px rgba(14, 165, 233, 0.9); }
  100% { transform: scale(1.07) translate(0, 0); filter: brightness(0.5); box-shadow: 0 0 80px rgba(14, 165, 233, 1); }
}

.flash-overlay { position: fixed; inset: 0; background-color: white; z-index: 100; pointer-events: none; animation: flashOut 1s ease-out forwards; }
@keyframes flashOut { 0% { opacity: 1; } 100% { opacity: 0; } }

.reveal-card { animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
@keyframes popIn { 0% { opacity: 0; transform: scale(0.5) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
</style>