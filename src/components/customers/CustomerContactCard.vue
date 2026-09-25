<script setup lang="ts">
import type { Customer } from '../../types/customer'

defineProps<{ customer: Customer }>()
</script>

<template>
  <section class="customer-contact-card" aria-labelledby="customer-contact-title">
    <header><h2 id="customer-contact-title">聯絡資訊</h2><p>客戶主要聯絡方式</p></header>
    <dl>
      <div><dt>聯絡人</dt><dd>{{ customer.contactName }}</dd></div>
      <div><dt>電子郵件</dt><dd><a :href="`mailto:${customer.email}`">{{ customer.email }}</a></dd></div>
      <div><dt>電話</dt><dd><a v-if="customer.phone" :href="`tel:${customer.phone.replace(/\s/g, '')}`">{{ customer.phone }}</a><span v-else>—</span></dd></div>
    </dl>
  </section>
</template>

<style scoped>
.customer-contact-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: var(--space-5); }header h2, header p { margin: 0; }h2 { color: var(--color-text); font-size: 1rem; }header p { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-1); }dl { display: grid; gap: var(--space-4); margin: var(--space-5) 0 0; }dt { color: var(--color-text-muted); font-size: .6875rem; font-weight: 750; }dd { color: var(--color-text-secondary); font-size: .875rem; margin: var(--space-1) 0 0; overflow-wrap: anywhere; }a { color: var(--color-accent-strong); text-decoration: none; }a:hover { text-decoration: underline; }a:focus-visible { border-radius: var(--radius-sm); outline: 3px solid #c7d2fe; outline-offset: 2px; }
</style>
