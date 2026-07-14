<template>
  <div class="bg-white p-4 rounded-lg shadow border border-border-default">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventInput } from '@fullcalendar/core';

// TourAPI 데이터 타입 정의
interface TourApiItem {
  title: string;
  eventstartdate?: string; // YYYYMMDD (API 명세 기준)
  eventenddate?: string;   // YYYYMMDD
  addr1: string;
  firstimage: string;
  tel: string;
}

const props = defineProps<{
  events: TourApiItem[];
}>();

// YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환하는 유틸리티
const formatDate = (dateStr?: string) => {
  if (!dateStr || dateStr.length !== 8) return new Date().toISOString().split('T')[0];
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
};

// FullCalendar Event 객체로 매핑
const mappedEvents = ref<EventInput[]>([]);

watch(() => props.events, (newEvents) => {
  mappedEvents.value = newEvents.map(item => ({
    title: item.title,
    start: formatDate(item.eventstartdate),
    end: formatDate(item.eventenddate),
    extendedProps: {
      address: item.addr1,
      image: item.firstimage,
      phone: item.tel
    }
  }));
}, { immediate: true });

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  events: mappedEvents,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth'
  },
  height: 'auto',
  eventClick: (info: any) => {
    // 상세 정보 모달 트리거 등의 로직 처리
    const { title } = info.event;
    const { address, phone } = info.event.extendedProps;
    alert(`[${title}]\n주소: ${address}\n문의: ${phone}`);
  }
});
</script>

<style>
/* FullCalendar 내부 스타일을 Tailwind 변수와 동기화 (선택적) */
:root {
  --fc-button-bg-color: var(--color-primary);
  --fc-button-border-color: var(--color-primary);
  --fc-button-hover-bg-color: var(--color-primary-hover);
  --fc-button-hover-border-color: var(--color-primary-hover);
}
.fc-event {
  cursor: pointer;
  background-color: var(--color-sky-100);
  border-color: var(--color-sky-200);
  color: var(--color-sky-800);
  font-size: 0.75rem;
  padding: 1px 4px;
}
</style>