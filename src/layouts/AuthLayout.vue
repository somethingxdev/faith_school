<template>
  <div class="bg-light-yellow h-dvh overlow-hidden">
    <div class="container py-10 h-full">
      <div class="flex flex-col justify-between items-center h-full max-w-[500px] mx-auto">
        <img :src="Logo" alt="logo" class="w-25 h-auto" />
        <RouterView />
        <div class="flex items-center gap-3">
          <span class="text-black font-medium">Powered by</span>
          <img src="@/assets/bezalel-lab.svg" alt="auth-bottom" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Logo from '@/assets/logo.svg'
</script>
