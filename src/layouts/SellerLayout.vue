<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import type { Component } from 'vue'
import { ShoppingBasketIcon, UserCircle2Icon } from 'lucide-vue-next'

type NavItem = { name: string; href: string; icon: Component }

const navigation: NavItem[] = [
  { name: 'Продажа', href: '/seller/sell', icon: ShoppingBasketIcon },
  { name: 'Профиль', href: '/seller/profile', icon: UserCircle2Icon },
]
</script>

<template>
  <AppLayout :navigation="navigation" />
</template>
