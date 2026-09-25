import type { OpportunityStage } from '../types/opportunity'

export const opportunityStageLabels: Record<OpportunityStage, string> = { lead: '潛在機會', contacted: '已聯絡', proposal: '提案中', negotiation: '協商中', won: '成交', lost: '失敗' }
export const activeOpportunityStages: OpportunityStage[] = ['lead', 'contacted', 'proposal', 'negotiation', 'won']
export const defaultStageProbabilities: Record<OpportunityStage, number> = { lead: 20, contacted: 40, proposal: 60, negotiation: 80, won: 100, lost: 0 }

export function formatOpportunityCurrency(value: number) {
  return `NT$${new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(value)}`
}
