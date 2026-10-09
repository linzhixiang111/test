import type { Task } from '../types/task'

export const TASKS_STORAGE_KEY = 'vibe-coding-runoob-tasks'

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {}
}

export function loadTasks(): Task[] {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!savedTasks) return []

    const parsedTasks: unknown = JSON.parse(savedTasks)
    return Array.isArray(parsedTasks) ? (parsedTasks as Task[]) : []
  } catch {
    return []
  }
}

export function hasSavedTasks(): boolean {
  try {
    return localStorage.getItem(TASKS_STORAGE_KEY) !== null
  } catch {
    return false
  }
}