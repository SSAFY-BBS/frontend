import { apiClient } from '@/shared/api/client'

export const fetchAllPlaces = async () => {
  const { data } = await apiClient.get('/api/all-places')
  return data
}
