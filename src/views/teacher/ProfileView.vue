<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PencilIcon, LockKeyholeIcon, LogOutIcon } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import avatar from '@/assets/avatar.png'
import Separator from '@/components/ui/separator/Separator.vue'
const assignedClasses = ['Русский язык (3-6 лет)', 'Русский язык (7-10 лет)', 'Рисование']
</script>

<template>
  <div class="flex items-center gap-6 mb-12">
    <img :src="avatar" alt="Avatar" class="size-[140px] rounded-full" />
    <h1 class="text-4xl font-sans text-black"><span class="text-gray">Привет,</span> Иван Иванов</h1>
  </div>

  <div>
    <label class="block text-xl/none font-sans text-black mb-4">Роль:</label>
    <Select>
      <SelectTrigger class="w-[430px]">
        <SelectValue placeholder="Учитель" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="teacher">Учитель</SelectItem>
        <SelectItem value="admin">Администратор</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <Separator class="my-10" />

  <div>
    <h2 class="text-lg font-sans text-black mb-4">Закрепленные классы:</h2>
    <div class="flex gap-4">
      <div v-for="cls in assignedClasses" :key="cls" class="px-5 py-4 bg-white rounded-base border border-surface text-lg">
        {{ cls }}
      </div>
    </div>
  </div>

  <Separator class="my-10" />

  <div class="space-y-6 font-sans">
    <RouterLink to="/teacher/profile/edit" class="flex items-center gap-3 text-black uppercase">
      <PencilIcon class="size-5" />
      Редактировать профиль
    </RouterLink>
    <button class="flex items-center gap-3 text-black uppercase">
      <LockKeyholeIcon class="size-5" />
      Сменить пароль
    </button>
    <button class="flex items-center gap-3 text-red uppercase">
      <LogOutIcon class="size-5" />
      Выйти из аккаунта
    </button>
  </div>
</template>
