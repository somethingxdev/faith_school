<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-vue-next'
import avatarKid from '@/assets/avatar-kid.png'
// Types
interface Student {
  id: number
  name: string
  class: string
  balance: number
  avatar: string
}

// Mock data
const allStudents: Student[] = [
  {
    id: 123,
    name: 'Иванов Петя',
    class: 'Русский язык (3-6 лет)',
    balance: 110,
    avatar: avatarKid,
  },
  {
    id: 124,
    name: 'Сидорова Аня',
    class: 'Математика (5-6 лет)',
    balance: 250,
    avatar: avatarKid,
  },
]

const searchQuery = ref('')
const selectedStudent = ref<Student | null>(null)
const productName = ref('')
const productPrice = ref<number>()

const displayedStudents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return allStudents
  }
  return allStudents.filter((s) => s.name.toLowerCase().includes(query) || s.id.toString().includes(query) || s.class.toLowerCase().includes(query))
})

const remainingBalance = computed(() => {
  if (selectedStudent.value && productPrice.value !== undefined) {
    return selectedStudent.value.balance - productPrice.value
  }
  return null
})

function selectStudent(student: Student) {
  if (selectedStudent.value?.id === student.id) {
    selectedStudent.value = null // Deselect if clicking the same student
  } else {
    selectedStudent.value = student
  }
}

function confirmPurchase() {
  if (!selectedStudent.value || !productName.value || productPrice.value === undefined) {
    alert('Пожалуйста, заполните все поля')
    return
  }
  console.log('Purchase confirmed for:', {
    student: selectedStudent.value.name,
    product: productName.value,
    price: productPrice.value,
  })
  alert('Покупка подтверждена!')
}
</script>

<template>
  <h1 class="text-4xl font-sans text-black mb-12.5">Продажа товара</h1>

  <!-- Search -->
  <div class="relative w-full mb-6">
    <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
    <Input v-model="searchQuery" placeholder="Найти ученика (имя / ID / класс)" class="pl-12" />
  </div>

  <!-- Student List -->
  <div class="space-y-4 mb-8">
    <div
      v-for="student in displayedStudents"
      :key="student.id"
      @click="selectStudent(student)"
      class="bg-white p-4 rounded-base border flex items-center justify-between cursor-pointer transition-all"
      :class="{
        'border-primary ring-2 ring-primary': selectedStudent?.id === student.id,
        'border-surface': selectedStudent?.id !== student.id,
      }"
    >
      <div class="flex items-center gap-4">
        <div class="size-17.5 rounded-full bg-surface grid place-items-center">
          <img :src="student.avatar" alt="avatar" class="w-12 h-12 rounded-full" />
        </div>
        <div>
          <p class="text-xl font-sans">{{ student.name }}</p>
          <p class="text-gray">{{ student.class }}</p>
        </div>
      </div>
      <div class="flex flex-col items-center gap-1">
        <p class="text-xl/none font-sans">{{ student.balance }}</p>
        <p class="">динариев</p>
      </div>
    </div>
  </div>

  <!-- Purchase Form -->
  <div class="space-y-5">
    <h2 class="text-xl font-sans">Введите данные о товаре</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input v-model="productName" placeholder="Название товара" class="" />
      <Input v-model.number="productPrice" type="text" placeholder="Сумма" class="" />
    </div>
    <p class="mb-5">После покупки останется хх динариев</p>
    <p v-if="remainingBalance !== null" class="text-gray-600 mb-6">После покупки останется {{ remainingBalance }} динариев</p>
    <Button @click="confirmPurchase" class="w-full py-6">Подтвердить покупку</Button>
  </div>
</template>
