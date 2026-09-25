import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  dashboardReferenceDate,
  mockActivities,
  mockProjects,
  mockTasks,
  mockTeamMembers,
} from '../data/dashboard'
import type {
  CreateProjectInput,
  CreateMemberInput,
  CreateTaskInput,
  DashboardActivity,
  Project,
  ProjectOverview,
  ProjectSort,
  ProjectStatistics,
  ProjectStatus,
  ProjectSummary,
  ProjectTask,
  TaskBoardItem,
  TaskPriority,
  TeamMemberOverview,
  TeamStatistics,
  WorkloadLevel,
} from '../types/dashboard'
import { getInitials, getWorkloadLevel } from '../utils/team'
import { isTaskStatus } from '../utils/task'

const upcomingProjectCutoff = '2026-10-09'

function cloneProject(project: Project): Project {
  return { ...project, memberIds: [...project.memberIds] }
}

export const useProjectStore = defineStore('project', () => {
  const projects = ref(mockProjects.map(cloneProject))
  const tasks = ref([...mockTasks])
  const teamMembers = ref([...mockTeamMembers])
  const activities = ref([...mockActivities])
  const searchQuery = ref('')
  const statusFilter = ref<ProjectStatus | 'all'>('all')
  const sortBy = ref<ProjectSort>('updated')
  const taskSearchQuery = ref('')
  const taskProjectFilter = ref('all')
  const taskPriorityFilter = ref<TaskPriority | 'all'>('all')
  const taskAssigneeFilter = ref('all')
  const teamSearchQuery = ref('')
  const teamWorkloadFilter = ref<WorkloadLevel | 'all'>('all')

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

  const filteredTasks = computed<TaskBoardItem[]>(() => {
    const query = taskSearchQuery.value.trim().toLocaleLowerCase('zh-TW')
    return tasks.value.flatMap((task) => {
      const project = projects.value.find((item) => item.id === task.projectId)
      const assignee = teamMembers.value.find((member) => member.id === task.assigneeId)
      if (!project || !assignee) return []
      const matches = task.title.toLocaleLowerCase('zh-TW').includes(query) &&
        (taskProjectFilter.value === 'all' || task.projectId === taskProjectFilter.value) &&
        (taskPriorityFilter.value === 'all' || task.priority === taskPriorityFilter.value) &&
        (taskAssigneeFilter.value === 'all' || task.assigneeId === taskAssigneeFilter.value)
      return matches ? [{ ...task, projectName: project.name, assignee }] : []
    })
  })

  const taskStatistics = computed(() => ({
    total: tasks.value.length,
    todo: tasks.value.filter((task) => task.status === 'todo').length,
    inProgress: tasks.value.filter((task) => task.status === 'in-progress').length,
    review: tasks.value.filter((task) => task.status === 'review').length,
    done: tasks.value.filter((task) => task.status === 'done').length,
    overdue: tasks.value.filter((task) => task.status !== 'done' && task.dueDate < dashboardReferenceDate).length,
  }))

  const filteredTeamMembers = computed(() => {
    const query = teamSearchQuery.value.trim().toLocaleLowerCase('zh-TW')
    return teamMembers.value.filter((member) => {
      const matchesQuery = [member.name, member.role]
        .some((value) => value.toLocaleLowerCase('zh-TW').includes(query))
      const matchesWorkload = teamWorkloadFilter.value === 'all' ||
        getWorkloadLevel(member.workload) === teamWorkloadFilter.value
      return matchesQuery && matchesWorkload
    })
  })

  const teamStatistics = computed<TeamStatistics>(() => ({
    totalMemberCount: teamMembers.value.length,
    availableMemberCount: teamMembers.value.filter((member) => member.workload < 80).length,
    activeTaskCount: tasks.value.filter((task) => task.status !== 'done').length,
    averageWorkload: teamMembers.value.length
      ? Math.round(teamMembers.value.reduce((total, member) => total + member.workload, 0) / teamMembers.value.length)
      : 0,
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

  function createTask(input: CreateTaskInput) {
    const projectExists = projects.value.some((project) => project.id === input.projectId)
    const assigneeExists = teamMembers.value.some((member) => member.id === input.assigneeId)
    if (!projectExists || !assigneeExists || !isTaskStatus(input.status)) return null

    const task = { id: `task-${crypto.randomUUID()}`, ...input, completedAt: input.status === 'done' ? dashboardReferenceDate : undefined }
    tasks.value.unshift(task)
    return task
  }

  function createMember(input: CreateMemberInput) {
    const name = input.name.trim()
    const member = {
      id: `member-${crypto.randomUUID()}`,
      name,
      role: input.role.trim(),
      initials: input.initials?.trim().toUpperCase() || getInitials(name),
      workload: 0,
    }
    teamMembers.value.push(member)
    return member
  }

  function updateTaskStatus(taskId: string, status: unknown) {
    const task = tasks.value.find((item) => item.id === taskId)
    if (!task || !isTaskStatus(status)) return false
    task.status = status
    task.completedAt = status === 'done' ? dashboardReferenceDate : undefined
    return true
  }

  function clearTaskFilters() { taskSearchQuery.value = ''; taskProjectFilter.value = 'all'; taskPriorityFilter.value = 'all'; taskAssigneeFilter.value = 'all' }

  function clearTeamFilters() {
    teamSearchQuery.value = ''
    teamWorkloadFilter.value = 'all'
  }

  function getProjectById(projectId: string) {
    return projectSummaries.value.find((project) => project.id === projectId)
  }

  function getTasksByProject(projectId: string): ProjectTask[] {
    return tasks.value
      .filter((task) => task.projectId === projectId)
      .map((task) => ({
        ...task,
        assignee: teamMembers.value.find((member) => member.id === task.assigneeId),
      }))
  }

  function getMembersByProject(projectId: string) {
    return getProjectById(projectId)?.members ?? []
  }

  function getMemberById(memberId: string) {
    return teamMembers.value.find((member) => member.id === memberId)
  }

  function getProjectsByMember(memberId: string) {
    return projects.value.filter((project) => project.memberIds.includes(memberId))
  }

  function getProjectsByCustomer(customerId: string) {
    return projects.value.filter((project) => project.customerId === customerId)
  }

  function getTasksByMember(memberId: string) {
    return tasks.value.filter((task) => task.assigneeId === memberId)
  }

  function getActiveTasksByMember(memberId: string) {
    return getTasksByMember(memberId).filter((task) => task.status !== 'done')
  }

  function getCompletedTasksByMember(memberId: string) {
    return getTasksByMember(memberId).filter((task) => task.status === 'done')
  }

  function getMemberOverview(memberId: string): TeamMemberOverview | undefined {
    const member = getMemberById(memberId)
    if (!member) return undefined

    const memberTasks = getTasksByMember(memberId)
    const activeTasks = getActiveTasksByMember(memberId)
    return {
      member,
      activeProjectCount: getProjectsByMember(memberId).filter((project) => project.status !== 'completed').length,
      activeTaskCount: activeTasks.length,
      completedTaskCount: memberTasks.filter((task) => task.status === 'done').length,
      totalTaskCount: memberTasks.length,
    }
  }

  function getActivitiesByProject(projectId: string): DashboardActivity[] {
    return activities.value.flatMap((activity) => {
      if (activity.projectId !== projectId) return []

      const member = teamMembers.value.find((item) => item.id === activity.memberId)
      return member ? [{ ...activity, member }] : []
    })
  }

  function getOverviewByProject(projectId: string): ProjectOverview | undefined {
    const project = getProjectById(projectId)
    if (!project) return undefined

    const projectTasks = getTasksByProject(projectId)
    return {
      totalTaskCount: projectTasks.length,
      completedTaskCount: projectTasks.filter((task) => task.status === 'done').length,
      activeTaskCount: projectTasks.filter((task) => task.status === 'in-progress').length,
      memberCount: project.members.length,
    }
  }

  return {
    activities,
    clearTeamFilters,
    clearTaskFilters,
    clearFilters,
    createProject,
    createMember,
    createTask,
    filteredTasks,
    filteredTeamMembers,
    filteredProjects,
    getActivitiesByProject,
    getActiveTasksByMember,
    getCompletedTasksByMember,
    getMemberById,
    getMemberOverview,
    getMembersByProject,
    getProjectsByMember,
    getProjectsByCustomer,
    getTasksByMember,
    getOverviewByProject,
    getProjectById,
    getTasksByProject,
    projectSummaries,
    projects,
    searchQuery,
    sortBy,
    statistics,
    statusFilter,
    tasks,
    taskAssigneeFilter,
    taskPriorityFilter,
    taskProjectFilter,
    taskSearchQuery,
    taskStatistics,
    teamSearchQuery,
    teamMembers,
    teamStatistics,
    teamWorkloadFilter,
    updateTaskStatus,
  }
})
