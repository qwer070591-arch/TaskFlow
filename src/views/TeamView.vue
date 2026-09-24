<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import CreateMemberModal from '../components/team/CreateMemberModal.vue'
import MemberDetailDrawer from '../components/team/MemberDetailDrawer.vue'
import TeamMemberCard from '../components/team/TeamMemberCard.vue'
import { useProjectStore } from '../stores/project'
import type { CreateMemberInput } from '../types/dashboard'

const store = useProjectStore()
const { filteredTeamMembers, teamSearchQuery, teamStatistics, teamWorkloadFilter } = storeToRefs(store)
const selectedMemberId = ref<string | null>(null)
const createModalOpen = ref(false)
const feedback = ref('')
let feedbackTimer: number | undefined

const memberOverviews = computed(() =>
  filteredTeamMembers.value.flatMap((member) => {
    const overview = store.getMemberOverview(member.id)
    return overview ? [overview] : []
  }),
)
const selectedMember = computed(() => selectedMemberId.value ? store.getMemberById(selectedMemberId.value) : undefined)
const selectedProjects = computed(() => selectedMemberId.value ? store.getProjectsByMember(selectedMemberId.value) : [])
const selectedActiveTasks = computed(() => selectedMemberId.value ? store.getActiveTasksByMember(selectedMemberId.value) : [])
const selectedCompletedTasks = computed(() => selectedMemberId.value ? store.getCompletedTasksByMember(selectedMemberId.value) : [])

function showFeedback(message: string) {
  feedback.value = message
  if (feedbackTimer) window.clearTimeout(feedbackTimer)
  feedbackTimer = window.setTimeout(() => { feedback.value = '' }, 4000)
}

function openMemberDetail(memberId: string) { selectedMemberId.value = memberId }
function closeMemberDetail() {
  const memberId = selectedMemberId.value
  selectedMemberId.value = null
  if (memberId) void nextTick(() => document.querySelector<HTMLButtonElement>(`[data-member-detail-trigger="${memberId}"]`)?.focus())
}
function closeCreateModal() {
  createModalOpen.value = false
  void nextTick(() => document.querySelector<HTMLButtonElement>('[data-create-member-trigger]')?.focus())
}
function createMember(input: CreateMemberInput) {
  const member = store.createMember(input)
  showFeedback(`已新增成員「${member.name}」。`)
  closeCreateModal()
}

watch([selectedMemberId, createModalOpen], ([memberId, modalOpen]) => document.body.classList.toggle('has-modal-open', Boolean(memberId || modalOpen)))
onBeforeUnmount(() => { document.body.classList.remove('has-modal-open'); if (feedbackTimer) window.clearTimeout(feedbackTimer) })
</script>

<template>
  <div class="team-view">
    <header class="team-view__header"><div><p>TaskFlow</p><h1>團隊</h1><span>查看團隊成員、工作負載與目前任務分配。</span></div><button data-create-member-trigger type="button" @click="createModalOpen = true">＋ 新增成員</button></header>
    <section class="team-summary" aria-label="團隊摘要"><dl><div><dt>團隊成員</dt><dd>{{ teamStatistics.totalMemberCount }}</dd></div><div><dt>可分配成員</dt><dd>{{ teamStatistics.availableMemberCount }}</dd></div><div><dt>進行中任務</dt><dd>{{ teamStatistics.activeTaskCount }}</dd></div><div><dt>平均工作負載</dt><dd>{{ teamStatistics.averageWorkload }}%</dd></div></dl></section>
    <section class="team-toolbar" aria-label="團隊篩選"><label>搜尋成員<input v-model="teamSearchQuery" placeholder="姓名或職位" /></label><label>工作負載<select v-model="teamWorkloadFilter"><option value="all">全部</option><option value="low">低負載</option><option value="normal">正常</option><option value="high">高負載</option></select></label></section>
    <div v-if="feedback" aria-atomic="true" aria-live="polite" class="team-view__toast" role="status">{{ feedback }}</div>
    <section v-if="memberOverviews.length" class="team-grid" aria-label="團隊成員"><TeamMemberCard v-for="overview in memberOverviews" :key="overview.member.id" :overview="overview" @open="openMemberDetail" /></section>
    <section v-else class="team-empty" aria-label="沒有符合條件的成員"><h2>找不到符合條件的成員</h2><p>請調整搜尋關鍵字或工作負載篩選條件。</p><button type="button" @click="store.clearTeamFilters()">清除篩選</button></section>
    <MemberDetailDrawer v-if="selectedMember" :active-tasks="selectedActiveTasks" :completed-tasks="selectedCompletedTasks" :member="selectedMember" :projects="selectedProjects" @close="closeMemberDetail" />
    <CreateMemberModal v-if="createModalOpen" @close="closeCreateModal" @create="createMember" />
  </div>
</template>

<style scoped>
.team-view { display: grid; gap: var(--space-5); }.team-view__header { align-items: flex-start; display: flex; gap: var(--space-4); justify-content: space-between; }.team-view__header p, h1, .team-view__header span { margin: 0; }.team-view__header p { color: var(--color-accent-strong); font-size: .75rem; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }h1 { color: var(--color-text); font-size: clamp(1.875rem, 4vw, 2.5rem); letter-spacing: -.045em; line-height: 1.1; margin-top: var(--space-2); }.team-view__header span { color: var(--color-text-secondary); display: block; line-height: 1.6; margin-top: var(--space-2); }.team-view__header > button { background: var(--color-accent); border: 1px solid var(--color-accent); border-radius: var(--radius-md); color: white; flex: 0 0 auto; font-weight: 700; min-height: 2.75rem; padding: 0 var(--space-4); }.team-view__header > button:hover { background: var(--color-accent-strong); }.team-summary, .team-toolbar { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }.team-summary { padding: var(--space-4) var(--space-5); }dl { display: grid; gap: var(--space-4); grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 0; }dt { color: var(--color-text-muted); font-size: .75rem; font-weight: 700; }dd { color: var(--color-text); font-size: 1.375rem; font-variant-numeric: tabular-nums; margin: var(--space-1) 0 0; }.team-toolbar { display: grid; gap: var(--space-3); grid-template-columns: minmax(0, 1fr) minmax(12rem, .45fr); padding: var(--space-4); }label { color: var(--color-text-secondary); display: grid; font-size: .75rem; font-weight: 700; gap: var(--space-1); }input, select { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font: inherit; min-height: 2.5rem; padding: 0 var(--space-3); }.team-grid { display: grid; gap: var(--space-5); grid-template-columns: repeat(3, minmax(0, 1fr)); }.team-empty { background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg); padding: clamp(2rem, 8vw, 4rem); text-align: center; }.team-empty h2, .team-empty p { margin: 0; }.team-empty h2 { color: var(--color-text); font-size: 1.125rem; }.team-empty p { color: var(--color-text-muted); margin-top: var(--space-2); }.team-empty button { background: var(--color-accent); border: 1px solid var(--color-accent); border-radius: var(--radius-md); color: white; font: inherit; font-weight: 700; margin-top: var(--space-5); min-height: 2.75rem; padding: 0 var(--space-4); }.team-view__toast { background: var(--color-text); border-radius: var(--radius-md); bottom: var(--space-5); box-shadow: var(--shadow-lg); color: white; font-size: .8125rem; max-width: min(24rem, calc(100vw - 2rem)); padding: var(--space-3) var(--space-4); position: fixed; right: var(--space-5); z-index: 30; }@media (max-width: 64rem) { .team-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }@media (max-width: 45rem) { dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }.team-toolbar { grid-template-columns: minmax(0, 1fr); } }@media (max-width: 34rem) { .team-view__header { align-items: stretch; flex-direction: column; }.team-view__header > button { width: 100%; }.team-grid { grid-template-columns: minmax(0, 1fr); }.team-view__toast { bottom: var(--space-4); left: var(--space-4); right: var(--space-4); } }
</style>
