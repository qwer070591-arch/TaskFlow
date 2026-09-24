<script setup lang="ts">
export type SettingsSection = 'general' | 'personal' | 'notifications'

defineProps<{ activeSection: SettingsSection }>()
const emit = defineEmits<{ change: [section: SettingsSection] }>()

const sections: { id: SettingsSection; label: string }[] = [
  { id: 'general', label: '一般設定' },
  { id: 'personal', label: '個人偏好' },
  { id: 'notifications', label: '通知設定' },
]

function moveFocus(event: KeyboardEvent) {
  const currentIndex = sections.findIndex((section) => section.id === (event.target as HTMLElement).dataset.section)
  if (currentIndex < 0) return

  let nextIndex = currentIndex
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % sections.length
  else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + sections.length) % sections.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = sections.length - 1
  else return

  event.preventDefault()
  const nextSection = sections[nextIndex]
  if (!nextSection) return
  emit('change', nextSection.id)
  ;(event.currentTarget as HTMLElement)
    .querySelector<HTMLButtonElement>(`[data-section="${nextSection.id}"]`)
    ?.focus()
}
</script>

<template>
  <nav aria-label="設定區段" class="settings-navigation" role="tablist" @keydown="moveFocus">
    <button
      v-for="section in sections"
      :id="`settings-tab-${section.id}`"
      :key="section.id"
      :aria-controls="`settings-panel-${section.id}`"
      :aria-selected="activeSection === section.id"
      :data-section="section.id"
      :tabindex="activeSection === section.id ? 0 : -1"
      role="tab"
      type="button"
      @click="emit('change', section.id)"
    >{{ section.label }}</button>
  </nav>
</template>

<style scoped>
.settings-navigation { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: grid; gap: var(--space-1); padding: var(--space-2); }button { background: transparent; border: 0; border-radius: var(--radius-md); color: var(--color-text-secondary); font: inherit; font-size: .875rem; font-weight: 700; min-height: 2.75rem; padding: 0 var(--space-3); text-align: left; }button:hover { background: var(--color-surface-subtle); color: var(--color-text); }button[aria-selected='true'] { background: var(--color-accent-soft); color: var(--color-accent-strong); }@media (max-width: 44rem) { .settings-navigation { display: flex; overflow-x: auto; padding: var(--space-2); }.settings-navigation button { flex: 0 0 auto; text-align: center; white-space: nowrap; } }
</style>
