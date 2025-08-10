<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeftIcon, EyeOffIcon, EyeIcon } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import avatar from '@/assets/avatar.png'

const isPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div class="flex items-center gap-6 mb-12">
    <RouterLink to="/teacher/profile">
      <ChevronLeftIcon class="size-10" />
    </RouterLink>
    <img :src="avatar" alt="Avatar" class="size-[140px] rounded-full" />
    <h1 class="text-4xl font-sans text-black">Редактирование профиля</h1>
  </div>

  <div class="flex flex-col justify-between">
    <div>
      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label for="firstName" class="block font-sans text-black mb-2">Имя</label>
          <Input id="firstName" defaultValue="Иван" />
        </div>
        <div>
          <label for="lastName" defaultValue="block  font-sans text-black mb-2">Фамилия</label>
          <Input id="lastName" value="Иванов" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-12">
        <div>
          <label for="email" class="block font-sans text-black mb-2">E-mail</label>
          <Input id="email" defaultValue="@ivan.ivanov" />
        </div>
        <div>
          <label for="password" class="block font-sans text-black mb-2">Пароль</label>
          <div class="relative">
            <Input id="password" :type="isPasswordVisible ? 'text' : 'password'" defaultValue="password" />
            <button @click="togglePasswordVisibility" class="absolute right-3 top-1/2 -translate-y-1/2">
              <EyeIcon v-if="isPasswordVisible" class="size-6 text-gray-400" />
              <EyeOffIcon v-else class="size-6 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <Button class="w-full mt-auto">Сохранить</Button>
  </div>
</template>
