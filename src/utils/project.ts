import type { ProjectStatus } from '../types/dashboard'

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
