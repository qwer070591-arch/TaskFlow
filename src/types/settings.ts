export type ProjectViewPreference = 'list' | 'grid'

export interface NotificationPreferences {
  projectProgress: boolean
  taskAssignments: boolean
  taskDueDates: boolean
  workloadAlerts: boolean
}

export interface SettingsState {
  notifications: NotificationPreferences
  personalName: string
  projectView: ProjectViewPreference
  role: string
  workspaceDescription: string
  workspaceName: string
}
