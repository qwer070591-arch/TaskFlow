<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

import type { Project, Task, TeamMember } from '../../types/dashboard'
import { getWorkloadLevel, workloadLabels } from '../../utils/team'

const props = defineProps<{ member: TeamMember; projects: Project[]; activeTasks: Task[]; completedTasks: Task[] }>()
const emit = defineEmits<{ close: [] }>()
const drawer = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const workloadLevel = getWorkloadLevel(props.member.workload)

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !drawer.value) return
  const elements = drawer.value.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
  const first = elements[0]
  const last = elements[elements.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}

onMounted(() => void nextTick(() => closeButton.value?.focus()))
</script>

<template>
  <div class="member-drawer" @mousedown.self="emit('close')">
    <aside ref="drawer" class="member-drawer__panel" role="dialog" aria-modal="true" :aria-labelledby="`member-detail-${member.id}`" @keydown.esc="emit('close')" @keydown.tab="trapFocus">
      <header><div class="member-drawer__identity"><span aria-hidden="true">{{ member.initials }}</span><div><h2 :id="`member-detail-${member.id}`">{{ member.name }}</h2><p>{{ member.role }}</p></div></div><button ref="closeButton" type="button" aria-label="關閉成員詳情" @click="emit('close')"><span aria-hidden="true">×</span></button></header>
      <section class="member-drawer__workload" :aria-label="`${member.name} 工作負載`"><div><span>工作負載</span><strong :class="`member-drawer__workload-value--${workloadLevel}`">{{ member.workload }}% · {{ workloadLabels[workloadLevel] }}</strong></div><progress :value="member.workload" max="100">{{ member.workload }}%</progress></section>
      <section aria-labelledby="member-projects-title"><h3 id="member-projects-title">參與專案</h3><ul v-if="projects.length"><li v-for="project in projects" :key="project.id">{{ project.name }}</li></ul><p v-else class="member-drawer__empty">目前沒有參與中的專案</p></section>
      <section aria-labelledby="member-active-tasks-title"><h3 id="member-active-tasks-title">進行中任務</h3><ul v-if="activeTasks.length"><li v-for="task in activeTasks" :key="task.id">{{ task.title }}</li></ul><p v-else class="member-drawer__empty">目前沒有進行中的任務</p></section>
      <section aria-labelledby="member-completed-tasks-title"><h3 id="member-completed-tasks-title">已完成任務</h3><ul v-if="completedTasks.length"><li v-for="task in completedTasks" :key="task.id">{{ task.title }}</li></ul><p v-else class="member-drawer__empty">尚無已完成任務</p></section>
    </aside>
  </div>
</template>

<style scoped>
.member-drawer { background: rgb(15 23 42 / 40%); inset: 0; position: fixed; z-index: 40; }.member-drawer__panel { background: var(--color-surface); box-shadow: var(--shadow-lg); display: grid; gap: var(--space-6); height: 100%; margin-left: auto; max-width: 30rem; overflow-y: auto; padding: var(--space-6); width: min(100%, 30rem); }header { align-items: flex-start; display: flex; gap: var(--space-4); justify-content: space-between; }.member-drawer__identity { align-items: center; display: flex; gap: var(--space-3); }.member-drawer__identity > span { align-items: center; background: var(--color-accent-soft); border-radius: 50%; color: var(--color-accent-strong); display: inline-flex; font-size: .875rem; font-weight: 750; height: 3rem; justify-content: center; width: 3rem; }h2, h3, p { margin: 0; }h2 { color: var(--color-text); font-size: 1.25rem; }header p { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-1); }header button { align-items: center; background: transparent; border: 0; border-radius: var(--radius-md); color: var(--color-text-secondary); display: inline-flex; font-size: 1.75rem; height: 2.75rem; justify-content: center; padding: 0; width: 2.75rem; }header button:hover { background: var(--color-surface-subtle); }.member-drawer__workload { background: var(--color-surface-subtle); border-radius: var(--radius-md); display: grid; gap: var(--space-2); padding: var(--space-4); }.member-drawer__workload > div { align-items: center; color: var(--color-text-secondary); display: flex; font-size: .8125rem; justify-content: space-between; }.member-drawer__workload strong { font-size: .8125rem; }.member-drawer__workload-value--low { color: var(--color-success-strong); }.member-drawer__workload-value--normal { color: var(--color-info-strong); }.member-drawer__workload-value--high { color: var(--color-danger-strong); }progress { appearance: none; border: 0; height: .5rem; overflow: hidden; width: 100%; }progress::-webkit-progress-bar { background: var(--color-surface); border-radius: 999px; }progress::-webkit-progress-value { background: var(--color-info); border-radius: 999px; }progress::-moz-progress-bar { background: var(--color-info); border-radius: 999px; }section { display: grid; gap: var(--space-3); }h3 { color: var(--color-text); font-size: .875rem; }ul { display: grid; gap: var(--space-2); list-style: none; margin: 0; padding: 0; }li, .member-drawer__empty { background: var(--color-surface-subtle); border-radius: var(--radius-sm); color: var(--color-text-secondary); font-size: .8125rem; line-height: 1.45; padding: var(--space-3); }.member-drawer__empty { color: var(--color-text-muted); }@media (max-width: 34rem) { .member-drawer__panel { max-width: none; padding: var(--space-5); width: 100%; } }
</style>
