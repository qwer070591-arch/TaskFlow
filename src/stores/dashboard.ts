import { computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import { dashboardReferenceDate } from '../data/dashboard'
import type {
  CompletionTrendPoint,
  DashboardActivity,
  DashboardTask,
  TaskStatus,
  TaskStatusSummary,
  TeamWorkload,
} from '../types/dashboard'
import { useProjectStore } from './project'

const taskStatusOrder: TaskStatus[] = ['todo', 'in-progress', 'review', 'done']

function getDateKey(date: Date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export const useDashboardStore = defineStore('dashboard', () => {
  const projectStore = useProjectStore()
  const { activities, projects, tasks, teamMembers } = storeToRefs(projectStore)

  const dashboardTasks = computed<DashboardTask[]>(() =>
    tasks.value.flatMap((task) => {
      const project = projects.value.find((item) => item.id === task.projectId)
      const assignee = teamMembers.value.find((member) => member.id === task.assigneeId)

      return project && assignee ? [{ ...task, projectName: project.name, assignee }] : []
    }),
  )

  const activeProjectCount = computed(
    () => projects.value.filter((project) => project.status === 'active').length,
  )
  const activeTaskCount = computed(
    () => tasks.value.filter((task) => task.status !== 'done').length,
  )
  const overdueTaskCount = computed(
    () =>
      tasks.value.filter(
        (task) => task.status !== 'done' && task.dueDate < dashboardReferenceDate,
      ).length,
  )
  const completionRate = computed(() => {
    if (tasks.value.length === 0) return 0

    const completedTaskCount = tasks.value.filter((task) => task.status === 'done').length
    return Math.round((completedTaskCount / tasks.value.length) * 100)
  })

  const tasksByStatus = computed<TaskStatusSummary[]>(() =>
    taskStatusOrder.map((status) => {
      const count = tasks.value.filter((task) => task.status === status).length

      return {
        status,
        count,
        percentage: tasks.value.length === 0 ? 0 : Math.round((count / tasks.value.length) * 100),
      }
    }),
  )

  const upcomingTasks = computed(() =>
    [...dashboardTasks.value]
      .filter((task) => task.status !== 'done' && task.dueDate >= dashboardReferenceDate)
      .sort((firstTask, secondTask) => firstTask.dueDate.localeCompare(secondTask.dueDate))
      .slice(0, 4),
  )

  const projectProgress = computed(() =>
    [...projects.value].sort((firstProject, secondProject) => secondProject.progress - firstProject.progress),
  )

  const recentActivities = computed<DashboardActivity[]>(() =>
    activities.value.flatMap((activity) => {
      const member = teamMembers.value.find((item) => item.id === activity.memberId)

      return member ? [{ ...activity, member }] : []
    }),
  )

  const teamWorkload = computed<TeamWorkload[]>(() =>
    teamMembers.value.map((member) => ({
      ...member,
      activeTaskCount: tasks.value.filter(
        (task) => task.assigneeId === member.id && task.status !== 'done',
      ).length,
    })),
  )

  const completionTrend = computed<CompletionTrendPoint[]>(() => {
    const finalDate = new Date(`${dashboardReferenceDate}T00:00:00Z`)

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(finalDate)
      date.setUTCDate(finalDate.getUTCDate() - (6 - index))
      const dateKey = getDateKey(date)

      return {
        date: dateKey,
        label: formatShortDate(dateKey),
        count: tasks.value.filter((task) => task.completedAt === dateKey).length,
      }
    })
  })

  return {
    activeProjectCount,
    activeTaskCount,
    completionRate,
    completionTrend,
    overdueTaskCount,
    projectProgress,
    recentActivities,
    tasksByStatus,
    teamWorkload,
    upcomingTasks,
  }
})
