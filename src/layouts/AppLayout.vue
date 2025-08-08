<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import type { Component } from 'vue'

type NavItem = { name: string; href: string; icon: Component }

const props = defineProps<{
  navigation?: NavItem[]
}>()
</script>

<template>
  <div>
    <div class="grid grid-cols-[130px_1fr] h-dvh items-start gap-12">
      <Sidebar :navigation="props.navigation" />
      <main class="container py-10 h-full">
        <router-view />
      </main>
    </div>
  </div>
</template>
