import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { dashboardReferenceDate } from '../data/dashboard'
import { useProjectStore } from '../stores/project'

describe('task state in the project store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('derives status columns, statistics, and overdue tasks from the shared task state', () => {
    const store = useProjectStore()
    const byStatus = Object.fromEntries(
      ['todo', 'in-progress', 'review', 'done'].map((status) => [
        status,
        store.filteredTasks.filter((task) => task.status === status).length,
      ]),
    )

    expect(byStatus).toEqual({ todo: 3, 'in-progress': 3, review: 2, done: 4 })
    expect(store.taskStatistics).toEqual({
      total: 12,
      todo: 3,
      inProgress: 3,
      review: 2,
      done: 4,
      overdue: 2,
    })
    expect(
      store.filteredTasks
        .filter((task) => task.status !== 'done' && task.dueDate < dashboardReferenceDate)
        .map((task) => task.id),
    ).toEqual(['task-4', 'task-7'])
  })

  it('derives search, project, priority, and assignee filtered task lists', () => {
    const store = useProjectStore()

    store.taskSearchQuery = '\u884c\u52d5\u7248\u8a2d\u8a08\u5be9\u67e5'
    expect(store.filteredTasks.map((task) => task.id)).toEqual(['task-3'])

    store.clearTaskFilters()
    store.taskProjectFilter = 'project-mobile-onboarding'
    expect(store.filteredTasks.map((task) => task.id)).toEqual(['task-3', 'task-4', 'task-10', 'task-11'])

    store.clearTaskFilters()
    store.taskPriorityFilter = 'high'
    expect(store.filteredTasks.map((task) => task.id)).toEqual(['task-1', 'task-2', 'task-3', 'task-7'])

    store.clearTaskFilters()
    store.taskAssigneeFilter = 'member-lin'
    expect(store.filteredTasks.map((task) => task.id)).toEqual(['task-2', 'task-9', 'task-10', 'task-12'])
  })

  it('creates tasks and synchronizes completedAt when their status changes', () => {
    const store = useProjectStore()
    const created = store.createTask({
      title: '\u6e2c\u8a66\u65b0\u4efb\u52d9',
      projectId: 'project-brand-site',
      assigneeId: 'member-lin',
      priority: 'high',
      dueDate: '2026-10-10',
      status: 'todo',
    })

    expect(store.tasks[0]).toMatchObject({ id: created.id, title: '\u6e2c\u8a66\u65b0\u4efb\u52d9', completedAt: undefined })
    expect(store.taskStatistics.total).toBe(13)
    expect(store.updateTaskStatus(created.id, 'done')).toBe(true)
    expect(store.tasks[0]).toMatchObject({ status: 'done', completedAt: dashboardReferenceDate })
    expect(store.updateTaskStatus(created.id, 'review')).toBe(true)
    expect(store.tasks[0]).toMatchObject({ status: 'review', completedAt: undefined })
    expect(store.updateTaskStatus('missing-task', 'done')).toBe(false)
  })
})
