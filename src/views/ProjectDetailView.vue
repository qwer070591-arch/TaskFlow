<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import ProjectActivityList from '../components/projects/ProjectActivityList.vue'
import ProjectMemberList from '../components/projects/ProjectMemberList.vue'
import ProjectTaskList from '../components/projects/ProjectTaskList.vue'
import { dashboardReferenceDate } from '../data/dashboard'
import { useProjectStore } from '../stores/project'
import { formatProjectDate, getProjectHealth, projectHealthLabels, projectStatusLabels } from '../utils/project'

const route = useRoute()
const projectStore = useProjectStore()
const projectId = computed(() => String(route.params.id))
const project = computed(() => projectStore.getProjectById(projectId.value))
const overview = computed(() => projectStore.getOverviewByProject(projectId.value))
const tasks = computed(() => projectStore.getTasksByProject(projectId.value))
const members = computed(() => projectStore.getMembersByProject(projectId.value))
const activities = computed(() => projectStore.getActivitiesByProject(projectId.value))
const health = computed(() =>
  project.value
    ? getProjectHealth(project.value.status, project.value.dueDate, dashboardReferenceDate)
    : undefined,
)
</script>

<template>
  <div v-if="project && overview" class="project-detail">
    <RouterLink class="project-detail__back" to="/projects">← 返回專案</RouterLink>
    <header class="project-detail__header">
      <div>
        <span :class="`project-detail__status project-detail__status--${project.status}`">{{ projectStatusLabels[project.status] }}</span>
        <h1>{{ project.name }}</h1>
        <p>{{ project.description }}</p>
      </div>
      <div class="project-detail__health">
        <span>專案健康度</span>
        <strong :class="`project-detail__health-value--${health}`">{{ health ? projectHealthLabels[health] : '' }}</strong>
      </div>
    </header>

    <section class="project-detail__facts" aria-label="專案基本資訊">
      <div><span>開始日期</span><time :datetime="project.startDate">{{ formatProjectDate(project.startDate) }}</time></div>
      <div><span>截止日期</span><time :datetime="project.dueDate">{{ formatProjectDate(project.dueDate) }}</time></div>
      <div class="project-detail__progress"><span>專案進度</span><strong>{{ project.progress }}%</strong><progress :value="project.progress" max="100" :aria-label="`${project.name}完成度 ${project.progress}%`">{{ project.progress }}%</progress></div>
    </section>

    <section class="project-detail__overview" aria-labelledby="project-overview-title">
      <h2 id="project-overview-title" class="visually-hidden">專案總覽</h2>
      <dl><div><dt>任務總數</dt><dd>{{ overview.totalTaskCount }}</dd></div><div><dt>已完成任務</dt><dd>{{ overview.completedTaskCount }}</dd></div><div><dt>進行中任務</dt><dd>{{ overview.activeTaskCount }}</dd></div><div><dt>專案成員數</dt><dd>{{ overview.memberCount }}</dd></div></dl>
    </section>

    <ProjectTaskList :tasks="tasks" />
    <div class="project-detail__secondary-grid"><ProjectMemberList :members="members" /><ProjectActivityList :activities="activities" /></div>
  </div>

  <section v-else class="project-not-found" aria-labelledby="project-not-found-title">
    <h1 id="project-not-found-title">找不到此專案</h1>
    <p>此專案可能不存在，或已不再提供檢視。</p>
    <RouterLink to="/projects">返回專案列表</RouterLink>
  </section>
</template>

<style scoped>
.project-detail { display: grid; gap: var(--space-5); }.project-detail__back { color: var(--color-accent-strong); font-size: .875rem; font-weight: 700; text-decoration: none; width: fit-content; }.project-detail__back:hover { text-decoration: underline; }.project-detail__header { align-items: flex-start; display: flex; gap: var(--space-5); justify-content: space-between; }.project-detail__status { border-radius: 999px; display: inline-block; font-size: .6875rem; font-weight: 750; padding: .25rem var(--space-2); }.project-detail__status--planning { background: var(--color-info-soft); color: var(--color-info-strong); }.project-detail__status--active { background: #f0fdf4; color: var(--color-success-strong); }.project-detail__status--completed { background: var(--color-accent-soft); color: var(--color-accent-strong); }.project-detail__status--on-hold { background: var(--color-warning-soft); color: var(--color-warning-strong); }h1, h2, p { margin: 0; }h1 { color: var(--color-text); font-size: clamp(1.875rem, 4vw, 2.5rem); letter-spacing: -.045em; line-height: 1.1; margin-top: var(--space-3); }.project-detail__header p { color: var(--color-text-secondary); line-height: 1.65; margin-top: var(--space-3); max-width: 42rem; }.project-detail__health { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); display: grid; flex: 0 0 auto; gap: var(--space-1); padding: var(--space-3) var(--space-4); }.project-detail__health span { color: var(--color-text-muted); font-size: .6875rem; font-weight: 700; }.project-detail__health strong { font-size: .8125rem; }.project-detail__health-value--normal { color: var(--color-success-strong); }.project-detail__health-value--upcoming, .project-detail__health-value--on-hold { color: var(--color-warning-strong); }.project-detail__health-value--overdue { color: var(--color-danger-strong); }.project-detail__health-value--completed { color: var(--color-accent-strong); }.project-detail__facts, .project-detail__overview { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: grid; gap: var(--space-5); grid-template-columns: repeat(3, minmax(0, 1fr)); padding: var(--space-5); }.project-detail__facts div { display: grid; gap: var(--space-1); }.project-detail__facts span, dt { color: var(--color-text-muted); font-size: .75rem; font-weight: 700; }.project-detail__facts time, .project-detail__facts strong { color: var(--color-text-secondary); font-size: .875rem; }.project-detail__progress { grid-template-columns: auto 1fr; }.project-detail__progress progress { appearance: none; border: 0; grid-column: 1 / -1; height: .5rem; overflow: hidden; width: 100%; }.project-detail__progress progress::-webkit-progress-bar { background: var(--color-surface-subtle); border-radius: 999px; }.project-detail__progress progress::-webkit-progress-value { background: var(--color-accent); border-radius: 999px; }.project-detail__progress progress::-moz-progress-bar { background: var(--color-accent); border-radius: 999px; }.project-detail__overview dl { display: grid; gap: var(--space-4); grid-column: 1 / -1; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 0; }.project-detail__overview dd { color: var(--color-text); font-size: 1.5rem; font-variant-numeric: tabular-nums; font-weight: 750; margin: var(--space-1) 0 0; }.project-detail__secondary-grid { display: grid; gap: var(--space-5); grid-template-columns: repeat(2, minmax(0, 1fr)); }.project-not-found { background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg); padding: clamp(2rem, 8vw, 4rem); text-align: center; }.project-not-found p { color: var(--color-text-muted); margin-top: var(--space-3); }.project-not-found a { color: var(--color-accent-strong); display: inline-block; font-weight: 700; margin-top: var(--space-5); }@media (max-width: 50rem) { .project-detail__facts, .project-detail__secondary-grid { grid-template-columns: minmax(0, 1fr); }.project-detail__overview dl { grid-template-columns: repeat(2, minmax(0, 1fr)); } }@media (max-width: 35rem) { .project-detail__header { flex-direction: column; }.project-detail__facts { padding: var(--space-4); }.project-detail__overview dl { grid-template-columns: minmax(0, 1fr); } }
</style>
