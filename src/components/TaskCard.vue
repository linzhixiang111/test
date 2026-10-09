<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [taskId: Task['id']]
  delete: [taskId: Task['id']]
}>()

const priorityLabels = {
  low: '低优先级',
  medium: '中优先级',
  high: '高优先级',
}

const priorityBorders = {
  low: 'border-l-emerald-500',
  medium: 'border-l-amber-400',
  high: 'border-l-rose-500',
}

const priorityText = {
  low: 'text-emerald-700 dark:text-emerald-400',
  medium: 'text-amber-700 dark:text-amber-400',
  high: 'text-rose-700 dark:text-rose-400',
}
</script>

<template>
  <article
    :class="[
      'group grid gap-4 border border-l-4 border-slate-200 bg-white px-4 py-4 shadow-sm transition-transform duration-200 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5',
      priorityBorders[task.priority],
    ]"
  >
    <input
      type="checkbox"
      :checked="task.status === 'done'"
      :aria-label="`${task.status === 'done' ? '重新打开' : '完成'}任务：${task.title}`"
      class="size-4 cursor-pointer accent-indigo-600"
      @change="emit('toggle', task.id)"
    />

    <div class="min-w-0">
      <h2 :class="['m-0 text-base font-semibold text-slate-900 dark:text-slate-100', { 'text-slate-400 line-through dark:text-slate-500': task.status === 'done' }]">
        {{ task.title }}
      </h2>
      <p class="mb-0 mt-1 text-sm text-slate-500 dark:text-slate-400">{{ task.description }}</p>
    </div>

    <div class="flex items-center justify-between gap-4 sm:justify-end">
      <div class="flex items-center gap-4 text-sm">
        <span :class="['whitespace-nowrap font-medium', priorityText[task.priority]]">
          {{ priorityLabels[task.priority] }}
        </span>
        <time v-if="task.dueDate" :datetime="task.dueDate" class="whitespace-nowrap text-slate-500 dark:text-slate-400">
          截止 {{ task.dueDate }}
        </time>
        <span v-else class="whitespace-nowrap text-slate-400 dark:text-slate-500">无截止日期</span>
      </div>

      <button
        type="button"
        :aria-label="`删除任务：${task.title}`"
        title="删除任务"
        class="flex size-11 shrink-0 items-center justify-center rounded-md text-xl leading-none text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-500 dark:hover:bg-rose-950 dark:hover:text-rose-300"
        @click="emit('delete', task.id)"
      >
        ×
      </button>
    </div>
  </article>
</template>