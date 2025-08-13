<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import type { Component } from 'vue'
import BookOpenIcon from '@/icons/IconBook.vue'
import StarIcon from '@/icons/IconStar.vue'
import CogIcon from '@/icons/IconSetting.vue'
import UserIcon from '@/icons/IconProfile.vue'

type NavItem = { name: string; href: string; icon: Component }

const navigation: NavItem[] = [
  { name: 'Мои уроки', href: '/teacher/lessons', icon: BookOpenIcon },
  { name: 'Оценка урока', href: '/teacher/rate-lesson', icon: StarIcon },
  { name: 'Настройки', href: '/teacher/rating-category', icon: CogIcon },
  { name: 'Профиль', href: '/teacher/profile', icon: UserIcon },
]
</script>

<template>
  <AppLayout :navigation="navigation" />
</template>
