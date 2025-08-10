<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { LineChart } from '@/components/ui/chart-line'
import { CurveType } from '@unovis/ts'
import TooltipNumber from '@/components/ui/chart/TooltipNumber.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Separator from '@/components/ui/separator/Separator.vue'
import { SearchIcon } from 'lucide-vue-next'

// Period select state
const month = ref('Июнь, 2025')

// Cards data (mock)
const overallAttendance = ref(87)
const earned = ref(3700)
const spent = ref(2400)
const avgTeachingScore = ref(4.5)
// Circular progress values for avg teaching score (0-5 -> 0-100%)
const teachingScorePercent = computed(() => {
  const pct = (avgTeachingScore.value / 5) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
})
const ringRadius = 52
const ringStroke = 10
const circumference = 2 * Math.PI * ringRadius

// Line chart data (mock)
// index key is `label`, value key is `value`
const attendanceData = ref(
  Array.from({ length: 14 }, (_, i) => ({ label: String(i + 1), value: [20, 35, 50, 40, 32, 28, 30, 45, 60, 75, 80, 70, 55, 48][i] })),
)
</script>

<template>
  <h1 class="text-4xl font-sans text-black mb-12.5">Обзор</h1>

  <!-- KPI Cards -->
  <div class="flex gap-4 mb-7.5">
    <div class="bg-white rounded-base border border-surface p-5 space-y-4">
      <p class="text-black /none">Общая посещаемость</p>
      <p class="text-4xl/none text-black font-sans">{{ overallAttendance }}%</p>
    </div>
    <div class="bg-white rounded-base border border-surface p-5 space-y-4">
      <p class="text-black /none">Заработано динариев</p>
      <p class="text-4xl/none text-black font-sans">{{ earned.toLocaleString('ru-RU') }}</p>
    </div>
    <div class="bg-white rounded-base border border-surface p-5 space-y-4">
      <p class="text-black /none">Средняя оценка преподавания</p>
      <p class="text-4xl/none text-black font-sans">{{ avgTeachingScore }}/5</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Attendance chart card -->
    <div class="bg-white rounded-base border border-surface p-6 lg:col-span-2">
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-xl font-sans text-black">Посещаемость</h2>
        <Select v-model="month">
          <SelectTrigger class="bg-transparent data-[size=default]:h-auto">
            <SelectValue placeholder="Месяц" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Июнь, 2025">Июнь, 2025</SelectItem>
            <SelectItem value="Июль, 2025">Июль, 2025</SelectItem>
            <SelectItem value="Август, 2025">Август, 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <LineChart
        :data="attendanceData"
        :categories="['value']"
        :colors="['#96C121']"
        index="label"
        :curve-type="CurveType.Natural"
        :custom-tooltip="TooltipNumber"
        class="mb-10"
      />

      <div class="mt-4 flex flex-col gap-4 items-center">
        <div class="relative w-full">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
          <Input placeholder="Найти ученика" class="pl-12" />
        </div>

        <Button class="w-full">Найти</Button>
      </div>
    </div>

    <!-- Right column -->
    <div class="space-y-4">
      <div class="bg-white rounded-base border border-surface p-6">
        <div class="flex items-center justify-between text-black">
          <h3>Очки</h3>
          <span>{{ month }}</span>
        </div>
        <Separator class="my-5" />
        <div class="flex items-center justify-between text-black">
          <span>Заработано</span>
          <span>{{ earned.toLocaleString('ru-RU') }}</span>
        </div>
        <Progress :model-value="Math.min(100, Math.round((earned / 5000) * 100))" class="mt-2" />

        <div class="flex items-center justify-between text-black mt-4">
          <span>Потрачено</span>
          <span>{{ spent.toLocaleString('ru-RU') }}</span>
        </div>
        <Progress :model-value="Math.min(100, Math.round((spent / 5000) * 100))" class="mt-2" />
      </div>

      <div class="bg-white rounded-base border border-surface p-6">
        <div class="flex items-center justify-between mb-7.5">
          <h3 class="text-black">Средняя оценка преподавания</h3>
          <span class="text-gray">{{ month }}</span>
        </div>

        <div class="flex flex-col items-start gap-7">
          <div class="relative size-30">
            <svg class="size-full -rotate-90" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" :r="ringRadius" :stroke-width="ringStroke" class="text-[#96C121]/30" fill="none" stroke="currentColor" />
              <circle
                cx="60"
                cy="60"
                :r="ringRadius"
                :stroke-width="ringStroke"
                class="text-[#96C121]"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                :style="{
                  strokeDasharray: `${circumference}`,
                  strokeDashoffset: `${((100 - teachingScorePercent) / 100) * circumference}`,
                  transition: 'stroke-dashoffset 600ms ease',
                }"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-3xl text-black">{{ avgTeachingScore }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-4 w-full">
            <div class="flex items-center gap-3">
              <span class="text-black shrink-0">И. Иванов</span>
              <Progress :model-value="96" class="h-7" />
              <span class="text-gray shrink-0">4,8/5</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-black shrink-0">И. Иванов</span>
              <Progress :model-value="94" class="h-7" />
              <span class="text-gray shrink-0">4,7/5</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-black shrink-0">И. Иванов</span>
              <Progress :model-value="78" class="h-7" />
              <span class="text-gray shrink-0">3,9/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
