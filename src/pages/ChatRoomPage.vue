<template>
  <div
    class="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl"
  >
    <!-- 닉네임 입력 게이트 -->
    <div
      v-if="!isJoined"
      class="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <h2 class="text-3xl font-black tracking-tighter text-slate-900">입에 거미줄 제거하기</h2>
      <p class="text-sm font-medium text-slate-500">닉네임을 입력하고 채팅방에 입장하세요.</p>
      <div class="flex w-full max-w-xs gap-2">
        <input
          v-model="nicknameInput"
          :maxlength="MAX_NICKNAME_LEN"
          placeholder="닉네임 입력"
          class="h-11 flex-1 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-slate-400"
          @keyup.enter="joinWithNickname"
        />
        <button
          :disabled="!nicknameInput.trim()"
          class="h-11 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          @click="joinWithNickname"
        >
          입장하기
        </button>
      </div>
    </div>

    <!-- 채팅방 -->
    <template v-else>
      <header class="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
        <div class="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span class="font-bold text-slate-900">{{ nickname }}</span>
          <span
            class="h-2 w-2 rounded-full"
            :class="isConnected ? 'bg-emerald-500' : 'bg-amber-500'"
          />
          <span class="text-xs text-slate-400">{{ connectionLabel }}</span>
        </div>
        <div class="flex gap-2">
          <button
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-400"
            @click="changeNickname"
          >
            닉네임 변경
          </button>
          <button
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-400"
            @click="leaveRoom"
          >
            나가기
          </button>
        </div>
      </header>

      <ul ref="messageListEl" class="flex-1 space-y-2 overflow-y-auto px-5 py-4">
        <li v-for="msg in messages" :key="msg.id">
          <p v-if="msg.system" class="text-center text-xs font-medium text-slate-400">
            {{ msg.text }}
          </p>
          <div v-else class="flex flex-col" :class="msg.mine ? 'items-end' : 'items-start'">
            <span class="mb-0.5 text-[11px] font-semibold text-slate-400">{{ msg.nickname }}</span>
            <!-- v-text만 사용, v-html 사용 금지 (XSS 방지) -->
            <span
              class="max-w-[75%] rounded-2xl px-3.5 py-2 text-sm"
              :class="msg.mine ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'"
              v-text="msg.text"
            />
          </div>
        </li>
      </ul>

      <footer class="flex gap-2 border-t border-slate-100 px-4 py-3">
        <input
          v-model="draft"
          :maxlength="MAX_MESSAGE_LEN"
          :disabled="!isConnected"
          placeholder="메시지를 입력하세요"
          class="h-11 flex-1 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-slate-400 disabled:bg-slate-50"
          @keyup.enter="sendMessage"
        />
        <button
          :disabled="!isConnected || !draft.trim()"
          class="h-11 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          @click="sendMessage"
        >
          전송
        </button>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, nextTick } from 'vue'

interface ChatMessage {
  id: string
  nickname: string
  text: string
  timestamp: number
  mine?: boolean
  system?: boolean
}

const NICKNAME_KEY = 'chat_nickname'
const MAX_NICKNAME_LEN = 12
const MAX_MESSAGE_LEN = 500
const HEARTBEAT_INTERVAL_MS = 25_000

// 헤더 컴포넌트와 동일한 WS_URL 조립 컨벤션 (환경변수 우선, 없으면 현재 host 기준 자동 조립)
// 온라인 카운트(/ws/notifications)와는 별도 엔드포인트로 분리
const WS_URL =
  import.meta.env.VITE_WS_CHAT_URL ??
  `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/chat`

const nickname = ref(localStorage.getItem(NICKNAME_KEY) ?? '')
const nicknameInput = ref('')
const isJoined = ref(false)
const connectionState = ref<'idle' | 'connecting' | 'open' | 'closed' | 'error'>('idle')
const messages = ref<ChatMessage[]>([])
const draft = ref('')
const messageListEl = ref<HTMLUListElement | null>(null)

let socket: WebSocket | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let backoff = 1000
const MAX_BACKOFF_MS = 16000 // 헤더 컴포넌트와 동일한 상한

const isConnected = computed(() => connectionState.value === 'open')
const connectionLabel = computed(() => {
  const labels: Record<string, string> = {
    idle: '대기 중',
    connecting: '연결 중...',
    open: '연결됨',
    closed: '재연결 중...',
    error: '오류',
  }
  return labels[connectionState.value]
})

function joinWithNickname() {
  const trimmed = nicknameInput.value.trim().slice(0, MAX_NICKNAME_LEN)
  if (!trimmed) return
  nickname.value = trimmed
  localStorage.setItem(NICKNAME_KEY, trimmed)
  isJoined.value = true
  connectWS()
}

// 저장된 닉네임이 있으면 자동 입장
if (nickname.value) {
  isJoined.value = true
  connectWS()
}

function leaveRoom() {
  isJoined.value = false
  disconnectWS()
}

function changeNickname() {
  localStorage.removeItem(NICKNAME_KEY)
  disconnectWS()
  nickname.value = ''
  isJoined.value = false
  messages.value = []
}

function connectWS() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
  ) {
    return
  }

  connectionState.value = 'connecting'
  try {
    socket = new WebSocket(`${WS_URL}?nickname=${encodeURIComponent(nickname.value)}`)
  } catch (e) {
    scheduleReconnect()
    return
  }

  socket.onopen = () => {
    connectionState.value = 'open'
    backoff = 1000
    startHeartbeat()
    pushSystemMessage(`${nickname.value}님이 입장했습니다.`)
  }

  socket.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data)
      if (data.type === 'pong') return
      if (data.type === 'message') {
        messages.value.push({
          id: crypto.randomUUID(),
          nickname: String(data.nickname ?? '익명').slice(0, MAX_NICKNAME_LEN),
          text: String(data.text ?? '').slice(0, MAX_MESSAGE_LEN),
          timestamp: data.timestamp ?? Date.now(),
          mine: data.nickname === nickname.value,
        })
        scrollToBottom()
      }
    } catch {
      // JSON 파싱 실패한 메시지는 무시 (프로토콜 방어)
    }
  }

  socket.onclose = () => {
    connectionState.value = 'closed'
    stopHeartbeat()
    if (isJoined.value) scheduleReconnect()
  }
  socket.onerror = () => {
    connectionState.value = 'error'
    socket?.close()
  }
}

function disconnectWS() {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  reconnectTimer = null
  stopHeartbeat()
  if (socket) {
    socket.onclose = null // 의도적 종료는 재연결 트리거 안 함
    socket.close()
    socket = null
  }
  connectionState.value = 'idle'
}

function scheduleReconnect() {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectWS()
  }, backoff)
  backoff = Math.min(backoff * 2, MAX_BACKOFF_MS)
}

function startHeartbeat() {
  stopHeartbeat()
  heartbeatTimer = setInterval(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }))
    }
  }, HEARTBEAT_INTERVAL_MS)
}
function stopHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer)
  heartbeatTimer = null
}

function sendMessage() {
  const text = draft.value.trim().slice(0, MAX_MESSAGE_LEN)
  if (!text || !isConnected.value || !socket) return
  socket.send(JSON.stringify({ type: 'message', nickname: nickname.value, text }))
  draft.value = ''
}

function pushSystemMessage(text: string) {
  messages.value.push({
    id: crypto.randomUUID(),
    nickname: '',
    text,
    timestamp: Date.now(),
    system: true,
  })
  scrollToBottom()
}

async function scrollToBottom() {
  await nextTick()
  if (messageListEl.value) {
    messageListEl.value.scrollTop = messageListEl.value.scrollHeight
  }
}

onBeforeUnmount(() => {
  disconnectWS()
})
</script>
