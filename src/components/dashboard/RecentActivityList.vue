<script setup lang="ts">
import type { ActivityType, DashboardActivity } from '../../types/dashboard'

defineProps<{
  activities: DashboardActivity[]
}>()

const activityTypeLabels: Record<ActivityType, string> = {
  completed: '完成',
  created: '建立',
  updated: '更新',
  moved: '移動',
}

function formatActivityTime(timestamp: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Taipei',
  }).format(new Date(timestamp))
}
</script>

<template>
  <section class="dashboard-panel recent-activity" aria-labelledby="recent-activity-title">
    <div class="dashboard-panel__heading">
      <div>
        <h2 id="recent-activity-title">最近動態</h2>
        <p>團隊剛剛完成的工作</p>
      </div>
    </div>

    <ul class="recent-activity__list">
      <li v-for="activity in activities" :key="activity.id">
        <span class="recent-activity__avatar" aria-hidden="true">{{ activity.member.initials }}</span>
        <div class="recent-activity__content">
          <p>
            <strong>{{ activity.member.name }}</strong>
            {{ activity.message }}
          </p>
          <time :datetime="activity.timestamp">
            {{ activityTypeLabels[activity.type] }} · {{ formatActivityTime(activity.timestamp) }}
          </time>
        </div>
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

.recent-activity__list {
  display: grid;
  gap: var(--space-5);
  list-style: none;
  margin: var(--space-6) 0 0;
  padding: 0;
}

.recent-activity__list li {
  align-items: flex-start;
  display: flex;
  gap: var(--space-3);
}

.recent-activity__avatar {
  align-items: center;
  background: var(--color-accent-soft);
  border-radius: 50%;
  color: var(--color-accent-strong);
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 0.75rem;
  font-weight: 750;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}

.recent-activity__content {
  min-width: 0;
}

.recent-activity__content p {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  line-height: 1.55;
}

strong {
  color: var(--color-text);
  font-weight: 750;
}

time {
  color: var(--color-text-muted);
  display: block;
  font-size: 0.75rem;
  line-height: 1.5;
  margin-top: var(--space-1);
}

@media (max-width: 35rem) {
  .dashboard-panel {
    padding: var(--space-5);
  }
}
</style>
