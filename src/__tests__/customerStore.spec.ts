import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useCustomerStore } from '../stores/customer'
import { customerStatusLabels, isValidCustomerEmail } from '../utils/customer'

describe('customer store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('derives customer statistics and search, status, industry filters', () => {
    const store = useCustomerStore()
    expect(store.statistics).toEqual({ total: 8, lead: 2, active: 4, inactive: 2 })

    store.searchQuery = 'olivia@novalabs.io'
    expect(store.filteredCustomers.map((customer) => customer.id)).toEqual(['customer-nova'])
    store.clearFilters()
    store.statusFilter = 'lead'
    expect(store.filteredCustomers.map((customer) => customer.id)).toEqual(['customer-nova', 'customer-northstar'])
    store.clearFilters()
    store.industryFilter = '\u8a2d\u8a08'
    expect(store.filteredCustomers.map((customer) => customer.id)).toEqual(['customer-vertex', 'customer-pixelcraft'])
  })

  it('sorts filtered customers by company and creation date', () => {
    const store = useCustomerStore()
    store.sortBy = 'company'
    expect(store.filteredCustomers[0]?.companyName).toBe('Apex Solutions')
    store.sortBy = 'created'
    expect(store.filteredCustomers[0]?.companyName).toBe('Nova Labs')
  })

  it('creates a customer in the CRM source of truth', () => {
    const store = useCustomerStore()
    const customer = store.createCustomer({ companyName: 'Halo Works', contactName: 'Ivy Chen', email: 'ivy@halo.works', industry: '\u8a2d\u8a08', status: 'lead' })

    expect(store.customers).toHaveLength(9)
    expect(store.customers[0]).toMatchObject({ id: customer.id, companyName: 'Halo Works', phone: undefined })
    expect(store.statistics.lead).toBe(3)
  })

  it('validates emails and provides status mappings', () => {
    expect(isValidCustomerEmail('name@example.com')).toBe(true)
    expect(isValidCustomerEmail('not-an-email')).toBe(false)
    expect(customerStatusLabels.active).toBe('\u5408\u4f5c\u4e2d')
  })

  it('selects customers by id and returns undefined for an invalid id', () => {
    const store = useCustomerStore()

    expect(store.getCustomerById('customer-nova')?.companyName).toBe('Nova Labs')
    expect(store.getCustomerById('missing-customer')).toBeUndefined()
  })

  it('filters customer activities and returns them in reverse chronological order', () => {
    const store = useCustomerStore()
    store.activities.push({
      id: 'customer-activity-nova-latest',
      customerId: 'customer-nova',
      type: 'note',
      title: '\u6700\u65b0\u7d00\u9304',
      description: '\u7528\u65bc\u78ba\u8a8d\u6392\u5e8f\u3002',
      occurredAt: '2026-09-25T09:00:00+08:00',
    })

    expect(store.getActivitiesByCustomer('customer-nova').map((activity) => activity.id)).toEqual([
      'customer-activity-nova-latest',
      'customer-activity-nova-1',
      'customer-activity-nova-2',
      'customer-activity-nova-3',
    ])
    expect(store.getActivitiesByCustomer('customer-brightline')).toEqual([])
  })
})
