<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { EditIcon } from 'lucide-vue-next'
import { today, getLocalTimeZone } from '@internationalized/date'

// Calendar state (same pattern as teacher RateLessonView)
import type { DateValue } from '@internationalized/date'
const value = ref<DateValue>()
value.value = today(getLocalTimeZone())

// Filters
const year = ref<string | null>(null)
const semester = ref<string | null>(null)

// Mock schedule items grouped by date
const schedule = ref([
  {
    date: '30 июня',
    day: 'Понедельник',
    items: [
      { id: 1, time: '9:00-12:00', title: 'Русский язык (3-6 лет)' },
      { id: 2, time: '12:30-14:00', title: 'Математика (5-6 лет)' },
      { id: 3, time: '15:00-16:00', title: 'Библия (7-9 лет)' },
    ],
  },
  {
    date: '1 июля',
    day: 'Вторник',
    items: [{ id: 4, time: '9:00-12:00', title: 'Русский язык (3-6 лет)' }],
  },
  {
    date: '2 июля',
    day: 'Среда',
    items: [{ id: 5, time: '9:00-12:00', title: 'История (6-7 лет)' }],
  },
])

const editing = ref<{ id: number; title: string; date: string; start: string; end: string } | null>(null)

function openEdit(item: { id: number; time: string; title: string }, date: string) {
  const [start, end] = item.time.split('-')
  editing.value = { id: item.id, title: item.title, date, start, end }
}

function saveEdit() {
  // Mock save: update local state
  if (!editing.value) return
  const { id, title, start, end } = editing.value
  schedule.value.forEach((group) => {
    group.items = group.items.map((it) => (it.id === id ? { ...it, title, time: `${start}-${end}` } : it))
  })
  editing.value = null
}
</script>

<template>
  <div class="container grid grid-cols-[1fr_auto] gap-8 items-start">
    <!-- Left column -->
    <div>
      <h1 class="text-4xl font-sans text-black mb-8">Расписание</h1>

      <!-- Filters -->
      <div class="flex gap-5 mb-7.5 w-full">
        <Select v-model="year">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Учебный год" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-2025">2024–2025</SelectItem>
            <SelectItem value="2025-2026">2025–2026</SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="semester">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Семестр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Schedule list -->
      <div class="space-y-4">
        <div v-for="group in schedule" :key="group.date" class="grid grid-cols-[120px_1fr] gap-8 pb-5 mb-5 border-b border-surface">
          <div class="flex flex-col gap-1">
            <h2 class="text-xl/none text-black font-sans">{{ group.date }}</h2>
            <p class="text-gray text-lg">{{ group.day }}</p>
          </div>

          <div class="space-y-4">
            <div v-for="item in group.items" :key="item.id" class="bg-white rounded-base shadow-sm border border-surface p-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex flex-col gap-1">
                  <span class="text-black">{{ item.title }}</span>
                  <span class="text-gray">{{ item.time }}</span>
                </div>
                <Dialog>
                  <DialogTrigger as-child>
                    <Button variant="ghost" size="icon" @click="openEdit(item, `${group.date}`)">
                      <EditIcon class="text-gray size-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Редактировать занятие</DialogTitle>
                    </DialogHeader>

                    <div class="grid gap-4 mb-5">
                      <div>
                        <label class="mb-2 block">Дата занятия</label>
                        <Input :value="editing?.date" readonly />
                      </div>
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="mb-2 block">Время начала</label>
                          <Input v-model="editing!.start" placeholder="15:00" />
                        </div>
                        <div>
                          <label class="mb-2 block">Время окончания</label>
                          <Input v-model="editing!.end" placeholder="16:00" />
                        </div>
                      </div>
                      <div>
                        <label class="mb-2 block">Класс</label>
                        <Select>
                          <SelectTrigger class="w-full">
                            <SelectValue placeholder="Выберите класс" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rus-3-6">Русский язык (3-6 лет)</SelectItem>
                            <SelectItem value="math-5-6">Математика (5-6 лет)</SelectItem>
                            <SelectItem value="bible-7-9">Библия (7-9 лет)</SelectItem>
                            <SelectItem value="history-6-7">История (6-7 лет)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter class="sm:flex-col">
                      <Button type="button" @click="saveEdit">Сохранить</Button>
                      <DialogClose as-child>
                        <Button type="button" variant="outline">Отмена</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Calendar v-model="value" :weekday-format="'short'" :locale="'ru-RU'" class="rounded-base bg-white shadow" />
  </div>
</template>
