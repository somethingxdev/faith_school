<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PencilIcon, PlusIcon } from 'lucide-vue-next'

const categories = ref([
  { name: 'Конспект', percentage: 20, color: 'bg-pink-200' },
  { name: 'Домашнее задание', percentage: 30, color: 'bg-blue-200' },
  { name: 'Участие', percentage: 25, color: 'bg-green-200' },
  { name: 'Поведение', percentage: 25, color: 'bg-orange-200' },
])

const isModalOpen = ref(false)
</script>

<template>
  <div>
    <h1 class="text-4xl font-sans text-black mb-8">Оценка урока</h1>

    <div class="mb-7.5">
      <Select>
        <SelectTrigger class="w-[430px]">
          <SelectValue placeholder="Осень, 2025" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semester-1">Осень, 2025</SelectItem>
          <SelectItem value="semester-2">Зима, 2025</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <div
        v-for="category in categories"
        :key="category.name"
        :class="['p-6 rounded-base hover:-translate-y-1 cursor-pointer transition-transform', category.color]"
      >
        <h3 class="text-xl font-sans mb-12.5">{{ category.name }}</h3>
        <div class="flex items-center justify-between">
          <p class="text-4xl font-sans">{{ category.percentage }}%</p>
          <Button variant="ghost" size="icon" class="p-0">
            <PencilIcon class="size-6" />
          </Button>
        </div>
      </div>
    </div>

    <Dialog v-model:open="isModalOpen">
      <DialogTrigger as-child>
        <Button variant="ghost">
          <PlusIcon class="size-6" />
          Добавить категорию
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить занятие</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Input id="name" placeholder="Название категории" class="col-span-4" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Input id="percentage" placeholder="Процент" class="col-span-4" />
          </div>
        </div>
        <DialogFooter class='sm:flex-col'>
          <Button type="submit" class="w-full">Сохранить</Button>
          <Button variant="outline" @click="isModalOpen = false" class="w-full">Отмена</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
