<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'

import { BookOpenIcon, StarIcon, CogIcon, UserIcon } from 'lucide-vue-next'

const navigation = [
  { name: 'Мои уроки', href: '/teacher/lessons', icon: BookOpenIcon },
  { name: 'Оценка урока', href: '/teacher/rate-lesson', icon: StarIcon },
  { name: 'Настройки', href: '/teacher/rating-category', icon: CogIcon },
  { name: 'Профиль', href: '/teacher/profile', icon: UserIcon },
]

const route = useRoute()

console.log(route.path)
</script>

<template>
  <aside class="bg-surface py-10 h-full w-[120px]">
    <nav>
      <ul class="flex items-center flex-col gap-10">
        <li v-for="item in navigation" class='text-gray'>
          <RouterLink :to="item.href">
            <component :is="item.icon" class='size-9' :class="{ 'text-black': route.path === item.href }" />
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
