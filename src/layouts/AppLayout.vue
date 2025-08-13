<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import type { Component } from 'vue'

type NavItem = { name: string; href: string; icon: Component }

const props = defineProps<{
  navigation?: NavItem[]
}>()
</script>

<template>
  <div class="grid sm:grid-cols-[130px_1fr] md:h-dvh items-start gap-12 pb-20 md:pb-0">
    <Sidebar :navigation="props.navigation" />
    <main class="container pt-20 pb-10 overflow-x-hidden">
      <router-view />
    </main>
  </div>
</template>
