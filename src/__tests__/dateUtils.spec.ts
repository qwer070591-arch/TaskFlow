import { describe, expect, it } from 'vitest'

import { formatCustomerDate } from '../utils/customer'
import { formatProjectDate } from '../utils/project'

const formatters = [formatCustomerDate, formatProjectDate]
const invalidDates = ['', 'not-a-date', '2026-02-31', '2026-04-31', '2026-13-01', '2026-00-10']

describe('safe ISO date formatting', () => {
  it('formats valid calendar dates and timestamps consistently', () => {
    for (const formatDate of formatters) {
      expect(formatDate('2026-09-25')).toContain('2026')
      expect(formatDate('2026-09-25T10:30:00')).toBe(formatDate('2026-09-25'))
    }
  })

  it('returns a fallback instead of throwing or rolling invalid dates forward', () => {
    for (const formatDate of formatters) {
      for (const invalidDate of invalidDates) {
        expect(() => formatDate(invalidDate)).not.toThrow()
        expect(formatDate(invalidDate)).toBe('—')
      }
    }
  })
})
