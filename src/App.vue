<script setup lang="ts">
import { ref } from 'vue'
import type { TaskStatus } from './types/task'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, taskStore, updateTask } from './stores/taskStore'

const isTaskModalOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')
const isMobileMenuOpen = ref(false)

function toggleTask(taskId: string) {
  const task = taskStore.tasks.find((item) => item.id === taskId)
  if (task) updateTask(taskId, { status: task.status === 'done' ? 'todo' : 'done' })
}

function moveTask(taskId: string, status: TaskStatus) {
  updateTask(taskId, { status })
}

</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav class="relative mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8" aria-label="主导航">
        <a href="#" class="flex min-w-0 items-center gap-3 font-semibold text-slate-900 no-underline dark:text-slate-100">
          <span class="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">V</span>
          <span class="truncate text-sm sm:text-base">Vibe Coding Runoob</span>
        </a>
        <button
          type="button"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-nav-panel"
          :aria-label="isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
          class="flex size-11 shrink-0 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" aria-hidden="true" viewBox="0 0 24 24" fill="none" class="size-6">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <svg v-else aria-hidden="true" viewBox="0 0 24 24" fill="none" class="size-6">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
        <div
          id="mobile-nav-panel"
          :class="[
            'absolute left-0 right-0 top-full z-40 items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-md dark:border-slate-800 dark:bg-slate-900 sm:static sm:flex sm:w-auto sm:justify-end sm:gap-4 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:dark:bg-transparent',
            isMobileMenuOpen ? 'flex' : 'hidden',
          ]"
        >
          <span class="text-sm text-slate-500 dark:text-slate-400">任务管理</span>
          <ThemeToggle />
        </div>
      </nav>
    </header>

    <main class="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <section aria-labelledby="tasks-heading">
        <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">工作空间 / 我的任务</p>
            <h1 id="tasks-heading" class="m-0 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">任务列表</h1>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <p class="m-0 text-sm text-slate-500 dark:text-slate-400">共 {{ taskStore.tasks.length }} 项任务</p>
            <button
              type="button"
              class="min-h-11 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click="isTaskModalOpen = true"
            >
              + 新建任务
            </button>
          </div>
        </div>

        <div class="mb-5 inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900" role="tablist" aria-label="任务视图">
          <button
            id="list-view-tab"
            type="button"
            role="tab"
            aria-controls="list-view-panel"
            :aria-selected="activeView === 'list'"
            :class="[
              'min-h-11 rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              activeView === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            ]"
            @click="activeView = 'list'"
          >
            列表
          </button>
          <button
            id="kanban-view-tab"
            type="button"
            role="tab"
            aria-controls="kanban-view-panel"
            :aria-selected="activeView === 'kanban'"
            :class="[
              'min-h-11 rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              activeView === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            ]"
            @click="activeView = 'kanban'"
          >
            看板
          </button>
        </div>

        <div v-if="activeView === 'list'" id="list-view-panel" role="tabpanel" aria-labelledby="list-view-tab">
          <TaskList :tasks="taskStore.tasks" @toggle="toggleTask" @delete="deleteTask" />
        </div>
        <div v-else id="kanban-view-panel" role="tabpanel" aria-labelledby="kanban-view-tab">
          <KanbanBoard :tasks="taskStore.tasks" @status-change="moveTask" />
        </div>
      </section>
    </main>

    <TaskModal v-model="isTaskModalOpen" @submit="addTask" />
  </div>
</template>
