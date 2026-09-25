export type CustomerStatus = 'lead' | 'active' | 'inactive'

export type CustomerSort = 'last-contact' | 'created' | 'company'

export interface Customer {
  companyName: string
  contactName: string
  createdAt: string
  email: string
  id: string
  industry: string
  lastContactAt?: string
  phone?: string
  status: CustomerStatus
}

export interface CreateCustomerInput {
  companyName: string
  contactName: string
  email: string
  industry: string
  phone?: string
  status: CustomerStatus
}

export interface CustomerStatistics {
  active: number
  inactive: number
  lead: number
  total: number
}
