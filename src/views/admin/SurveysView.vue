<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { EditIcon, PlusIcon, SearchIcon, ChevronDown } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

// Types
interface Survey {
  id: number
  question: string
  type: 'numeric' | 'descriptive'
  targetClasses: string[]
  targetTeachers: string[]
  answered: string // e.g., '6/12 (50%)'
  status: 'active' | 'closed'
  options?: string[]
}

// Mock directories
const allClasses = ['Русский язык (3-6 лет)', 'Математика (5-6 лет)', 'Библия (7-9 лет)', 'История (6-7 лет)']
const allTeachers = ['Иван Иванов', 'Мария Петрова', 'Олег Смирнов']

// Mock data
const surveys = ref<Survey[]>([
  {
    id: 1,
    question: 'Оцените урок по шкале',
    type: 'numeric',
    targetClasses: [],
    targetTeachers: ['Все учителя'],
    answered: '6/12 (50%)',
    status: 'active',
  },
  {
    id: 2,
    question: 'Что понравилось в занятии?',
    type: 'descriptive',
    targetClasses: ['Русский язык (3-6 лет)'],
    targetTeachers: [],
    answered: '10/10 (100%)',
    status: 'closed',
    options: ['Ответ 1', 'Ответ 2'],
  },
])

// Controls
const query = ref('')
const classFilter = ref<string | null>(null)
const typeFilter = ref<string | null>(null) // 'Все типы' | 'Числовой (1-5)' | 'Описательный'

const classes = ['Все классы', ...allClasses]
const types = ['Все типы', 'Числовой (1-5)', 'Описательный']

function typeLabel(t: Survey['type']) {
  return t === 'numeric' ? 'Числовой (1-5)' : 'Описательный'
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const tf = typeFilter.value
  const cf = classFilter.value
  return surveys.value.filter((s) => {
    const matchesQ = !q || s.question.toLowerCase().includes(q)
    const matchesType = !tf || tf === 'Все типы' || typeLabel(s.type) === tf
    const matchesClass = !cf || cf === 'Все классы' || s.targetClasses.includes(cf)
    return matchesQ && matchesType && matchesClass
  })
})

// Table columns
const columnHelper = createColumnHelper<Survey>()
const columns = [
  columnHelper.accessor('question', { header: () => 'Вопрос', cell: (ctx) => ctx.getValue() }),
  columnHelper.display({ id: 'type', header: () => 'Тип', cell: (ctx) => typeLabel(ctx.row.original.type) }),
  columnHelper.display({
    id: 'assigned',
    header: () => 'Назначено на',
    cell: (ctx) => {
      const s = ctx.row.original
      if (s.targetClasses.length) return s.targetClasses.join(', ')
      if (s.targetTeachers.includes('Все учителя')) return 'Все учителя'
      return s.targetTeachers.join(', ')
    },
  }),
  columnHelper.accessor('answered', { header: () => 'Ответили', cell: (ctx) => ctx.getValue() }),
  columnHelper.display({
    id: 'status',
    header: () => 'Статус',
    cell: (ctx) => (ctx.row.original.status === 'active' ? 'Активен' : 'Завершён'),
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

// Summary for assignment trigger
const assignSummary = computed(() => {
  const e = editing.value
  if (!e) return 'Выберите пользователей'
  const parts: string[] = []
  if (e.targetClasses.length) parts.push(`${e.targetClasses.length} клас.`)
  if (e.targetTeachers.includes('Все учителя')) parts.push('Все учителя')
  else if (e.targetTeachers.length) parts.push(`${e.targetTeachers.length} уч.`)
  return parts.length ? parts.join(' • ') : 'Выберите пользователей'
})

// Tri-state for select-all checkboxes
const classesAllChecked = computed(() => !!editing.value && editing.value.targetClasses.length === allClasses.length)
const classesIndeterminate = computed(
  () => !!editing.value && editing.value.targetClasses.length > 0 && editing.value.targetClasses.length < allClasses.length,
)
const teachersAllChecked = computed(() => !!editing.value && editing.value.targetTeachers.length === allTeachers.length)
const teachersIndeterminate = computed(
  () => !!editing.value && editing.value.targetTeachers.length > 0 && editing.value.targetTeachers.length < allTeachers.length,
)

// Modal state
const isOpen = ref(false)
const editing = ref<Survey | null>(null)
const newOption = ref('')

function openAdd() {
  editing.value = {
    id: 0,
    question: '',
    type: 'numeric',
    targetClasses: [],
    targetTeachers: [],
    answered: '0/0 (0%)',
    status: 'active',
    options: [],
  }
  isOpen.value = true
}
function openEdit(row: Survey) {
  const cloned: Survey = { ...row, options: row.options ? [...row.options] : [] }
  // Normalize "Все учителя" to full list for checkbox UI
  if (cloned.targetTeachers.includes('Все учителя')) {
    cloned.targetTeachers = [...allTeachers]
  }
  editing.value = cloned
  isOpen.value = true
}
function addOption() {
  const val = newOption.value.trim()
  if (!val) return
  editing.value!.options = [...(editing.value!.options || []), val]
  newOption.value = ''
}
function removeOption(idx: number) {
  if (!editing.value) return
  editing.value.options = (editing.value.options || []).filter((_, i) => i !== idx)
}
function saveSurvey() {
  if (!editing.value) return
  // Prepare a copy to persist
  const payload: Survey = { ...editing.value }
  // Compress full teacher selection to sentinel for table display
  if (payload.targetTeachers.length === allTeachers.length) {
    payload.targetTeachers = ['Все учителя']
  }
  if (payload.id === 0) {
    const nextId = Math.max(0, ...surveys.value.map((s) => s.id)) + 1
    surveys.value.push({ ...payload, id: nextId })
  } else {
    surveys.value = surveys.value.map((s) => (s.id === payload.id ? { ...payload } : s))
  }
  isOpen.value = false
}
</script>

<template>
  <div class="container">
    <h1 class="text-4xl font-sans text-black mb-4">Опросы</h1>

    <div class="relative w-full mb-2.5">
      <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray size-5" />
      <Input v-model="query" placeholder="Найти" class="pl-11" />
    </div>
    <!-- Controls row -->
    <div class="grid grid-cols-3 gap-5 mb-7.5">
      <Select v-model="classFilter" :value="classFilter">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Класс" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="c in classes" :key="c" :value="c">{{ c }}</SelectItem>
        </SelectContent>
      </Select>
      <Select v-model="typeFilter" :value="typeFilter" class="flex-1">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Тип вопроса" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="t in types" :key="t" :value="t">{{ t }}</SelectItem>
        </SelectContent>
      </Select>
      <Button @click="openAdd">
        <PlusIcon class="size-6" />
        <span class="ml-2">Создать опрос</span>
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

    <!-- Create/Edit Modal -->
    <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{{ editing?.id === 0 ? 'Создать опрос' : 'Редактировать опрос' }}</DialogTitle>
        </DialogHeader>

        <div class="grid gap-5 mb-5">
          <!-- Type selector -->
          <div>
            <label class="mb-4 block text-lg font-sans">Тип опроса</label>
            <RadioGroup v-model="(editing as any).type" class="grid gap-3">
              <div class="flex items-center gap-2">
                <RadioGroupItem id="type-numeric" value="numeric" />
                <Label for="type-numeric">Числовой (1-5)</Label>
              </div>
              <div class="flex items-center gap-2">
                <RadioGroupItem id="type-descriptive" value="descriptive" />
                <Label for="type-descriptive">Описательный</Label>
              </div>
            </RadioGroup>
          </div>

          <!-- Options for descriptive -->
          <div v-if="editing?.type === 'descriptive'">
            <label class="mb-2 block">Варианты ответа</label>
            <div class="flex flex-col items-start gap-3 mb-3">
              <Input v-model="newOption" placeholder="Введите вариант ответа" />
              <Button type="button" variant="ghost" size="sm" @click="addOption"> <PlusIcon class="size-5" /> Добавить вариант</Button>
            </div>
            <ul class="space-y-2">
              <li
                v-for="(opt, i) in editing?.options || []"
                :key="i"
                class="flex items-center justify-between rounded-base border border-surface pl-5 overflow-hidden"
              >
                <span>{{ opt }}</span>
                <Button type="button" variant="ghost" class="rounded-none" size="sm" @click="removeOption(i)">Удалить</Button>
              </li>
            </ul>
          </div>

          <!-- Question text -->
          <div>
            <label class="mb-2 block">Текст вопроса</label>
            <Input v-model="editing!.question" placeholder="Введите текст" />
          </div>

          <!-- Assign to (Popover) -->
          <div>
            <label class="mb-2 block">Назначить на</label>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="ghost" class="w-full bg-surface justify-between">
                  <span class="normal-case font-body">{{ assignSummary }}</span>
                  <ChevronDown class="size-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="p-3 w-(--reka-popover-trigger-width)">
                <div class="space-y-4 grid grid-cols-2">
                  <!-- Classes group -->
                  <div>
                    <span class="font-sans font-medium block mb-3">Классы</span>

                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <Checkbox
                          id="class-all"
                          :model-value="classesAllChecked ? true : classesIndeterminate ? 'indeterminate' : false"
                          @update:modelValue="
                            (value: boolean | 'indeterminate') => {
                              const checked = value === true
                              editing!.targetClasses = checked ? [...allClasses] : []
                            }
                          "
                        />
                        <Label for="class-all">Все классы</Label>
                      </div>
                      <div v-for="(c, idx) in allClasses" :key="c" class="flex items-center gap-2">
                        <Checkbox
                          :id="'class-' + idx"
                          :model-value="editing?.targetClasses.includes(c)"
                          @update:modelValue="
                            (value: boolean | 'indeterminate') => {
                              const checked = value === true
                              const list = new Set(editing!.targetClasses)
                              if (checked) list.add(c)
                              else list.delete(c)
                              editing!.targetClasses = Array.from(list)
                            }
                          "
                        />
                        <Label :for="'class-' + idx">{{ c }}</Label>
                      </div>
                    </div>
                  </div>
                  <!-- Teachers group -->
                  <div>
                    <span class="font-sans font-medium block mb-3">Учителя</span>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <Checkbox
                          id="teacher-all"
                          :model-value="teachersAllChecked ? true : teachersIndeterminate ? 'indeterminate' : false"
                          @update:modelValue="
                            (value: boolean | 'indeterminate') => {
                              const checked = value === true
                              editing!.targetTeachers = checked ? [...allTeachers] : []
                            }
                          "
                        />
                        <Label for="teacher-all">Все учителя</Label>
                      </div>
                      <div v-for="(t, idx) in allTeachers" :key="t" class="flex items-center gap-2">
                        <Checkbox
                          :id="'teacher-' + idx"
                          :model-value="editing?.targetTeachers.includes(t)"
                          @update:modelValue="
                            (value: boolean | 'indeterminate') => {
                              const checked = value === true
                              const list = new Set(editing!.targetTeachers)
                              if (checked) list.add(t)
                              else list.delete(t)
                              editing!.targetTeachers = Array.from(list)
                            }
                          "
                        />
                        <Label :for="'teacher-' + idx">{{ t }}</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <!-- Status -->
          <div>
            <label class="mb-2 block">Состояние</label>
            <Select v-model="(editing as any).status" :value="editing?.status">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Состояние" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Активен</SelectItem>
                <SelectItem value="closed">Завершён</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter class="sm:flex-col">
          <Button type="button" @click="saveSurvey">Сохранить</Button>
          <DialogClose as-child><Button type="button" variant="outline">Отмена</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
