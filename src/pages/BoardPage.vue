<template>
  <div class="mx-auto max-w-5xl py-6">
    <div class="mb-4 text-sm text-slate-500">
      홈 <span class="mx-2 text-slate-300">›</span> 게시판
    </div>

    <section class="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)]">
      <div class="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-6 py-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Community</p>
            <h1 class="mt-1 text-2xl font-bold text-slate-800">지역 정보 게시판</h1>
            <p class="mt-2 text-sm text-slate-600">
              서울 지역의 관광, 맛집, 축제 정보를 함께 공유해보세요.
            </p>
          </div>

          <router-link
            to="/board/write"
            class="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_10px_24px_-14px_rgba(14,116,144,0.7)]"
          >
            + 글쓰기
          </router-link>
        </div>
      </div>

      <div class="p-6">
        <div class="mb-6 flex flex-col gap-3 md:flex-row">
          <label class="flex flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-sky-400 focus-within:bg-white">
            <svg class="mr-2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="게시글 검색어를 입력하세요"
              class="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            @click="handleSearch"
            class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
          >
            검색
          </button>
        </div>

        <div class="mb-6 flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-300"
            :class="selectedCategory === category.id
              ? 'border-sky-500 bg-sky-500 text-white shadow-[0_8px_18px_-10px_rgba(14,116,144,0.8)]'
              : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'"
          >
            {{ category.name }}
          </button>
        </div>

        <div class="overflow-hidden rounded-2xl border border-slate-200">
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr>
                <th class="w-16 px-4 py-3 text-center text-sm font-semibold text-slate-600">번호</th>
                <th class="px-4 py-3 text-sm font-semibold text-slate-600">제목</th>
                <th class="w-28 px-4 py-3 text-center text-sm font-semibold text-slate-600">작성일</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(post, idx) in filteredPosts"
                :key="post.id"
                @click="openPostDetail(post)"
                class="cursor-pointer border-t border-slate-100 transition-all duration-300 hover:bg-sky-50/60 hover:translate-x-1"
              >
                <td class="px-4 py-4 text-center text-sm text-slate-500">{{ filteredPosts.length - idx }}</td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <span class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
                        {{ post.tag }}
                      </span>
                      <span class="text-sm font-medium text-slate-800">{{ post.title }}</span>
                    </div>

                    <div class="flex items-center gap-2">
                      <button
                        @click.stop="openEditModal(post)"
                        class="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                      >
                        수정
                      </button>
                      <button
                        @click.stop="openDeleteModal(post)"
                        class="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-center text-sm text-slate-500">{{ post.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button class="rounded-full border border-slate-200 px-3.5 py-2 text-sm text-slate-500 transition-all duration-300 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600">
            &lt;
          </button>
          <button class="rounded-full border border-sky-500 bg-sky-500 px-3.5 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_-10px_rgba(14,116,144,0.8)]">
            1
          </button>
          <button class="rounded-full border border-slate-200 px-3.5 py-2 text-sm text-slate-500 transition-all duration-300 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600">
            2
          </button>
          <button class="rounded-full border border-slate-200 px-3.5 py-2 text-sm text-slate-500 transition-all duration-300 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600">
            3
          </button>
          <button class="rounded-full border border-slate-200 px-3.5 py-2 text-sm text-slate-500 transition-all duration-300 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600">
            &gt;
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
    >
      <div class="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl">
        <h2 class="text-lg font-bold text-slate-800">
          {{ modalMode === 'edit' ? '비밀번호 확인' : '게시글 삭제' }}
        </h2>
        <p class="mt-2 text-sm text-slate-600">
          {{ modalMode === 'edit' ? '수정하려면 작성 시 입력한 비밀번호를 입력하세요.' : '삭제하려면 작성 시 입력한 비밀번호를 입력하세요.' }}
        </p>

        <input
          v-model="passwordInput"
          type="password"
          placeholder="비밀번호 입력"
          class="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
        />

        <div class="mt-5 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            취소
          </button>
          <button
            @click="confirmAction"
            class="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            {{ modalMode === 'edit' ? '확인' : '삭제' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="selectedPost"
      class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
    >
      <div class="w-full max-w-2xl rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">{{ selectedPost.tag }}</p>
            <h2 class="mt-2 text-2xl font-bold text-slate-800">{{ selectedPost.title }}</h2>
            <p class="mt-2 text-sm text-slate-500">{{ selectedPost.date }}</p>
          </div>

          <button
            @click="closePostDetail"
            class="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            닫기
          </button>
        </div>

        <div class="mt-6 rounded-[20px] border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          {{ selectedPost.content }}
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3 text-sm text-slate-500">
            <span>조회 {{ selectedPost.views }}</span>
            <span>좋아요 {{ selectedPost.likes }}</span>
          </div>

          <button
            @click.stop="handleLike(selectedPost)"
            :disabled="isPostLiked(selectedPost.id)"
            class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="isPostLiked(selectedPost.id)
              ? 'bg-rose-100 text-rose-600'
              : 'bg-rose-500 text-white hover:bg-rose-600'"
          >
            {{ isPostLiked(selectedPost.id) ? '♥ 좋아요 완료' : '♡ 좋아요' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchCategories, type Category } from '@/features/category/api'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

type Post = {
  id: number
  title: string
  date: string
  tag: string
  category: Category['id']
  content: string
  likes: number
  views: number
}

type InteractionState = {
  likedPosts: number[]
  viewedPosts: number[]
}

const STORAGE_KEY = 'board-interactions'

const router = useRouter()
const searchQuery = ref('')
const isModalOpen = ref(false)
const passwordInput = ref('')
const modalMode = ref<'edit' | 'delete'>('edit')
const targetPostId = ref<number | null>(null)
const selectedCategory = ref<string>('all')
const categories = ref<Category[]>([{ id: 'all', name: '전체' }])
const selectedPost = ref<Post | null>(null)
const interactionState = ref<InteractionState>({ likedPosts: [], viewedPosts: [] })

const loadInteractionState = () => {
  if (typeof window === 'undefined') return

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return

  try {
    const parsed = JSON.parse(saved) as Partial<InteractionState>
    interactionState.value = {
      likedPosts: Array.isArray(parsed.likedPosts) ? parsed.likedPosts : [],
      viewedPosts: Array.isArray(parsed.viewedPosts) ? parsed.viewedPosts : [],
    }
  } catch {
    interactionState.value = { likedPosts: [], viewedPosts: [] }
  }
}

const saveInteractionState = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(interactionState.value))
}

const isPostLiked = (postId: number | null) => {
  return !!postId && interactionState.value.likedPosts.includes(postId)
}

onMounted(() => {
  loadInteractionState()
})

const handleSearch = () => {
  // API 연동 로직
}

onMounted(async () => {
  try {
    const remote = await fetchCategories()
    categories.value = [{ id: 'all', name: '전체' }, ...remote]
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
})

const openEditModal = (_post: { id: number }) => {
  modalMode.value = 'edit'
  passwordInput.value = ''
  targetPostId.value = null
  isModalOpen.value = true
}

const openDeleteModal = (post: { id: number }) => {
  modalMode.value = 'delete'
  passwordInput.value = ''
  targetPostId.value = post.id
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  passwordInput.value = ''
  targetPostId.value = null
}

const confirmAction = () => {
  if (!passwordInput.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  if (modalMode.value === 'delete' && targetPostId.value !== null) {
    posts.value = posts.value.filter(post => post.id !== targetPostId.value)
    alert('게시글이 삭제되었습니다.')
    closeModal()
    return
  }

  closeModal()
  router.push('/board/edit')
}

const openPostDetail = (post: Post) => {
  const alreadyViewed = interactionState.value.viewedPosts.includes(post.id)

  if (!alreadyViewed) {
    interactionState.value.viewedPosts.push(post.id)
    post.views += 1
    saveInteractionState()
  }

  selectedPost.value = post
}

const closePostDetail = () => {
  selectedPost.value = null
}

const handleLike = (post: Post) => {
  const alreadyLiked = interactionState.value.likedPosts.includes(post.id)

  if (alreadyLiked) {
    alert('이미 좋아요를 누른 게시글입니다.')
    return
  }

  interactionState.value.likedPosts.push(post.id)
  post.likes += 1
  saveInteractionState()
}

const posts = ref<Post[]>([
  {
    id: 1,
    title: '관광지 추천 코스 공유해요',
    date: '07.01',
    tag: '관광지',
    category: 'tour',
    content: '서울의 숨은 명소를 소개하는 글입니다. 조용한 산책로와 예쁜 카페까지 함께 즐길 수 있는 코스를 정리해두었습니다.',
    likes: 12,
    views: 34,
  },
  {
    id: 2,
    title: '성수동 맛집 리스트',
    date: '07.02',
    tag: '맛집',
    category: 'food',
    content: '성수동에서 가볍게 들르기 좋은 맛집들을 모아봤습니다. brunch와 디저트까지 한 번에 즐길 수 있어요.',
    likes: 8,
    views: 21,
  },
  {
    id: 3,
    title: '서울 축제 일정 모음',
    date: '07.03',
    tag: '축제',
    category: 'festival',
    content: '이번 달 서울에서 열리는 축제와 공연 일정을 정리해두었습니다. 방문 전 미리 확인해보세요.',
    likes: 15,
    views: 46,
  },
  {
    id: 4,
    title: '경복궁 야간 개장 정보',
    date: '07.04',
    tag: '관광지',
    category: 'tour',
    content: '경복궁 야간 개장 일정과 입장 정보를 확인할 수 있는 게시글입니다. 조명과 분위기를 즐기고 싶다면 좋습니다.',
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

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesCategory = selectedCategory.value === 'all' || post.category === selectedCategory.value
    const matchesSearch = post.title.includes(searchQuery.value) || post.tag.includes(searchQuery.value)
    return matchesCategory && (searchQuery.value ? matchesSearch : true)
  })
})
</script>