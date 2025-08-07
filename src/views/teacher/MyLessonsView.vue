<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { EditIcon } from 'lucide-vue-next'

const lessonsByDate = ref([
  {
    date: '30 июня',
    day: 'Понедельник',
    lessons: [
      { time: '9:00-12:00', title: 'Русский язык (5-6 лет)' },
      { time: '13:00-14:00', title: 'Нет названия' },
      { time: '17:00-18:00', title: 'Нет названия' },
    ],
  },
  {
    date: '1 июля',
    day: 'Вторник',
    lessons: [{ time: '9:00-12:00', title: 'Русский язык (5-6 лет)' }],
  },
  {
    date: '2 июля',
    day: 'Среда',
    lessons: [{ time: '9:00-12:00', title: 'Русский язык (5-6 лет)' }],
  },
])

const editLesson = (lesson: { time: string; title: string }) => {
  console.log('Editing lesson:', lesson)
}
</script>

<template>
  <div class="container">
    <h1 class="text-4xl font-sans text-black mb-12.5">Мои уроки</h1>
    <div v-for="group in lessonsByDate" :key="group.date" class="grid grid-cols-[120px_1fr] gap-55 mb-5 last:mb-0 pb-5 border-b border-surface">
      <div class="flex flex-col gap-1">
        <h2 class="text-xl/none text-black font-sans">{{ group.date }}</h2>
        <p class="text-gray text-lg">{{ group.day }}</p>
      </div>
      <div class="relative pl-8">
        <!-- Timeline line -->
        <div v-if="group.lessons.length > 1" class="absolute left-[1.5px] top-5 bottom-5 w-0.5 bg-green"></div>
        <div class="space-y-4">
          <div
            v-for="(lesson, index) in group.lessons"
            class="relative bg-white p-6 rounded-base border border-surface flex justify-between items-center"
          >
            <div
              v-if="group.lessons.length > 1"
              class="absolute -left-[40.3px] size-5 drop-shadow-[0_0_10px_#96C121] rounded-full bg-green"
              :class="{
                'top-1/2 -translate-y-1/2': index > 0 && index < group.lessons.length - 1,
                'top-5 -translate-y-1/2': index === 0,
                'bottom-5 translate-y-1/2': index === group.lessons.length - 1,
              }"
            ></div>
            <div class="flex flex-col gap-1">
              <span class="text-lg text-black">{{ lesson.title }}</span>
              <span class="text-lg text-gray">{{ lesson.time }}</span>
            </div>
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="ghost" size="icon" @click="editLesson(lesson)">
                  <EditIcon class="text-gray size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[600px] pt-15">
                <Input id="name" class="text-gray" :defaultValue="lesson.title" />
                <DialogFooter class="sm:flex-col">
                  <Button type="submit">Сохранить</Button>
                  <DialogClose as-child>
                    <Button type="button" variant="secondary">Отмена</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
