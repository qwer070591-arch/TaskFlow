<script setup lang="ts">
import type { Project } from '../../types/dashboard'
import { formatProjectDate, projectStatusLabels } from '../../utils/project'

defineProps<{ projects: Project[] }>()
</script>

<template>
  <section class="customer-project-list" aria-labelledby="customer-projects-title">
    <header><h2 id="customer-projects-title">相關專案</h2><p>與此客戶建立關聯的專案</p></header>
    <p v-if="!projects.length" class="customer-project-list__empty">目前沒有相關專案。</p>
    <ul v-else>
      <li v-for="project in projects" :key="project.id">
        <div class="customer-project-list__content"><span :class="`customer-project-list__status customer-project-list__status--${project.status}`">{{ projectStatusLabels[project.status] }}</span><h3>{{ project.name }}</h3><div class="customer-project-list__meta"><span>進度 {{ project.progress }}%</span><time :datetime="project.dueDate">截止 {{ formatProjectDate(project.dueDate) }}</time></div><progress :value="project.progress" max="100" :aria-label="`${project.name} 進度 ${project.progress}%`">{{ project.progress }}%</progress></div>
        <RouterLink :to="`/projects/${project.id}`" :aria-label="`查看 ${project.name} 專案`">查看專案</RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.customer-project-list { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: var(--space-6); }header h2, header p, h3 { margin: 0; }h2 { color: var(--color-text); font-size: 1rem; }header p, .customer-project-list__empty { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-1); }.customer-project-list ul { display: grid; gap: var(--space-3); list-style: none; margin: var(--space-5) 0 0; padding: 0; }.customer-project-list li { align-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-md); display: flex; gap: var(--space-4); justify-content: space-between; padding: var(--space-4); }.customer-project-list__content { min-width: 0; }.customer-project-list__status { border-radius: 999px; display: inline-block; font-size: .6875rem; font-weight: 750; padding: .2rem var(--space-2); }.customer-project-list__status--planning { background: var(--color-info-soft); color: var(--color-info-strong); }.customer-project-list__status--active { background: #f0fdf4; color: var(--color-success-strong); }.customer-project-list__status--completed { background: var(--color-accent-soft); color: var(--color-accent-strong); }.customer-project-list__status--on-hold { background: var(--color-warning-soft); color: var(--color-warning-strong); }h3 { color: var(--color-text); font-size: .9375rem; margin-top: var(--space-2); }.customer-project-list__meta { color: var(--color-text-muted); display: flex; flex-wrap: wrap; font-size: .75rem; gap: var(--space-3); margin-top: var(--space-2); }progress { appearance: none; border: 0; display: block; height: .4rem; margin-top: var(--space-3); overflow: hidden; width: 100%; }progress::-webkit-progress-bar { background: var(--color-surface-subtle); border-radius: 999px; }progress::-webkit-progress-value { background: var(--color-accent); border-radius: 999px; }progress::-moz-progress-bar { background: var(--color-accent); border-radius: 999px; }a { color: var(--color-accent-strong); flex: 0 0 auto; font-size: .8125rem; font-weight: 750; text-decoration: none; }a:hover { text-decoration: underline; }a:focus-visible { border-radius: var(--radius-sm); outline: 3px solid #c7d2fe; outline-offset: 3px; }@media (max-width: 40rem) { .customer-project-list { padding: var(--space-5); }.customer-project-list li { align-items: flex-start; flex-direction: column; }.customer-project-list li > a { min-height: 2.75rem; display: inline-flex; align-items: center; } }
</style>
