<script setup lang="ts">
import { ref } from 'vue'

import GeneralSettingsPanel from '../components/settings/GeneralSettingsPanel.vue'
import NotificationSettingsPanel from '../components/settings/NotificationSettingsPanel.vue'
import PersonalSettingsPanel from '../components/settings/PersonalSettingsPanel.vue'
import SettingsNavigation from '../components/settings/SettingsNavigation.vue'
import type { SettingsSection } from '../components/settings/SettingsNavigation.vue'
import { useSettingsStore } from '../stores/settings'
import type { NotificationPreferences, SettingsState } from '../types/settings'

const settings = useSettingsStore()
const activeSection = ref<SettingsSection>('general')
const feedback = ref('')
let feedbackTimer: number | undefined

function showFeedback(message: string) {
  feedback.value = message
  if (feedbackTimer) window.clearTimeout(feedbackTimer)
  feedbackTimer = window.setTimeout(() => { feedback.value = '' }, 4000)
}

function saveSettings() {
  settings.saveSettings()
  showFeedback('設定已儲存。')
}

function resetChanges() {
  settings.resetDraft()
  showFeedback('已還原未儲存的變更。')
}

function updateSettings(update: Partial<SettingsState>) { settings.updateDraft(update) }
function updateNotification(key: keyof NotificationPreferences, enabled: boolean) { settings.updateNotification(key, enabled) }
</script>

<template>
  <div class="settings-view">
    <header class="settings-view__header"><p>TaskFlow</p><h1>設定</h1><span>管理工作空間與個人偏好設定。</span></header>
    <div class="settings-view__layout"><SettingsNavigation :active-section="activeSection" @change="activeSection = $event" /><main class="settings-view__content"><GeneralSettingsPanel v-if="activeSection === 'general'" :settings="settings.draft" @update="updateSettings" /><PersonalSettingsPanel v-else-if="activeSection === 'personal'" :settings="settings.draft" @update="updateSettings" /><NotificationSettingsPanel v-else :settings="settings.draft" @toggle="updateNotification" /><footer class="settings-view__actions"><button type="button" :disabled="!settings.isDirty" @click="resetChanges">還原變更</button><button type="button" :disabled="!settings.isDirty" @click="saveSettings">儲存設定</button></footer></main></div>
    <div v-if="feedback" aria-atomic="true" aria-live="polite" class="settings-view__toast" role="status">{{ feedback }}</div>
  </div>
</template>

<style scoped>
.settings-view { display: grid; gap: var(--space-5); }.settings-view__header { padding: var(--space-2) 0 var(--space-3); }.settings-view__header p, h1, .settings-view__header span { margin: 0; }.settings-view__header p { color: var(--color-accent-strong); font-size: .75rem; font-weight: 750; letter-spacing: .1em; text-transform: uppercase; }h1 { color: var(--color-text); font-size: clamp(1.875rem, 4vw, 2.5rem); letter-spacing: -.045em; line-height: 1.1; margin-top: var(--space-2); }.settings-view__header span { color: var(--color-text-secondary); display: block; font-size: .9375rem; line-height: 1.65; margin-top: var(--space-3); }.settings-view__layout { align-items: start; display: grid; gap: var(--space-5); grid-template-columns: 13rem minmax(0, 1fr); }.settings-view__content { display: grid; gap: var(--space-4); }.settings-view__actions { display: flex; gap: var(--space-3); justify-content: flex-end; }.settings-view__actions button { border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-secondary); font: inherit; font-weight: 700; min-height: 2.75rem; padding: 0 var(--space-4); }.settings-view__actions button:first-child { background: var(--color-surface); }.settings-view__actions button:last-child { background: var(--color-accent); border-color: var(--color-accent); color: white; }.settings-view__actions button:disabled { background: var(--color-surface-subtle); border-color: var(--color-border); color: var(--color-text-muted); cursor: not-allowed; }.settings-view__toast { background: var(--color-text); border-radius: var(--radius-md); bottom: var(--space-5); box-shadow: var(--shadow-lg); color: white; font-size: .8125rem; max-width: min(24rem, calc(100vw - 2rem)); padding: var(--space-3) var(--space-4); position: fixed; right: var(--space-5); z-index: 30; }@media (max-width: 44rem) { .settings-view__layout { grid-template-columns: minmax(0, 1fr); }.settings-view__actions { justify-content: stretch; }.settings-view__actions button { flex: 1; } }@media (max-width: 34rem) { .settings-view__toast { bottom: var(--space-4); left: var(--space-4); right: var(--space-4); } }
</style>
