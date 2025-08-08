<script setup lang="ts">
const props = defineProps<{
  // Заголовок (ось X), приходит из ChartCrosshair, но нам не нужен
  title: string
  // Массив значений по сериям; при одной категории ['value']
  // здесь будет один элемент с полем value
  data: Array<{ value: number | string }>
}>()
</script>

<template>
  <div class="bg-gray-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
    {{ data?.[0]?.value }}
  </div>
</template>
