<template>
  <div class="mx-auto max-w-3xl py-6">
    <div class="mb-4 text-sm text-slate-500">
      홈 <span class="mx-2 text-slate-300">›</span> 게시판 <span class="mx-2 text-slate-300">›</span> 글 수정
    </div>

    <section class="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)]">
      <div class="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-6 py-5">
        <h1 class="text-2xl font-bold text-slate-800">글 수정</h1>
        <p class="mt-2 text-sm text-slate-600">비밀번호 확인 후 수정할 수 있습니다.</p>
      </div>

      <div class="p-6">
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">제목</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">카테고리</label>
            <select
              v-model="form.category"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
            >
              <option value="tour">관광지</option>
              <option value="food">맛집</option>
              <option value="festival">축제·행사</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700">내용</label>
            <textarea
              v-model="form.content"
              rows="8"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <router-link
              to="/board"
              class="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              취소
            </router-link>
            <button
              @click="handleSubmit"
              class="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
            >
              수정완료
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  title: '기존 게시글 제목',
  category: 'tour',
  content: '기존 게시글 내용입니다.',
})

const handleSubmit = () => {
  alert('수정이 완료되었습니다.')
  router.push('/board')
}
</script>