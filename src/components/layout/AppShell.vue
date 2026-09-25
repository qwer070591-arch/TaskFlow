<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const mobileNavigationOpen = ref(false)
const mobileDrawer = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

function openMobileNavigation() {
  mobileNavigationOpen.value = true
  void nextTick(() => closeButton.value?.focus())
}

function closeMobileNavigation() {
  mobileNavigationOpen.value = false
}

function toggleMobileNavigation() {
  if (mobileNavigationOpen.value) {
    closeMobileNavigation()
    return
  }

  openMobileNavigation()
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !mobileDrawer.value) return

  const focusableElements = mobileDrawer.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  if (!firstFocusableElement || !lastFocusableElement) return

  if (event.shiftKey && document.activeElement === firstFocusableElement) {
    event.preventDefault()
    lastFocusableElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
    event.preventDefault()
    firstFocusableElement.focus()
  }
}

watch(mobileNavigationOpen, (isOpen) => {
  document.body.classList.toggle('has-modal-open', isOpen)
})

onBeforeUnmount(() => {
  document.body.classList.remove('has-modal-open')
})
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">跳至主要內容</a>

    <AppSidebar class="app-shell__desktop-sidebar" />

    <div class="app-shell__workspace">
      <AppHeader
        :mobile-navigation-open="mobileNavigationOpen"
        @toggle-navigation="toggleMobileNavigation"
      />

      <main id="main-content" class="app-shell__main" tabindex="-1">
        <slot />
      </main>
    </div>

    <Transition name="drawer">
      <div v-if="mobileNavigationOpen" class="mobile-navigation">
        <div class="mobile-navigation__backdrop" aria-hidden="true" @click="closeMobileNavigation" />
        <aside
          id="mobile-navigation"
          ref="mobileDrawer"
          class="mobile-navigation__drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-navigation-title"
          @keydown.esc="closeMobileNavigation"
          @keydown.tab="trapFocus"
        >
          <div class="mobile-navigation__drawer-header">
            <h2 id="mobile-navigation-title" class="visually-hidden">主要導覽</h2>
            <button
              ref="closeButton"
              class="mobile-navigation__close-button"
              type="button"
              aria-label="關閉導覽選單"
              @click="closeMobileNavigation"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <AppSidebar mobile @navigate="closeMobileNavigation" />
        </aside>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-shell {
  background: var(--color-page-background);
  display: grid;
  grid-template-columns: 16.5rem minmax(0, 1fr);
  min-height: 100vh;
}

.skip-link {
  background: var(--color-accent);
  border-radius: var(--radius-sm);
  color: white;
  left: var(--space-4);
  padding: var(--space-3) var(--space-4);
  position: fixed;
  text-decoration: none;
  top: -5rem;
  z-index: 30;
}

.skip-link:focus {
  top: var(--space-4);
}

.app-shell__desktop-sidebar {
  align-self: start;
  height: 100vh;
  height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  position: sticky;
  scrollbar-gutter: stable;
  top: 0;
}

.app-shell__workspace {
  min-width: 0;
}

.app-shell__main {
  margin: 0 auto;
  max-width: 92rem;
  outline: none;
  padding: clamp(1.5rem, 3vw, 2.75rem);
  width: 100%;
}

.mobile-navigation {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 20;
}

.mobile-navigation__backdrop {
  background: rgb(15 23 42 / 40%);
  inset: 0;
  position: absolute;
}

.mobile-navigation__drawer {
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  height: 100%;
  max-width: 20rem;
  position: relative;
  width: min(86vw, 20rem);
}

.mobile-navigation__drawer-header {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-3) var(--space-3) 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

.mobile-navigation__close-button {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: 1.75rem;
  height: 2.75rem;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 2.75rem;
}

.mobile-navigation__close-button:hover {
  background: var(--color-surface-subtle);
  color: var(--color-text);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 180ms ease;
}

.drawer-enter-active .mobile-navigation__drawer,
.drawer-leave-active .mobile-navigation__drawer {
  transition: transform 180ms ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .mobile-navigation__drawer,
.drawer-leave-to .mobile-navigation__drawer {
  transform: translateX(-100%);
}

@media (max-width: 64rem) {
  .app-shell {
    display: block;
  }

  .app-shell__desktop-sidebar {
    display: none;
  }

  .app-shell__main {
    padding: var(--space-6) var(--space-4);
  }
}
</style>
