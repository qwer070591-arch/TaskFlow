import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { defaultSettings, settingsStorageKey, useSettingsStore } from '../stores/settings'

describe('settings store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts from the default settings without unsaved changes', () => {
    const settings = useSettingsStore()

    expect(settings.draft).toEqual(defaultSettings)
    expect(settings.isDirty).toBe(false)
  })

  it('tracks draft changes and persists them when saved', () => {
    const settings = useSettingsStore()

    settings.updateDraft({ workspaceName: '產品團隊' })
    expect(settings.isDirty).toBe(true)
    settings.saveSettings()

    expect(settings.isDirty).toBe(false)
    expect(JSON.parse(localStorage.getItem(settingsStorageKey) ?? '')).toMatchObject({ workspaceName: '產品團隊' })
  })

  it('resets unsaved changes without resetting saved preferences', () => {
    const settings = useSettingsStore()
    settings.updateDraft({ workspaceName: '已儲存的名稱' })
    settings.saveSettings()
    settings.updateDraft({ workspaceName: '未儲存的名稱' })

    settings.resetDraft()
    expect(settings.draft.workspaceName).toBe('已儲存的名稱')
    expect(settings.isDirty).toBe(false)
  })

  it('updates notification preferences as draft state', () => {
    const settings = useSettingsStore()

    settings.updateNotification('workloadAlerts', true)
    expect(settings.draft.notifications.workloadAlerts).toBe(true)
    expect(settings.isDirty).toBe(true)
  })

  it('falls back to defaults when persisted JSON is malformed', () => {
    localStorage.setItem(settingsStorageKey, '{not-json')
    const settings = useSettingsStore()

    expect(settings.draft).toEqual(defaultSettings)
  })
})
