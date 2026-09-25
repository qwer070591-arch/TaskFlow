import type { TaskPriority, TaskStatus } from '../types/dashboard'

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: '待處理',
  'in-progress': '進行中',
  review: '審核中',
  done: '已完成',
}

export function isTaskStatus(status: unknown): status is TaskStatus {
  return typeof status === 'string' && Object.prototype.hasOwnProperty.call(taskStatusLabels, status)
}

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
}
