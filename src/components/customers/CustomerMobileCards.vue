<script setup lang="ts">
import type { Customer } from '../../types/customer'
import { customerStatusLabels, formatCustomerDate } from '../../utils/customer'

defineProps<{ customers: Customer[] }>()
</script>

<template>
  <section aria-label="客戶卡片" class="customer-cards"><article v-for="customer in customers" :key="customer.id"><header><div><h2>{{ customer.companyName }}</h2><p>{{ customer.industry }}</p></div><span :class="`status status--${customer.status}`">{{ customerStatusLabels[customer.status] }}</span></header><dl><div><dt>聯絡人</dt><dd>{{ customer.contactName }}</dd></div><div><dt>電子郵件</dt><dd><a :href="`mailto:${customer.email}`">{{ customer.email }}</a></dd></div><div><dt>最後聯絡</dt><dd><time v-if="customer.lastContactAt" :datetime="customer.lastContactAt">{{ formatCustomerDate(customer.lastContactAt) }}</time><span v-else>—</span></dd></div></dl></article></section>
</template>

<style scoped>
.customer-cards { display: none; }@media (max-width: 44rem) { .customer-cards { display: grid; gap: var(--space-3); }.customer-cards article { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: grid; gap: var(--space-4); padding: var(--space-4); }header { align-items: flex-start; display: flex; gap: var(--space-3); justify-content: space-between; }h2, p { margin: 0; }h2 { color: var(--color-text); font-size: .9375rem; }header p { color: var(--color-text-muted); font-size: .75rem; margin-top: var(--space-1); }.status { border-radius: 999px; font-size: .6875rem; font-weight: 700; padding: .22rem var(--space-2); white-space: nowrap; }.status--lead { background: var(--color-warning-soft); color: var(--color-warning-strong); }.status--active { background: #f0fdf4; color: var(--color-success-strong); }.status--inactive { background: var(--color-surface-subtle); color: var(--color-text-secondary); }dl { display: grid; gap: var(--space-3); grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; }dt { color: var(--color-text-muted); font-size: .6875rem; font-weight: 700; }dd { color: var(--color-text-secondary); font-size: .8125rem; margin: var(--space-1) 0 0; overflow-wrap: anywhere; }a { color: var(--color-accent-strong); } }
</style>
