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

const navItems = computed(() => (props.navigation?.length ? props.navigation : defaultNavigation))
</script>

<template>
  <aside
    class="py-10 m-10 rounded-base sticky top-10 w-[130px] relative after:absolute after:top-0 after:left-0 after:rounded-base after:w-[130px] after:-z-10 after:h-[calc(100vh-80px)] after:bg-surface"
  >
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
