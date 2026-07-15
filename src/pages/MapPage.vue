<template>
  <div class="flex w-full h-screen overflow-hidden text-gray-800 bg-gray-50">
    <!-- 1. 좌측 사이드바 (필터 및 검색 리스트) -->
    <div class="flex flex-col w-96 h-full bg-white border-r border-gray-200 shadow-lg z-10">
      <!-- 사이드바 헤더 -->
      <div class="p-5 border-b border-gray-100">
        <h1 class="text-xl font-bold text-slate-900">서울 관광&맛집 지도</h1>
        <p class="text-xs text-gray-500 mt-1">SSAFY 16기 맞춤형 로컬 가이드</p>
      </div>

      <!-- 장소 리스트 (스크롤 구역) -->
      <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
        <div
          v-for="place in filteredPlaces"
          :key="place.id"
          @click="selectPlace(place)"
          :class="[
            'p-4 cursor-pointer hover:bg-indigo-50/50 transition-all duration-150',
            selectedPlaceId === place.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : '',
          ]"
        >
          <div class="flex justify-between items-start">
            <span
              class="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-gray-100 text-gray-600"
            >
              {{ place.category }}
            </span>
          </div>
          <h3 class="font-bold text-slate-800 mt-1.5">{{ place.name }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ place.description }}</p>
        </div>

        <!-- 검색 결과가 없을 때 -->
        <div
          v-if="filteredPlaces.length === 0"
          class="flex flex-col items-center justify-center h-48 text-gray-400"
        >
          <span class="text-sm">해당되는 장소가 없습니다.</span>
        </div>

        <div id="sentinel" class="h-4"></div>
      </div>
    </div>

    <!-- 2. 우측 지도 영역 -->
    <div class="flex-1 h-full relative">
      <div id="kakao-map" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { fetchAllPlaces } from '@/features/map/api'

// ----------------------------------------------------
// [Reactive States]
// ----------------------------------------------------
const mapInstance = ref(null)
const rawPlaces = ref([])
const activeCategory = ref('ALL')
const selectedPlaceId = ref(null)
const activeInfoWindow = ref(null)
const isLoading = ref(false)
const page = ref(1)
const hasMore = ref(true)

const fetchPlacesData = async (isInitial = false) => {
  if (isLoading.value || (!hasMore.value && !isInitial)) return

  isLoading.value = true
  try {
    const response = await fetch(`/api/places?page=${page.value}&limit=30`)
    const data = await response.json()

    const newPlaces = data.items.map((item, idx) => ({
      id: (page.value - 1) * 30 + idx, // 고유 ID 부여
      name: item.name || item.title,
      category: item.category,
      lat: parseFloat(item.mapy),
      lng: parseFloat(item.mapx),
    }))

    rawPlaces.value = isInitial ? newPlaces : [...rawPlaces.value, ...newPlaces]
    hasMore.value = data.hasMore

    // 마커 추가 렌더링 (전체 삭제 후 다시 그리는 대신, 새 데이터만 추가)
    addMarkersToMap(newPlaces)

    if (hasMore.value) page.value++
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const addMarkersToMap = (places) => {
  if (!mapInstance.value) return

  places.forEach((place) => {
    // 1. 좌표 객체 생성
    const position = new window.kakao.maps.LatLng(place.lat, place.lng)

    // 2. 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: position,
      map: mapInstance.value,
    })

    // 3. 추후 관리를 위해 마커 객체에 데이터 ID 저장
    marker.placeId = place.id

    // 4. 전역 마커 배열에 추가 (clearMarkers 호출 시 제거될 수 있도록)
    markerInstances.push(marker)

    // 5. 클릭 이벤트 바인딩
    window.kakao.maps.event.addListener(marker, 'click', () => {
      // 해당 마커를 클릭했을 때 호출할 로직
      selectPlace(place)
    })
  })
}

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && hasMore.value) {
      fetchPlacesData()
    }
  },
  { threshold: 0.1 },
)

// 마커 인스턴스 보관용 배열 (필터링 및 소멸자 가비지 컬렉션용)
let markerInstances = []

// ----------------------------------------------------
// [Computed] 필터링된 데이터
// ----------------------------------------------------
const filteredPlaces = computed(() => {
  if (activeCategory.value === 'ALL') return rawPlaces.value
  return rawPlaces.value.filter((place) => place.category === activeCategory.value)
})

// ----------------------------------------------------
// [Methods] 비동기 데이터 로딩 & 카카오맵 연동
// ----------------------------------------------------
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }

    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY
    if (!apiKey) {
      reject(new Error('VITE_KAKAO_MAP_API_KEY is missing in .env file'))
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`
    script.async = true
    script.defer = true
    script.onload = () => {
      window.kakao.maps.load(() => resolve())
    }
    script.onerror = () => reject(new Error('Kakao Maps SDK Load Failed'))
    document.head.appendChild(script)
  })
}

const initMap = () => {
  const container = document.getElementById('kakao-map')
  if (!container) return

  // 디폴트 중심점: 서울 시청 인근
  const defaultCenter = new window.kakao.maps.LatLng(37.501, 127.04)
  const options = {
    center: defaultCenter,
    level: 3,
  }

  mapInstance.value = new window.kakao.maps.Map(container, options)
  renderMarkers()
}

// 마커 클리어 및 재렌더링
const renderMarkers = () => {
  if (!mapInstance.value) return

  // 1. 기존 마커 지우기
  clearMarkers()

  // 2. 필터링된 데이터를 기준으로 마커 새로 찍기
  const bounds = new window.kakao.maps.LatLngBounds()
  let hasValidCoords = false

  filteredPlaces.value.forEach((place) => {
    const position = new window.kakao.maps.LatLng(place.lat, place.lng)
    const marker = new window.kakao.maps.Marker({
      position: position,
      map: mapInstance.value,
    })

    // 마커 객체 내부에 ID 저장
    marker.placeId = place.id
    markerInstances.push(marker)
    bounds.extend(position)
    hasValidCoords = true

    // 마커 클릭 이벤트 바인딩
    window.kakao.maps.event.addListener(marker, 'click', () => {
      selectPlace(place)
    })
  })
}

const clearMarkers = () => {
  markerInstances.forEach((marker) => marker.setMap(null))
  markerInstances = []
  if (activeInfoWindow.value) {
    activeInfoWindow.value.close()
    activeInfoWindow.value = null
  }
}

// 특정 장소 선택 시 이벤트 처리
const selectPlace = (place) => {
  selectedPlaceId.value = place.id
  if (!mapInstance.value) return

  const moveLatLon = new window.kakao.maps.LatLng(place.lat, place.lng)
  mapInstance.value.panTo(moveLatLon)

  // 기존 오픈된 정보창 닫기
  if (activeInfoWindow.value) {
    activeInfoWindow.value.close()
  }

  // 커스텀 오버레이/정보창 생성 및 출력
  const content = `
    <div class="p-3 bg-white rounded-lg border border-slate-200 shadow-md min-w-[200px]">
      <h4 class="font-bold text-sm text-slate-800">${place.name}</h4>
      <p class="text-[11px] text-gray-500 mt-1">${place.description}</p>
    </div>
  `

  const infoWindow = new window.kakao.maps.InfoWindow({
    content: content,
    removable: true,
  })

  // 마커 인스턴스 검색하여 맵핑
  const targetMarker = markerInstances.find((m) => m.placeId === place.id)
  if (targetMarker) {
    infoWindow.open(mapInstance.value, targetMarker)
    activeInfoWindow.value = infoWindow
  }
}

const setCenterToAddress = () => {
  if (!window.kakao.maps.services) {
    console.error('Kakao Maps services library is not loaded.')
    return
  }

  const geocoder = new window.kakao.maps.services.Geocoder()
  const address = '서울특별시 강남구 테헤란로 212'

  geocoder.addressSearch(address, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)

      // mapInstance가 존재하는지 확인 후 이동
      if (mapInstance.value) {
        mapInstance.value.setCenter(coords)
        mapInstance.value.setLevel(3)
      }
    } else {
      console.error('주소 검색 실패:', status)
    }
  })
}

// ----------------------------------------------------
// [Watchers] 필터 변경 감지 시 마커 갱신
// ----------------------------------------------------
watch(activeCategory, () => {
  renderMarkers()
})

// ----------------------------------------------------
// [LifeCycle Hooks]
// ----------------------------------------------------
onMounted(async () => {
  try {
    await loadKakaoMapScript()
    await fetchPlacesData()
    initMap()

    observer.observe(document.querySelector('#sentinel'))
  } catch (error) {
    console.error('Initialization failed:', error)
  }
})

onUnmounted(() => {
  clearMarkers()
})
</script>
