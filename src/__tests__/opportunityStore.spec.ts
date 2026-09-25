import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCustomerStore } from '../stores/customer'
import { useOpportunityStore } from '../stores/opportunity'
import { useProjectStore } from '../stores/project'
import { formatOpportunityCurrency } from '../utils/opportunity'

describe('opportunity store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('derives pipeline totals and opportunities by stage without counting lost deals', () => {
    const store = useOpportunityStore()
    expect(store.pipelineTotal).toBe(1810000)
    expect(store.weightedPipeline).toBe(1006000)
    expect(store.wonTotal).toBe(420000)
    expect(store.getOpportunitiesByStage('proposal').map((item) => item.id)).toEqual(['opportunity-nova', 'opportunity-apex'])
    expect(store.lostOpportunities).toHaveLength(1)
  })

  it('filters by search, customer, and owner relationships', () => {
    const store = useOpportunityStore(); const customers = useCustomerStore(); const projects = useProjectStore()
    store.searchQuery = 'onboarding'; expect(store.filteredOpportunities.map((item) => item.id)).toEqual(['opportunity-vertex'])
    store.clearFilters(); store.customerFilter = 'customer-nova'; expect(customers.getCustomerById(store.filteredOpportunities[0]?.customerId ?? '')?.companyName).toBe('Nova Labs')
    store.clearFilters(); store.ownerFilter = 'member-wang'; expect(store.filteredOpportunities.every((item) => projects.getMemberById(item.ownerId)?.name === 'Emma Wang')).toBe(true)
  })

  it('creates opportunities and applies won/lost probability rules', () => {
    const store = useOpportunityStore()
    const won = store.createOpportunity({ title: '新成交案', customerId: 'customer-nova', value: 50000, stage: 'won', probability: 20, expectedCloseDate: '2026-11-01', ownerId: 'member-lin' })
    const lost = store.createOpportunity({ title: '失敗案', customerId: 'customer-nova', value: 30000, stage: 'lost', probability: 80, expectedCloseDate: '2026-11-02', ownerId: 'member-lin' })
    expect(won.probability).toBe(100); expect(lost.probability).toBe(0); expect(store.opportunities).toHaveLength(10)
  })

  it('updates stages with deterministic business probabilities and restores a lost opportunity', () => {
    const store = useOpportunityStore()
    expect(store.updateOpportunityStage('opportunity-nova', 'won')).toBe(true)
    expect(store.opportunities.find((item) => item.id === 'opportunity-nova')).toMatchObject({ stage: 'won', probability: 100 })
    store.updateOpportunityStage('opportunity-orbit', 'lead')
    expect(store.opportunities.find((item) => item.id === 'opportunity-orbit')).toMatchObject({ stage: 'lead', probability: 20 })
    expect(store.updateOpportunityStage('missing', 'lead')).toBe(false)
  })

  it('formats TWD currency consistently', () => {
    expect(formatOpportunityCurrency(320000)).toContain('320,000')
  })
})
