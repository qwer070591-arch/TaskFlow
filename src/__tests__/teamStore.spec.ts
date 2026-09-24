import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useProjectStore } from '../stores/project'
import { getInitials, getWorkloadLevel } from '../utils/team'

describe('team state in the project store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('derives team statistics, search, and workload filters without mutating members', () => {
    const store = useProjectStore()

    expect(store.teamStatistics).toEqual({
      totalMemberCount: 4,
      availableMemberCount: 3,
      activeTaskCount: 8,
      averageWorkload: 70,
    })

    store.teamSearchQuery = 'Jack'
    expect(store.filteredTeamMembers.map((member) => member.id)).toEqual(['member-chen'])

    store.clearTeamFilters()
    store.teamWorkloadFilter = 'high'
    expect(store.filteredTeamMembers.map((member) => member.id)).toEqual(['member-wang'])
    expect(store.teamMembers).toHaveLength(4)
  })

  it('follows member relationships through project and task ids', () => {
    const store = useProjectStore()

    expect(store.getProjectsByMember('member-chen')).toHaveLength(3)
    expect(store.getTasksByMember('member-chen').map((task) => task.id)).toEqual(['task-1', 'task-3', 'task-7'])
    expect(store.getActiveTasksByMember('member-chen').map((task) => task.id)).toEqual(['task-3', 'task-7'])
    expect(store.getCompletedTasksByMember('member-chen').map((task) => task.id)).toEqual(['task-1'])
    expect(store.getMemberOverview('member-chen')).toMatchObject({
      activeProjectCount: 2,
      activeTaskCount: 2,
      completedTaskCount: 1,
      totalTaskCount: 3,
      member: { name: 'Jack Chen' },
    })
  })

  it('creates a member in the shared source of truth with generated initials and no relationships', () => {
    const store = useProjectStore()
    const member = store.createMember({ name: 'Mia Chen', role: '前端工程師' })

    expect(member).toMatchObject({ name: 'Mia Chen', role: '前端工程師', initials: 'MC', workload: 0 })
    expect(store.teamMembers).toHaveLength(5)
    expect(store.getProjectsByMember(member.id)).toEqual([])
    expect(store.getActiveTasksByMember(member.id)).toEqual([])
    expect(store.getCompletedTasksByMember(member.id)).toEqual([])
  })

  it('classifies workload and generates initials consistently', () => {
    expect(getInitials('  sophia hsu ')).toBe('SH')
    expect(getWorkloadLevel(0)).toBe('low')
    expect(getWorkloadLevel(79)).toBe('normal')
    expect(getWorkloadLevel(80)).toBe('high')
  })
})
