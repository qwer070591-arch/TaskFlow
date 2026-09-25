<script setup lang="ts">
import type { Customer } from '../../types/customer'
import { customerStatusLabels } from '../../utils/customer'

defineProps<{ customer: Customer }>()
</script>

<template>
  <header class="customer-detail-header">
    <RouterLink class="customer-detail-header__back" to="/customers">← 返回客戶</RouterLink>
    <div class="customer-detail-header__content">
      <div>
        <p class="customer-detail-header__eyebrow">客戶關係管理</p>
        <h1>{{ customer.companyName }}</h1>
        <p class="customer-detail-header__contact">主要聯絡人：{{ customer.contactName }}</p>
      </div>
      <div class="customer-detail-header__meta">
        <span :class="`customer-status customer-status--${customer.status}`">{{ customerStatusLabels[customer.status] }}</span>
        <span class="customer-detail-header__industry">{{ customer.industry }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.customer-detail-header { display: grid; gap: var(--space-4); }.customer-detail-header__back { color: var(--color-accent-strong); font-size: .875rem; font-weight: 700; text-decoration: none; width: fit-content; }.customer-detail-header__back:hover { text-decoration: underline; }.customer-detail-header__back:focus-visible { border-radius: var(--radius-sm); outline: 3px solid #c7d2fe; outline-offset: 3px; }.customer-detail-header__content { align-items: flex-start; display: flex; gap: var(--space-5); justify-content: space-between; }.customer-detail-header__eyebrow, h1, .customer-detail-header__contact { margin: 0; }.customer-detail-header__eyebrow { color: var(--color-accent-strong); font-size: .75rem; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }h1 { color: var(--color-text); font-size: clamp(1.875rem, 4vw, 2.5rem); letter-spacing: -.045em; line-height: 1.1; margin-top: var(--space-2); }.customer-detail-header__contact { color: var(--color-text-secondary); margin-top: var(--space-3); }.customer-detail-header__meta { align-items: center; display: flex; flex: 0 0 auto; flex-wrap: wrap; gap: var(--space-2); }.customer-status, .customer-detail-header__industry { border-radius: 999px; font-size: .75rem; font-weight: 750; padding: .3rem var(--space-3); }.customer-status--lead { background: var(--color-warning-soft); color: var(--color-warning-strong); }.customer-status--active { background: #f0fdf4; color: var(--color-success-strong); }.customer-status--inactive { background: var(--color-surface-subtle); color: var(--color-text-secondary); }.customer-detail-header__industry { background: var(--color-accent-soft); color: var(--color-accent-strong); }@media (max-width: 40rem) { .customer-detail-header__content { flex-direction: column; }.customer-detail-header__meta { margin-top: calc(var(--space-2) * -1); } }
</style>
