import type { ProjectStatus } from '../types/dashboard'

type ProjectHealth = 'normal' | 'upcoming' | 'overdue' | 'completed' | 'on-hold'

export const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: '規劃中',
  active: '進行中',
  completed: '已完成',
  'on-hold': '暫停',
}

export function formatProjectDate(date: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export const projectHealthLabels: Record<ProjectHealth, string> = {
  normal: '正常進行',
  upcoming: '即將到期',
  overdue: '已逾期',
  completed: '已完成',
  'on-hold': '暫停',
}

export function getProjectHealth(status: ProjectStatus, dueDate: string, referenceDate: string): ProjectHealth {
  if (status === 'completed') return 'completed'
  if (status === 'on-hold') return 'on-hold'
  if (dueDate < referenceDate) return 'overdue'
  if (dueDate <= '2026-10-09') return 'upcoming'
  return 'normal'
}
