<template>
  <footer class="bg-slate-50 border-t border-border-default py-8 text-sm text-text-muted">
    <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-6">
      <!-- 좌측: 서비스 정보 및 공공데이터 출처 표기 -->
      <div class="flex flex-col gap-2">
        <h2 class="text-lg font-bold text-text-strong">LocalHub</h2>
        <div class="leading-relaxed">
          <p>이 서비스는 한국관광공사 Tour API(TourAPI 4.0)의 데이터를 활용하였습니다.</p>
          <p>
            출처: 
            <a 
              href="https://www.data.go.kr/data/15101578/openapi.do" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="hover:text-primary transition-colors underline underline-offset-2"
            >
              한국관광공사
            </a>
          </p>
          <p>라이선스: 공공누리 제3유형 (출처표시, 변경금지)</p>
        </div>
      </div>

      <!-- 우측: 부가 정보 및 저작권 -->
      <div class="md:text-right flex flex-col justify-end h-full mt-4 md:mt-0">
        <div class="flex gap-4 md:justify-end mb-2 text-text-base font-medium">
          <a href="#" class="hover:text-primary">이용약관</a>
          <a href="#" class="hover:text-primary">개인정보처리방침</a>
        </div>
        <p class="text-xs">&copy; 2026 LocalHub. All rights reserved.</p>
        <p class="text-xs mt-1">본 사이트는 교육 목적의 프로젝트 와이어프레임입니다.</p>
      </div>
    </div>
  </footer>
</template>