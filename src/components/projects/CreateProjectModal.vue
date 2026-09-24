<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'

import type { CreateProjectInput, TeamMember } from '../../types/dashboard'

const props = defineProps<{
  members: TeamMember[]
}>()

const emit = defineEmits<{
  close: []
  create: [project: CreateProjectInput]
}>()

const dialog = ref<HTMLElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)
const form = reactive<CreateProjectInput>({
  name: '',
  description: '',
  startDate: '',
  dueDate: '',
  memberIds: [],
})
const errors = reactive({ name: '', startDate: '', dueDate: '' })

function validate() {
  errors.name = form.name.trim() ? '' : '請輸入專案名稱。'
  errors.startDate = form.startDate ? '' : '請選擇開始日期。'
  errors.dueDate = form.dueDate ? '' : '請選擇截止日期。'

  if (form.startDate && form.dueDate && form.dueDate < form.startDate) {
    errors.dueDate = '截止日期不得早於開始日期。'
  }

  return !errors.name && !errors.startDate && !errors.dueDate
}

function submit() {
  if (!validate()) return

  emit('create', {
    name: form.name,
    description: form.description,
    startDate: form.startDate,
    dueDate: form.dueDate,
    memberIds: form.memberIds,
  })
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !dialog.value) return

  const focusableElements = dialog.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  if (!firstFocusableElement || !lastFocusableElement) return

  if (event.shiftKey && document.activeElement === firstFocusableElement) {
    event.preventDefault()
    lastFocusableElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
    event.preventDefault()
    firstFocusableElement.focus()
  }
}

onMounted(() => {
  void nextTick(() => nameInput.value?.focus())
})
</script>

<template>
  <div class="project-modal" @mousedown.self="emit('close')">
    <section
      ref="dialog"
      class="project-modal__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
      @keydown.esc="emit('close')"
      @keydown.tab="trapFocus"
    >
      <header class="project-modal__header">
        <div>
          <h2 id="create-project-title">新增專案</h2>
          <p>建立專案後即可開始安排團隊工作。</p>
        </div>
        <button class="project-modal__close" type="button" aria-label="關閉新增專案視窗" @click="emit('close')">
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <form @submit.prevent="submit">
        <div class="project-modal__field">
          <label for="new-project-name">專案名稱</label>
          <input
            id="new-project-name"
            ref="nameInput"
            v-model="form.name"
            :aria-describedby="errors.name ? 'new-project-name-error' : undefined"
            :aria-invalid="Boolean(errors.name)"
            type="text"
          />
          <p v-if="errors.name" id="new-project-name-error" class="project-modal__error">{{ errors.name }}</p>
        </div>

        <div class="project-modal__field">
          <label for="new-project-description">專案描述</label>
          <textarea id="new-project-description" v-model="form.description" rows="3"></textarea>
        </div>

        <div class="project-modal__date-fields">
          <div class="project-modal__field">
            <label for="new-project-start-date">開始日期</label>
            <input
              id="new-project-start-date"
              v-model="form.startDate"
              :aria-describedby="errors.startDate ? 'new-project-start-date-error' : undefined"
              :aria-invalid="Boolean(errors.startDate)"
              type="date"
            />
            <p v-if="errors.startDate" id="new-project-start-date-error" class="project-modal__error">{{ errors.startDate }}</p>
          </div>
          <div class="project-modal__field">
            <label for="new-project-due-date">截止日期</label>
            <input
              id="new-project-due-date"
              v-model="form.dueDate"
              :aria-describedby="errors.dueDate ? 'new-project-due-date-error' : undefined"
              :aria-invalid="Boolean(errors.dueDate)"
              type="date"
            />
            <p v-if="errors.dueDate" id="new-project-due-date-error" class="project-modal__error">{{ errors.dueDate }}</p>
          </div>
        </div>

        <fieldset class="project-modal__members">
          <legend>專案成員</legend>
          <p>可選擇協作成員，之後仍可於專案設定調整。</p>
          <div class="project-modal__member-options">
            <label v-for="member in props.members" :key="member.id">
              <input v-model="form.memberIds" type="checkbox" :value="member.id" />
              <span>{{ member.name }}</span>
              <small>{{ member.role }}</small>
            </label>
          </div>
        </fieldset>

        <div class="project-modal__actions">
          <button class="project-modal__secondary-action" type="button" @click="emit('close')">取消</button>
          <button class="project-modal__primary-action" type="submit">建立專案</button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.project-modal {
  align-items: center;
  background: rgb(15 23 42 / 45%);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: var(--space-4);
  position: fixed;
  z-index: 40;
}

.project-modal__dialog {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: min(48rem, calc(100vh - 2rem));
  max-width: 38rem;
  overflow-y: auto;
  padding: var(--space-6);
  width: 100%;
}

.project-modal__header {
  align-items: flex-start;
  display: flex;
  gap: var(--space-4);
  justify-content: space-between;
}

h2,
p {
  margin: 0;
}

h2 {
  color: var(--color-text);
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}

.project-modal__header p,
.project-modal__members > p {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
  margin-top: var(--space-2);
}

.project-modal__close,
.project-modal__secondary-action,
.project-modal__primary-action {
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 700;
  min-height: 2.75rem;
}

.project-modal__close {
  background: transparent;
  border: 0;
  color: var(--color-text-secondary);
  flex: 0 0 auto;
  font-size: 1.75rem;
  line-height: 1;
  padding: 0;
  width: 2.75rem;
}

form {
  display: grid;
  gap: var(--space-5);
  margin-top: var(--space-6);
}

.project-modal__field {
  display: grid;
  gap: var(--space-2);
}

label,
legend {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
}

input[type='text'],
input[type='date'],
textarea {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font: inherit;
  padding: var(--space-3);
  width: 100%;
}

input[type='text'],
input[type='date'] {
  min-height: 2.75rem;
}

textarea {
  resize: vertical;
}

input[aria-invalid='true'] {
  border-color: var(--color-danger-strong);
}

.project-modal__error {
  color: var(--color-danger-strong);
  font-size: 0.75rem;
  line-height: 1.4;
}

.project-modal__date-fields {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.project-modal__members {
  border: 0;
  margin: 0;
  padding: 0;
}

.project-modal__member-options {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: var(--space-3);
}

.project-modal__member-options label {
  align-items: center;
  background: var(--color-surface-subtle);
  border-radius: var(--radius-md);
  display: grid;
  font-weight: 650;
  gap: 0 var(--space-2);
  grid-template-columns: auto 1fr;
  padding: var(--space-3);
}

.project-modal__member-options small {
  color: var(--color-text-muted);
  font-size: 0.6875rem;
  grid-column: 2;
  margin-top: var(--space-1);
}

.project-modal__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

.project-modal__secondary-action,
.project-modal__primary-action {
  border: 1px solid var(--color-border);
  padding: 0 var(--space-4);
}

.project-modal__secondary-action {
  background: var(--color-surface);
  color: var(--color-text-secondary);
}

.project-modal__primary-action {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

@media (max-width: 31rem) {
  .project-modal {
    align-items: flex-end;
    padding: 0;
  }

  .project-modal__dialog {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: calc(100vh - var(--space-6));
    padding: var(--space-5);
  }

  .project-modal__date-fields,
  .project-modal__member-options {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
