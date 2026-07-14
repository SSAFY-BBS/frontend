<template>
  <div class="max-w-5xl mx-auto py-6">
    <h1 class="text-2xl font-bold text-text-strong mb-6">지역 축제 캘린더</h1>

    <FestivalCalendarWidget :events="festivalData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FestivalCalendarWidget from '@/widgets/FestivalCalendarWidget.vue';

interface TourApiItem {
  title: string;
  eventstartdate?: string;
  eventenddate?: string;
  addr1: string;
  firstimage: string;
  tel: string;
}

interface FestivalJsonItem {
  title: string;
  addr1: string;
  firstimage?: string;
  tel?: string;
  createdtime?: string;
  modifiedtime?: string;
}

interface FestivalJsonResponse {
  items?: FestivalJsonItem[];
}

const festivalData = ref<TourApiItem[]>([]);

const toYyyymmdd = (value?: string) => {
  if (!value || value.length < 8) return '';
  return value.slice(0, 8);
};

onMounted(async () => {
  try {
    const response = await fetch('/seoul_data/서울_축제공연행사.json');
    const json: FestivalJsonResponse = await response.json();

    festivalData.value = (json.items ?? []).map(item => ({
      title: item.title,
      eventstartdate: toYyyymmdd(item.createdtime),
      eventenddate: toYyyymmdd(item.modifiedtime),
      addr1: item.addr1,
      firstimage: item.firstimage ?? '',
      tel: item.tel ?? '',
    }));
  } catch (error) {
    console.error('축제 JSON 로드 실패:', error);
  }
});
</script>