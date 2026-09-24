<script setup lang="ts">
import type { ProjectTask } from '../../types/dashboard'
import { formatProjectDate } from '../../utils/project'
import { taskPriorityLabels, taskStatusLabels } from '../../utils/task'

defineProps<{ tasks: ProjectTask[] }>()
</script>

<template>
  <section class="detail-panel" aria-labelledby="project-tasks-title">
    <header><h2 id="project-tasks-title">專案任務</h2><p>目前與此專案相關的任務。</p></header>
    <p v-if="!tasks.length" class="empty-message">此專案目前尚無任務。</p>
    <ul v-else class="task-list">
      <li v-for="task in tasks" :key="task.id">
        <div><h3>{{ task.title }}</h3><span>{{ taskStatusLabels[task.status] }} · {{ taskPriorityLabels[task.priority] }}優先</span></div>
        <p><span>負責人</span>{{ task.assignee?.name ?? '未指派' }}</p>
        <p><span>截止日期</span><time :datetime="task.dueDate">{{ formatProjectDate(task.dueDate) }}</time></p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.detail-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: var(--space-6); }
header h2, header p, h3, p { margin: 0; }
h2 { color: var(--color-text); font-size: 1rem; }
header p, .empty-message { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-1); }
.task-list { list-style: none; margin: var(--space-5) 0 0; padding: 0; }
.task-list li { align-items: center; border-top: 1px solid var(--color-border); display: grid; gap: var(--space-3); grid-template-columns: minmax(0, 1fr) 8rem 8rem; padding: var(--space-4) 0; }
.task-list li:last-child { padding-bottom: 0; }
h3 { color: var(--color-text-secondary); font-size: .875rem; }
.task-list div > span, .task-list p { color: var(--color-text-muted); font-size: .75rem; line-height: 1.5; }
.task-list div > span { display: block; margin-top: var(--space-1); }
.task-list p span { display: none; }
@media (max-width: 40rem) { .detail-panel { padding: var(--space-5); } .task-list li { align-items: start; grid-template-columns: minmax(0, 1fr); } .task-list p { display: flex; gap: var(--space-2); } .task-list p span { color: var(--color-text-secondary); display: inline; font-weight: 700; } }
</style>
