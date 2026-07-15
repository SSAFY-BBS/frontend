<template>
  <div class="relative w-full h-screen">
    <!-- 필터 UI -->
    <div class="absolute top-4 left-4 z-10 flex gap-2 bg-white p-2 rounded shadow">
      <button @click="filterMarkers('all')" class="px-3 py-1 bg-gray-200 rounded">전체</button>
      <button @click="filterMarkers('관광지')" class="px-3 py-1 bg-sky-500 text-white rounded">
        관광지
      </button>
      <button @click="filterMarkers('맛집')" class="px-3 py-1 bg-orange-500 text-white rounded">
        맛집
      </button>
    </div>

    <!-- 지도 컨테이너 -->
    <div id="map" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const map = ref(null)
const markers = ref([]) // 모든 마커 저장용
const rawData = ref([]) // 백엔드에서 가져온 데이터

// 데이터 가져오기 (API 연동 예시)
const fetchPlaces = async () => {
  // 실제 백엔드 API 경로로 수정하세요
  const response = await fetch('/api/places')
  rawData.value = await response.json()
  initMap()
}

const initMap = () => {
  const container = document.getElementById('map')
  const options = {
    center: new kakao.maps.LatLng(37.5053, 127.0501), // 서울 중심
    level: 3,
  }
  map.value = new kakao.maps.Map(container, options)

  // 데이터 기반 마커 생성
  rawData.value.forEach((item) => {
    const position = new kakao.maps.LatLng(item.mapy, item.mapx)
    const marker = new kakao.maps.Marker({ position })

    // 마커 객체에 카테고리 정보 저장 (필터링용)
    marker.category = item.contentType
    marker.setMap(map.value)
    markers.value.push(marker)
  })
}

const filterMarkers = (category) => {
  markers.value.forEach((marker) => {
    if (category === 'all' || marker.category === category) {
      marker.setMap(map.value) // 보이기
    } else {
      marker.setMap(null) // 숨기기
    }
  })
}
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    // 1. 이미 로드되었는지 확인
    console.log('실제 사용 중인 API 키:', import.meta.env.VITE_KAKAO_MAP_API_KEY)
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }

    // 2. .env에서 안전하게 키를 가져옴 (VITE_ 접두사 필수)
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY
    console.log('실제 사용 중인 API 키:', apiKey)
    // 3. 동적 스크립트 생성
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`
    script.onload = () => window.kakao.maps.load(resolve)
    script.onerror = () => reject(new Error('Kakao Maps SDK Load Failed'))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  try {
    console.log('전체 환경 변수:', import.meta.env)
    console.log('아 왜 안보여 참')
    await loadKakaoMapScript()
    await fetchPlaces()
  } catch (e) {
    console.error('초기화 실패:', e)
  }
})
</script>
