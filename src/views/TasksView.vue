<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import CreateTaskModal from '../components/tasks/CreateTaskModal.vue'
import TaskCard from '../components/tasks/TaskCard.vue'
import { dashboardReferenceDate } from '../data/dashboard'
import { useProjectStore } from '../stores/project'
import type { CreateTaskInput, TaskStatus } from '../types/dashboard'
import { taskStatusLabels } from '../utils/task'

const store = useProjectStore()
const { filteredTasks, projects, taskAssigneeFilter, taskPriorityFilter, taskProjectFilter, taskSearchQuery, taskStatistics, teamMembers } = storeToRefs(store)
const modal = ref(false)
const feedback = ref('')
const dragged = ref<string | null>(null)
const dragOverStatus = ref<TaskStatus | null>(null)
const createButton = ref<HTMLButtonElement | null>(null)
let feedbackTimer: number | undefined

const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'done']
const columns = computed(() => statuses.map((status) => ({ label: taskStatusLabels[status], status, tasks: filteredTasks.value.filter((task) => task.status === status) })))

function isOverdue(dueDate: string, status: TaskStatus) { return status !== 'done' && dueDate < dashboardReferenceDate }
function showFeedback(message: string) { feedback.value = message; if (feedbackTimer) window.clearTimeout(feedbackTimer); feedbackTimer = window.setTimeout(() => { feedback.value = '' }, 4000) }
function changeStatus(taskId: string, status: TaskStatus) { if (store.updateTaskStatus(taskId, status)) showFeedback(`任務狀態已更新為${taskStatusLabels[status]}。`) }
function startDrag(taskId: string) { dragged.value = taskId }
function endDrag() { dragged.value = null; dragOverStatus.value = null }
function handleDrop(status: TaskStatus) { if (dragged.value) changeStatus(dragged.value, status); endDrag() }
function closeModal() { modal.value = false; void nextTick(() => createButton.value?.focus()) }
function createTask(input: CreateTaskInput) { const task = store.createTask(input); showFeedback(`已建立任務「${task.title}」。`); closeModal() }

watch(modal, (isOpen) => document.body.classList.toggle('has-modal-open', isOpen))
onBeforeUnmount(() => { document.body.classList.remove('has-modal-open'); if (feedbackTimer) window.clearTimeout(feedbackTimer) })
</script>

<template>
  <div class="tasks">
    <header class="tasks__header"><div><p>TaskFlow</p><h1>任務</h1><span>集中管理任務，掌握工作進度與優先順序。</span></div><button ref="createButton" type="button" @click="modal = true">＋ 新增任務</button></header>
    <section class="summary" aria-label="任務摘要"><dl><div><dt>全部</dt><dd>{{ taskStatistics.total }}</dd></div><div><dt>待處理</dt><dd>{{ taskStatistics.todo }}</dd></div><div><dt>進行中</dt><dd>{{ taskStatistics.inProgress }}</dd></div><div><dt>審核中</dt><dd>{{ taskStatistics.review }}</dd></div><div><dt>已完成</dt><dd>{{ taskStatistics.done }}</dd></div><div><dt>已逾期</dt><dd>{{ taskStatistics.overdue }}</dd></div></dl></section>
    <section class="toolbar" aria-label="任務篩選"><label>搜尋任務<input v-model="taskSearchQuery" /></label><label>專案<select v-model="taskProjectFilter"><option value="all">全部專案</option><option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option></select></label><label>優先度<select v-model="taskPriorityFilter"><option value="all">全部</option><option value="high">高</option><option value="medium">中</option><option value="low">低</option></select></label><label>負責人<select v-model="taskAssigneeFilter"><option value="all">全部成員</option><option v-for="member in teamMembers" :key="member.id" :value="member.id">{{ member.name }}</option></select></label></section>
    <div v-if="feedback" aria-atomic="true" aria-live="polite" class="tasks__toast" role="status">{{ feedback }}</div>
    <section class="board" aria-label="看板"><section v-for="column in columns" :key="column.status" :class="{ 'column--drag-over': dragOverStatus === column.status }" class="column" @dragover.prevent="dragOverStatus = column.status" @drop="handleDrop(column.status)"><header class="column__header"><h2>{{ column.label }}</h2><span :aria-label="`${column.label}任務數 ${column.tasks.length}`" class="column__count">{{ column.tasks.length }}</span></header><p v-if="!column.tasks.length" class="column__empty">目前沒有{{ column.label }}任務</p><TaskCard v-for="task in column.tasks" :key="task.id" :is-dragging="dragged === task.id" :overdue="isOverdue(task.dueDate, task.status)" :task="task" @dragend="endDrag" @dragstart="startDrag" @status-change="changeStatus" /></section></section>
    <CreateTaskModal v-if="modal" :members="teamMembers" :projects="projects" @close="closeModal" @create="createTask" />
  </div>
</template>

<style scoped>
.tasks { display: grid; gap: var(--space-5); }.tasks__header { align-items: flex-start; display: flex; gap: var(--space-4); justify-content: space-between; }.tasks__header p, h1, .tasks__header span { margin: 0; }.tasks__header p { color: var(--color-accent-strong); font-size: .75rem; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }h1 { color: var(--color-text); font-size: clamp(1.875rem, 4vw, 2.5rem); letter-spacing: -.045em; line-height: 1.1; margin-top: var(--space-2); }.tasks__header span { color: var(--color-text-secondary); display: block; line-height: 1.6; margin-top: var(--space-2); }.tasks__header button { background: var(--color-accent); border: 1px solid var(--color-accent); border-radius: var(--radius-md); color: white; flex: 0 0 auto; font-weight: 700; min-height: 2.75rem; padding: 0 var(--space-4); }.tasks__header button:hover { background: var(--color-accent-strong); }.summary, .toolbar { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }.summary { padding: var(--space-4) var(--space-5); }dl { display: grid; gap: var(--space-3); grid-template-columns: repeat(6, minmax(0, 1fr)); margin: 0; }dt { color: var(--color-text-muted); font-size: .7rem; font-weight: 700; }dd { color: var(--color-text); font-size: 1.25rem; font-variant-numeric: tabular-nums; margin: var(--space-1) 0 0; }.toolbar { display: grid; gap: var(--space-3); grid-template-columns: repeat(4, minmax(0, 1fr)); padding: var(--space-4); }label { color: var(--color-text-secondary); display: grid; font-size: .75rem; font-weight: 700; gap: var(--space-1); }input, select { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font: inherit; min-height: 2.5rem; padding: 0 var(--space-3); }.tasks__toast { background: var(--color-text); border-radius: var(--radius-md); bottom: var(--space-5); box-shadow: var(--shadow-lg); color: white; font-size: .8125rem; max-width: min(24rem, calc(100vw - 2rem)); padding: var(--space-3) var(--space-4); position: fixed; right: var(--space-5); z-index: 30; }.board { display: grid; gap: var(--space-4); grid-template-columns: repeat(4, minmax(15rem, 1fr)); overflow-x: auto; padding-bottom: var(--space-2); }.column { align-content: start; background: color-mix(in srgb, var(--color-surface-subtle) 72%, white); border: 1px solid transparent; border-radius: var(--radius-lg); display: grid; gap: var(--space-3); min-height: 16rem; padding: var(--space-3); transition: background-color 160ms ease, border-color 160ms ease; }.column--drag-over { background: var(--color-accent-soft); border-color: #a5b4fc; }.column__header { align-items: center; display: flex; justify-content: space-between; }.column h2, .column p { margin: 0; }.column h2 { color: var(--color-text-secondary); font-size: .875rem; }.column__count { align-items: center; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 999px; color: var(--color-text-secondary); display: inline-flex; font-size: .6875rem; font-variant-numeric: tabular-nums; font-weight: 750; justify-content: center; min-width: 1.5rem; padding: .15rem var(--space-2); }.column__empty { color: var(--color-text-muted); font-size: .8125rem; padding: var(--space-3) var(--space-2); }@media (max-width: 45rem) { dl { grid-template-columns: repeat(3, minmax(0, 1fr)); } .toolbar { grid-template-columns: repeat(2, minmax(0, 1fr)); } }@media (max-width: 34rem) { .tasks__header { align-items: stretch; flex-direction: column; }.tasks__header button { width: 100%; }.tasks__toast { bottom: var(--space-4); left: var(--space-4); right: var(--space-4); } }@media (prefers-reduced-motion: reduce) { .column { transition: none; } }
.tasks__header {
  padding: var(--space-2) 0 var(--space-3);
}

.tasks__header span {
  font-size: 0.9375rem;
}

.summary,
.toolbar {
  padding: var(--space-4) var(--space-5);
}

dd {
  font-size: 1.375rem;
  font-weight: 750;
}

input:focus-visible,
select:focus-visible {
  border-color: var(--color-accent);
  outline: 3px solid #c7d2fe;
  outline-offset: 1px;
}

.board {
  align-items: start;
  gap: var(--space-5);
  grid-template-columns: repeat(4, minmax(16.25rem, 1fr));
  padding-bottom: var(--space-3);
}

.column {
  background: color-mix(in srgb, var(--color-surface-subtle) 84%, white);
  border-color: #e8edf5;
  gap: var(--space-4);
  min-height: 18rem;
  padding: var(--space-4);
}

.column__header {
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-1) var(--space-3);
}

.column h2 {
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 750;
}

.column__count {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  min-height: 1.5rem;
  min-width: 1.75rem;
  padding: 0.125rem var(--space-2);
}

.column--drag-over {
  background: var(--color-accent-soft);
  border-color: #a5b4fc;
}

@media (max-width: 45rem) {
  .summary,
  .toolbar {
    padding: var(--space-4);
  }

  .board {
    gap: var(--space-4);
  }

  .column {
    padding: var(--space-3);
  }
}

@media (max-width: 34rem) {
  .summary dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
