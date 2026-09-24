<script setup lang="ts">
import type { TeamMemberOverview } from '../../types/dashboard'
import { getWorkloadLevel, workloadLabels } from '../../utils/team'

const props = defineProps<{ overview: TeamMemberOverview }>()
const emit = defineEmits<{ open: [memberId: string] }>()

const workloadLevel = getWorkloadLevel(props.overview.member.workload)
</script>

<template>
  <article class="team-member-card">
    <header>
      <span class="team-member-card__avatar" aria-hidden="true">{{ overview.member.initials }}</span>
      <div>
        <h2>{{ overview.member.name }}</h2>
        <p>{{ overview.member.role }}</p>
      </div>
    </header>

    <dl class="team-member-card__facts">
      <div><dt>進行中專案</dt><dd>{{ overview.activeProjectCount }}</dd></div>
      <div><dt>進行中任務</dt><dd>{{ overview.activeTaskCount }}</dd></div>
    </dl>

    <section class="team-member-card__workload" :aria-label="`${overview.member.name} 工作負載`">
      <div><span>工作負載</span><strong :class="`team-member-card__workload-value--${workloadLevel}`">{{ overview.member.workload }}% · {{ workloadLabels[workloadLevel] }}</strong></div>
      <progress :value="overview.member.workload" max="100">{{ overview.member.workload }}%</progress>
    </section>

    <footer>
      <p>已完成 {{ overview.completedTaskCount }} / {{ overview.totalTaskCount }} 任務</p>
      <button :data-member-detail-trigger="overview.member.id" type="button" :aria-label="`查看 ${overview.member.name} 詳情`" @click="emit('open', overview.member.id)">查看詳情</button>
    </footer>
  </article>
</template>

<style scoped>
.team-member-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: grid; gap: var(--space-4); padding: var(--space-5); }.team-member-card header { align-items: center; display: flex; gap: var(--space-3); }.team-member-card__avatar { align-items: center; background: var(--color-accent-soft); border: 2px solid var(--color-surface); border-radius: 50%; color: var(--color-accent-strong); display: inline-flex; flex: 0 0 auto; font-size: .8125rem; font-weight: 750; height: 2.75rem; justify-content: center; width: 2.75rem; }h2, p { margin: 0; }h2 { color: var(--color-text); font-size: 1rem; }header p, footer p { color: var(--color-text-muted); font-size: .75rem; margin-top: var(--space-1); }.team-member-card__facts { display: grid; gap: var(--space-3); grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; }dt { color: var(--color-text-muted); font-size: .6875rem; font-weight: 700; }dd { color: var(--color-text); font-size: 1.125rem; font-variant-numeric: tabular-nums; margin: var(--space-1) 0 0; }.team-member-card__workload { display: grid; gap: var(--space-2); }.team-member-card__workload > div { align-items: center; color: var(--color-text-secondary); display: flex; font-size: .75rem; justify-content: space-between; }.team-member-card__workload strong { font-size: .75rem; }.team-member-card__workload-value--low { color: var(--color-success-strong); }.team-member-card__workload-value--normal { color: var(--color-info-strong); }.team-member-card__workload-value--high { color: var(--color-danger-strong); }progress { appearance: none; border: 0; height: .5rem; overflow: hidden; width: 100%; }progress::-webkit-progress-bar { background: var(--color-surface-subtle); border-radius: 999px; }progress::-webkit-progress-value { background: var(--color-info); border-radius: 999px; }progress::-moz-progress-bar { background: var(--color-info); border-radius: 999px; }.team-member-card:has(.team-member-card__workload-value--low) progress::-webkit-progress-value { background: var(--color-success); }.team-member-card:has(.team-member-card__workload-value--low) progress::-moz-progress-bar { background: var(--color-success); }.team-member-card:has(.team-member-card__workload-value--high) progress::-webkit-progress-value { background: var(--color-danger-strong); }.team-member-card:has(.team-member-card__workload-value--high) progress::-moz-progress-bar { background: var(--color-danger-strong); }footer { align-items: center; border-top: 1px solid var(--color-border); display: flex; gap: var(--space-3); justify-content: space-between; padding-top: var(--space-3); }footer p { margin: 0; }button { background: transparent; border: 0; border-radius: var(--radius-sm); color: var(--color-accent-strong); font: inherit; font-size: .8125rem; font-weight: 700; min-height: 2.5rem; padding: 0 var(--space-2); }button:hover { background: var(--color-accent-soft); }@media (max-width: 30rem) { .team-member-card { padding: var(--space-4); } }
</style>
