<script setup lang="ts">
import type { Project } from '../../types/dashboard'
import { projectStatusLabels } from '../../utils/project'

defineProps<{
  projects: Project[]
}>()

</script>

<template>
  <section class="dashboard-panel project-progress" aria-labelledby="project-progress-title">
    <div class="dashboard-panel__heading">
      <div>
        <h2 id="project-progress-title">專案進度</h2>
        <p>主要專案的目前完成度</p>
      </div>
    </div>

    <ul class="project-progress__list">
      <li v-for="project in projects" :key="project.id">
        <div class="project-progress__project-row">
          <div>
            <h3>{{ project.name }}</h3>
            <span :class="`project-progress__status project-progress__status--${project.status}`">
              {{ projectStatusLabels[project.status] }}
            </span>
          </div>
          <strong>{{ project.progress }}%</strong>
        </div>
        <progress
          class="project-progress__bar"
          :value="project.progress"
          max="100"
          :aria-label="`${project.name}完成度 ${project.progress}%`"
        >
          {{ project.progress }}%
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

.project-progress__list {
  display: grid;
  gap: var(--space-6);
  list-style: none;
  margin: var(--space-7) 0 0;
  padding: 0;
}

.project-progress__project-row {
  align-items: flex-start;
  display: flex;
  gap: var(--space-4);
  justify-content: space-between;
}

h3 {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.4;
}

.project-progress__status {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 650;
  margin-top: var(--space-1);
}

.project-progress__status--planning {
  color: var(--color-info-strong);
}

.project-progress__status--active {
  color: var(--color-success-strong);
}

.project-progress__status--completed {
  color: var(--color-accent-strong);
}

.project-progress__status--on-hold {
  color: var(--color-warning-strong);
}

strong {
  color: var(--color-text);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.project-progress__bar {
  appearance: none;
  border: 0;
  display: block;
  height: 0.5rem;
  margin-top: var(--space-3);
  overflow: hidden;
  width: 100%;
}

.project-progress__bar::-webkit-progress-bar {
  background: var(--color-surface-subtle);
  border-radius: 999px;
}

.project-progress__bar::-webkit-progress-value {
  background: var(--color-accent);
  border-radius: 999px;
}

.project-progress__bar::-moz-progress-bar {
  background: var(--color-accent);
  border-radius: 999px;
}

@media (max-width: 35rem) {
  .dashboard-panel {
    padding: var(--space-5);
  }
}
</style>
