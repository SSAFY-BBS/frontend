import { apiClient } from '@/shared/api/client'

export interface WeatherResponse {
  location: string
  base_date: string
  base_time: string
  temp: number | null
  pop: number | null
  sky: number | null
  suitability: 'good' | 'moderate' | 'bad' | 'unknown'
  message: string
}

export const getSeoulWeather = async (): Promise<WeatherResponse> => {
  // Always call real backend endpoint. Backend supports ?mock=true if needed for testing.
  const res = await apiClient.get('/api/weather/seoul')
  return res.data as WeatherResponse
}
