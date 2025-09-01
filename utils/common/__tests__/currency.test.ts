import { formatCurrency } from '@/utils/common/currency'

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(1000)).toBe('₱1,000.00')
    expect(formatCurrency(1000.5)).toBe('₱1,000.50')
    expect(formatCurrency(1234567.89)).toBe('₱1,234,567.89')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('₱0.00')
  })

  it('formats negative numbers correctly', () => {
    expect(formatCurrency(-1000)).toBe('-₱1,000.00')
    expect(formatCurrency(-1234.56)).toBe('-₱1,234.56')
  })

  it('handles decimal precision', () => {
    expect(formatCurrency(10.1)).toBe('₱10.10')
    expect(formatCurrency(10.123)).toBe('₱10.12')
  })

  it('handles very large numbers', () => {
    expect(formatCurrency(1000000000)).toBe('₱1,000,000,000.00')
  })

  it('handles very small numbers', () => {
    expect(formatCurrency(0.01)).toBe('₱0.01')
    expect(formatCurrency(0.001)).toBe('₱0.00')
  })
})
