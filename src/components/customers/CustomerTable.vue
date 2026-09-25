<script setup lang="ts">
import type { Customer } from '../../types/customer'
import { customerStatusLabels, formatCustomerDate } from '../../utils/customer'

defineProps<{ customers: Customer[] }>()
</script>

<template>
  <div class="customer-table-wrap"><table><caption class="visually-hidden">客戶清單</caption><thead><tr><th scope="col">客戶</th><th scope="col">聯絡人</th><th scope="col">狀態</th><th scope="col">產業</th><th scope="col">最後聯絡</th><th scope="col">建立日期</th></tr></thead><tbody><tr v-for="customer in customers" :key="customer.id"><th scope="row"><strong>{{ customer.companyName }}</strong><a :href="`mailto:${customer.email}`">{{ customer.email }}</a></th><td><strong>{{ customer.contactName }}</strong><span>{{ customer.phone || '—' }}</span></td><td><span :class="`status status--${customer.status}`">{{ customerStatusLabels[customer.status] }}</span></td><td>{{ customer.industry }}</td><td><time v-if="customer.lastContactAt" :datetime="customer.lastContactAt">{{ formatCustomerDate(customer.lastContactAt) }}</time><span v-else>—</span></td><td><time :datetime="customer.createdAt">{{ formatCustomerDate(customer.createdAt) }}</time></td></tr></tbody></table></div>
</template>

<style scoped>
.customer-table-wrap { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow-x: auto; }table { border-collapse: collapse; min-width: 52rem; width: 100%; }th, td { border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary); font-size: .8125rem; padding: var(--space-4) var(--space-5); text-align: left; white-space: nowrap; }thead th { background: var(--color-surface-subtle); color: var(--color-text-muted); font-size: .6875rem; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }tbody tr:hover { background: #fafbff; }tbody th { font-weight: 500; }strong, a, td span { display: block; }strong { color: var(--color-text); font-size: .8125rem; }a, td span { color: var(--color-text-muted); font-size: .75rem; font-weight: 400; margin-top: var(--space-1); }.status { border-radius: 999px; display: inline-block; font-size: .6875rem; font-weight: 700; padding: .22rem var(--space-2); }.status--lead { background: var(--color-warning-soft); color: var(--color-warning-strong); }.status--active { background: #f0fdf4; color: var(--color-success-strong); }.status--inactive { background: var(--color-surface-subtle); color: var(--color-text-secondary); }@media (max-width: 44rem) { .customer-table-wrap { display: none; } }
</style>
