<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'

import type { CreateMemberInput } from '../../types/dashboard'

const emit = defineEmits<{ close: []; create: [member: CreateMemberInput] }>()
const dialog = ref<HTMLElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)
const form = reactive<CreateMemberInput>({ name: '', role: '', initials: '' })
const errors = reactive({ name: '', role: '' })

function validate() {
  errors.name = form.name.trim() ? '' : '請輸入成員姓名。'
  errors.role = form.role.trim() ? '' : '請輸入職位名稱。'
  return !errors.name && !errors.role
}

function submit() {
  if (!validate()) return
  emit('create', { ...form })
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !dialog.value) return
  const elements = dialog.value.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
  const first = elements[0]
  const last = elements[elements.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}

onMounted(() => void nextTick(() => nameInput.value?.focus()))
</script>

<template>
  <div class="member-modal" @mousedown.self="emit('close')">
    <section ref="dialog" class="member-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="create-member-title" @keydown.esc="emit('close')" @keydown.tab="trapFocus">
      <header><div><h2 id="create-member-title">新增成員</h2><p>建立團隊成員資料，稍後可透過專案與任務關聯工作內容。</p></div><button type="button" aria-label="關閉新增成員視窗" @click="emit('close')"><span aria-hidden="true">×</span></button></header>
      <form @submit.prevent="submit"><div class="member-modal__field"><label for="member-name">姓名</label><input id="member-name" ref="nameInput" v-model="form.name" :aria-invalid="Boolean(errors.name)" type="text" /><p v-if="errors.name" role="alert">{{ errors.name }}</p></div><div class="member-modal__field"><label for="member-role">職位</label><input id="member-role" v-model="form.role" :aria-invalid="Boolean(errors.role)" type="text" /><p v-if="errors.role" role="alert">{{ errors.role }}</p></div><div class="member-modal__field"><label for="member-initials">縮寫（選填）</label><input id="member-initials" v-model="form.initials" maxlength="2" type="text" /><span>未填寫時會依姓名自動產生。</span></div><footer><button type="button" @click="emit('close')">取消</button><button type="submit">建立成員</button></footer></form>
    </section>
  </div>
</template>

<style scoped>
.member-modal { align-items: center; background: rgb(15 23 42 / 45%); display: flex; inset: 0; justify-content: center; padding: var(--space-4); position: fixed; z-index: 40; }.member-modal__dialog { background: var(--color-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); max-width: 32rem; padding: var(--space-6); width: 100%; }header { align-items: flex-start; display: flex; gap: var(--space-4); justify-content: space-between; }h2, p { margin: 0; }h2 { color: var(--color-text); font-size: 1.25rem; }header p { color: var(--color-text-muted); font-size: .8125rem; line-height: 1.5; margin-top: var(--space-2); }header button { align-items: center; background: transparent; border: 0; border-radius: var(--radius-md); color: var(--color-text-secondary); display: inline-flex; font-size: 1.75rem; height: 2.75rem; justify-content: center; padding: 0; width: 2.75rem; }header button:hover { background: var(--color-surface-subtle); }form { display: grid; gap: var(--space-4); margin-top: var(--space-6); }.member-modal__field { display: grid; gap: var(--space-2); }label { color: var(--color-text-secondary); font-size: .8125rem; font-weight: 700; }input { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font: inherit; min-height: 2.75rem; padding: 0 var(--space-3); }input[aria-invalid='true'] { border-color: var(--color-danger-strong); }.member-modal__field p { color: var(--color-danger-strong); font-size: .75rem; }.member-modal__field span { color: var(--color-text-muted); font-size: .75rem; }footer { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-2); }footer button { border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-secondary); font: inherit; font-weight: 700; min-height: 2.75rem; padding: 0 var(--space-4); }footer button:last-child { background: var(--color-accent); border-color: var(--color-accent); color: white; }@media (max-width: 31rem) { .member-modal { align-items: flex-end; padding: 0; }.member-modal__dialog { border-radius: var(--radius-lg) var(--radius-lg) 0 0; padding: var(--space-5); } }
</style>
