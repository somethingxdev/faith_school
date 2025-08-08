<script setup lang="ts">
import { computed, ref, h } from 'vue'
import ManagementTabs from '@/views/admin/components/ManagementTabs.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { EditIcon, PlusIcon, SearchIcon } from 'lucide-vue-next'

// Types
interface Student {
  id: number
  firstName: string
  lastName: string
  className: string
  cardId: string
  balance: number
}

// Mock data
const students = ref<Student[]>([
  { id: 1, firstName: 'Иван', lastName: 'Иванов', className: 'Русский язык (3-6 лет)', cardId: '123456789', balance: 120 },
  { id: 2, firstName: 'Мария', lastName: 'Петрова', className: 'Математика (5-6 лет)', cardId: '987654321', balance: 85 },
  { id: 3, firstName: 'Олег', lastName: 'Смирнов', className: 'Русский язык (3-6 лет)', cardId: '555123456', balance: 60 },
])

// Controls
const query = ref('')
const classFilter = ref<string | null>(null)

const classes = ['Все классы', 'Русский язык (3-6 лет)', 'Математика (5-6 лет)', 'Библия (7-9 лет)', 'История (6-7 лет)']

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return students.value.filter((s) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase()
    const matchesQ = !q || name.includes(q) || s.cardId.includes(q)
    const matchesClass = !classFilter.value || classFilter.value === 'Все классы' || s.className === classFilter.value
    return matchesQ && matchesClass
  })
})

// Table columns
const columnHelper = createColumnHelper<Student>()
const columns = [
  columnHelper.display({
    id: 'name',
    header: () => 'Имя',
    cell: (ctx) => `${ctx.row.original.firstName} ${ctx.row.original.lastName}`,
  }),
  columnHelper.accessor('className', {
    header: () => 'Класс',
    cell: (ctx) => ctx.getValue(),
  }),
  columnHelper.accessor('cardId', {
    header: () => 'Карта (ID)',
    cell: (ctx) => ctx.getValue(),
  }),
  columnHelper.accessor('balance', {
    header: () => 'Динарии',
    cell: (ctx) => ctx.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => '',
    // div flex-end
    cell: (ctx) =>
      h('div', { class: 'flex justify-end' }, [
        h(Button, { variant: 'ghost', size: 'icon', onClick: () => openEdit(ctx.row.original) }, [h(EditIcon, { class: 'text-gray size-5' })]),
      ]),
  }),
]

const table = useVueTable({
  get data() {
    return filtered.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
})

// Modal state
const isOpen = ref(false)
const editing = ref<null | Student>(null)

function openEdit(student: Student) {
  editing.value = { ...student }
  isOpen.value = true
}

function openAdd() {
  editing.value = { id: 0, firstName: '', lastName: '', className: '', cardId: '', balance: 0 }
  isOpen.value = true
}

function saveStudent() {
  if (!editing.value) return
  if (editing.value.id === 0) {
    const nextId = Math.max(0, ...students.value.map((s) => s.id)) + 1
    students.value.push({ ...editing.value, id: nextId })
  } else {
    students.value = students.value.map((s) => (s.id === editing.value!.id ? { ...editing.value! } : s))
  }
  isOpen.value = false
}
</script>

<template>
  <div class="container">
    <h1 class="text-4xl font-sans text-black mb-4">Управление студентами</h1>
    <ManagementTabs />

    <!-- Controls row -->
    <div class="grid grid-cols-3 gap-5 mb-7.5">
      <div class="relative w-full">
        <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray size-5" />
        <Input v-model="query" placeholder="Найти ученика" class="pl-11" />
      </div>
      <Select v-model="classFilter">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Класс" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="c in classes" :key="c" :value="c">{{ c }}</SelectItem>
        </SelectContent>
      </Select>
      <Button class="w-full" @click="openAdd">
        <PlusIcon class="size-6" />
        Добавить ученика
      </Button>
    </div>

    <!-- Table -->
    <div class="rounded-base border border-surface overflow-auto">
      <Table>
        <TableHeader class="bg-surface">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <template v-if="!header.isPlaceholder">
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              </template>
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
    <!-- Edit/Add Modal -->
    <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ editing?.id === 0 ? 'Добавить ученика' : 'Редактировать ученика' }}</DialogTitle>
        </DialogHeader>

        <div class="grid gap-4 mb-5">
          <div>
            <label class="mb-2 block">Имя</label>
            <Input v-model="editing!.firstName" placeholder="Имя" />
          </div>
          <div>
            <label class="mb-2 block">Фамилия</label>
            <Input v-model="editing!.lastName" placeholder="Фамилия" />
          </div>
          <div>
            <label class="mb-2 block">Класс</label>
            <Select v-model="editing!.className">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Класс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in classes.filter((c) => c !== 'Все классы')" :key="c" :value="c">{{ c }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="mb-2 block">Номер карты (ID)</label>
            <Input v-model="editing!.cardId" placeholder="123456789" />
          </div>
          <div>
            <label class="mb-2 block">Баланс</label>
            <Input v-model.number="editing!.balance" type="number" min="0" />
          </div>
        </div>

        <DialogFooter class="sm:flex-col">
          <Button type="button" @click="saveStudent">Сохранить</Button>
          <DialogClose as-child>
            <Button type="button" variant="outline">Отмена</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
