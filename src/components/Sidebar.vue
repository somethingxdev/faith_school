<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { computed, type Component } from 'vue'
import { BookOpenIcon, StarIcon, CogIcon, UserIcon } from 'lucide-vue-next'

type NavItem = { name: string; href: string; icon: Component }

// Fallback (teacher) navigation for backwards compatibility
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

const navItems = computed(() => props.navigation?.length ? props.navigation : defaultNavigation)
</script>

<template>
  <aside class="bg-surface py-10 h-full w-[120px]">
    <nav>
      <ul class="flex items-center flex-col gap-10">
        <li v-for="item in navItems" class="text-gray">
          <RouterLink :to="item.href">
            <component :is="item.icon" class="size-9" :class="{ 'text-black': route.path === item.href }" />
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
