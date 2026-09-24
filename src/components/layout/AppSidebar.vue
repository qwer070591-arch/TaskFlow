<script setup lang="ts">
type NavigationItem = {
  label: string
  to: string
}

defineProps<{
  mobile?: boolean
}>()

const emit = defineEmits<{
  navigate: []
}>()

const navigationItems: NavigationItem[] = [
  { label: '儀表板', to: '/dashboard' },
  { label: '專案', to: '/projects' },
  { label: '任務', to: '/tasks' },
  { label: '團隊', to: '/team' },
  { label: '設定', to: '/settings' },
]
</script>

<template>
  <aside class="app-sidebar" :class="{ 'app-sidebar--mobile': mobile }">
    <RouterLink class="app-sidebar__brand" to="/dashboard" @click="emit('navigate')">
      <span class="app-sidebar__brand-mark" aria-hidden="true">✓</span>
      <span>TaskFlow</span>
    </RouterLink>

    <nav class="app-sidebar__navigation" aria-label="主要導覽">
      <p class="app-sidebar__navigation-label">工作空間</p>
      <ul class="app-sidebar__navigation-list">
        <li v-for="item in navigationItems" :key="item.to">
          <RouterLink class="app-sidebar__navigation-link" :to="item.to" @click="emit('navigate')">
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <p class="app-sidebar__footer">清楚規劃，高效協作。</p>
  </aside>
</template>

<style scoped>
.app-sidebar {
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: var(--space-6) var(--space-4);
}

.app-sidebar__brand {
  align-items: center;
  border-radius: var(--radius-md);
  color: var(--color-text);
  display: inline-flex;
  font-size: 1.125rem;
  font-weight: 750;
  gap: var(--space-3);
  line-height: 1;
  padding: var(--space-2);
  text-decoration: none;
  width: fit-content;
}

.app-sidebar__brand-mark {
  align-items: center;
  background: var(--color-accent);
  border-radius: 0.625rem;
  color: white;
  display: inline-flex;
  font-size: 0.875rem;
  height: 1.875rem;
  justify-content: center;
  width: 1.875rem;
}

.app-sidebar__navigation {
  margin-top: var(--space-10);
}

.app-sidebar__navigation-label {
  color: var(--color-text-muted);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 var(--space-3) var(--space-2);
  text-transform: uppercase;
}

.app-sidebar__navigation-list {
  display: grid;
  gap: var(--space-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-sidebar__navigation-link {
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  display: block;
  font-size: 0.9375rem;
  font-weight: 550;
  padding: 0.75rem var(--space-3);
  text-decoration: none;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.app-sidebar__navigation-link:hover {
  background: var(--color-surface-subtle);
  color: var(--color-text);
}

.app-sidebar__navigation-link.router-link-active {
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
  font-weight: 650;
}

.app-sidebar__footer {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
  margin: auto var(--space-3) 0;
}

.app-sidebar--mobile {
  border-right: 0;
  min-height: 100%;
}
</style>
