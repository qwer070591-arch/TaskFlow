export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold'

export type ProjectSort = 'updated' | 'due-date' | 'name' | 'progress'

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export type ActivityType = 'completed' | 'created' | 'updated' | 'moved'

export interface Project {
  description: string
  id: string
  name: string
  status: ProjectStatus
  progress: number
  startDate: string
  dueDate: string
  memberIds: string[]
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assigneeId: string
  completedAt?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  initials: string
  workload: number
}

export type WorkloadLevel = 'low' | 'normal' | 'high'

export interface CreateMemberInput {
  initials?: string
  name: string
  role: string
}

export interface TeamMemberOverview {
  activeProjectCount: number
  activeTaskCount: number
  completedTaskCount: number
  member: TeamMember
  totalTaskCount: number
}

export interface TeamStatistics {
  activeTaskCount: number
  availableMemberCount: number
  averageWorkload: number
  totalMemberCount: number
}

export interface Activity {
  id: string
  memberId: string
  projectId: string
  type: ActivityType
  message: string
  timestamp: string
}

export interface TaskStatusSummary {
  status: TaskStatus
  count: number
  percentage: number
}

export interface CompletionTrendPoint {
  date: string
  label: string
  count: number
}

export interface DashboardTask extends Task {
  projectName: string
  assignee: TeamMember
}

export interface DashboardActivity extends Activity {
  member: TeamMember
}

export interface TeamWorkload extends TeamMember {
  activeTaskCount: number
}

export interface ProjectTask extends Task {
  assignee?: TeamMember
}

export interface ProjectOverview {
  activeTaskCount: number
  completedTaskCount: number
  memberCount: number
  totalTaskCount: number
}

export interface ProjectSummary extends Project {
  completedTaskCount: number
  members: TeamMember[]
  totalTaskCount: number
}

export interface ProjectStatistics {
  active: number
  completed: number
  total: number
  upcoming: number
}

export interface CreateProjectInput {
  description: string
  dueDate: string
  memberIds: string[]
  name: string
  startDate: string
}

export interface CreateTaskInput {
  assigneeId: string
  dueDate: string
  priority: TaskPriority
  projectId: string
  status: TaskStatus
  title: string
}

export interface TaskBoardItem extends ProjectTask {
  projectName: string
}
