<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { EditIcon, PlusIcon, SearchIcon } from 'lucide-vue-next'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

// Types
interface Notification {
  id: number
  event: string
  recipients: string
  type: 'E-mail' | 'Push'
  message: string
  status: 'active' | 'inactive'
}

// Mock data
const notifications = ref<Notification[]>([
  {
    id: 1,
    event: 'Ученик пропустил урок',
    recipients: 'Родители',
    type: 'E-mail',
    message: 'Уважаемые родители, ваш ребенок пропустил урок.',
    status: 'active',
  },
  {
    id: 2,
    event: 'Новый уровень ученика',
    recipients: 'Родители',
    type: 'E-mail',
    message: 'Поздравляем, ваш ребенок достиг нового уровня!',
    status: 'active',
  },
])

// Table columns
const columnHelper = createColumnHelper<Notification>()
const columns = [
  columnHelper.accessor('event', { header: () => 'Событие', cell: (ctx) => ctx.getValue() }),
  columnHelper.accessor('recipients', { header: () => 'Получатели', cell: (ctx) => ctx.getValue() }),
  columnHelper.accessor('type', { header: () => 'Тип', cell: (ctx) => ctx.getValue() }),
  columnHelper.display({
    id: 'actions',
    header: () => '',
    cell: (ctx) =>
      h('div', { class: 'flex justify-end' }, [
        h(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            onClick: () => openEdit(ctx.row.original),
          },
          () => h(EditIcon, { class: 'size-5' }),
        ),
      ]),
  }),
]

const table = useVueTable({
  get data() {
    return notifications.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
})

// Modal state
const isOpen = ref(false)
const editing = ref<Notification | null>(null)

const modalTitle = computed(() => (editing.value?.id ? 'Редактировать оповещение' : 'Создать оповещение'))

const events = ['Ученик пропустил урок', 'Новый уровень ученика', 'Новое домашнее задание']
const recipientGroups = ['Родители', 'Учителя', 'Все']
const notificationTypes = ['E-mail', 'Push']

function openAdd() {
  editing.value = {
    id: Date.now(),
    event: '',
    recipients: '',
    type: 'E-mail',
    message: '',
    status: 'active',
  }
  isOpen.value = true
}

function openEdit(notification: Notification) {
  editing.value = { ...notification }
  isOpen.value = true
}

function saveNotification() {
  if (!editing.value) return

  const index = notifications.value.findIndex((n) => n.id === editing.value!.id)
  if (index !== -1) {
    notifications.value[index] = editing.value
  } else {
    notifications.value.push(editing.value)
  }
  isOpen.value = false
  editing.value = null
}
</script>

<template>
  <h1 class="text-4xl font-sans text-black mb-4">Оповещения</h1>

  <div class="relative w-full mb-7.5 flex justify-end">
    <Button @click="openAdd" class="w-[365px]">
      <PlusIcon class="size-6" />
      <span>Создать оповещение</span>
    </Button>
  </div>

  <!-- Table -->
  <div class="rounded-base border border-surface overflow-auto">
    <Table>
      <TableHeader class="bg-surface">
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center text-gray"> Нет данных </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>

  <!-- Create/Edit Modal -->
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{{ modalTitle }}</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <!-- Event -->
        <div>
          <label class="mb-2 block font-sans">Событие</label>
          <Select v-model="(editing as any).event">
            <SelectTrigger class="w-full"><SelectValue placeholder="Выберите событие" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="e in events" :key="e" :value="e">{{ e }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Recipients -->
        <div>
          <label class="mb-2 block font-sans">Кому отправлять</label>
          <Select v-model="(editing as any).recipients">
            <SelectTrigger class="w-full"><SelectValue placeholder="Выберите получателей" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="r in recipientGroups" :key="r" :value="r">{{ r }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Type -->
        <div>
          <label class="mb-2 block font-sans">Тип уведомления</label>
          <Select v-model="(editing as any).type">
            <SelectTrigger class="w-full"><SelectValue placeholder="Выберите тип" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="t in notificationTypes" :key="t" :value="t">{{ t }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="mb-2 block font-sans">Текст уведомления</label>
          <Input id="message" v-model="(editing as any).message" placeholder="Введите текст уведомления" />
        </div>

        <!-- Status -->
        <div>
          <label class="mb-2 block font-sans">Активность</label>
          <RadioGroup v-model="(editing as any).status" class="flex flex-col gap-2.5">
            <div class="flex items-center gap-2">
              <RadioGroupItem id="r1" value="active" />
              <Label for="r1">Активен</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="r2" value="inactive" />
              <Label for="r2">Неактивен</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <DialogFooter class="sm:flex-col">
        <Button type="button" @click="saveNotification">Сохранить</Button>
        <DialogClose as-child><Button type="button" variant="outline">Отмена</Button></DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
