<template>
  <div class="max-w-5xl mx-auto py-6">
    <!-- Hero Section -->
    <section class="bg-sky-50 py-12 text-center rounded-lg mb-8">
      <h1 class="text-3xl font-bold text-sky-600 mb-2">지역 정보 공유 커뮤니티 LocalHub</h1>
      <p class="text-gray-600">선정 권역(OO/OO) 지역 정보를 한눈에 만나보세요</p>
    </section>

    <!-- Categories -->
    <section class="mb-10">
      <h2 class="text-lg font-bold mb-4">카테고리 바로가기</h2>
      <div class="grid grid-cols-3 gap-4">
        <router-link to="/board?category=tour" class="border p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition cursor-pointer">
          <div class="w-16 h-12 bg-gray-200 mb-2 flex items-center justify-center text-gray-400">IMG</div>
          <span class="font-medium text-gray-800">관광지</span>
        </router-link>
        <router-link to="/board?category=food" class="border p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition cursor-pointer">
          <div class="w-16 h-12 bg-gray-200 mb-2 flex items-center justify-center text-gray-400">IMG</div>
          <span class="font-medium text-gray-800">맛집</span>
        </router-link>
        <router-link to="/board?category=festival" class="border p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition cursor-pointer">
          <div class="w-16 h-12 bg-gray-200 mb-2 flex items-center justify-center text-gray-400">IMG</div>
          <span class="font-medium text-gray-800">축제·행사</span>
        </router-link>
      </div>
    </section>

    <!-- Recent Posts -->
    <section>
      <h2 class="text-lg font-bold mb-4">최근 게시글</h2>
      <ul class="space-y-4">
        <li v-for="i in 4" :key="i" class="flex justify-between items-center border-b pb-2 text-gray-700">
          <div class="h-4 bg-gray-200 w-2/3 rounded"></div>
          <span class="text-sm text-gray-400">07.0{{ i }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>