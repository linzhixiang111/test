<script setup lang="ts">
import { ref } from 'vue'

type Theme = 'light' | 'dark'

const storageKey = 'vibe-coding-runoob-theme'

function getInitialTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(storageKey)
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getInitialTheme())

function applyTheme(nextTheme: Theme) {
  theme.value = nextTheme
  document.documentElement.classList.toggle('dark', nextTheme === 'dark')
}

applyTheme(theme.value)

function toggleTheme() {
  const nextTheme = theme.value === 'dark' ? 'light' : 'dark'
  applyTheme(nextTheme)

  try {
    localStorage.setItem(storageKey, nextTheme)
  } catch {
    // Theme still applies for this session when storage is unavailable.
  }
}
</script>

<template>
  <button
    type="button"
    role="switch"
    aria-label="深色模式"
    :aria-checked="theme === 'dark'"
    class="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-300"
    @click="toggleTheme"
  >
    <span>深色模式</span>
    <span
      :class="[
        'relative h-6 w-10 rounded-full transition-colors',
        theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600',
      ]"
    >
      <span
        :class="[
          'absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
          theme === 'dark' ? 'translate-x-4' : 'translate-x-0',
        ]"
      ></span>
    </span>
  </button>
</template>