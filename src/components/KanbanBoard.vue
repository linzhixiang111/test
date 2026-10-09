<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  statusChange: [taskId: Task['id'], status: TaskStatus]
}>()

const columns: { status: TaskStatus; label: string; dotClass: string }[] = [
  { status: 'todo', label: '待办', dotClass: 'bg-slate-400' },
  { status: 'in-progress', label: '进行中', dotClass: 'bg-indigo-500' },
  { status: 'done', label: '已完成', dotClass: 'bg-emerald-500' },
]

const draggedTaskId = ref<Task['id'] | null>(null)
const dragOverStatus = ref<TaskStatus | null>(null)

const tasksByStatus = computed<Record<TaskStatus, Task[]>>(() => ({
  todo: props.tasks.filter((task) => task.status === 'todo'),
  'in-progress': props.tasks.filter((task) => task.status === 'in-progress'),
  done: props.tasks.filter((task) => task.status === 'done'),
}))

function handleDragStart(event: DragEvent, taskId: Task['id']) {
  draggedTaskId.value = taskId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
  }
}

function handleDragOver(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  dragOverStatus.value = status
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}

function handleDrop(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId.value
  if (taskId) emit('statusChange', taskId, status)
  draggedTaskId.value = null
  dragOverStatus.value = null
}

function clearDragState() {
  draggedTaskId.value = null
  dragOverStatus.value = null
}
</script>

<template>
  <section aria-label="任务看板" class="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <section v-for="column in columns" :key="column.status" :aria-label="`${column.label}任务`">
      <header class="mb-3 flex items-center justify-between px-1">
        <h2 class="m-0 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span :class="['size-2 rounded-full', column.dotClass]"></span>
          {{ column.label }}
        </h2>
        <span class="text-xs tabular-nums text-slate-500 dark:text-slate-400">{{ tasksByStatus[column.status].length }}</span>
      </header>

      <div
        :class="[
          'min-h-64 space-y-3 rounded-lg border border-dashed p-3 transition-colors',
          dragOverStatus === column.status
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-300 bg-slate-100/70 dark:border-slate-700 dark:bg-slate-900/70',
          dragOverStatus === column.status ? 'dark:border-indigo-400 dark:bg-indigo-950' : '',
        ]"
        @dragover="handleDragOver($event, column.status)"
        @drop="handleDrop($event, column.status)"
      >
        <article
          v-for="task in tasksByStatus[column.status]"
          :key="task.id"
          draggable="true"
          :class="[
            'cursor-grab rounded-md border border-l-4 border-slate-200 bg-white p-4 shadow-sm transition-opacity active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900',
            task.priority === 'high'
              ? 'border-slate-200 border-l-rose-500'
              : task.priority === 'medium'
                ? 'border-slate-200 border-l-amber-400'
                : 'border-slate-200 border-l-emerald-500',
            draggedTaskId === task.id ? 'opacity-50' : '',
          ]"
          @dragstart="handleDragStart($event, task.id)"
          @dragend="clearDragState"
        >
          <h3 :class="['m-0 text-sm font-semibold text-slate-900 dark:text-slate-100', { 'line-through text-slate-400 dark:text-slate-500': task.status === 'done' }]">
            {{ task.title }}
          </h3>
          <p v-if="task.description" class="mb-0 mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {{ task.description }}
          </p>
          <div class="mt-4 flex items-center justify-between gap-2 text-xs">
            <span
              :class="[
                'rounded-full px-2 py-1 font-medium',
                task.priority === 'high'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : task.priority === 'medium'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              ]"
            >
              {{ task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级' }}
            </span>
            <time v-if="task.dueDate" :datetime="task.dueDate" class="text-slate-500 dark:text-slate-400">
              {{ task.dueDate }}
            </time>
          </div>
        </article>
        <p v-if="tasksByStatus[column.status].length === 0" class="m-0 px-2 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
          拖动任务到此列
        </p>
      </div>
    </section>
  </section>
</template>