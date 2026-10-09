<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Task, TaskStatus } from '../types/task'
import TaskCard from './TaskCard.vue'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: Task['id']]
  delete: [taskId: Task['id']]
}>()

type TaskFilter = 'all' | TaskStatus

const filters: { label: string; value: TaskFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '待办', value: 'todo' },
  { label: '进行中', value: 'in-progress' },
  { label: '完成', value: 'done' },
]

const activeFilter = ref<TaskFilter>('all')

const sortedTasks = computed(() =>
  [...props.tasks].sort(
    (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
  ),
)

const visibleTasks = computed(() =>
  activeFilter.value === 'all'
    ? sortedTasks.value
    : sortedTasks.value.filter((task) => task.status === activeFilter.value),
)
</script>

<template>
  <section aria-label="任务列表">
    <div class="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="按状态筛选任务">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        :aria-pressed="activeFilter === filter.value"
        :class="[
          'min-h-11 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
          activeFilter === filter.value
            ? 'bg-indigo-600 text-white'
            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
        ]"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <p v-if="tasks.length === 0" class="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      还没有任务，点击下方按钮创建第一个吧
    </p>
    <p v-else-if="visibleTasks.length === 0" class="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      当前状态下没有任务
    </p>
    <div v-else class="space-y-3">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </section>
</template>