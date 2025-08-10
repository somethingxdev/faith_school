<script setup lang="ts">
import { ref, computed, h } from 'vue'
import ManagementTabs from '@/views/admin/components/ManagementTabs.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { EditIcon, PlusIcon, SearchIcon } from 'lucide-vue-next'

interface ClassRow {
  id: number
  name: string
  studentsCount: number
  teacher: string
}

const rows = ref<ClassRow[]>([
  { id: 1, name: 'Русский язык (3-6 лет)', studentsCount: 12, teacher: 'Иван Иванов' },
  { id: 2, name: 'Математика (5-6 лет)', studentsCount: 10, teacher: 'Мария Петрова' },
  { id: 3, name: 'История (6-7 лет)', studentsCount: 8, teacher: 'Олег Смирнов' },
])

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return rows.value.filter((r) => !q || r.name.toLowerCase().includes(q) || r.teacher.toLowerCase().includes(q))
})

const columnHelper = createColumnHelper<ClassRow>()
const columns = [
  columnHelper.accessor('name', { header: () => 'Название класса', cell: (ctx) => ctx.getValue() }),
  columnHelper.accessor('studentsCount', { header: () => 'Кол-во учеников', cell: (ctx) => ctx.getValue() }),
  columnHelper.accessor('teacher', { header: () => 'Закреп. учителя', cell: (ctx) => ctx.getValue() }),
  columnHelper.display({
    id: 'actions',
    header: () => '',
    cell: (ctx) =>
      h('div', { class: 'flex justify-end' }, [
        h(Button as any, { variant: 'ghost', size: 'icon', onClick: () => openEdit(ctx.row.original) }, () => [
          h(EditIcon as any, { class: 'text-gray size-5' }),
        ]),
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

const isOpen = ref(false)
const editing = ref<ClassRow | null>(null)

function openAdd() {
  editing.value = { id: 0, name: '', studentsCount: 0, teacher: '' }
  isOpen.value = true
}
function openEdit(row: ClassRow) {
  editing.value = { ...row }
  isOpen.value = true
}
function saveRow() {
  if (!editing.value) return
  if (editing.value.id === 0) {
    const nextId = Math.max(0, ...rows.value.map((r) => r.id)) + 1
    rows.value.push({ ...editing.value, id: nextId })
  } else {
    rows.value = rows.value.map((r) => (r.id === editing.value!.id ? { ...editing.value! } : r))
  }
  isOpen.value = false
}
</script>

<template>
  <h1 class="text-4xl font-sans text-black mb-4">Управление классами</h1>
  <ManagementTabs />

  <div class="grid grid-cols-2 gap-5 mb-7.5">
    <div class="relative w-full">
      <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray size-5" />
      <Input v-model="query" placeholder="Найти класс" class="pl-11" />
    </div>
    <Button class="w-full" @click="openAdd"><PlusIcon class="size-6" /> Добавить класс</Button>
  </div>

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

  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{{ editing?.id === 0 ? 'Добавить класс' : 'Редактировать класс' }}</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 mb-5">
        <div>
          <label class="mb-2 block">Название класса</label>
          <Input v-model="editing!.name" />
        </div>
      </div>
      <DialogFooter class="sm:flex-col">
        <Button type="button" @click="saveRow">Сохранить</Button>
        <DialogClose as-child><Button type="button" variant="outline">Отмена</Button></DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
