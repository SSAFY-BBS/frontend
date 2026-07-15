import { apiClient } from '@/shared/api/client'

export const sendChatMessage = async (message: string, region = '서울') => {
  const payload = { message, region }

  const { data } = await apiClient.post('/api/chat', payload)

  console.log(data)
  return data.reply
}
