<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import CustomerActivityTimeline from '../components/customers/CustomerActivityTimeline.vue'
import CustomerContactCard from '../components/customers/CustomerContactCard.vue'
import CustomerDetailHeader from '../components/customers/CustomerDetailHeader.vue'
import CustomerProjectList from '../components/customers/CustomerProjectList.vue'
import { useCustomerStore } from '../stores/customer'
import { useProjectStore } from '../stores/project'
import { customerStatusLabels, formatCustomerDate } from '../utils/customer'

const route = useRoute()
const customerStore = useCustomerStore()
const projectStore = useProjectStore()
const customerId = computed(() => String(route.params.id))
const customer = computed(() => customerStore.getCustomerById(customerId.value))
const activities = computed(() => customerStore.getActivitiesByCustomer(customerId.value))
const projects = computed(() => projectStore.getProjectsByCustomer(customerId.value))
</script>

<template>
  <div v-if="customer" class="customer-detail">
    <CustomerDetailHeader :customer="customer" />
    <div class="customer-detail__layout">
      <main class="customer-detail__main">
        <section class="customer-detail__overview" aria-labelledby="customer-overview-title">
          <header><h2 id="customer-overview-title">客戶概覽</h2><p>客戶關係與合作資訊</p></header>
          <dl>
            <div><dt>客戶狀態</dt><dd>{{ customerStatusLabels[customer.status] }}</dd></div>
            <div><dt>產業</dt><dd>{{ customer.industry }}</dd></div>
            <div><dt>建立日期</dt><dd><time :datetime="customer.createdAt">{{ formatCustomerDate(customer.createdAt) }}</time></dd></div>
            <div><dt>最後聯絡</dt><dd><time v-if="customer.lastContactAt" :datetime="customer.lastContactAt">{{ formatCustomerDate(customer.lastContactAt) }}</time><span v-else>—</span></dd></div>
          </dl>
        </section>
        <CustomerActivityTimeline :activities="activities" />
        <CustomerProjectList :projects="projects" />
      </main>
      <aside class="customer-detail__aside" aria-label="客戶聯絡資訊"><CustomerContactCard :customer="customer" /></aside>
    </div>
  </div>

  <section v-else class="customer-not-found" aria-labelledby="customer-not-found-title">
    <h1 id="customer-not-found-title">找不到此客戶</h1>
    <p>這位客戶可能不存在，或已不在目前的資料範圍內。</p>
    <RouterLink to="/customers">返回客戶列表</RouterLink>
  </section>
</template>

<style scoped>
.customer-detail { display: grid; gap: var(--space-5); }
.customer-detail__layout { align-items: start; display: grid; gap: var(--space-5); grid-template-columns: minmax(0, 1fr) minmax(16rem, .36fr); }
.customer-detail__main { display: grid; gap: var(--space-5); min-width: 0; }
.customer-detail__overview { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: var(--space-6); }
.customer-detail__overview header h2, .customer-detail__overview header p { margin: 0; }
.customer-detail__overview h2 { color: var(--color-text); font-size: 1rem; }
.customer-detail__overview header p { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-1); }
.customer-detail__overview dl { display: grid; gap: var(--space-4); grid-template-columns: repeat(4, minmax(0, 1fr)); margin: var(--space-5) 0 0; }
.customer-detail__overview dt { color: var(--color-text-muted); font-size: .6875rem; font-weight: 750; }
.customer-detail__overview dd { color: var(--color-text-secondary); font-size: .875rem; margin: var(--space-1) 0 0; }
.customer-not-found { background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg); padding: clamp(2rem, 8vw, 4rem); text-align: center; }
.customer-not-found h1, .customer-not-found p { margin: 0; }
.customer-not-found h1 { color: var(--color-text); font-size: clamp(1.5rem, 4vw, 2rem); }
.customer-not-found p { color: var(--color-text-muted); margin-top: var(--space-3); }
.customer-not-found a { color: var(--color-accent-strong); display: inline-block; font-weight: 700; margin-top: var(--space-5); text-decoration: none; }
.customer-not-found a:hover { text-decoration: underline; }
.customer-not-found a:focus-visible { border-radius: var(--radius-sm); outline: 3px solid #c7d2fe; outline-offset: 3px; }
@media (max-width: 64rem) { .customer-detail__layout { grid-template-columns: minmax(0, 1fr); }.customer-detail__aside :deep(.customer-contact-card dl) { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 44rem) { .customer-detail__overview, .customer-detail__aside :deep(.customer-contact-card) { padding: var(--space-5); }.customer-detail__overview dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }.customer-detail__aside :deep(.customer-contact-card dl) { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 30rem) { .customer-detail__overview dl { grid-template-columns: minmax(0, 1fr); } }
</style>
