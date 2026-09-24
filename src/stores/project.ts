import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { dashboardReferenceDate, mockProjects, mockTasks, mockTeamMembers } from '../data/dashboard'
import type {
  CreateProjectInput,
  Project,
  ProjectSort,
  ProjectStatistics,
  ProjectStatus,
  ProjectSummary,
} from '../types/dashboard'

const upcomingProjectCutoff = '2026-10-09'

function cloneProject(project: Project): Project {
  return { ...project, memberIds: [...project.memberIds] }
}

export const useProjectStore = defineStore('project', () => {
  const projects = ref(mockProjects.map(cloneProject))
  const tasks = ref([...mockTasks])
  const teamMembers = ref([...mockTeamMembers])
  const searchQuery = ref('')
  const statusFilter = ref<ProjectStatus | 'all'>('all')
  const sortBy = ref<ProjectSort>('updated')

  const projectSummaries = computed<ProjectSummary[]>(() =>
    projects.value.map((project) => {
      const projectTasks = tasks.value.filter((task) => task.projectId === project.id)

      return {
        ...project,
        members: project.memberIds.flatMap((memberId) => {
          const member = teamMembers.value.find((item) => item.id === memberId)
          return member ? [member] : []
        }),
        completedTaskCount: projectTasks.filter((task) => task.status === 'done').length,
        totalTaskCount: projectTasks.length,
      }
    }),
  )

  const filteredProjects = computed(() => {
    const normalizedQuery = searchQuery.value.trim().toLocaleLowerCase('zh-TW')
    const matchingProjects = projectSummaries.value.filter(
      (project) =>
        (statusFilter.value === 'all' || project.status === statusFilter.value) &&
        project.name.toLocaleLowerCase('zh-TW').includes(normalizedQuery),
    )

    return [...matchingProjects].sort((firstProject, secondProject) => {
      if (sortBy.value === 'name') return firstProject.name.localeCompare(secondProject.name, 'zh-TW')
      if (sortBy.value === 'progress') return secondProject.progress - firstProject.progress
      if (sortBy.value === 'due-date') return firstProject.dueDate.localeCompare(secondProject.dueDate)
      return secondProject.updatedAt.localeCompare(firstProject.updatedAt)
    })
  })

  const statistics = computed<ProjectStatistics>(() => ({
    total: projects.value.length,
    active: projects.value.filter((project) => project.status === 'active').length,
    completed: projects.value.filter((project) => project.status === 'completed').length,
    upcoming: projects.value.filter(
      (project) =>
        project.status !== 'completed' &&
        project.dueDate >= dashboardReferenceDate &&
        project.dueDate <= upcomingProjectCutoff,
    ).length,
  }))

  function clearFilters() {
    searchQuery.value = ''
    statusFilter.value = 'all'
    sortBy.value = 'updated'
  }

  function createProject(input: CreateProjectInput) {
    const createdProject: Project = {
      id: `project-${crypto.randomUUID()}`,
      name: input.name.trim(),
      description: input.description.trim(),
      status: 'planning',
      progress: 0,
      startDate: input.startDate,
      dueDate: input.dueDate,
      memberIds: [...input.memberIds],
      updatedAt: new Date().toISOString(),
    }

    projects.value.unshift(createdProject)
    return createdProject
  }

  return {
    clearFilters,
    createProject,
    filteredProjects,
    projectSummaries,
    projects,
    searchQuery,
    sortBy,
    statistics,
    statusFilter,
    tasks,
    teamMembers,
  }
})
