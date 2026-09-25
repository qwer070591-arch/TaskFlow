<script setup lang="ts">
type StatIcon = 'projects' | 'tasks' | 'overdue' | 'completion'

defineProps<{
  detail: string
  icon: StatIcon
  label: string
  suffix?: string
  value: number
}>()
</script>

<template>
  <article class="dashboard-stat-card">
    <div class="dashboard-stat-card__header">
      <h2>{{ label }}</h2>
      <span class="dashboard-stat-card__icon" aria-hidden="true">
        <svg v-if="icon === 'projects'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M4 6.5A2.5 2.5 0 0 1 6.5 4h4L12 6h5.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-10Z"
            stroke-width="1.8"
          />
        </svg>
        <svg v-else-if="icon === 'tasks'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="m7 12 3 3 7-7M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            stroke-width="1.8"
          />
        </svg>
        <svg v-else-if="icon === 'overdue'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="8.5" stroke-width="1.8" />
          <path d="M12 7.5v5l3.25 2" stroke-width="1.8" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 17.5 9.25 13l3 2.75L19 8.5" stroke-width="1.8" />
          <path d="M15 8.5h4v4" stroke-width="1.8" />
        </svg>
      </span>
    </div>
    <p class="dashboard-stat-card__value">{{ value }}{{ suffix }}</p>
    <p class="dashboard-stat-card__detail">{{ detail }}</p>
  </article>
</template>

<style scoped>
.dashboard-stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-width: 0;
  padding: var(--space-5);
  position: relative;
}

.dashboard-stat-card__header {
  align-items: center;
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
}

h2,
.dashboard-stat-card__value,
.dashboard-stat-card__detail {
  margin: 0;
}

h2 {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1.4;
}

.dashboard-stat-card__icon {
  align-items: center;
  background: var(--color-accent-soft);
  border: 1px solid #dfe5ff;
  border-radius: var(--radius-md);
  color: var(--color-accent-strong);
  display: inline-flex;
  flex: 0 0 auto;
  height: 2.5rem;
  justify-content: center;
  width: 2.5rem;
}

.dashboard-stat-card__icon svg {
  height: 1.25rem;
  width: 1.25rem;
}

.dashboard-stat-card__value {
  color: var(--color-text);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-variant-numeric: tabular-nums;
  font-weight: 750;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-top: var(--space-5);
}

.dashboard-stat-card__detail {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
  margin-top: var(--space-2);
}

@media (max-width: 35rem) {
  .dashboard-stat-card {
    padding: var(--space-4);
  }
}
</style>
