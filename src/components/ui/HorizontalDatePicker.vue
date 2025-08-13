<script setup lang="ts">
import { ref } from 'vue'
import { today, getLocalTimeZone } from '@internationalized/date'

const now = today(getLocalTimeZone())
const startDate = now.subtract({ days: 1 })

const dates = ref<any[]>([])
for (let i = 0; i < 15; i++) {
  dates.value.push(startDate.add({ days: i }))
}

const selectedDate = ref(now)

const getDayName = (date: any) => {
  return new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(date.toDate(getLocalTimeZone()))
}
</script>

<template>
  <div class="flex items-start gap-2 mb-8 w-full overflow-scroll">
    <div
      v-for="date in dates"
      :key="date.toString()"
      @click="selectedDate = date"
      class="flex flex-col items-center gap-2.5 py-3.5 justify-center w-12.5 shrink-0 rounded-base cursor-pointer transition-colors text-gray"
      :class="{ 'bg-green text-white': selectedDate.compare(date) === 0, 'hover:bg-gray-100': selectedDate.compare(date) !== 0 }"
    >
      <span class="/none">{{ getDayName(date) }}</span>
      <span class="text-xl/none font-sans">{{ date.day }}</span>

      <span class="size-1.5 rounded-full bg-white" v-show="selectedDate.compare(date) === 0"> </span>
    </div>
  </div>
</template>
