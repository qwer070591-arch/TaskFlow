import type { Customer } from '../types/customer'

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
