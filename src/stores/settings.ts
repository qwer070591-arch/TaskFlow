import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { NotificationPreferences, SettingsState } from '../types/settings'

export const settingsStorageKey = 'taskflow-settings'

type SettingsUpdate = Partial<Omit<SettingsState, 'notifications'>> & {
  notifications?: Partial<NotificationPreferences>
}

export const defaultSettings: SettingsState = {
  workspaceName: 'TaskFlow',
  workspaceDescription: '專案管理與協作工作空間。',
  projectView: 'grid',
  personalName: 'Jason Lin',
  role: '前端工程師',
  notifications: {
    taskAssignments: true,
    taskDueDates: true,
    projectProgress: true,
    workloadAlerts: false,
  },
}

function cloneSettings(settings: SettingsState): SettingsState {
  return { ...settings, notifications: { ...settings.notifications } }
}

function isSettingsState(value: unknown): value is SettingsState {
  if (!value || typeof value !== 'object') return false
  const settings = value as Partial<SettingsState>
  const notifications = settings.notifications as Partial<NotificationPreferences> | undefined
  return typeof settings.workspaceName === 'string' &&
    typeof settings.workspaceDescription === 'string' &&
    (settings.projectView === 'grid' || settings.projectView === 'list') &&
    typeof settings.personalName === 'string' &&
    typeof settings.role === 'string' &&
    Boolean(notifications) &&
    typeof notifications?.taskAssignments === 'boolean' &&
    typeof notifications.taskDueDates === 'boolean' &&
    typeof notifications.projectProgress === 'boolean' &&
    typeof notifications.workloadAlerts === 'boolean'
}

function readStoredSettings(): SettingsState {
  if (typeof window === 'undefined') return cloneSettings(defaultSettings)
  try {
    const stored = window.localStorage.getItem(settingsStorageKey)
    if (!stored) return cloneSettings(defaultSettings)
    const parsed: unknown = JSON.parse(stored)
    return isSettingsState(parsed) ? cloneSettings(parsed) : cloneSettings(defaultSettings)
  } catch {
    return cloneSettings(defaultSettings)
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const savedSettings = ref(readStoredSettings())
  const draft = ref(cloneSettings(savedSettings.value))
  const isDirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(savedSettings.value))

  function updateDraft(update: SettingsUpdate) {
    draft.value = {
      ...draft.value,
      ...update,
      notifications: update.notifications
        ? { ...draft.value.notifications, ...update.notifications }
        : draft.value.notifications,
    }
  }

  function updateNotification(key: keyof NotificationPreferences, enabled: boolean) {
    updateDraft({ notifications: { [key]: enabled } })
  }

  function saveSettings() {
    savedSettings.value = cloneSettings(draft.value)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(settingsStorageKey, JSON.stringify(savedSettings.value))
      } catch {
        // The in-memory setting remains available if storage is unavailable.
      }
    }
  }

  function resetDraft() {
    draft.value = cloneSettings(savedSettings.value)
  }

  return { draft, isDirty, resetDraft, saveSettings, updateDraft, updateNotification }
})
