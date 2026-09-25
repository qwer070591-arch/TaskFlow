import type { CustomerStatus } from '../types/customer'

export const customerStatusLabels: Record<CustomerStatus, string> = {
  lead: '潛在客戶',
  active: '合作中',
  inactive: '暫停合作',
}

export function formatCustomerDate(date?: string) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date.slice(0, 10)}T00:00:00Z`))
}

export function isValidCustomerEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
