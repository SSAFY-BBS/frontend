import { ref, onMounted, onBeforeUnmount } from 'vue';

export interface Participant {
  group: string;
  name: string;
}

export function useMealFriendWS() {
  const participants = ref<Participant[]>([]);
  const isMatching = ref(false);
  const isFlashing = ref(false);
  const isRevealed = ref(false);

  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let backoff = 1000;

  const envWsUrl = import.meta.env.VITE_WS_URL;
  const WS_URL = envWsUrl 
    ? envWsUrl.replace('/notifications', '/meal-friend')
    : `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws/meal-friend`;

  const triggerMatchEvent = () => {
    isMatching.value = true;
    const buildUpDuration = 4000; 

    setTimeout(() => {
      isMatching.value = false;
      isFlashing.value = true; 
      isRevealed.value = true; 

      setTimeout(() => {
        isFlashing.value = false;
      }, 1000);
    }, buildUpDuration);
  };

  const connectWS = () => {
    try {
      ws = new WebSocket(WS_URL);
    } catch (e) {
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      backoff = 1000;
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        
        if (data.type === 'wait_state') {
          participants.value = Array.from({ length: data.current_count }, () => ({
            group: '익명',
            name: '익명'
          }));
        } else if (data.type === 'match_complete') {
          participants.value = data.participants;
          if (!isMatching.value && !isRevealed.value) {
            triggerMatchEvent();
          }
        }
      } catch (e) {
        console.error("Payload parsing error:", e);
      }
    };

    ws.onclose = () => {
      ws = null;
      scheduleReconnect();
    };
  };

  const scheduleReconnect = () => {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connectWS();
    }, backoff);
    backoff = Math.min(backoff * 2, 16000);
  };

  const submitNoteAPI = (group: string, name: string): boolean => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'submit_note',
        group,
        name
      }));
      return true;
    }
    return false;
  };

  const resetMatchState = () => {
    participants.value = [];
    isRevealed.value = false;
    isFlashing.value = false;
    isMatching.value = false;
  };

  onMounted(() => {
    connectWS();
  });

  onBeforeUnmount(() => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = null;
    if (ws) {
      try { ws.close(); } catch {}
      ws = null;
    }
  });

  return {
    participants,
    isMatching,
    isFlashing,
    isRevealed,
    submitNoteAPI,
    resetMatchState
  };
}