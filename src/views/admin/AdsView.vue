<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditIcon } from 'lucide-vue-next'

// Types
interface Ad {
  id: number
  imageUrl: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  status: 'active' | 'inactive'
}

// Mock data
const ads = ref<Ad[]>([
  {
    id: 1,
    imageUrl: 'https://placehold.co/90x160',
    startDate: '30.06',
    startTime: '10:00',
    endDate: '07.07',
    endTime: '18:00',
    status: 'active',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/90x160',
    startDate: '30.06',
    startTime: '10:00',
    endDate: '07.07',
    endTime: '18:00',
    status: 'active',
  },
])

const newAd = ref({
  image: null as File | null,
  startDate: '01.07.2025',
  startTime: '10:00',
  endDate: '05.07.2025',
  endTime: '18:00',
})

const previewUrl = ref<string | null>(null)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    newAd.value.image = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

function saveAd() {
  // Logic to save the ad
  console.log('Saving ad:', newAd.value)
}

function editAd(ad: Ad) {
  // Logic to open edit modal or form
  console.log('Editing ad:', ad)
}
</script>

<template>
  <h1 class="text-4xl font-sans text-black mb-8">Реклама</h1>
  <div class="grid grid-cols-3 gap-5">
    <!-- Ad Creation Form -->
    <div class="bg-white p-6 rounded-base border border-surface col-span-2">
      <div class="flex items-start gap-10">
        <div class="flex flex-col gap-5">
          <h2 class="text-xl font-sans">Загрузите изображение для показа</h2>
          <div>
            <input id="file-upload" type="file" class="hidden" @change="handleFileUpload" accept="image/png, image/jpeg" />
            <Button as="label" for="file-upload" class="w-full">Выбрать файл</Button>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <p class="text-black leading-tight">
            Рекомендуемый размер: <br />
            <span class="text-gray">1080x1920px</span>
          </p>
          <p class="text-black leading-tight">
            Формат: <br />
            <span class="text-gray">PNG или JPG, не более 5 МБ</span>
          </p>
        </div>
        <div class="w-[90px] h-40 bg-surface ml-auto">
          <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="w-full h-full object-cover rounded-md" />
          <span v-else class="text-gray-400"></span>
        </div>
      </div>

      <h2 class="text-xl font-sans mb-5">Время показа</h2>
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block mb-1">Дата начала:</label>
          <Input type="text" v-model="newAd.startDate" />
        </div>
        <div>
          <label class="block mb-1">Время начала:</label>
          <Input type="text" v-model="newAd.startTime" />
        </div>
        <div>
          <label class="block mb-1">Дата окончания:</label>
          <Input type="text" v-model="newAd.endDate" />
        </div>
        <div>
          <label class="block mb-1">Время окончания:</label>
          <Input type="text" v-model="newAd.endTime" />
        </div>
      </div>

      <Button @click="saveAd" class="w-full">Сохранить</Button>
    </div>

    <!-- Existing Ads -->
    <div>
      <h2 class="text-xl font-sans mb-6">Ранее загруженная реклама</h2>
      <div class="space-y-5">
        <div v-for="ad in ads" :key="ad.id" class="bg-white p-6 rounded-base border border-surface flex gap-5 relative">
          <img :src="ad.imageUrl" alt="Ad thumbnail" class="w-24 h-40 object-cover rounded-md bg-gray-100" />
          <div class="flex flex-col justify-between">
            <div>
              <p class="leading-none font-sans text-xl mb-2">Даты показа:</p>
              <p>{{ ad.startDate }} - {{ ad.endDate }}</p>
            </div>

            <div class="mt-auto">
              <p class="font-semibold mt-2">Статус:</p>
              <p :class="ad.status === 'active' ? 'text-green-600' : 'text-red-600'">
                {{ ad.status === 'active' ? 'Активно' : 'Неактивно' }}
              </p>
            </div>
          </div>
          <Button variant="ghost" class="absolute top-2 right-2" size="icon" @click="editAd(ad)">
            <EditIcon class="size-5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
