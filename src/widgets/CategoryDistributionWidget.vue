<script setup lang="ts">
import { computed } from 'vue'

interface CategoryItem {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  items: CategoryItem[]
}>()

const circumference = 2 * Math.PI * 40

const totalValue = computed(() => props.items.reduce((sum, item) => sum + item.value, 0) || 1)

const segments = computed(() => {
  let offset = 0

  return props.items.map(item => {
    const length = (item.value / totalValue.value) * circumference
    const segment = {
      ...item,
      length,
      offset: -offset,
    }
    offset += length
    return segment
  })
})

const labelText = (key: string) => {
  const labels: Record<string, string> = {
    tour: '관광지',
    food: '맛집',
    festival: '축제·행사',
  }

  return labels[key] ?? key
}
</script>

<template>
  <section class="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(14,116,144,0.34)] lg:col-span-2">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-slate-800">카테고리별 인기 분포</h3>
      <span class="text-xs font-medium text-slate-400">서울 기준</span>
    </div>

    <div class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center">
      <svg viewBox="0 0 120 120" class="mx-auto h-40 w-40 shrink-0">
        <circle cx="60" cy="60" r="40" fill="none" stroke="#e2e8f0" stroke-width="24" />
        <circle
          v-for="segment in segments"
          :key="segment.label"
          cx="60"
          cy="60"
          r="40"
          fill="none"
          :stroke="segment.color"
          stroke-width="24"
          stroke-linecap="round"
          :stroke-dasharray="`${segment.length} ${circumference}`"
          :stroke-dashoffset="segment.offset"
          transform="rotate(-90 60 60)"
          class="transition-all duration-700"
        />
      </svg>

      <div class="flex-1 space-y-3">
        <div
          v-for="segment in segments"
          :key="segment.label"
          class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2"
        >
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: segment.color }" />
            <span class="text-sm font-medium text-slate-700">{{ labelText(segment.label) }}</span>
          </div>
          <span class="text-sm text-slate-500">{{ segment.value }}개</span>
        </div>
      </div>
    </div>
  </section>
</template>