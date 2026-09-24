export type ProjectStatus = 'on-track' | 'at-risk'

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export type ActivityType = 'completed' | 'created' | 'updated' | 'moved'

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  progress: number
  startDate: string
  dueDate: string
  memberIds: string[]
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

export interface Activity {
  id: string
  memberId: string
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
