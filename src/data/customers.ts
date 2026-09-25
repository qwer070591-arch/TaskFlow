import type { Customer, CustomerActivity } from '../types/customer'

export const mockCustomers: Customer[] = [
  { id: 'customer-nova', companyName: 'Nova Labs', contactName: 'Olivia Chen', email: 'olivia@novalabs.io', phone: '+886 2 2718 2401', status: 'lead', industry: '科技', createdAt: '2026-09-18', lastContactAt: '2026-09-22' },
  { id: 'customer-vertex', companyName: 'Vertex Studio', contactName: 'Ethan Wu', email: 'ethan@vertex.studio', phone: '+886 2 2786 1190', status: 'active', industry: '設計', createdAt: '2026-08-21', lastContactAt: '2026-09-24' },
  { id: 'customer-lumina', companyName: 'Lumina Digital', contactName: 'Grace Lin', email: 'grace@lumina.digital', phone: '+886 2 2345 6812', status: 'active', industry: '行銷', createdAt: '2026-08-10', lastContactAt: '2026-09-20' },
  { id: 'customer-orbit', companyName: 'Orbit Systems', contactName: 'Daniel Huang', email: 'daniel@orbit.systems', phone: '+886 3 565 4420', status: 'inactive', industry: '科技', createdAt: '2026-07-29', lastContactAt: '2026-08-30' },
  { id: 'customer-northstar', companyName: 'Northstar Media', contactName: 'Mia Chang', email: 'mia@northstar.media', phone: '+886 2 2501 7639', status: 'lead', industry: '媒體', createdAt: '2026-09-12' },
  { id: 'customer-pixelcraft', companyName: 'PixelCraft', contactName: 'Leo Tsai', email: 'leo@pixelcraft.tw', phone: '+886 2 2881 9334', status: 'active', industry: '設計', createdAt: '2026-08-05', lastContactAt: '2026-09-17' },
  { id: 'customer-apex', companyName: 'Apex Solutions', contactName: 'Sophie Wang', email: 'sophie@apex.solutions', phone: '+886 2 2365 4510', status: 'active', industry: '顧問', createdAt: '2026-07-18', lastContactAt: '2026-09-23' },
  { id: 'customer-brightline', companyName: 'Brightline', contactName: 'Noah Lee', email: 'noah@brightline.co', phone: '+886 4 2256 7081', status: 'inactive', industry: '媒體', createdAt: '2026-08-02', lastContactAt: '2026-09-02' },
]

export const mockCustomerActivities: CustomerActivity[] = [
  {
    id: 'customer-activity-nova-1',
    customerId: 'customer-nova',
    type: 'meeting',
    title: '討論 Nova Labs 的 Q4 專案方向',
    description: '確認品牌網站優化與後續合作的優先項目。',
    occurredAt: '2026-09-24T14:30:00+08:00',
  },
  {
    id: 'customer-activity-nova-2',
    customerId: 'customer-nova',
    type: 'email',
    title: '寄送合作提案與時程摘要',
    description: '提供初步專案範圍、團隊配置與預估時程。',
    occurredAt: '2026-09-20T10:15:00+08:00',
  },
  {
    id: 'customer-activity-nova-3',
    customerId: 'customer-nova',
    type: 'call',
    title: '初步需求訪談',
    description: '了解現有網站的使用情境與內容維護需求。',
    occurredAt: '2026-09-15T16:00:00+08:00',
  },
  {
    id: 'customer-activity-vertex-1',
    customerId: 'customer-vertex',
    type: 'meeting',
    title: '檢視行動版 onboarding 進度',
    description: '確認設計測試結果與下一輪優化方向。',
    occurredAt: '2026-09-24T11:00:00+08:00',
  },
  {
    id: 'customer-activity-vertex-2',
    customerId: 'customer-vertex',
    type: 'note',
    title: '記錄客戶回饋',
    description: '客戶希望優先處理新手引導中的權限說明。',
    occurredAt: '2026-09-18T09:40:00+08:00',
  },
  {
    id: 'customer-activity-lumina-1',
    customerId: 'customer-lumina',
    type: 'email',
    title: '確認內容中心啟動資訊',
    description: '已收到內容架構與第一批素材清單。',
    occurredAt: '2026-09-20T15:20:00+08:00',
  },
]
