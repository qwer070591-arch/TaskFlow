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
    store.industryFilter = '設計'
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
    const customer = store.createCustomer({ companyName: 'Halo Works', contactName: 'Ivy Chen', email: 'ivy@halo.works', industry: '設計', status: 'lead' })

    expect(store.customers).toHaveLength(9)
    expect(store.customers[0]).toMatchObject({ id: customer.id, companyName: 'Halo Works', phone: undefined })
    expect(store.statistics.lead).toBe(3)
  })

  it('validates emails and provides status mappings', () => {
    expect(isValidCustomerEmail('name@example.com')).toBe(true)
    expect(isValidCustomerEmail('not-an-email')).toBe(false)
    expect(customerStatusLabels.active).toBe('合作中')
  })
})
