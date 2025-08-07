<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import { BookOpenIcon, StarIcon, CogIcon, UserIcon } from 'lucide-vue-next'

const navigation = [
  { name: 'Мои уроки', href: '/teacher/lessons', icon: BookOpenIcon },
  { name: 'Избранное', href: '#', icon: StarIcon },
  { name: 'Настройки', href: '#', icon: CogIcon },
  { name: 'Профиль', href: '#', icon: UserIcon },
]

const activeLink = ref(navigation[0].href)
</script>

<template>
  <aside class="bg-surface py-10 w-[120px] shrink-0 rounded-base">
    <nav class="flex flex-col items-center gap-10 pt-4">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        @click="activeLink = item.href"
      >
        <component
          :is="item.icon"
          class="size-8 text-gray"
          :class="{ 'text-black': item.href === activeLink }"
        />
      </RouterLink>
    </nav>
  </aside>
</template>
