import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { mockCustomerActivities, mockCustomers } from '../data/customers'
import type {
  CreateCustomerInput,
  CustomerActivity,
  CustomerSort,
  CustomerStatistics,
  CustomerStatus,
} from '../types/customer'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([...mockCustomers])
  const activities = ref<CustomerActivity[]>([...mockCustomerActivities])
  const searchQuery = ref('')
  const statusFilter = ref<CustomerStatus | 'all'>('all')
  const industryFilter = ref('all')
  const sortBy = ref<CustomerSort>('last-contact')

  const industries = computed(() => [...new Set(customers.value.map((customer) => customer.industry))].sort((first, second) => first.localeCompare(second, 'zh-TW')))
  const statistics = computed<CustomerStatistics>(() => ({
    total: customers.value.length,
    lead: customers.value.filter((customer) => customer.status === 'lead').length,
    active: customers.value.filter((customer) => customer.status === 'active').length,
    inactive: customers.value.filter((customer) => customer.status === 'inactive').length,
  }))
  const filteredCustomers = computed(() => {
    const query = searchQuery.value.trim().toLocaleLowerCase('zh-TW')
    const matching = customers.value.filter((customer) =>
      [customer.companyName, customer.contactName, customer.email]
        .some((value) => value.toLocaleLowerCase('zh-TW').includes(query)) &&
      (statusFilter.value === 'all' || customer.status === statusFilter.value) &&
      (industryFilter.value === 'all' || customer.industry === industryFilter.value),
    )
    return [...matching].sort((first, second) => {
      if (sortBy.value === 'company') return first.companyName.localeCompare(second.companyName, 'zh-TW')
      if (sortBy.value === 'created') return second.createdAt.localeCompare(first.createdAt)
      return (second.lastContactAt ?? '').localeCompare(first.lastContactAt ?? '')
    })
  })

  function clearFilters() {
    searchQuery.value = ''
    statusFilter.value = 'all'
    industryFilter.value = 'all'
    sortBy.value = 'last-contact'
  }

  function createCustomer(input: CreateCustomerInput) {
    const customer = { id: `customer-${crypto.randomUUID()}`, ...input, companyName: input.companyName.trim(), contactName: input.contactName.trim(), email: input.email.trim(), phone: input.phone?.trim() || undefined, createdAt: new Date().toISOString().slice(0, 10) }
    customers.value.unshift(customer)
    return customer
  }

  function getCustomerById(customerId: string) {
    return customers.value.find((customer) => customer.id === customerId)
  }

  function getActivitiesByCustomer(customerId: string) {
    return activities.value
      .filter((activity) => activity.customerId === customerId)
      .sort((first, second) => second.occurredAt.localeCompare(first.occurredAt))
  }

  return {
    activities,
    clearFilters,
    createCustomer,
    customers,
    filteredCustomers,
    getActivitiesByCustomer,
    getCustomerById,
    industries,
    industryFilter,
    searchQuery,
    sortBy,
    statistics,
    statusFilter,
  }
})
