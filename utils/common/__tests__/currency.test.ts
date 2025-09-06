import { formatCurrency, formatCompactCurrency } from '@/utils/common/currency'

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

  it('handles string inputs', () => {
    expect(formatCurrency('1000')).toBe('₱1,000.00')
    expect(formatCurrency('1234.56')).toBe('₱1,234.56')
  })

  it('handles invalid string inputs', () => {
    expect(formatCurrency('invalid')).toBe('PHP 0.00')
    expect(formatCurrency('')).toBe('PHP 0.00')
    expect(formatCurrency('abc123')).toBe('PHP 0.00')
  })

  it('accepts custom currency codes', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00')
  })
})

describe('formatCompactCurrency', () => {
  it('formats small numbers normally', () => {
    expect(formatCompactCurrency(999)).toBe('₱999')
    expect(formatCompactCurrency(500.5)).toBe('₱500.5')
  })

  it('formats thousands with K abbreviation', () => {
    expect(formatCompactCurrency(1000)).toBe('₱1K')
    expect(formatCompactCurrency(1500)).toBe('₱1.5K')
    expect(formatCompactCurrency(50000)).toBe('₱50K')
  })

  it('formats millions with M abbreviation', () => {
    expect(formatCompactCurrency(1000000)).toBe('₱1M')
    expect(formatCompactCurrency(1500000)).toBe('₱1.5M')
    expect(formatCompactCurrency(50000000)).toBe('₱50M')
  })

  it('formats billions with B abbreviation', () => {
    expect(formatCompactCurrency(1000000000)).toBe('₱1B')
    expect(formatCompactCurrency(1500000000)).toBe('₱1.5B')
  })

  it('handles string inputs', () => {
    expect(formatCompactCurrency('1000000')).toBe('₱1M')
    expect(formatCompactCurrency('1500')).toBe('₱1.5K')
  })

  it('handles invalid string inputs', () => {
    expect(formatCompactCurrency('invalid')).toBe('PHP 0.00')
    expect(formatCompactCurrency('')).toBe('PHP 0.00')
    expect(formatCompactCurrency('not-a-number')).toBe('PHP 0.00')
  })

  it('accepts custom currency codes', () => {
    expect(formatCompactCurrency(1000000, 'USD')).toBe('$1M')
  })

  it('handles negative numbers', () => {
    expect(formatCompactCurrency(-1000)).toBe('-₱1K')
    expect(formatCompactCurrency(-1500000)).toBe('-₱1.5M')
  })

  it('handles zero', () => {
    expect(formatCompactCurrency(0)).toBe('₱0')
  })
})
