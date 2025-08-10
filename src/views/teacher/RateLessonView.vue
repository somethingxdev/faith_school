<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { today, getLocalTimeZone } from '@internationalized/date'
import HorizontalDatePicker from '@/components/ui/HorizontalDatePicker.vue'

const lessons = ref([
  {
    id: 1,
    subject: 'Русский язык (3-6 лет)',
    date: '30.06.2025',
    time: '12:00-13:00',
    rated: false,
  },
  {
    id: 2,
    subject: 'Русский язык (3-6 лет)',
    date: '30.06.2025',
    time: '12:00-13:00',
    rated: false,
  },
  {
    id: 3,
    subject: 'Русский язык (3-6 лет)',
    date: '30.06.2025',
    time: '12:00-13:00',
    rated: true,
  },
  {
    id: 4,
    subject: 'Русский язык (3-6 лет)',
    date: '30.06.2025',
    time: '12:00-13:00',
    rated: true,
  },
])

import type { DateValue } from '@internationalized/date'

const value = ref<DateValue>()
value.value = today(getLocalTimeZone())
</script>

<template>
  <div class="grid grid-cols-[1fr_auto] gap-8 items-start">
    <div>
      <h1 class="text-4xl font-sans text-black mb-8">Оценка урока</h1>

      <!-- Date Picker -->
      <div class="flex items-center gap-4 mb-8">
        <HorizontalDatePicker />
      </div>

      <!-- Filters -->
      <div class="flex gap-4 mb-8 w-full">
        <Select>
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Русский язык (3-6 лет)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rus-3-6">Русский язык (3-6 лет)</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger class="w-full">
            <SelectValue placeholder="По умолчанию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">По умолчанию</SelectItem>
            <SelectItem value="rated">Оцененные</SelectItem>
            <SelectItem value="unrated">Неоцененные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Lessons List -->
      <div class="space-y-4">
        <div v-for="lesson in lessons" :key="lesson.id" class="bg-white p-6 rounded-base border border-surface flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-black">{{ lesson.subject }}</span>
            <span class="text-gray">{{ lesson.date }} | {{ lesson.time }}</span>
          </div>
          <RouterLink to="/teacher/rate-lesson-details">
            <Button v-if="!lesson.rated" variant="default" size="sm" class="w-[350px]">Оценить</Button>
          </RouterLink>
        </div>
      </div>
    </div>

    <Calendar v-model="value" :weekday-format="'short'" :locale="'ru-RU'" class="rounded-base bg-white shadow" />
  </div>
</template>
