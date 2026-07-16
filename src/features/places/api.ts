import { apiClient } from '@/shared/api/client'

export interface TourItem {
  contentid: string
  title: string
  addr1: string
  firstimage: string
  cat2: string
  searchDescription?: string
}

export interface PlacesResponse {
  items: TourItem[]
  total: number
}

/**
 * 7개의 랜덤 장소 데이터를 가져오는 함수
 */
export const fetchRandomPlaces = async (limit: number = 7): Promise<TourItem[]> => {
  // params 객체를 사용하면 쿼리 스트링(?limit=7)이 자동으로 직렬화됩니다.
  const { data } = await apiClient.get<PlacesResponse>('/api/places/random', {
    params: { limit },
  })

  return data.items
}

/**
 * 장소 이름을 기반으로 부가 설명을 가져오는 함수 (BFF 패턴 가정)
 */
export const fetchSearchDescription = async (query: string): Promise<string> => {
  try {
    const { data } = await apiClient.get('/api/search/naver', {
      params: { query },
    })

    console.log(data)

    // 네이버 API 응답 구조에 맞게 데이터 파싱 및 태그 제거
    return (
      data.items[0]?.description.replace(/(<([^>]+)>)/gi, '') || '상세 정보를 찾을 수 없습니다.'
    )
  } catch (error) {
    return '설명 로드 실패'
  }
}

export const fetchSearchCategory = async (query: string): Promise<string> => {
  try {
    const { data } = await apiClient.get('/api/search/naver', {
      params: { query },
    })

    // 네이버 API 응답의 category 필드 추출 (예: "한식>생선회")
    const categoryStr = data.items[0]?.category

    if (categoryStr) {
      // "한식>생선회" 처럼 '>'로 구분된 경우, 가장 마지막 상세 카테고리만 추출
      const parts = categoryStr.split('>')
      return parts[parts.length - 1].trim()
    }

    return '지역 정보' // 카테고리 값이 없을 경우의 Fallback
  } catch (error) {
    return '지역 정보' // 네트워크 등 에러 발생 시 Fallback
  }
}
