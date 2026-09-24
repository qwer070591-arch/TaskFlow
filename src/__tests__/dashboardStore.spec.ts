import { beforeEach, describe, expect, it } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import DashboardView from '../views/DashboardView.vue'
import { useDashboardStore } from '../stores/dashboard'

describe('dashboard store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('derives dashboard metrics, task status summaries, and workload from mock data', () => {
    const dashboard = useDashboardStore()

    expect(dashboard.activeProjectCount).toBe(3)
    expect(dashboard.activeTaskCount).toBe(8)
    expect(dashboard.overdueTaskCount).toBe(2)
    expect(dashboard.completionRate).toBe(33)
    expect(dashboard.tasksByStatus).toEqual([
      { status: 'todo', count: 3, percentage: 25 },
      { status: 'in-progress', count: 3, percentage: 25 },
      { status: 'review', count: 2, percentage: 17 },
      { status: 'done', count: 4, percentage: 33 },
    ])
    expect(dashboard.upcomingTasks.map((task) => task.id)).toEqual([
      'task-3',
      'task-2',
      'task-8',
      'task-5',
    ])
    expect(dashboard.teamWorkload.find((member) => member.id === 'member-lin')?.activeTaskCount).toBe(3)
  })

  it('renders data-driven KPI cards and dashboard sections', () => {
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.get('h1').text()).toBe('儀表板')
    expect(wrapper.findAll('article')).toHaveLength(4)
    expect(wrapper.text()).toContain('任務趨勢')
    expect(wrapper.text()).toContain('即將到期任務')
    expect(wrapper.text()).toContain('團隊工作量')
  })
})
