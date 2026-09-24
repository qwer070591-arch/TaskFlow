<script setup lang="ts">
import type { NotificationPreferences, SettingsState } from '../../types/settings'

defineProps<{ settings: SettingsState }>()
const emit = defineEmits<{ toggle: [key: keyof NotificationPreferences, enabled: boolean] }>()

const options: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: 'taskAssignments', label: '任務指派通知', description: '當有任務指派給你時通知。' },
  { key: 'taskDueDates', label: '任務到期提醒', description: '任務即將到期時通知。' },
  { key: 'projectProgress', label: '專案進度更新', description: '專案進度更新時通知。' },
  { key: 'workloadAlerts', label: '團隊工作負載提醒', description: '團隊成員工作負載偏高時通知。' },
]
</script>

<template>
  <section id="settings-panel-notifications" aria-labelledby="settings-tab-notifications" class="settings-panel" role="tabpanel">
    <header><h2>通知設定</h2><p>選擇要在前端工作空間中顯示的通知偏好。</p></header>
    <fieldset><legend class="visually-hidden">通知偏好</legend><label v-for="option in options" :key="option.key" class="notification-option"><input :checked="settings.notifications[option.key]" type="checkbox" @change="emit('toggle', option.key, ($event.target as HTMLInputElement).checked)" /><span><strong>{{ option.label }}</strong><small>{{ option.description }}</small></span></label></fieldset>
  </section>
</template>

<style scoped>
.settings-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: grid; gap: var(--space-5); padding: var(--space-6); }h2, p { margin: 0; }h2 { color: var(--color-text); font-size: 1.25rem; }header p { color: var(--color-text-muted); font-size: .875rem; line-height: 1.6; margin-top: var(--space-2); }fieldset { border: 0; display: grid; gap: var(--space-2); margin: 0; padding: 0; }.notification-option { align-items: flex-start; border-radius: var(--radius-md); display: flex; gap: var(--space-3); padding: var(--space-3); }.notification-option:hover { background: var(--color-surface-subtle); }.notification-option input { accent-color: var(--color-accent); flex: 0 0 auto; height: 1rem; margin: .1875rem 0 0; width: 1rem; }.notification-option span { display: grid; gap: var(--space-1); }.notification-option strong { color: var(--color-text-secondary); font-size: .875rem; }.notification-option small { color: var(--color-text-muted); font-size: .75rem; line-height: 1.5; }@media (max-width: 34rem) { .settings-panel { padding: var(--space-5); } }
</style>
