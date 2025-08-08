<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const current = computed(() => route.name as string | undefined)

const tabs = [
  { name: 'Ученики', to: { name: 'admin-students' } },
  { name: 'Классы', to: { name: 'admin-classes' } },
  { name: 'Учителя', to: { name: 'admin-teachers' } },
  { name: 'Весь персонал', to: { name: 'admin-staff' } },
]

function isActive(name?: string) {
  if (!current.value || !name) return false
  return current.value === name
}
</script>

<template>
  <div class="flex gap-3.5 mb-7.5">
    <RouterLink
      v-for="tab in tabs"
      :key="(tab.to as any).name"
      :to="tab.to"
      class="p-3.5 rounded-base shadow-sm"
      :class="isActive((tab.to as any).name) ? 'bg-green text-white border-green' : 'bg-white text-black border-surface'"
    >
      {{ tab.name }}
    </RouterLink>
  </div>
</template>
