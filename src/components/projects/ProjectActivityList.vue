<script setup lang="ts">
import type { DashboardActivity } from '../../types/dashboard'
defineProps<{ activities: DashboardActivity[] }>()
</script>

<template>
  <section class="detail-panel" aria-labelledby="project-activity-title">
    <header><h2 id="project-activity-title">最近活動</h2><p>與此專案相關的最新動態。</p></header>
    <p v-if="!activities.length" class="empty-message">此專案目前尚無最近活動。</p>
    <ul v-else class="activity-list"><li v-for="activity in activities" :key="activity.id"><span aria-hidden="true">{{ activity.member.initials }}</span><p><strong>{{ activity.member.name }}</strong>{{ activity.message }}</p></li></ul>
  </section>
</template>

<style scoped>
.detail-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: var(--space-6); }header h2, header p, p { margin: 0; }h2 { color: var(--color-text); font-size: 1rem; }header p, .empty-message { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-1); }.activity-list { display: grid; gap: var(--space-4); list-style: none; margin: var(--space-5) 0 0; padding: 0; }.activity-list li { align-items: flex-start; display: flex; gap: var(--space-3); }.activity-list li > span { align-items: center; background: var(--color-surface-subtle); border-radius: 50%; color: var(--color-text-secondary); display: inline-flex; flex: 0 0 auto; font-size: .75rem; font-weight: 750; height: 2rem; justify-content: center; width: 2rem; }.activity-list p { color: var(--color-text-secondary); font-size: .8125rem; line-height: 1.55; }.activity-list strong { color: var(--color-text); margin-right: .25rem; }@media (max-width: 40rem) { .detail-panel { padding: var(--space-5); } }
</style>
