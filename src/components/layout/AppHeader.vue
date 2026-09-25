<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  mobileNavigationOpen: boolean
}>()

defineEmits<{
  toggleNavigation: []
}>()

const menuButton = ref<HTMLButtonElement | null>(null)

watch(
  () => props.mobileNavigationOpen,
  (isOpen, wasOpen) => {
    if (!isOpen && wasOpen) {
      void nextTick(() => menuButton.value?.focus())
    }
  },
)
</script>

<template>
  <header class="app-header">
    <button
      ref="menuButton"
      class="app-header__menu-button"
      type="button"
      aria-label="開啟導覽選單"
      aria-controls="mobile-navigation"
      :aria-expanded="mobileNavigationOpen"
      @click="$emit('toggleNavigation')"
    >
      <span aria-hidden="true">☰</span>
    </button>

    <div class="app-header__context">
      <p class="app-header__eyebrow">工作空間</p>
      <p class="app-header__title">TaskFlow</p>
    </div>

    <div class="app-header__status" aria-label="工作空間狀態">
      <span class="app-header__status-indicator" aria-hidden="true"></span>
      <span>系統運作正常</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  align-items: center;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  gap: var(--space-3);
  min-height: 4.5rem;
  padding: 0 var(--space-8);
  position: relative;
  z-index: 1;
}

.app-header__menu-button {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--radius-md);
  color: var(--color-text);
  cursor: pointer;
  display: none;
  font-size: 1.25rem;
  height: 2.75rem;
  justify-content: center;
  padding: 0;
  width: 2.75rem;
}

.app-header__menu-button:hover {
  background: var(--color-surface-subtle);
}

.app-header__context {
  min-width: 0;
}

.app-header__eyebrow,
.app-header__title {
  margin: 0;
}

.app-header__eyebrow {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.1;
  text-transform: uppercase;
}

.app-header__title {
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 650;
  line-height: 1.35;
}

.app-header__status {
  align-items: center;
  color: var(--color-text-muted);
  display: flex;
  font-size: 0.8125rem;
  gap: var(--space-2);
  margin-left: auto;
}

.app-header__status-indicator {
  background: #16a34a;
  border-radius: 50%;
  height: 0.5rem;
  width: 0.5rem;
}

@media (max-width: 64rem) {
  .app-header {
    min-height: 4rem;
    padding: 0 var(--space-4);
  }

  .app-header__menu-button {
    display: inline-flex;
  }

  .app-header__status {
    display: none;
  }
}
</style>
