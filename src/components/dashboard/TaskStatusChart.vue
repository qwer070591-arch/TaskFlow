<script setup lang="ts">
import type { TaskStatus, TaskStatusSummary } from '../../types/dashboard'

defineProps<{
  statuses: TaskStatusSummary[]
}>()

const statusLabels: Record<TaskStatus, string> = {
  todo: '待處理',
  'in-progress': '進行中',
  review: '審核中',
  done: '已完成',
}
</script>

<template>
  <section class="dashboard-panel task-status" aria-labelledby="task-status-title">
    <div class="dashboard-panel__heading">
      <div>
        <h2 id="task-status-title">任務狀態</h2>
        <p>依目前工作流程分布</p>
      </div>
    </div>

    <ul class="task-status__list">
      <li v-for="item in statuses" :key="item.status">
        <div class="task-status__label-row">
          <span class="task-status__label">
            <span
              class="task-status__marker"
              :class="`task-status__marker--${item.status}`"
              aria-hidden="true"
            ></span>
            {{ statusLabels[item.status] }}
          </span>
          <span class="task-status__value">{{ item.count }} 項 · {{ item.percentage }}%</span>
        </div>
        <progress
          :class="`task-status__progress task-status__progress--${item.status}`"
          :value="item.percentage"
          max="100"
          :aria-label="`${statusLabels[item.status]}任務占比 ${item.percentage}%`"
        >
          {{ item.percentage }}%
        </progress>
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

.task-status__list {
  display: grid;
  gap: var(--space-5);
  list-style: none;
  margin: var(--space-7) 0 0;
  padding: 0;
}

.task-status__label-row {
  align-items: center;
  display: flex;
  font-size: 0.8125rem;
  gap: var(--space-3);
  justify-content: space-between;
}

.task-status__label {
  align-items: center;
  color: var(--color-text-secondary);
  display: inline-flex;
  font-weight: 650;
  gap: var(--space-2);
}

.task-status__marker {
  border-radius: 50%;
  height: 0.625rem;
  width: 0.625rem;
}

.task-status__marker--todo {
  background: var(--color-status-neutral);
}

.task-status__marker--in-progress {
  background: var(--color-info);
}

.task-status__marker--review {
  background: var(--color-warning);
}

.task-status__marker--done {
  background: var(--color-success);
}

.task-status__value {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.task-status__progress {
  appearance: none;
  border: 0;
  display: block;
  height: 0.5rem;
  margin-top: var(--space-2);
  overflow: hidden;
  width: 100%;
}

.task-status__progress::-webkit-progress-bar {
  background: var(--color-surface-subtle);
  border-radius: 999px;
}

.task-status__progress::-webkit-progress-value,
.task-status__progress::-moz-progress-bar {
  border-radius: 999px;
}

.task-status__progress--todo::-webkit-progress-value,
.task-status__progress--todo::-moz-progress-bar {
  background: var(--color-status-neutral);
}

.task-status__progress--in-progress::-webkit-progress-value,
.task-status__progress--in-progress::-moz-progress-bar {
  background: var(--color-info);
}

.task-status__progress--review::-webkit-progress-value,
.task-status__progress--review::-moz-progress-bar {
  background: var(--color-warning);
}

.task-status__progress--done::-webkit-progress-value,
.task-status__progress--done::-moz-progress-bar {
  background: var(--color-success);
}

@media (max-width: 35rem) {
  .dashboard-panel {
    padding: var(--space-5);
  }
}
</style>
