import { ref } from 'vue'

type PostCategory = 'tour' | 'food' | 'festival'

type Post = {
  id: number
  title: string
  date: string
  tag: string
  category: PostCategory
  content: string
  likes: number
  views: number
}

export const posts = ref<Post[]>([
  {
    id: 1,
    title: '관광지 추천 코스 공유해요',
    date: '07.01',
    tag: '관광지',
    category: 'tour',
    content:
      '서울의 숨은 명소를 소개하는 글입니다. 조용한 산책로와 예쁜 카페까지 함께 즐길 수 있는 코스를 정리해두었습니다.',
    likes: 12,
    views: 34,
  },
  {
    id: 2,
    title: '성수동 맛집 리스트',
    date: '07.02',
    tag: '맛집',
    category: 'food',
    content:
      '성수동에서 가볍게 들르기 좋은 맛집들을 모아봤습니다. brunch와 디저트까지 한 번에 즐길 수 있어요.',
    likes: 8,
    views: 21,
  },
  {
    id: 3,
    title: '서울 축제 일정 모음',
    date: '07.03',
    tag: '축제',
    category: 'festival',
    content:
      '이번 달 서울에서 열리는 축제와 공연 일정을 정리해두었습니다. 방문 전 미리 확인해보세요.',
    likes: 15,
    views: 46,
  },
  {
    id: 4,
    title: '경복궁 야간 개장 정보',
    date: '07.04',
    tag: '관광지',
    category: 'tour',
    content:
      '경복궁 야간 개장 일정과 입장 정보를 확인할 수 있는 게시글입니다. 조명과 분위기를 즐기고 싶다면 좋습니다.',
    likes: 6,
    views: 19,
  },
  {
    id: 5,
    title: '한강공원 피크닉 추천',
    date: '07.05',
    tag: '맛집',
    category: 'food',
    content: '한강공원 근처에서 피크닉하기 좋은 메뉴와 간단한 준비물을 정리해두었습니다.',
    likes: 11,
    views: 28,
  },
  {
    id: 6,
    title: '2026 서울 축제 준비',
    date: '07.06',
    tag: '축제',
    category: 'festival',
    content: '2026년 서울 축제를 위해 미리 알아두면 좋은 준비 포인트를 정리해두었습니다.',
    likes: 9,
    views: 17,
  },
  {
    id: 7,
    title: '청계천 산책 포인트',
    date: '07.07',
    tag: '관광지',
    category: 'tour',
    content: '청계천 산책 시 놓치지 말아야 할 포인트와 추천 시간대를 소개합니다.',
    likes: 7,
    views: 22,
  },
])
