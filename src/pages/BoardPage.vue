<template>
  <div class="mx-auto max-w-5xl py-6">
    <div class="mb-4 text-sm text-slate-500">
      홈 <span class="mx-2 text-slate-300">›</span> 게시판
    </div>

    <section
      class="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)]"
    >
      <div
        class="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-6 py-5"
      >
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
          <label
            class="flex flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-sky-400 focus-within:bg-white"
          >
            <svg
              class="mr-2 h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
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
            @click="selectedCategory = category.id === 'all' ? 'all' : Number(category.id)"
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
                <th class="w-16 px-4 py-3 text-center text-sm font-semibold text-slate-600">
                  번호
                </th>
                <th class="px-4 py-3 text-sm font-semibold text-slate-600">제목</th>
                <th class="w-28 px-4 py-3 text-center text-sm font-semibold text-slate-600">
                  작성일
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(post, idx) in paginatedPosts"
                :key="post.id"
                @click="openPostDetail(post)"
                class="cursor-pointer border-t border-slate-100 transition-all duration-300 hover:bg-sky-50/60 hover:translate-x-1"
              >
                <td class="px-4 py-4 text-center text-sm text-slate-500">
                  {{ (currentPage - 1) * perPage + (idx + 1) }}
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <span
                        class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700"
                      >
                        {{ post.catName }}
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
                <td class="px-4 py-4 text-center text-sm text-slate-500">{{ post.createdAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            class="rounded-full border border-slate-200 px-3.5 py-2 text-sm text-slate-500 transition-all duration-300 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
           :disabled="currentPage===1" @click="currentPage--">&lt;</button>

          <button
            v-for="p in totalPages"
            :key="p"
            :class="p === currentPage ? 'rounded-full border border-sky-500 bg-sky-500 px-3.5 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_-10px_rgba(14,116,144,0.8)]' : 'rounded-full border border-slate-200 px-3.5 py-2 text-sm text-slate-500 transition-all duration-300 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600'"
            @click="currentPage = p"
          >
            {{ p }}
          </button>

          <button
            class="rounded-full border border-slate-200 px-3.5 py-2 text-sm text-slate-500 transition-all duration-300 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
            :disabled="currentPage===totalPages" @click="currentPage++">&gt;</button>
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
          {{
            modalMode === 'edit'
              ? '수정하려면 작성 시 입력한 비밀번호를 입력하세요.'
              : '삭제하려면 작성 시 입력한 비밀번호를 입력하세요.'
          }}
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
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
              {{ selectedPost.catName }}
            </p>
            <h2 class="mt-2 text-2xl font-bold text-slate-800">{{ selectedPost.title }}</h2>
            <p class="mt-2 text-sm text-slate-500">{{ selectedPost.createdAt }}</p>
          </div>

          <button
            @click="closePostDetail"
            class="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            닫기
          </button>
        </div>

        <div
          class="mt-6 rounded-[20px] border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
        >
          {{ selectedPost.content }}
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3 text-sm text-slate-500">
            <span>조회 {{ selectedPost.viewCount }}</span>
            <span>좋아요 {{ selectedPost.likeCount }}</span>
          </div>

          <button
            @click.stop="handleLike(selectedPost)"
            :disabled="isPostLiked(selectedPost.id) || isLikeProcessing"
            class="rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
            :class="
              isPostLiked(selectedPost.id)
                ? 'bg-rose-100 text-rose-600'
                : 'bg-rose-500 text-white hover:bg-rose-600'
            "
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
import { boardApi, fetchPosts, verifyPassword } from '@/features/board/api'

type Post = {
  id: number
  catId: number;
  catName?: string;
  title: string
  content: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
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
const selectedCategory = ref<number | 'all'>('all')
const categories = ref<Category[]>([{ id: 'all', name: '전체' }])
const posts = ref<Post[]>([])
const selectedPost = ref<Post | null>(null)
const interactionState = ref<InteractionState>({ likedPosts: [], viewedPosts: [] })
const isLikeProcessing = ref(false) // API 중복 호출 방지 플래그
const currentPage = ref(1)
const perPage = ref(10)

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

const findCategoryName = (catId?: number | string) => {
      const category = categories.value.find(c => String(c.id) === String(catId))
      return category ? category.name : ''
    }

    const formatDate = (iso?: string) => {
      if (!iso) return ''
      const d = new Date(iso)
      if (isNaN(d.getTime())) return ''
      const mm  = String(d.getMonth() + 1).padStart(2, '0')
      const dd  = String(d.getDate()).padStart(2, '0')
      return `${mm}.${dd}`
    }

onMounted(() => {
  loadInteractionState()
})

const handleSearch = async () => {
  currentPage.value = 1
  await loadPosts(1, searchQuery.value)
}

onMounted(async () => {
  try {
    const remoteCategories = await fetchCategories()
    categories.value = [{ id: 'all', name: '전체' }, ...remoteCategories]
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }

  await loadPosts(1)
})

const loadPosts = async (page = 1, keyword?: string) => {
  try {
      const remotePosts = await fetchPosts(page, keyword)

      posts.value = remotePosts.map((p) => ({
        id: p.id,
        catId: Number(p.cat_id),
        catName: findCategoryName(p.cat_id),
        title: p.title,
        content: p.content,
        viewCount: p.view_count,
        likeCount: p.like_count,
        createdAt: formatDate(p.created_at),
        updatedAt: formatDate(p.updated_at),
      }))
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    }
}

const openEditModal = (post: { id: number }) => {
  modalMode.value = 'edit'
  passwordInput.value = ''
  targetPostId.value = post.id
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

const confirmAction = async () => {
  if (!passwordInput.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  const id = targetPostId.value
  if (!id) {
    alert('게시글을 선택해주세요.')
    return
  }

  try {
    await verifyPassword(id, passwordInput.value)

    if (modalMode.value === 'delete' && targetPostId.value !== null) {
      posts.value = posts.value.filter((post) => post.id !== targetPostId.value)
      alert('게시글이 삭제되었습니다.')
      closeModal()
      return
    }

    closeModal()
    router.push('/board/edit')
  } catch (err: any) {
    const msg = err?.message ?? '처리 중 오류가 발생했습니다.'
    alert(msg)
  }

}

// ----------------------------------------------------
// 변경 사항: API 연동 및 상태 갱신 로직 적용
// ----------------------------------------------------

const openPostDetail = async (post: Post) => {
  // 1. UI를 즉각적으로 그리기 위해 상태를 먼저 바인딩합니다.
  selectedPost.value = post

  const alreadyViewed = interactionState.value.viewedPosts.includes(post.id)
  if (!alreadyViewed) {
    try {
      // 2. 서버에 원자적 업데이트 요청
      const response = await boardApi.incrementViewCount(post.id)

      // 3. 서버에서 반환된 정확한 카운트로 로컬 상태 갱신
      post.viewCount = response.view_count

      // 4. 로컬 스토리지 업데이트를 통해 중복 조회 차단
      interactionState.value.viewedPosts.push(post.id)
      saveInteractionState()
    } catch (error) {
      console.error('조회수 갱신 실패:', error)
    }
  }
}

const closePostDetail = () => {
  selectedPost.value = null
}

const handleLike = async (post: Post) => {
  const alreadyLiked = interactionState.value.likedPosts.includes(post.id)
  if (alreadyLiked) {
    alert('이미 좋아요를 누른 게시글입니다.')
    return
  }

  isLikeProcessing.value = true

  try {
    // 1. 서버에 원자적 업데이트 요청
    const response = await boardApi.incrementLikeCount(post.id)

    // 2. 서버에서 반환된 정확한 카운트로 로컬 상태 갱신
    post.likeCount = response.like_count

    // 3. 로컬 스토리지 업데이트를 통해 중복 좋아요 차단
    interactionState.value.likedPosts.push(post.id)
    saveInteractionState()
  } catch (error) {
    console.error('좋아요 반영 실패:', error)
    alert('좋아요 처리 중 오류가 발생했습니다.')
  } finally {
    isLikeProcessing.value = false
  }
}

// ----------------------------------------------------

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    const matchesCategory =
      selectedCategory.value === 'all' || post.catId === selectedCategory.value
    const matchesSearch =
      post.title.includes(searchQuery.value) || (post.catName || '').includes(searchQuery.value)
    return matchesCategory && (searchQuery.value ? matchesSearch : true)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / perPage.value)))


const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredPosts.value.slice(start, start + perPage.value)
})

</script>
