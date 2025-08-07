<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Separator from '@/components/ui/separator/Separator.vue'

interface Student {
  id: number
  name: string
  score: number
  rated: boolean
}

const students = ref<Student[]>([
  { id: 1, name: 'Иван Петров', score: 0, rated: false },
  { id: 2, name: 'Мария Сидорова', score: 8, rated: true },
  { id: 3, name: 'Алексей Иванов', score: 0, rated: false },
  { id: 4, name: 'Елена Кузнецова', score: 0, rated: false },
  { id: 5, name: 'Дмитрий Смирнов', score: 9, rated: true },
  
])

const selectedStudent = ref<Student>(students.value[0])

const ratings = ref({
  summary: [10],
  homework: [8],
  behavior: [8],
  participation: [9],
})

const totalScore = computed(() => {
  return ratings.value.summary[0] + ratings.value.homework[0] + ratings.value.behavior[0] + ratings.value.participation[0]
})

const selectedForApply = ref<Record<number, boolean>>({})
const selectAll = ref(false)

const otherStudents = computed(() => students.value.filter((s: Student) => s.id !== selectedStudent.value.id))

// Handle select all functionality
const handleSelectAll = (checked: boolean | 'indeterminate') => {
  const isChecked = checked === true
  selectAll.value = isChecked
  otherStudents.value.forEach((student) => {
    selectedForApply.value[student.id] = isChecked
  })
}

// Watch for individual checkbox changes to update select all state
const updateSelectAllState = () => {
  selectAll.value = otherStudents.value.every((student) => selectedForApply.value[student.id])
}

const isAnyStudentSelected = computed(() => {
  return Object.values(selectedForApply.value).some((isSelected) => isSelected)
})
</script>

<template>
  <div class="mb-8">
    <RouterLink to="/teacher/rate-lesson" class="flex items-center gap-2 text-4xl leading-tight text-black font-sans mb-2">
      <ChevronLeft class="size-8 mt-0.5" />
      Русский язык (3-6 лет)
    </RouterLink>
    <p class="text-xl font-sans text-gray ml-10">30.06.2025 | 12:00-13:00</p>
  </div>

  <div class="grid grid-cols-[650px_1fr] gap-30 items-start">
    <!-- Students List -->
    <div class="space-y-4">
      <div
        v-for="(student, index) in students"
        :key="student.id"
        @click="selectedStudent = student"
        class="p-6 rounded-base border flex justify-between items-center cursor-pointer"
        :class="selectedStudent.id === student.id ? 'bg-green/10 border-green' : 'bg-white border-surface'"
      >
        <div class="flex items-center gap-4">
          <span class="flex items-center justify-center size-8 rounded-full bg-gray text-white">{{ index + 1 }}</span>
          <span class="text-xl font-sans text-black">{{ student.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="student.rated" class="text-lg text-black font-bold">{{ student.score }}</span>

          <svg v-if="student.rated" width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.301 4.07544L16.1343 7.74211C16.3843 8.25252 17.051 8.74211 17.6135 8.83586L20.9364 9.38794C23.0614 9.74211 23.5614 11.2838 22.0301 12.8046L19.4468 15.3879C19.0093 15.8254 18.7697 16.6692 18.9051 17.2734L19.6447 20.4713C20.228 23.0025 18.8843 23.9817 16.6447 22.6588L13.5301 20.815C12.9676 20.4817 12.0405 20.4817 11.4676 20.815L8.35303 22.6588C6.12387 23.9817 4.7697 22.9921 5.35303 20.4713L6.09262 17.2734C6.22803 16.6692 5.98845 15.8254 5.55095 15.3879L2.96762 12.8046C1.44678 11.2838 1.93637 9.74211 4.06137 9.38794L7.38428 8.83586C7.93637 8.74211 8.60303 8.25252 8.85303 7.74211L10.6864 4.07544C11.6864 2.08586 13.3114 2.08586 14.301 4.07544Z"
              fill="#96C121"
              stroke="#96C121"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <svg v-else width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.301 4.07544L16.1343 7.74211C16.3843 8.25252 17.051 8.74211 17.6135 8.83586L20.9364 9.38794C23.0614 9.74211 23.5614 11.2838 22.0301 12.8046L19.4468 15.3879C19.0093 15.8254 18.7697 16.6692 18.9051 17.2734L19.6447 20.4713C20.228 23.0025 18.8843 23.9817 16.6447 22.6588L13.5301 20.815C12.9676 20.4817 12.0405 20.4817 11.4676 20.815L8.35303 22.6588C6.12387 23.9817 4.7697 22.9921 5.35303 20.4713L6.09262 17.2734C6.22803 16.6692 5.98845 15.8254 5.55095 15.3879L2.96762 12.8046C1.44678 11.2838 1.93637 9.74211 4.06137 9.38794L7.38428 8.83586C7.93637 8.74211 8.60303 8.25252 8.85303 7.74211L10.6864 4.07544C11.6864 2.08586 13.3114 2.08586 14.301 4.07544Z"
              stroke="#96C121"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Rating Sliders -->
    <div>
      <h2 class="text-4xl font-sans text-black mb-12.5">{{ selectedStudent.name }}</h2>

      <div class="space-y-7 mb-7.5 pb-7.5 border-b border-surface">
        <div>
          <div class="flex justify-between items-center mb-5">
            <label class="text-xl font-sans text-black">Конспект</label>
            <span class="text-xl font-sans text-black">{{ ratings.summary[0] }}</span>
          </div>
          <Slider v-model="ratings.summary" :max="10" :step="1" />
        </div>
        <div>
          <div class="flex justify-between items-center mb-5">
            <label class="text-xl font-sans text-black">Домашнее задание</label>
            <span class="text-xl font-sans text-black">{{ ratings.homework[0] }}</span>
          </div>
          <Slider v-model="ratings.homework" :max="10" :step="1" />
        </div>
        <div>
          <div class="flex justify-between items-center mb-5">
            <label class="text-xl font-sans text-black">Поведение</label>
            <span class="text-xl font-sans text-black">{{ ratings.behavior[0] }}</span>
          </div>
          <Slider v-model="ratings.behavior" :max="10" :step="1" />
        </div>
        <div>
          <div class="flex justify-between items-center mb-5">
            <label class="text-xl font-sans text-black">Участие</label>
            <span class="text-xl font-sans text-black">{{ ratings.participation[0] }}</span>
          </div>
          <Slider v-model="ratings.participation" :max="10" :step="1" />
        </div>
      </div>

      <p class="text-xl font-sans text-black mb-4">
        Сумма баллов за урок: <span class="font-bold">{{ totalScore }}</span>
      </p>
      <div class="flex items-center space-x-2 mb-10">
        <Popover>
          <PopoverTrigger as-child>
            <div class="flex items-center space-x-2">
              <Checkbox :model-value="isAnyStudentSelected" disabled />
              <label class="text-lg text-black cursor-pointer">Применить к другим ученикам</label>
            </div>
          </PopoverTrigger>
          <PopoverContent side='left' class="w-80">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Выберите учеников</h4>
                <p class="text-sm text-muted-foreground">Выбранные оценки будут применены к этим ученикам.</p>
                <Separator />
              </div>
              <div class="grid gap-2 max-h-[200px] overflow-y-auto">
                <div class="flex items-center space-x-2">
                  <Checkbox id="select-all" v-model="selectAll" @update:modelValue="handleSelectAll" />
                  <label for="select-all">Все</label>
                </div>
                <div v-for="student in otherStudents" :key="student.id" class="flex items-center space-x-2">
                  <Checkbox :id="'student-' + student.id" v-model="selectedForApply[student.id]" @update:modelValue="updateSelectAllState" />
                  <label :for="'student-' + student.id">{{ student.name }}</label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Button class='w-full'>Сохранить</Button>
    </div>
  </div>
</template>
