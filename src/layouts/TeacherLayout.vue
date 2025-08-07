<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="px-10">
    <div class="grid grid-cols-[130px_1fr] gap-15 py-10">
      <Sidebar />
      <main class="pt-10">
        <router-view />
      </main>
    </div>
  </div>
</template>
