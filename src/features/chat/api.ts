import { apiClient } from '@/shared/api/client';

export const sendChatMessage = async (message: string) => {
  const { data } = await apiClient.post('/chat', { message });
  return data.reply; // FastAPI에서 { "reply": "답변 내용" } 형태로 반환한다고 가정
};