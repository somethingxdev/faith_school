<script setup lang="ts">
import { ref, computed, h } from 'vue'
import ManagementTabs from '@/views/admin/components/ManagementTabs.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { EditIcon, PlusIcon, SearchIcon } from 'lucide-vue-next'

interface TeacherRow {
  id: number
  firstName: string
  lastName: string
  email: string
  roles: string[]
  classes: string[]
}

const rows = ref<TeacherRow[]>([
  { id: 1, firstName: 'Иван', lastName: 'Иванов', email: 'ivan@example.com', roles: ['Учитель'], classes: ['Русский язык (3-6 лет)'] },
  { id: 2, firstName: 'Мария', lastName: 'Петрова', email: 'maria@example.com', roles: ['Учитель', 'Продавец'], classes: ['Математика (5-6 лет)'] },
  { id: 3, firstName: 'Олег', lastName: 'Смирнов', email: 'oleg@example.com', roles: ['Учитель'], classes: ['История (6-7 лет)'] },
])

const query = ref('')
const roleFilter = ref<string | null>(null)
const roleOptions = ['Все роли', 'Учитель', 'Продавец', 'Администратор']

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const role = roleFilter.value
  return rows.value.filter((r) => {
    const name = `${r.firstName} ${r.lastName}`.toLowerCase()
    const matchesQ = !q || name.includes(q) || r.email.toLowerCase().includes(q)
    const matchesRole = !role || role === 'Все роли' || r.roles.includes(role)
    return matchesQ && matchesRole
  })
})

const columnHelper = createColumnHelper<TeacherRow>()
const columns = [
  columnHelper.display({
    id: 'name',
    header: () => 'Имя',
    cell: (ctx) => `${ctx.row.original.firstName} ${ctx.row.original.lastName}`,
  }),
  columnHelper.display({
    id: 'roles',
    header: () => 'Роли',
    cell: (ctx) => ctx.row.original.roles.join(', '),
  }),
  columnHelper.display({
    id: 'classes',
    header: () => 'Закрепл. классы',
    cell: (ctx) => ctx.row.original.classes.join(', '),
  }),
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
const editing = ref<TeacherRow | null>(null)

function openAdd() {
  editing.value = { id: 0, firstName: '', lastName: '', email: '', roles: [], classes: [] }
  isOpen.value = true
}
function openEdit(row: TeacherRow) {
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
  <h1 class="text-4xl font-sans text-black mb-4">Управление учителями</h1>
  <ManagementTabs />

  <div class="grid grid-cols-3 gap-5 mb-7.5">
    <div class="relative w-full">
      <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray size-5" />
      <Input v-model="query" placeholder="Найти учителя" class="pl-11" />
    </div>
    <Select v-model="roleFilter" :value="roleFilter">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Роль" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="r in roleOptions" :key="r" :value="r">{{ r }}</SelectItem>
      </SelectContent>
    </Select>
    <Button class="w-full" @click="openAdd"><PlusIcon class="size-6" /> Добавить учителя</Button>
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
        <DialogTitle>{{ editing?.id === 0 ? 'Добавить учителя' : 'Редактировать учителя' }}</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 mb-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block">Имя</label>
            <Input v-model="editing!.firstName" />
          </div>
          <div>
            <label class="mb-2 block">Фамилия</label>
            <Input v-model="editing!.lastName" />
          </div>
        </div>
        <div>
          <label class="mb-2 block">E-mail / логин</label>
          <Input v-model="editing!.email" />
        </div>
        <div>
          <label class="mb-2 block">Роли (через запятую)</label>
          <Input
            :modelValue="editing?.roles?.join(', ')"
            @update:modelValue="
              (v: string | number) =>
                (editing!.roles = String(v)
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean))
            "
          />
        </div>
        <div>
          <label class="mb-2 block">Закрепленные классы (через запятую)</label>
          <Input
            :modelValue="editing?.classes?.join(', ')"
            @update:modelValue="
              (v: string | number) =>
                (editing!.classes = String(v)
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean))
            "
          />
        </div>
      </div>
      <DialogFooter class="sm:flex-col">
        <Button type="button" @click="saveRow">Сохранить</Button>
        <DialogClose as-child><Button type="button" variant="outline">Отмена</Button></DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
