<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const isOpen = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  submit: [task: Task]
}>()

const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
}>({
  title: '',
  description: '',
  priority: 'medium',
})

const titleError = ref(false)
const titleInput = ref<HTMLInputElement | null>(null)

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  titleError.value = false
}

function closeModal() {
  isOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) closeModal()
}

function submitTask() {
  const title = form.title.trim()
  if (!title) {
    titleError.value = true
    titleInput.value?.focus()
    return
  }

  emit('submit', {
    id: crypto.randomUUID(),
    title,
    description: form.description.trim(),
    status: 'todo',
    priority: form.priority,
    dueDate: null,
    createdAt: new Date().toISOString(),
  })
  closeModal()
}

watch(isOpen, async (open) => {
  if (open) {
    resetForm()
    await nextTick()
    titleInput.value?.focus()
  }
})

watch(
  () => form.title,
  (title) => {
    if (title.trim()) titleError.value = false
  },
)

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="task-sheet">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-0 pb-0 pt-8 dark:bg-black/70 sm:items-center sm:p-4"
        @click.self="closeModal"
      >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        class="task-modal-panel max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-b-0 border-slate-200 bg-white px-5 py-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:rounded-xl sm:border-b sm:p-7"
      >
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="task-modal-title" class="m-0 text-xl font-semibold text-slate-900 dark:text-slate-100">新建任务</h2>
            <p class="mb-0 mt-1 text-sm text-slate-500 dark:text-slate-400">填写任务信息，稍后也可以继续编辑。</p>
          </div>
          <button
            type="button"
            aria-label="关闭弹窗"
            class="flex size-11 shrink-0 items-center justify-center rounded-md text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            @click="closeModal"
          >
            ×
          </button>
        </div>

        <form novalidate class="space-y-5" @submit.prevent="submitTask">
          <div>
            <label for="task-title" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">标题 <span class="text-rose-600">*</span></label>
            <input
              id="task-title"
              ref="titleInput"
              v-model="form.title"
              type="text"
              required
              :aria-invalid="titleError"
              :aria-describedby="titleError ? 'task-title-error' : undefined"
              placeholder="输入任务标题"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
            />
            <p v-if="titleError" id="task-title-error" class="mb-0 mt-1.5 text-sm text-rose-600">标题不能为空</p>
          </div>

          <div>
            <label for="task-description" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">描述</label>
            <textarea
              id="task-description"
              v-model="form.description"
              rows="3"
              placeholder="补充任务说明（选填）"
              class="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
            ></textarea>
          </div>

          <div>
            <label for="task-priority" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">优先级</label>
            <select
              id="task-priority"
              v-model="form.priority"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-950"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              class="min-h-11 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="closeModal"
            >
              取消
            </button>
            <button
              type="submit"
              class="min-h-11 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              创建任务
            </button>
          </div>
        </form>
      </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.task-sheet-enter-active,
.task-sheet-leave-active {
  transition: opacity 220ms ease;
}

.task-sheet-enter-active .task-modal-panel,
.task-sheet-leave-active .task-modal-panel {
  transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.task-sheet-enter-from,
.task-sheet-leave-to {
  opacity: 0;
}

.task-sheet-enter-from .task-modal-panel,
.task-sheet-leave-to .task-modal-panel {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .task-sheet-enter-from .task-modal-panel,
  .task-sheet-leave-to .task-modal-panel {
    transform: translateY(0.75rem) scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .task-sheet-enter-active,
  .task-sheet-leave-active,
  .task-sheet-enter-active .task-modal-panel,
  .task-sheet-leave-active .task-modal-panel {
    transition-duration: 0.01ms;
  }
}
</style>