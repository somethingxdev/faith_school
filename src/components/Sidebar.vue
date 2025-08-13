<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { computed, type Component } from 'vue'
import { BookOpenIcon, StarIcon, CogIcon, UserIcon } from 'lucide-vue-next'

type NavItem = { name: string; href: string; icon: Component }

const defaultNavigation: NavItem[] = [
  { name: 'Мои уроки', href: '/teacher/lessons', icon: BookOpenIcon },
  { name: 'Оценка урока', href: '/teacher/rate-lesson', icon: StarIcon },
  { name: 'Настройки', href: '/teacher/rating-category', icon: CogIcon },
  { name: 'Профиль', href: '/teacher/profile', icon: UserIcon },
]

const props = defineProps<{
  navigation?: NavItem[]
}>()

const route = useRoute()

const navItems = computed(() => (props.navigation?.length ? props.navigation : defaultNavigation))
</script>

<template>
  <aside class="fixed bottom-5 left-5 right-5 sm:sticky z-10 sm:top-10 sm:m-10 sm:w-[130px]">
    <nav class="p-6 sm:py-10 after:absolute after:top-0 after:left-0 after:rounded-base after:w-full after:-z-10 after:h-full sm:after:h-[calc(100vh-80px)] after:backdrop-blur after:bg-surface/60">
      <ul class="flex items-center justify-between sm:flex-col gap-10">
        <li v-for="item in navItems" class="text-gray flex flex-col items-center gap-2 sm:min-h-20 hover:text-black transition-colors">
          <RouterLink :to="item.href">
            <component :is="item.icon" class="size-9 sm:size-10" :class="{ 'text-black': route.path === item.href }" />
          </RouterLink>
          <span v-if="route.path === item.href" class="bg-black size-3 rounded-full hidden sm:block"></span>
        </li>
      </ul>
    </nav>
  </aside>
</template>
