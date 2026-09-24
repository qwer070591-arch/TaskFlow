<script setup lang="ts">
defineProps<{
  description: string
  title: string
}>()
</script>

<template>
  <section class="page-placeholder" :aria-labelledby="`${title.toLowerCase()}-title`">
    <p class="page-placeholder__eyebrow">TaskFlow</p>
    <h1 :id="`${title.toLowerCase()}-title`">{{ title }}</h1>
    <p class="page-placeholder__description">{{ description }}</p>
  </section>
</template>

<style scoped>
.page-placeholder {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: clamp(1.5rem, 4vw, 2.5rem);
}

.page-placeholder__eyebrow {
  color: var(--color-accent-strong);
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  margin: 0 0 var(--space-3);
  text-transform: uppercase;
}

h1 {
  color: var(--color-text);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0;
}

.page-placeholder__description {
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: var(--space-4) 0 0;
  max-width: 40rem;
}
</style>
