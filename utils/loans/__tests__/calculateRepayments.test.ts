 import { calculateRepaymentSchedule, validateRepaymentParams } from '../repayment-calculator'

describe('calculateRepaymentSchedule', () => {
  it('calculates repayments correctly for 4-month loan', () => {
    const principal = 100000
    const interestRate = 12 // 12% annual
    const startDate = new Date('2025-01-01')
    const maturityDate = new Date('2025-05-01') // 4 months later
    
    const repayments = calculateRepaymentSchedule(principal, interestRate, startDate, maturityDate)
    
    expect(repayments).toHaveLength(4)
    
    // Total interest = 100000 * 12% = 12000
    // Interest distributed over 4 months = 3000 per month
    const monthlyInterest = 3000
    
    // First 3 payments are monthly interest only
    expect(repayments[0].amountDue).toBe(monthlyInterest)
    expect(repayments[1].amountDue).toBe(monthlyInterest)
    expect(repayments[2].amountDue).toBe(monthlyInterest)
    
    // Last payment includes remaining principal + last monthly interest
    // Last payment = 100000 + 3000 = 103000
    expect(repayments[3].amountDue).toBe(103000)
    expect(repayments[3].isLastPayment).toBe(true)
    
    // Verify total adds up correctly
    const totalPayments = repayments.reduce((sum, payment) => sum + payment.amountDue, 0)
    expect(totalPayments).toBe(principal + (principal * interestRate / 100))
  })

  it('handles 2-month loan correctly', () => {
    const principal = 50000
    const interestRate = 15 // 15% annual  
    const startDate = new Date('2025-01-01')
    const maturityDate = new Date('2025-03-01') // 2 months later
    
    const repayments = calculateRepaymentSchedule(principal, interestRate, startDate, maturityDate)
    
    expect(repayments).toHaveLength(2)
    
    // Total interest = 50000 * 15% = 7500
    // Interest distributed over 2 months = 3750 per month
    const monthlyInterest = 3750
    
    // First payment is interest only
    expect(repayments[0].amountDue).toBe(monthlyInterest)
    
    // Last payment includes principal + remaining interest  
    expect(repayments[1].amountDue).toBe(principal + monthlyInterest)
  })

  it('handles 1-month loan correctly', () => {
    const principal = 25000
    const interestRate = 10 // 10% annual
    const startDate = new Date('2025-01-01')
    const maturityDate = new Date('2025-02-01') // 1 month later
    
    const repayments = calculateRepaymentSchedule(principal, interestRate, startDate, maturityDate)
    
    expect(repayments).toHaveLength(1)
    
    // Total interest = 25000 * 10% = 2500
    // Single payment includes principal + total interest
    expect(repayments[0].amountDue).toBe(principal + 2500)
    expect(repayments[0].dueDate).toEqual(maturityDate)
  })
})

describe('validateRepaymentParams', () => {
  const validStartDate = new Date('2025-08-23')
  const validMaturityDate = new Date('2025-12-23') // 4 months later

  it('validates principal amount', () => {
    expect(validateRepaymentParams(0, 12, validStartDate, validMaturityDate))
      .toBe('Principal amount must be greater than 0')
    
    expect(validateRepaymentParams(-1000, 12, validStartDate, validMaturityDate))
      .toBe('Principal amount must be greater than 0')
  })

  it('validates interest rate', () => {
    expect(validateRepaymentParams(100000, -5, validStartDate, validMaturityDate))
      .toBe('Interest rate cannot be negative')
  })

  it('validates date sequence', () => {
    const invalidMaturityDate = new Date('2024-01-01') // Before start date
    expect(validateRepaymentParams(100000, 12, validStartDate, invalidMaturityDate))
      .toBe('Maturity date must be after start date')
  })

  it('validates minimum loan duration', () => {
    const shortMaturityDate = new Date('2025-08-24') // 1 day later
    expect(validateRepaymentParams(100000, 12, validStartDate, shortMaturityDate))
      .toBe('Loan term must be at least 1 month')
  })
})