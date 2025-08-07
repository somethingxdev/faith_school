<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div>
    <div class="grid grid-cols-[130px_1fr] h-dvh items-start gap-12">
      <Sidebar />
      <main class='container py-10 h-full'>
        <router-view />
      </main>
    </div>
  </div>
</template>
