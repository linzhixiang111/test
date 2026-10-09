import { reactive, watch } from 'vue'
import type { Task } from '../types/task'
import { hasSavedTasks, loadTasks, saveTasks } from '../utils/storage'

const sampleTasks: Task[] = [
  {
    id: 'sample-task-1',
    title: '梳理产品需求',
    description: '整理核心用户流程和首版功能范围。',
    status: 'done',
    priority: 'high',
    dueDate: '2026-10-08',
    createdAt: '2026-10-01T09:00:00',
  },
  {
    id: 'sample-task-2',
    title: '完成首页视觉稿',
    description: '确定任务看板的布局、色彩和组件样式。',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-10-12',
    createdAt: '2026-10-03T10:30:00',
  },
  {
    id: 'sample-task-3',
    title: '编写使用说明',
    description: '补充本地开发和启动项目的说明。',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-10-18',
    createdAt: '2026-10-07T08:45:00',
  },
]

export const taskStore = reactive({
  tasks: hasSavedTasks() ? loadTasks() : sampleTasks,
})

watch(
  () => taskStore.tasks,
  (tasks) => saveTasks(tasks),
  { deep: true, immediate: true },
)

export function addTask(task: Task): void {
  taskStore.tasks.push(task)
}

export function updateTask(taskId: Task['id'], updates: Partial<Omit<Task, 'id'>>): void {
  const task = taskStore.tasks.find((item) => item.id === taskId)
  if (task) Object.assign(task, updates)
}

export function deleteTask(taskId: Task['id']): void {
  const taskIndex = taskStore.tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) taskStore.tasks.splice(taskIndex, 1)
}