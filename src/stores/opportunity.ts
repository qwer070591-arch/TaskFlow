import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { mockOpportunities } from '../data/opportunities'
import type { CreateOpportunityInput, OpportunityStage, SalesOpportunity } from '../types/opportunity'
import { defaultStageProbabilities } from '../utils/opportunity'

export const useOpportunityStore = defineStore('opportunity', () => {
  const opportunities = ref<SalesOpportunity[]>([...mockOpportunities])
  const searchQuery = ref('')
  const customerFilter = ref('all')
  const ownerFilter = ref('all')
  const showLost = ref(false)

  const activeOpportunities = computed(() => opportunities.value.filter((item) => item.stage !== 'lost'))
  const wonOpportunities = computed(() => opportunities.value.filter((item) => item.stage === 'won'))
  const lostOpportunities = computed(() => opportunities.value.filter((item) => item.stage === 'lost'))
  const pipelineTotal = computed(() => opportunities.value.filter((item) => ['lead', 'contacted', 'proposal', 'negotiation'].includes(item.stage)).reduce((total, item) => total + item.value, 0))
  const weightedPipeline = computed(() => opportunities.value.filter((item) => ['lead', 'contacted', 'proposal', 'negotiation'].includes(item.stage)).reduce((total, item) => total + item.value * item.probability / 100, 0))
  const wonTotal = computed(() => wonOpportunities.value.reduce((total, item) => total + item.value, 0))
  const filteredOpportunities = computed(() => {
    const query = searchQuery.value.trim().toLocaleLowerCase('zh-TW')
    return opportunities.value.filter((item) =>
      (showLost.value || item.stage !== 'lost') &&
      (customerFilter.value === 'all' || item.customerId === customerFilter.value) &&
      (ownerFilter.value === 'all' || item.ownerId === ownerFilter.value) &&
      item.title.toLocaleLowerCase('zh-TW').includes(query),
    )
  })
  const filteredLostOpportunities = computed(() => lostOpportunities.value.filter((item) =>
    (customerFilter.value === 'all' || item.customerId === customerFilter.value) &&
    (ownerFilter.value === 'all' || item.ownerId === ownerFilter.value) &&
    item.title.toLocaleLowerCase('zh-TW').includes(searchQuery.value.trim().toLocaleLowerCase('zh-TW')),
  ))

  function getOpportunitiesByStage(stage: OpportunityStage) {
    return filteredOpportunities.value.filter((item) => item.stage === stage)
  }
  function clearFilters() { searchQuery.value = ''; customerFilter.value = 'all'; ownerFilter.value = 'all'; showLost.value = false }
  function createOpportunity(input: CreateOpportunityInput) {
    const stage = input.stage
    const opportunity: SalesOpportunity = { ...input, id: `opportunity-${crypto.randomUUID()}`, title: input.title.trim(), value: Number(input.value), probability: stage === 'won' ? 100 : stage === 'lost' ? 0 : Number(input.probability), createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) }
    opportunities.value.unshift(opportunity)
    return opportunity
  }
  function updateOpportunityStage(opportunityId: string, stage: OpportunityStage) {
    const opportunity = opportunities.value.find((item) => item.id === opportunityId)
    if (!opportunity) return false
    opportunity.stage = stage
    opportunity.probability = defaultStageProbabilities[stage]
    opportunity.updatedAt = new Date().toISOString().slice(0, 10)
    return true
  }
  return { activeOpportunities, clearFilters, createOpportunity, customerFilter, filteredLostOpportunities, filteredOpportunities, getOpportunitiesByStage, lostOpportunities, opportunities, ownerFilter, pipelineTotal, searchQuery, showLost, updateOpportunityStage, weightedPipeline, wonOpportunities, wonTotal }
})
