<script setup lang="ts">
import type { SettingsState } from '../../types/settings'

defineProps<{ settings: SettingsState }>()
const emit = defineEmits<{ update: [update: Partial<SettingsState>] }>()
</script>

<template>
  <section id="settings-panel-personal" aria-labelledby="settings-tab-personal" class="settings-panel" role="tabpanel">
    <header><h2>個人偏好</h2><p>調整顯示在 TaskFlow 工作空間中的個人資訊。</p></header>
    <div class="settings-field"><label for="personal-name">顯示名稱</label><input id="personal-name" :value="settings.personalName" type="text" @input="emit('update', { personalName: ($event.target as HTMLInputElement).value })" /></div>
    <div class="settings-field"><label for="personal-role">職位</label><select id="personal-role" :value="settings.role" disabled><option>{{ settings.role }}</option></select><p>職位資訊目前由團隊成員資料管理。</p></div>
    <section class="theme-note" aria-labelledby="theme-note-title"><h3 id="theme-note-title">介面主題</h3><p>目前使用淺色主題，以維持一致的工作空間體驗。</p></section>
  </section>
</template>

<style scoped>
.settings-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: grid; gap: var(--space-5); padding: var(--space-6); }h2, h3, p { margin: 0; }h2 { color: var(--color-text); font-size: 1.25rem; }header p, .settings-field > p, .theme-note p { color: var(--color-text-muted); font-size: .875rem; line-height: 1.6; margin-top: var(--space-2); }.settings-field { display: grid; gap: var(--space-2); }label { color: var(--color-text-secondary); font-size: .8125rem; font-weight: 700; }input, select { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font: inherit; min-height: 2.75rem; padding: 0 var(--space-3); width: 100%; }input:focus-visible { border-color: var(--color-accent); outline: 3px solid #c7d2fe; outline-offset: 1px; }select:disabled { background: var(--color-surface-subtle); color: var(--color-text-muted); cursor: not-allowed; }.theme-note { background: var(--color-surface-subtle); border-radius: var(--radius-md); padding: var(--space-4); }.theme-note h3 { color: var(--color-text-secondary); font-size: .875rem; }@media (max-width: 34rem) { .settings-panel { padding: var(--space-5); } }
</style>
