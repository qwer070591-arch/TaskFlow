<script setup lang="ts">
import type { ProjectSort, ProjectStatus } from '../../types/dashboard'

defineProps<{
  searchQuery: string
  sortBy: ProjectSort
  statusFilter: ProjectStatus | 'all'
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:sortBy': [value: ProjectSort]
  'update:statusFilter': [value: ProjectStatus | 'all']
}>()

function updateSearchQuery(event: Event) {
  emit('update:searchQuery', (event.target as HTMLInputElement).value)
}

function updateStatusFilter(event: Event) {
  emit('update:statusFilter', (event.target as HTMLSelectElement).value as ProjectStatus | 'all')
}

function updateSortBy(event: Event) {
  emit('update:sortBy', (event.target as HTMLSelectElement).value as ProjectSort)
}
</script>

<template>
  <section class="project-toolbar" aria-label="專案搜尋與篩選">
    <div class="project-toolbar__search">
      <label for="project-search">搜尋專案</label>
      <input
        id="project-search"
        :value="searchQuery"
        type="search"
        placeholder="依名稱搜尋"
        @input="updateSearchQuery"
      />
    </div>
    <div class="project-toolbar__select">
      <label for="project-status-filter">專案狀態</label>
      <select id="project-status-filter" :value="statusFilter" @change="updateStatusFilter">
        <option value="all">全部</option>
        <option value="planning">規劃中</option>
        <option value="active">進行中</option>
        <option value="completed">已完成</option>
        <option value="on-hold">暫停</option>
      </select>
    </div>
    <div class="project-toolbar__select">
      <label for="project-sort">排序方式</label>
      <select id="project-sort" :value="sortBy" @change="updateSortBy">
        <option value="updated">最近更新</option>
        <option value="due-date">到期日</option>
        <option value="name">專案名稱</option>
        <option value="progress">進度</option>
      </select>
    </div>
  </section>
</template>

<style scoped>
.project-toolbar {
  align-items: end;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: grid;
  gap: var(--space-4);
  grid-template-columns: minmax(12rem, 1fr) repeat(2, minmax(9rem, 0.32fr));
  padding: var(--space-4);
}

.project-toolbar__search,
.project-toolbar__select {
  display: grid;
  gap: var(--space-2);
}

label {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 700;
}

input,
select {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font: inherit;
  min-height: 2.75rem;
  padding: 0 var(--space-3);
  width: 100%;
}

input::placeholder {
  color: var(--color-text-muted);
}

@media (max-width: 46rem) {
  .project-toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .project-toolbar__search {
    grid-column: 1 / -1;
  }
}

@media (max-width: 31rem) {
  .project-toolbar {
    grid-template-columns: minmax(0, 1fr);
  }

  .project-toolbar__search {
    grid-column: auto;
  }
}
</style>
