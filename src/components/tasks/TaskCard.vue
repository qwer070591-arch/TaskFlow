<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'

import type { TaskBoardItem, TaskStatus } from '../../types/dashboard'
import { formatProjectDate } from '../../utils/project'
import { taskPriorityLabels, taskStatusLabels } from '../../utils/task'

const props = defineProps<{ task: TaskBoardItem; overdue: boolean; isDragging?: boolean }>()
const emit = defineEmits<{
  dragend: []
  dragstart: [taskId: string]
  statusChange: [taskId: string, status: TaskStatus]
}>()

const actionMenu = ref<HTMLElement | null>(null)
const actionButton = ref<HTMLButtonElement | null>(null)
const isStatusMenuOpen = ref(false)
const menuId = `task-status-menu-${props.task.id}`
const statusOptions = (Object.keys(taskStatusLabels) as TaskStatus[]).map((status) => ({
  label: taskStatusLabels[status],
  status,
}))

function closeStatusMenu(returnFocus = false) {
  isStatusMenuOpen.value = false
  if (returnFocus) void nextTick(() => actionButton.value?.focus())
}

function toggleStatusMenu() {
  if (isStatusMenuOpen.value) {
    closeStatusMenu()
    return
  }

  isStatusMenuOpen.value = true
  void nextTick(() => actionMenu.value?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus())
}

function updateStatus(status: TaskStatus) {
  emit('statusChange', props.task.id, status)
  closeStatusMenu(true)
}

function handleOutsidePointerDown(event: PointerEvent) {
  if (isStatusMenuOpen.value && !actionMenu.value?.contains(event.target as Node)) closeStatusMenu()
}

document.addEventListener('pointerdown', handleOutsidePointerDown)
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutsidePointerDown))
</script>

<template>
  <article
    class="task-card"
    :class="{ 'task-card--dragging': isDragging }"
    draggable="true"
    @dragend="emit('dragend')"
    @dragstart="emit('dragstart', task.id)"
  >
    <div class="task-card__header">
      <div>
        <h3>{{ task.title }}</h3>
        <p class="task-card__project">{{ task.projectName }}</p>
      </div>

      <div ref="actionMenu" class="task-card__actions" @keydown.esc.prevent="closeStatusMenu(true)">
        <button
          ref="actionButton"
          :aria-controls="menuId"
          :aria-expanded="isStatusMenuOpen"
          :aria-label="`變更「${task.title}」狀態`"
          aria-haspopup="menu"
          class="task-card__action-button"
          type="button"
          @click="toggleStatusMenu"
        >
          <span aria-hidden="true">⋯</span>
        </button>

        <div v-if="isStatusMenuOpen" :id="menuId" class="task-card__menu" role="menu">
          <button
            v-for="option in statusOptions"
            :key="option.status"
            :disabled="task.status === option.status"
            role="menuitem"
            type="button"
            @click="updateStatus(option.status)"
          >
            移至{{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="task-card__badges">
      <span :class="`task-card__badge task-card__badge--${task.priority}`">
        {{ taskPriorityLabels[task.priority] }}優先
      </span>
      <span v-if="overdue" class="task-card__badge task-card__badge--overdue">已逾期</span>
    </div>

    <div class="task-card__meta">
      <span class="task-card__assignee">{{ task.assignee?.name }}</span>
      <time :datetime="task.dueDate">{{ formatProjectDate(task.dueDate) }}</time>
    </div>
  </article>
</template>

<style scoped>
.task-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); cursor: grab; display: grid; gap: var(--space-2); padding: var(--space-3); position: relative; transition: border-color 160ms ease, opacity 160ms ease, transform 160ms ease; }
.task-card--dragging { border-color: var(--color-accent); cursor: grabbing; opacity: .56; transform: scale(.985); }.task-card__header { align-items: flex-start; display: flex; gap: var(--space-2); justify-content: space-between; }.task-card__header > div:first-child { min-width: 0; }h3, p { margin: 0; }h3 { color: var(--color-text); font-size: .875rem; line-height: 1.45; }.task-card__project { color: var(--color-text-muted); font-size: .75rem; line-height: 1.4; margin-top: var(--space-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.task-card__actions { flex: 0 0 auto; position: relative; }.task-card__action-button { align-items: center; background: transparent; border: 0; border-radius: var(--radius-sm); color: var(--color-text-secondary); display: inline-flex; font-size: 1.25rem; height: 2rem; justify-content: center; line-height: 1; padding: 0; width: 2rem; }.task-card__action-button:hover, .task-card__action-button[aria-expanded='true'] { background: var(--color-surface-subtle); color: var(--color-text); }.task-card__menu { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); display: grid; min-width: 9.5rem; overflow: hidden; padding: var(--space-1); position: absolute; right: 0; top: calc(100% + var(--space-1)); z-index: 2; }.task-card__menu button { background: transparent; border: 0; border-radius: var(--radius-sm); color: var(--color-text-secondary); font: inherit; font-size: .8125rem; min-height: 2.25rem; padding: 0 var(--space-2); text-align: left; }.task-card__menu button:hover:not(:disabled) { background: var(--color-accent-soft); color: var(--color-accent-strong); }.task-card__menu button:disabled { color: var(--color-text-muted); cursor: default; font-weight: 700; }.task-card__badges { display: flex; flex-wrap: wrap; gap: var(--space-1); }.task-card__badge { border-radius: 999px; font-size: .6875rem; font-weight: 700; line-height: 1.25; padding: .2rem var(--space-2); }.task-card__badge--high, .task-card__badge--overdue { background: var(--color-danger-soft); color: var(--color-danger-strong); }.task-card__badge--medium { background: var(--color-warning-soft); color: var(--color-warning-strong); }.task-card__badge--low { background: var(--color-info-soft); color: var(--color-info-strong); }.task-card__meta { align-items: center; color: var(--color-text-muted); display: flex; font-size: .75rem; gap: var(--space-2); justify-content: space-between; line-height: 1.4; }.task-card__assignee { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.task-card__meta time { flex: 0 0 auto; }@media (prefers-reduced-motion: reduce) { .task-card { transition: none; } }
.task-card {
  border-radius: var(--radius-lg);
  gap: var(--space-3);
  padding: var(--space-4);
}

.task-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 6px 16px rgb(15 23 42 / 8%);
  transform: translateY(-1px);
}

.task-card--dragging,
.task-card--dragging:hover {
  box-shadow: none;
  transform: scale(0.985);
}

.task-card__header {
  gap: var(--space-3);
}

h3 {
  font-size: 0.9375rem;
  font-weight: 750;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.task-card__project {
  font-size: 0.75rem;
  margin-top: 0.3125rem;
}

.task-card__action-button {
  cursor: pointer;
  flex: 0 0 2rem;
  font-size: 1.375rem;
}

.task-card__action-button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

.task-card__badges {
  gap: var(--space-2);
}

.task-card__badge {
  border: 1px solid transparent;
  font-size: 0.6875rem;
  letter-spacing: 0.01em;
  padding: 0.21875rem var(--space-2);
}

.task-card__badge--high,
.task-card__badge--overdue {
  border-color: #fecaca;
}

.task-card__badge--medium {
  border-color: #fde68a;
}

.task-card__badge--low {
  border-color: #bfdbfe;
}

.task-card__meta {
  border-top: 1px solid var(--color-border);
  font-size: 0.75rem;
  gap: var(--space-2);
  justify-content: flex-start;
  padding-top: var(--space-2);
}

.task-card__assignee::after {
  color: var(--color-text-muted);
  content: '·';
  margin-left: var(--space-2);
}

.task-card__meta time {
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 30rem) {
  .task-card {
    padding: var(--space-3);
  }
}
</style>
