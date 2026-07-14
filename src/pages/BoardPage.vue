<template>
  <div class="max-w-5xl mx-auto py-6">
    <div class="text-sm text-gray-500 mb-4">홈 > 게시판</div>
    
    <!-- Search & Write Button -->
    <div class="flex gap-2 mb-6">
      <input type="text" v-model="searchQuery" placeholder="게시글 검색어를 입력하세요" class="flex-1 border p-2 rounded focus:outline-none focus:border-sky-500" />
      <button @click="handleSearch" class="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800">검색</button>
      <router-link to="/board/write" class="bg-sky-500 text-white px-6 py-2 rounded flex items-center hover:bg-sky-600">+ 글쓰기</router-link>
    </div>

    <!-- Board Table -->
    <table class="w-full text-left mb-6 border-t-2 border-gray-800">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 w-16 text-center">번호</th>
          <th class="p-3">제목</th>
          <th class="p-3 w-24 text-center">작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, idx) in dummyPosts" :key="idx" class="border-b hover:bg-gray-50 cursor-pointer">
          <td class="p-3 text-center text-gray-500">{{ 7 - idx }}</td>
          <td class="p-3 text-gray-800">{{ post.title }}</td>
          <td class="p-3 text-center text-gray-500">{{ post.date }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-center gap-2">
      <button class="border px-3 py-1 text-gray-500 hover:bg-gray-50">&lt;</button>
      <button class="border px-3 py-1 border-sky-500 text-sky-500 font-bold">1</button>
      <button class="border px-3 py-1 text-gray-500 hover:bg-gray-50">2</button>
      <button class="border px-3 py-1 text-gray-500 hover:bg-gray-50">3</button>
      <button class="border px-3 py-1 text-gray-500 hover:bg-gray-50">&gt;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
const handleSearch = () => { /* API 연동 로직 */ };

// UI 확인용 더미 데이터
const dummyPosts = Array.from({ length: 7 }).map((_, i) => ({
  title: '게시글 제목 예시입니다.',
  date: `07.0${i + 1}`
}));
</script>