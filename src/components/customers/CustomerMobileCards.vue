<script setup lang="ts">
import type { Customer } from '../../types/customer'
import { customerStatusLabels, formatCustomerDate } from '../../utils/customer'

defineProps<{ customers: Customer[] }>()
</script>

<template>
  <section class="customer-cards" aria-label="客戶卡片">
    <article v-for="customer in customers" :key="customer.id">
      <header><div><RouterLink :to="`/customers/${customer.id}`">{{ customer.companyName }}</RouterLink><p>{{ customer.industry }}</p></div><span :class="`status status--${customer.status}`">{{ customerStatusLabels[customer.status] }}</span></header>
      <dl><div><dt>聯絡人</dt><dd>{{ customer.contactName }}</dd></div><div><dt>電子郵件</dt><dd><a :href="`mailto:${customer.email}`">{{ customer.email }}</a></dd></div><div><dt>最後聯絡</dt><dd><time v-if="customer.lastContactAt" :datetime="customer.lastContactAt">{{ formatCustomerDate(customer.lastContactAt) }}</time><span v-else>—</span></dd></div></dl>
      <RouterLink class="customer-cards__detail-link" :to="`/customers/${customer.id}`" :aria-label="`查看 ${customer.companyName} 詳情`">查看詳情</RouterLink>
    </article>
  </section>
</template>

<style scoped>
.customer-cards { display: none; }@media (max-width: 44rem) { .customer-cards { display: grid; gap: var(--space-3); }.customer-cards article { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: var(--space-4); }.customer-cards header { align-items: flex-start; display: flex; gap: var(--space-3); justify-content: space-between; }.customer-cards h2, .customer-cards p { margin: 0; }.customer-cards header a { color: var(--color-text); font-size: .9375rem; font-weight: 750; text-decoration: none; }.customer-cards header a:hover, .customer-cards__detail-link:hover { text-decoration: underline; }.customer-cards header a:focus-visible, .customer-cards__detail-link:focus-visible, dd a:focus-visible { border-radius: var(--radius-sm); outline: 3px solid #c7d2fe; outline-offset: 2px; }.customer-cards header p { color: var(--color-text-muted); font-size: .75rem; margin-top: var(--space-1); }.status { border-radius: 999px; flex: 0 0 auto; font-size: .6875rem; font-weight: 750; padding: .25rem var(--space-2); }.status--lead { background: var(--color-warning-soft); color: var(--color-warning-strong); }.status--active { background: #f0fdf4; color: var(--color-success-strong); }.status--inactive { background: var(--color-surface-subtle); color: var(--color-text-secondary); }.customer-cards dl { display: grid; gap: var(--space-3); margin: var(--space-4) 0 0; }.customer-cards dt { color: var(--color-text-muted); font-size: .6875rem; font-weight: 750; }.customer-cards dd { color: var(--color-text-secondary); font-size: .8125rem; margin: var(--space-1) 0 0; overflow-wrap: anywhere; }.customer-cards dd a, .customer-cards__detail-link { color: var(--color-accent-strong); text-decoration: none; }.customer-cards__detail-link { display: inline-block; font-size: .8125rem; font-weight: 750; margin-top: var(--space-4); } }
</style>
