<template>
  <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-800">서울 현재 날씨</h3>
        <!-- timestamps removed per request -->
      </div>
      <div class="text-right flex items-center gap-3">
        <div class="text-2xl font-bold text-slate-800">{{ displayTemp }}</div>
        <div class="text-xs text-slate-500">강수확률 {{ weather?.pop ?? '-' }}%</div>
        <button
          class="ml-2 inline-flex items-center gap-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-700"
          @click="fetchWeather"
          :disabled="loading"
          aria-label="새로고침"
        >
          <svg v-if="!loading" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M20.49 9A9 9 0 1 0 21 12"/></svg>
          <svg v-else class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="4" stroke="#94a3b8" stroke-linecap="round" fill="none" stroke-dasharray="80" stroke-dashoffset="60"/></svg>
        </button>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="h-10 w-10 flex-shrink-0 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">{{ weatherIcon }}</div>
        <div>
          <div class="text-sm font-medium text-slate-700">{{ summaryText }}</div>
          <div class="text-xs text-slate-500">{{ weather?.message }}</div>
        </div>
      </div>

      <div class="text-right">
        <span :class="badgeClass" class="rounded-full px-3 py-1 text-sm font-semibold">{{ suitabilityLabel }}</span>
        <div v-if="!weather && !loading" class="text-xs text-rose-600 mt-1">데이터 없음 — 서버 또는 API 확인 필요</div>
        <div v-if="weather && weather.message && (!weather.temp && !weather.pop)" class="text-xs text-slate-500 mt-1">{{ weather.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getSeoulWeather, type WeatherResponse } from '@/features/weather/api'

const weather = ref<WeatherResponse | null>(null)
const loading = ref(false)

const fetchWeather = async () => {
  loading.value = true
  try {
    weather.value = await getSeoulWeather()
  } catch (e) {
    weather.value = null
    console.error('Failed to fetch weather', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWeather()
})

const displayTemp = computed(() => (weather.value && weather.value.temp !== null ? `${Math.round(weather.value.temp)}°C` : '-'))

const suitabilityLabel = computed(() => {
  if (!weather.value) return '데이터 없음'
  switch (weather.value.suitability) {
    case 'good':
      return '여행 적합'
    case 'moderate':
      return '주의 필요'
    case 'bad':
      return '부적합'
    default:
      return '판단불가'
  }
})

const badgeClass = computed(() => {
  if (!weather.value) return 'bg-gray-200 text-gray-700'
  switch (weather.value.suitability) {
    case 'good':
      return 'bg-emerald-100 text-emerald-700'
    case 'moderate':
      return 'bg-amber-100 text-amber-700'
    case 'bad':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-gray-200 text-gray-700'
  }
})

const skyText = computed(() => {
  if (!weather.value || weather.value.sky === null) return '-'
  const s = weather.value.sky
  // KMA SKY: 1-맑음, 3-구름많음, 4-흐림 (approx)
  if (s === 1) return '맑음'
  if (s === 3) return '구름 많음'
  if (s === 4) return '흐림'
  return '정보 없음'
})

const weatherIcon = computed(() => {
  if (!weather.value) return '❓'
  const t = weather.value.temp
  const p = weather.value.pop ?? 0
  const s = weather.value.sky

  // Precipitation overrides sky
  if (p >= 60) return '⛈️'
  if (p >= 30) {
    // if temp <= 0 maybe snow
    if (t !== null && t <= 0) return '❄️'
    return '🌧️'
  }

  if (s === 1) {
    if (t !== null && t >= 30) return '🥵'
    return '☀️'
  }
  if (s === 3) return '⛅'
  if (s === 4) return '☁️'
  return '🌈'
})

const summaryText = computed(() => {
  if (!weather.value) return '데이터 없음'
  const parts: string[] = []
  const t = weather.value.temp
  const p = weather.value.pop
  const s = skyText.value
  if (s) parts.push(s)
  if (t !== null) parts.push(`${Math.round(t)}°C`)
  if (typeof p === 'number') parts.push(`강수확률 ${p}%`)
  return parts.join(' / ')
})
</script>

<style scoped>
</style>
