<script setup lang="ts">
import type { TeamWorkload } from '../../types/dashboard'

defineProps<{
  members: TeamWorkload[]
}>()
</script>

<template>
  <section class="dashboard-panel team-workload" aria-labelledby="team-workload-title">
    <div class="dashboard-panel__heading">
      <div>
        <h2 id="team-workload-title">團隊工作量</h2>
        <p>目前進行中任務與可用容量</p>
      </div>
    </div>

    <ul class="team-workload__list">
      <li v-for="member in members" :key="member.id">
        <div class="team-workload__member-row">
          <span class="team-workload__avatar" aria-hidden="true">{{ member.initials }}</span>
          <div class="team-workload__member-details">
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }} · {{ member.activeTaskCount }} 項進行中任務</p>
          </div>
          <strong>{{ member.workload }}%</strong>
        </div>
        <progress
          class="team-workload__bar"
          :value="member.workload"
          max="100"
          :aria-label="`${member.name}工作量 ${member.workload}%`"
        >
          {{ member.workload }}%
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

.team-workload__list {
  display: grid;
  gap: var(--space-5);
  list-style: none;
  margin: var(--space-6) 0 0;
  padding: 0;
}

.team-workload__member-row {
  align-items: center;
  display: flex;
  gap: var(--space-3);
}

.team-workload__avatar {
  align-items: center;
  background: var(--color-surface-subtle);
  border-radius: 50%;
  color: var(--color-text-secondary);
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 0.75rem;
  font-weight: 750;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}

.team-workload__member-details {
  min-width: 0;
}

h3 {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 750;
  line-height: 1.4;
}

.team-workload__member-details p {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  line-height: 1.45;
  margin-top: var(--space-1);
}

strong {
  color: var(--color-text);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  margin-left: auto;
}

.team-workload__bar {
  appearance: none;
  border: 0;
  display: block;
  height: 0.5rem;
  margin-top: var(--space-3);
  overflow: hidden;
  width: 100%;
}

.team-workload__bar::-webkit-progress-bar {
  background: var(--color-surface-subtle);
  border-radius: 999px;
}

.team-workload__bar::-webkit-progress-value {
  background: var(--color-info);
  border-radius: 999px;
}

.team-workload__bar::-moz-progress-bar {
  background: var(--color-info);
  border-radius: 999px;
}

@media (max-width: 35rem) {
  .dashboard-panel {
    padding: var(--space-5);
  }
}
</style>
