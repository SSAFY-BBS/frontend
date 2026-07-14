<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  items: Array<{ title: string; value: number }>
  barColor: string
  label: string
}>()

const maxValue = computed(() => Math.max(...props.items.map(item => item.value), 1))
</script>

<template>
  <section class="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(14,116,144,0.34)]">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-slate-800">{{ title }}</h3>
      <span class="text-xs font-medium text-slate-400">TOP 5</span>
    </div>

    <div class="mt-4 space-y-4">
      <div
        v-for="item in items"
        :key="item.title"
        class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition-all duration-300 hover:bg-slate-50"
      >
        <div class="flex items-center justify-between text-sm text-slate-600">
          <span class="truncate pr-2">{{ item.title }}</span>
          <span class="font-semibold text-slate-700">{{ item.value.toLocaleString() }} {{ label }}</span>
        </div>

        <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            class="h-2 rounded-full transition-all duration-500"
            :style="{
              width: `${(item.value / maxValue) * 100}%`,
              backgroundColor: barColor,
            }"
          />
        </div>
      </div>
    </div>
  </section>
</template>