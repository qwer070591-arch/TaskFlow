<script setup lang="ts">
import type { CustomerActivity } from '../../types/customer'
import { customerActivityTypeLabels, formatCustomerDate } from '../../utils/customer'

defineProps<{ activities: CustomerActivity[] }>()
</script>

<template>
  <section class="customer-timeline" aria-labelledby="customer-timeline-title">
    <header><h2 id="customer-timeline-title">客戶活動</h2><p>依最近互動排序</p></header>
    <p v-if="!activities.length" class="customer-timeline__empty">目前沒有客戶活動紀錄。</p>
    <ol v-else>
      <li v-for="activity in activities" :key="activity.id">
        <div class="customer-timeline__marker" aria-hidden="true"></div>
        <div class="customer-timeline__entry">
          <div class="customer-timeline__entry-meta"><time :datetime="activity.occurredAt">{{ formatCustomerDate(activity.occurredAt) }}</time><span>{{ customerActivityTypeLabels[activity.type] }}</span></div>
          <h3>{{ activity.title }}</h3>
          <p>{{ activity.description }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.customer-timeline { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: var(--space-6); }header h2, header p, h3, .customer-timeline__entry p { margin: 0; }h2 { color: var(--color-text); font-size: 1rem; }header p, .customer-timeline__empty { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-1); }.customer-timeline ol { list-style: none; margin: var(--space-5) 0 0; padding: 0; }.customer-timeline li { display: grid; gap: var(--space-3); grid-template-columns: 1rem minmax(0, 1fr); position: relative; }.customer-timeline li:not(:last-child)::before { background: var(--color-border); bottom: calc(var(--space-3) * -1); content: ''; left: .4375rem; position: absolute; top: 1rem; width: 1px; }.customer-timeline li + li { margin-top: var(--space-5); }.customer-timeline__marker { background: var(--color-accent); border: 3px solid var(--color-accent-soft); border-radius: 50%; height: .875rem; margin-top: .2rem; width: .875rem; z-index: 1; }.customer-timeline__entry-meta { align-items: center; display: flex; flex-wrap: wrap; gap: var(--space-2); }.customer-timeline time { color: var(--color-text-muted); font-size: .75rem; font-weight: 700; }.customer-timeline__entry-meta span { background: var(--color-surface-subtle); border-radius: 999px; color: var(--color-text-secondary); font-size: .6875rem; font-weight: 750; padding: .2rem var(--space-2); }h3 { color: var(--color-text); font-size: .9375rem; line-height: 1.45; margin-top: var(--space-2); }.customer-timeline__entry p { color: var(--color-text-secondary); font-size: .8125rem; line-height: 1.6; margin-top: var(--space-1); }@media (max-width: 40rem) { .customer-timeline { padding: var(--space-5); } }
</style>
