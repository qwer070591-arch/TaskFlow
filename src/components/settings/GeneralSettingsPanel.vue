<script setup lang="ts">
import type { ProjectViewPreference, SettingsState } from '../../types/settings'

defineProps<{ settings: SettingsState }>()
const emit = defineEmits<{
  update: [update: Partial<SettingsState>]
}>()

function updateProjectView(event: Event) {
  emit('update', { projectView: (event.target as HTMLInputElement).value as ProjectViewPreference })
}
</script>

<template>
  <section id="settings-panel-general" aria-labelledby="settings-tab-general" class="settings-panel" role="tabpanel">
    <header><h2>一般設定</h2><p>管理工作空間的基本資訊與專案瀏覽偏好。</p></header>
    <div class="settings-field"><label for="workspace-name">工作空間名稱</label><input id="workspace-name" :value="settings.workspaceName" type="text" @input="emit('update', { workspaceName: ($event.target as HTMLInputElement).value })" /></div>
    <div class="settings-field"><label for="workspace-description">工作空間說明</label><textarea id="workspace-description" :value="settings.workspaceDescription" rows="4" @input="emit('update', { workspaceDescription: ($event.target as HTMLTextAreaElement).value })" /></div>
    <fieldset><legend>預設專案檢視</legend><p>選擇專案頁面偏好的呈現方式。</p><div class="settings-options"><label><input :checked="settings.projectView === 'grid'" name="project-view" type="radio" value="grid" @change="updateProjectView" /><span>卡片</span></label><label><input :checked="settings.projectView === 'list'" name="project-view" type="radio" value="list" @change="updateProjectView" /><span>列表</span></label></div></fieldset>
  </section>
</template>

<style scoped>
.settings-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: grid; gap: var(--space-5); padding: var(--space-6); }h2, p { margin: 0; }h2 { color: var(--color-text); font-size: 1.25rem; }header p, fieldset > p { color: var(--color-text-muted); font-size: .875rem; line-height: 1.6; margin-top: var(--space-2); }.settings-field { display: grid; gap: var(--space-2); }label, legend { color: var(--color-text-secondary); font-size: .8125rem; font-weight: 700; }input[type='text'], textarea { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font: inherit; padding: var(--space-3); width: 100%; }input[type='text'] { min-height: 2.75rem; }textarea { line-height: 1.5; resize: vertical; }input:focus-visible, textarea:focus-visible { border-color: var(--color-accent); outline: 3px solid #c7d2fe; outline-offset: 1px; }fieldset { border: 0; margin: 0; padding: 0; }.settings-options { display: grid; gap: var(--space-3); grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: var(--space-3); }.settings-options label { align-items: center; background: var(--color-surface-subtle); border: 1px solid transparent; border-radius: var(--radius-md); display: flex; gap: var(--space-2); min-height: 3rem; padding: 0 var(--space-3); }.settings-options label:has(input:checked) { background: var(--color-accent-soft); border-color: #c7d2fe; color: var(--color-accent-strong); }@media (max-width: 34rem) { .settings-panel { padding: var(--space-5); }.settings-options { grid-template-columns: minmax(0, 1fr); } }
</style>
