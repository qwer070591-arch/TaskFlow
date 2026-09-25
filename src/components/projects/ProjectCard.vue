<script setup lang="ts">
import type { ProjectSummary } from '../../types/dashboard'
import { formatProjectDate, projectStatusLabels } from '../../utils/project'

defineProps<{
  project: ProjectSummary
}>()
</script>

<template>
  <article class="project-card">
    <div class="project-card__header">
      <div>
        <span :class="`project-card__status project-card__status--${project.status}`">
          {{ projectStatusLabels[project.status] }}
        </span>
        <h2>{{ project.name }}</h2>
      </div>
      <strong>{{ project.progress }}%</strong>
    </div>
    <p class="project-card__description">{{ project.description }}</p>

    <progress
      class="project-card__progress"
      :value="project.progress"
      max="100"
      :aria-label="`${project.name}完成度 ${project.progress}%`"
    >
      {{ project.progress }}%
    </progress>

    <div class="project-card__details">
      <p>
        <span>任務</span>
        {{ project.completedTaskCount }} / {{ project.totalTaskCount }} 項已完成
      </p>
      <p>
        <span>截止日期</span>
        <time :datetime="project.dueDate">{{ formatProjectDate(project.dueDate) }}</time>
      </p>
    </div>

    <div class="project-card__members">
      <span>專案成員</span>
      <ul :aria-label="`${project.name}專案成員`">
        <li v-for="member in project.members" :key="member.id" :aria-label="member.name">
          {{ member.initials }}
        </li>
      </ul>
    </div>
    <RouterLink class="project-card__link" :to="`/projects/${project.id}`">查看專案</RouterLink>
  </article>
</template>

<style scoped>
.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-width: 0;
  padding: var(--space-6);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.project-card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-md);
}

.project-card__header {
  align-items: flex-start;
  display: flex;
  gap: var(--space-4);
  justify-content: space-between;
}

h2,
p {
  margin: 0;
}

h2 {
  color: var(--color-text);
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  line-height: 1.35;
  margin-top: var(--space-2);
}

strong {
  color: var(--color-text);
  font-size: 1.125rem;
  font-variant-numeric: tabular-nums;
}

.project-card__status {
  border-radius: 999px;
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 750;
  padding: 0.25rem var(--space-2);
}

.project-card__status--planning {
  background: var(--color-info-soft);
  color: var(--color-info-strong);
}

.project-card__status--active {
  background: #f0fdf4;
  color: var(--color-success-strong);
}

.project-card__status--completed {
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
}

.project-card__status--on-hold {
  background: var(--color-warning-soft);
  color: var(--color-warning-strong);
}

.project-card__description {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.65;
  margin-top: var(--space-4);
}

.project-card__progress {
  appearance: none;
  border: 0;
  display: block;
  height: 0.5625rem;
  margin-top: var(--space-5);
  overflow: hidden;
  width: 100%;
}

.project-card__progress::-webkit-progress-bar {
  background: var(--color-surface-subtle);
  border-radius: 999px;
}

.project-card__progress::-webkit-progress-value {
  background: var(--color-accent);
  border-radius: 999px;
}

.project-card__progress::-moz-progress-bar {
  background: var(--color-accent);
  border-radius: 999px;
}

.project-card__details {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: var(--space-5);
}

.project-card__details p,
.project-card__members > span {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.project-card__details span,
.project-card__members > span {
  color: var(--color-text-muted);
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.project-card__members {
  align-items: center;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
  margin-top: var(--space-5);
  padding-top: var(--space-4);
}

.project-card__members > span {
  margin: 0;
}

.project-card__members ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.project-card__members li {
  align-items: center;
  background: var(--color-accent-soft);
  border: 2px solid var(--color-surface);
  border-radius: 50%;
  color: var(--color-accent-strong);
  display: inline-flex;
  font-size: 0.625rem;
  font-weight: 750;
  height: 2rem;
  justify-content: center;
  margin-left: -0.4rem;
  width: 2rem;
}

.project-card__members li:first-child {
  margin-left: 0;
}

.project-card__link {
  color: var(--color-accent-strong);
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 750;
  margin-top: var(--space-5);
  text-decoration: none;
}

.project-card__link:hover {
  text-decoration: underline;
}

.project-card__link:focus-visible {
  border-radius: var(--radius-sm);
}

@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition: none;
  }
}

@media (max-width: 31rem) {
  .project-card {
    padding: var(--space-5);
  }
}
</style>
