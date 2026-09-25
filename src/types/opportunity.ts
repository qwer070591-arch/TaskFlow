export type OpportunityStage = 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost'

export interface SalesOpportunity {
  createdAt: string
  customerId: string
  expectedCloseDate: string
  id: string
  ownerId: string
  probability: number
  stage: OpportunityStage
  title: string
  updatedAt: string
  value: number
}

export interface CreateOpportunityInput {
  customerId: string
  expectedCloseDate: string
  ownerId: string
  probability: number
  stage: OpportunityStage
  title: string
  value: number
}
