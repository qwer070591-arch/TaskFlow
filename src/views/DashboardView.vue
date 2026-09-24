<script setup lang="ts">
import DashboardStatCard from '../components/dashboard/DashboardStatCard.vue'
import ProjectProgressList from '../components/dashboard/ProjectProgressList.vue'
import RecentActivityList from '../components/dashboard/RecentActivityList.vue'
import TaskStatusChart from '../components/dashboard/TaskStatusChart.vue'
import TaskTrendChart from '../components/dashboard/TaskTrendChart.vue'
import TeamWorkloadList from '../components/dashboard/TeamWorkloadList.vue'
import UpcomingTaskList from '../components/dashboard/UpcomingTaskList.vue'
import { useDashboardStore } from '../stores/dashboard'

const dashboard = useDashboardStore()
</script>

<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <p class="dashboard__eyebrow">TaskFlow</p>
      <h1>儀表板</h1>
      <p class="dashboard__intro">歡迎回來，這是今天的工作概覽。</p>
    </header>

    <section class="dashboard__stats" aria-labelledby="dashboard-stats-title">
      <h2 id="dashboard-stats-title" class="visually-hidden">工作摘要</h2>
      <DashboardStatCard
        label="進行中專案"
        :value="dashboard.activeProjectCount"
        detail="持續推進本週目標"
        icon="projects"
      />
      <DashboardStatCard
        label="進行中任務"
        :value="dashboard.activeTaskCount"
        detail="待處理、進行中與審核中的任務"
        icon="tasks"
      />
      <DashboardStatCard
        label="逾期任務"
        :value="dashboard.overdueTaskCount"
        detail="需要優先安排處理"
        icon="overdue"
      />
      <DashboardStatCard
        label="任務完成率"
        :value="dashboard.completionRate"
        suffix="%"
        detail="以目前全部任務計算"
        icon="completion"
      />
    </section>

    <div class="dashboard__insights-grid">
      <TaskTrendChart :points="dashboard.completionTrend" />
      <TaskStatusChart :statuses="dashboard.tasksByStatus" />
    </div>

    <div class="dashboard__content-grid">
      <ProjectProgressList :projects="dashboard.projectProgress" />
      <UpcomingTaskList :tasks="dashboard.upcomingTasks" />
    </div>

    <div class="dashboard__content-grid">
      <RecentActivityList :activities="dashboard.recentActivities" />
      <TeamWorkloadList :members="dashboard.teamWorkload" />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  gap: clamp(1.25rem, 2vw, 1.75rem);
}

.dashboard__header {
  padding: var(--space-2) 0 var(--space-3);
}

.dashboard__eyebrow,
h1,
.dashboard__intro {
  margin: 0;
}

.dashboard__eyebrow {
  color: var(--color-accent-strong);
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h1 {
  color: var(--color-text);
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  letter-spacing: -0.045em;
  line-height: 1.1;
  margin-top: var(--space-2);
}

.dashboard__intro {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
  margin-top: var(--space-3);
}

.dashboard__stats {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.dashboard__insights-grid,
.dashboard__content-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
}

.dashboard__content-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 75rem) {
  .dashboard__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 60rem) {
  .dashboard__insights-grid,
  .dashboard__content-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 35rem) {
  .dashboard__stats {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
