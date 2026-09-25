<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'

import type { CreateCustomerInput, CustomerStatus } from '../../types/customer'
import { isValidCustomerEmail } from '../../utils/customer'

const emit = defineEmits<{ close: []; create: [customer: CreateCustomerInput] }>()
const dialog = ref<HTMLElement | null>(null)
const companyInput = ref<HTMLInputElement | null>(null)
const form = reactive<CreateCustomerInput>({ companyName: '', contactName: '', email: '', phone: '', industry: '', status: 'lead' })
const errors = reactive({ companyName: '', contactName: '', email: '', industry: '' })

function validate() {
  errors.companyName = form.companyName.trim() ? '' : '請輸入客戶名稱。'
  errors.contactName = form.contactName.trim() ? '' : '請輸入聯絡人姓名。'
  errors.email = !form.email.trim() ? '請輸入電子郵件。' : isValidCustomerEmail(form.email) ? '' : '請輸入有效的電子郵件。'
  errors.industry = form.industry.trim() ? '' : '請輸入產業。'
  return !errors.companyName && !errors.contactName && !errors.email && !errors.industry
}

function submit() { if (validate()) emit('create', { ...form }) }
function trapFocus(event: KeyboardEvent) { if (event.key !== 'Tab' || !dialog.value) return; const elements = dialog.value.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'); const first = elements[0]; const last = elements[elements.length - 1]; if (!first || !last) return; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() } }
function updateStatus(event: Event) { form.status = (event.target as HTMLSelectElement).value as CustomerStatus }
onMounted(() => void nextTick(() => companyInput.value?.focus()))
</script>

<template>
  <div class="customer-modal" @mousedown.self="emit('close')"><section ref="dialog" class="customer-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="create-customer-title" @keydown.esc="emit('close')" @keydown.tab="trapFocus"><header><div><h2 id="create-customer-title">新增客戶</h2><p>建立前端 demo 用的客戶資料。</p></div><button type="button" aria-label="關閉新增客戶視窗" @click="emit('close')"><span aria-hidden="true">×</span></button></header><form @submit.prevent="submit"><div class="field"><label for="customer-company">客戶名稱</label><input id="customer-company" ref="companyInput" v-model="form.companyName" :aria-invalid="Boolean(errors.companyName)" type="text" /><p v-if="errors.companyName" role="alert">{{ errors.companyName }}</p></div><div class="field"><label for="customer-contact">聯絡人</label><input id="customer-contact" v-model="form.contactName" :aria-invalid="Boolean(errors.contactName)" type="text" /><p v-if="errors.contactName" role="alert">{{ errors.contactName }}</p></div><div class="field"><label for="customer-email">電子郵件</label><input id="customer-email" v-model="form.email" :aria-invalid="Boolean(errors.email)" type="email" /><p v-if="errors.email" role="alert">{{ errors.email }}</p></div><div class="field"><label for="customer-phone">電話（選填）</label><input id="customer-phone" v-model="form.phone" type="tel" /></div><div class="field"><label for="customer-industry">產業</label><input id="customer-industry" v-model="form.industry" :aria-invalid="Boolean(errors.industry)" type="text" /><p v-if="errors.industry" role="alert">{{ errors.industry }}</p></div><div class="field"><label for="customer-status">客戶狀態</label><select id="customer-status" :value="form.status" @change="updateStatus"><option value="lead">潛在客戶</option><option value="active">合作中</option><option value="inactive">暫停合作</option></select></div><footer><button type="button" @click="emit('close')">取消</button><button type="submit">建立客戶</button></footer></form></section></div>
</template>

<style scoped>
.customer-modal { align-items: center; background: rgb(15 23 42 / 45%); display: flex; inset: 0; justify-content: center; padding: var(--space-4); position: fixed; z-index: 40; }.customer-modal__dialog { background: var(--color-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); max-height: calc(100vh - 2rem); max-width: 36rem; overflow-y: auto; padding: var(--space-6); width: 100%; }header { align-items: flex-start; display: flex; gap: var(--space-4); justify-content: space-between; }h2, p { margin: 0; }h2 { color: var(--color-text); font-size: 1.25rem; }header p { color: var(--color-text-muted); font-size: .8125rem; margin-top: var(--space-2); }header button { align-items: center; background: transparent; border: 0; border-radius: var(--radius-md); color: var(--color-text-secondary); display: inline-flex; font-size: 1.75rem; height: 2.75rem; justify-content: center; padding: 0; width: 2.75rem; }header button:hover { background: var(--color-surface-subtle); }form { display: grid; gap: var(--space-4); margin-top: var(--space-6); }.field { display: grid; gap: var(--space-2); }label { color: var(--color-text-secondary); font-size: .8125rem; font-weight: 700; }input, select { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font: inherit; min-height: 2.75rem; padding: 0 var(--space-3); }input[aria-invalid='true'] { border-color: var(--color-danger-strong); }.field p { color: var(--color-danger-strong); font-size: .75rem; }footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-2); }footer button { border: 1px solid var(--color-border); border-radius: var(--radius-md); font: inherit; font-weight: 700; min-height: 2.75rem; padding: 0 var(--space-4); }footer button:last-child { background: var(--color-accent); border-color: var(--color-accent); color: white; }@media (max-width: 31rem) { .customer-modal { align-items: flex-end; padding: 0; }.customer-modal__dialog { border-radius: var(--radius-lg) var(--radius-lg) 0 0; padding: var(--space-5); } }
</style>
