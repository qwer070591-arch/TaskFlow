<script setup lang="ts">
import type { DashboardTask, TaskPriority } from '../../types/dashboard'

defineProps<{
  tasks: DashboardTask[]
}>()

const priorityLabels: Record<TaskPriority, string> = {
  low: '低優先',
  medium: '中優先',
  high: '高優先',
}

function formatDueDate(date: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}
</script>

<template>
  <section class="dashboard-panel upcoming-tasks" aria-labelledby="upcoming-tasks-title">
    <div class="dashboard-panel__heading">
      <div>
        <h2 id="upcoming-tasks-title">即將到期任務</h2>
        <p>依到期日排序的待辦事項</p>
      </div>
    </div>

    <ul class="upcoming-tasks__list">
      <li v-for="task in tasks" :key="task.id">
        <div class="upcoming-tasks__title-row">
          <div>
            <h3>{{ task.title }}</h3>
            <p>{{ task.projectName }}</p>
          </div>
          <span :class="`upcoming-tasks__priority upcoming-tasks__priority--${task.priority}`">
            {{ priorityLabels[task.priority] }}
          </span>
        </div>
        <div class="upcoming-tasks__meta">
          <time :datetime="task.dueDate">到期：{{ formatDueDate(task.dueDate) }}</time>
          <span aria-label="負責人">{{ task.assignee.initials }} · {{ task.assignee.name }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.dashboard-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-width: 0;
  padding: var(--space-6);
}

h2,
h3,
p {
  margin: 0;
}

h2 {
  color: var(--color-text);
  font-size: 1rem;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.dashboard-panel__heading p {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
  margin-top: var(--space-1);
}

.upcoming-tasks__list {
  list-style: none;
  margin: var(--space-5) 0 0;
  padding: 0;
}

.upcoming-tasks__list li {
  border-top: 1px solid var(--color-border);
  padding: var(--space-4) 0;
}

.upcoming-tasks__list li:last-child {
  padding-bottom: 0;
}

.upcoming-tasks__title-row {
  align-items: flex-start;
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
}

h3 {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.45;
}

.upcoming-tasks__title-row p {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  line-height: 1.45;
  margin-top: var(--space-1);
}

.upcoming-tasks__priority {
  border-radius: 999px;
  flex: 0 0 auto;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem var(--space-2);
}

.upcoming-tasks__priority--high {
  background: var(--color-danger-soft);
  color: var(--color-danger-strong);
}

.upcoming-tasks__priority--medium {
  background: var(--color-warning-soft);
  color: var(--color-warning-strong);
}

.upcoming-tasks__priority--low {
  background: var(--color-info-soft);
  color: var(--color-info-strong);
}

.upcoming-tasks__meta {
  color: var(--color-text-muted);
  display: flex;
  flex-wrap: wrap;
  font-size: 0.75rem;
  gap: var(--space-3);
  line-height: 1.5;
  margin-top: var(--space-3);
}

@media (max-width: 35rem) {
  .dashboard-panel {
    padding: var(--space-5);
  }
}
</style>
