import type { SalesOpportunity } from '../types/opportunity'

export const mockOpportunities: SalesOpportunity[] = [
  { id: 'opportunity-nova', title: '品牌網站優化合作', customerId: 'customer-nova', value: 320000, stage: 'proposal', probability: 70, expectedCloseDate: '2026-10-20', ownerId: 'member-chen', createdAt: '2026-09-10', updatedAt: '2026-09-24' },
  { id: 'opportunity-vertex', title: '行動 onboarding 顧問案', customerId: 'customer-vertex', value: 480000, stage: 'negotiation', probability: 80, expectedCloseDate: '2026-10-12', ownerId: 'member-lin', createdAt: '2026-08-28', updatedAt: '2026-09-24' },
  { id: 'opportunity-lumina', title: '內容中心建置專案', customerId: 'customer-lumina', value: 260000, stage: 'contacted', probability: 40, expectedCloseDate: '2026-11-08', ownerId: 'member-wang', createdAt: '2026-09-05', updatedAt: '2026-09-20' },
  { id: 'opportunity-northstar', title: '年度媒體策略提案', customerId: 'customer-northstar', value: 180000, stage: 'lead', probability: 20, expectedCloseDate: '2026-11-30', ownerId: 'member-hsu', createdAt: '2026-09-12', updatedAt: '2026-09-22' },
  { id: 'opportunity-pixelcraft', title: '設計系統延伸合作', customerId: 'customer-pixelcraft', value: 420000, stage: 'won', probability: 100, expectedCloseDate: '2026-09-18', ownerId: 'member-chen', createdAt: '2026-08-01', updatedAt: '2026-09-18' },
  { id: 'opportunity-orbit', title: '系統整合評估案', customerId: 'customer-orbit', value: 150000, stage: 'lost', probability: 0, expectedCloseDate: '2026-09-10', ownerId: 'member-lin', createdAt: '2026-08-15', updatedAt: '2026-09-10' },
  { id: 'opportunity-apex', title: '數位轉型工作坊', customerId: 'customer-apex', value: 360000, stage: 'proposal', probability: 60, expectedCloseDate: '2026-10-28', ownerId: 'member-wang', createdAt: '2026-09-08', updatedAt: '2026-09-23' },
  { id: 'opportunity-brightline', title: '品牌內容規劃案', customerId: 'customer-brightline', value: 210000, stage: 'lead', probability: 20, expectedCloseDate: '2026-12-05', ownerId: 'member-hsu', createdAt: '2026-09-14', updatedAt: '2026-09-19' },
]
