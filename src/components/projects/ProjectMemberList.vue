<script setup lang="ts">
import type { TeamMember } from '../../types/dashboard'
defineProps<{ members: TeamMember[] }>()
</script>

<template>
  <section class="detail-panel" aria-labelledby="project-members-title">
    <header><h2 id="project-members-title">專案成員</h2><p>參與此專案的協作夥伴。</p></header>
    <p v-if="!members.length" class="empty-message">此專案目前尚未指派成員。</p>
    <ul v-else class="member-list"><li v-for="member in members" :key="member.id"><span aria-hidden="true">{{ member.initials }}</span><div><h3>{{ member.name }}</h3><p>{{ member.role }}</p></div></li></ul>
  </section>
</template>

<style scoped>
.detail-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: var(--space-6); }
header h2, header p, h3, p { margin: 0; } h2 { color: var(--color-text); font-size: 1rem; } header p, .empty-message, .member-list p { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-1); }
.member-list { display: grid; gap: var(--space-4); list-style: none; margin: var(--space-5) 0 0; padding: 0; }.member-list li { align-items: center; display: flex; gap: var(--space-3); }.member-list li > span { align-items: center; background: var(--color-accent-soft); border-radius: 50%; color: var(--color-accent-strong); display: inline-flex; font-size: .75rem; font-weight: 750; height: 2.25rem; justify-content: center; width: 2.25rem; }h3 { color: var(--color-text-secondary); font-size: .875rem; }@media (max-width: 40rem) { .detail-panel { padding: var(--space-5); } }
</style>
