<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import CreateProjectModal from '../components/projects/CreateProjectModal.vue'
import ProjectCard from '../components/projects/ProjectCard.vue'
import ProjectToolbar from '../components/projects/ProjectToolbar.vue'
import { useProjectStore } from '../stores/project'
import type { CreateProjectInput } from '../types/dashboard'

const projectStore = useProjectStore()
const { filteredProjects, searchQuery, sortBy, statistics, statusFilter, teamMembers } = storeToRefs(projectStore)
const isCreateModalOpen = ref(false)
const successMessage = ref('')
const createButton = ref<HTMLButtonElement | null>(null)

function openCreateModal() {
  successMessage.value = ''
  isCreateModalOpen.value = true
}

function closeCreateModal() {
  isCreateModalOpen.value = false
  void nextTick(() => createButton.value?.focus())
}

function createProject(input: CreateProjectInput) {
  const project = projectStore.createProject(input)
  successMessage.value = `已新增專案「${project.name}」。`
  closeCreateModal()
}

function clearFilters() {
  projectStore.clearFilters()
}

watch(isCreateModalOpen, (isOpen) => {
  document.body.classList.toggle('has-modal-open', isOpen)
})

onBeforeUnmount(() => {
  document.body.classList.remove('has-modal-open')
})
</script>

<template>
  <div class="projects-page">
    <header class="projects-page__header">
      <div>
        <p class="projects-page__eyebrow">TaskFlow</p>
        <h1>專案</h1>
        <p class="projects-page__intro">管理與追蹤團隊目前的所有專案。</p>
      </div>
      <button ref="createButton" class="projects-page__create-button" type="button" @click="openCreateModal">
        <span aria-hidden="true">＋</span>
        新增專案
      </button>
    </header>

    <section class="projects-page__summary" aria-labelledby="project-summary-title">
      <h2 id="project-summary-title" class="visually-hidden">專案摘要</h2>
      <dl>
        <div>
          <dt>全部專案</dt>
          <dd>{{ statistics.total }}</dd>
        </div>
        <div>
          <dt>進行中</dt>
          <dd>{{ statistics.active }}</dd>
        </div>
        <div>
          <dt>已完成</dt>
          <dd>{{ statistics.completed }}</dd>
        </div>
        <div>
          <dt>即將到期</dt>
          <dd>{{ statistics.upcoming }}</dd>
        </div>
      </dl>
    </section>

    <ProjectToolbar
      :search-query="searchQuery"
      :status-filter="statusFilter"
      :sort-by="sortBy"
      @update:search-query="searchQuery = $event"
      @update:status-filter="statusFilter = $event"
      @update:sort-by="sortBy = $event"
    />

    <p v-if="successMessage" class="projects-page__success" role="status">{{ successMessage }}</p>

    <section v-if="filteredProjects.length" class="projects-page__list" aria-label="專案列表">
      <ProjectCard v-for="project in filteredProjects" :key="project.id" :project="project" />
    </section>

    <section v-else class="projects-page__empty-state" aria-labelledby="no-projects-title">
      <h2 id="no-projects-title">找不到符合條件的專案</h2>
      <p>請調整搜尋條件或篩選設定。</p>
      <button type="button" @click="clearFilters">清除篩選</button>
    </section>

    <CreateProjectModal
      v-if="isCreateModalOpen"
      :members="teamMembers"
      @close="closeCreateModal"
      @create="createProject"
    />
  </div>
</template>

<style scoped>
.projects-page {
  display: grid;
  gap: var(--space-5);
}

.projects-page__header {
  align-items: flex-end;
  display: flex;
  gap: var(--space-5);
  justify-content: space-between;
  padding: var(--space-2) 0 var(--space-3);
}

.projects-page__eyebrow,
h1,
.projects-page__intro {
  margin: 0;
}

.projects-page__eyebrow {
  color: var(--color-accent-strong);
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h1 {
  color: var(--color-text);
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  letter-spacing: -0.045em;
  line-height: 1.1;
  margin-top: var(--space-2);
}

.projects-page__intro {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
  margin-top: var(--space-3);
}

.projects-page__create-button,
.projects-page__empty-state button {
  align-items: center;
  background: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font: inherit;
  font-weight: 700;
  gap: var(--space-2);
  min-height: 2.75rem;
  padding: 0 var(--space-4);
}

.projects-page__summary {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4) var(--space-5);
}

dl {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;
}

dt {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 700;
}

dd {
  color: var(--color-text);
  font-size: 1.5rem;
  font-variant-numeric: tabular-nums;
  font-weight: 750;
  margin: var(--space-1) 0 0;
}

.projects-page__success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  color: var(--color-success-strong);
  font-size: 0.875rem;
  font-weight: 650;
  margin: 0;
  padding: var(--space-3) var(--space-4);
}

.projects-page__list {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.projects-page__empty-state {
  align-items: center;
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  display: grid;
  justify-items: center;
  padding: clamp(2rem, 8vw, 4rem) var(--space-5);
  text-align: center;
}

.projects-page__empty-state h2,
.projects-page__empty-state p {
  margin: 0;
}

.projects-page__empty-state h2 {
  color: var(--color-text);
  font-size: 1.125rem;
}

.projects-page__empty-state p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-top: var(--space-2);
}

.projects-page__empty-state button {
  margin-top: var(--space-5);
}

@media (max-width: 54rem) {
  .projects-page__list {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 40rem) {
  .projects-page__header {
    align-items: flex-start;
    flex-direction: column;
  }

  dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
