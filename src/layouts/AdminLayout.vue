<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import type { Component } from 'vue'
import { BarChart2Icon, UsersIcon, CalendarIcon } from 'lucide-vue-next'

type NavItem = { name: string; href: string; icon: Component }

const navigation: NavItem[] = [
  { name: 'Обзор', href: '/admin/dashboard', icon: BarChart2Icon },
  { name: 'Студенты', href: '/admin/students', icon: UsersIcon },
  { name: 'Расписание', href: '/admin/schedule', icon: CalendarIcon },
  { name: 'Опросы', href: '/admin/surveys', icon: BarChart2Icon },
]
</script>

<template>
  <AppLayout :navigation="navigation" />
</template>
