import { beforeEach, describe, expect, it } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'
import { useProjectStore } from '../stores/project'

describe('project store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('derives project statistics and applies search, status, and sort state', () => {
    const projectStore = useProjectStore()

    expect(projectStore.statistics).toEqual({ total: 5, active: 2, completed: 1, upcoming: 2 })

    projectStore.searchQuery = '品牌'
    expect(projectStore.filteredProjects.map((project) => project.id)).toEqual(['project-brand-site'])

    projectStore.searchQuery = ''
    projectStore.statusFilter = 'completed'
    expect(projectStore.filteredProjects.map((project) => project.id)).toEqual(['project-design-system'])

    projectStore.statusFilter = 'all'
    projectStore.sortBy = 'progress'
    expect(projectStore.filteredProjects[0]?.id).toBe('project-design-system')
  })

  it('creates a planning project in the shared project state', () => {
    const projectStore = useProjectStore()

    const project = projectStore.createProject({
      name: '合作夥伴入口網站',
      description: '提供合作夥伴管理品牌素材的單一入口。',
      startDate: '2026-10-01',
      dueDate: '2026-11-14',
      memberIds: ['member-lin', 'member-wang'],
    })

    expect(project.status).toBe('planning')
    expect(projectStore.statistics.total).toBe(6)
    expect(projectStore.projectSummaries[0]).toMatchObject({
      id: project.id,
      name: '合作夥伴入口網站',
      totalTaskCount: 0,
    })
  })
})
