import { Decimal } from "@prisma/client/runtime/library";

export interface RepaymentSchedule {
  dueDate: Date;
  amountDue: number;
  isLastPayment: boolean;
}

/**
 * Calculate repayment schedule based on loan terms
 * @param principal - Loan principal amount
 * @param interestRate - Annual interest rate (percentage)
 * @param startDate - Loan start date
 * @param maturityDate - Expected return/maturity date
 * @returns Array of repayment schedules
 */
export function calculateRepaymentSchedule(
  principal: number,
  interestRate: number,
  startDate: Date,
  maturityDate: Date
): RepaymentSchedule[] {
  const schedules: RepaymentSchedule[] = [];
  
  // Calculate the difference in months between start and maturity date
  const monthsDiff = getMonthsDifference(startDate, maturityDate);
  
  if (monthsDiff <= 0) {
    throw new Error("Maturity date must be after start date");
  }
  
  // Calculate total interest amount
  const totalInterest = (principal * interestRate) / 100;
  const totalAmount = principal + totalInterest;
  
  // If loan term is 1 month or less, create single payment
  if (monthsDiff === 1) {
    schedules.push({
      dueDate: maturityDate,
      amountDue: totalAmount,
      isLastPayment: true
    });
    return schedules;
  }
  
  // Calculate monthly payment for regular payments (excluding last payment)
  const regularPayments = monthsDiff - 1; // All payments except the last one
  const monthlyPayment = totalInterest / monthsDiff; // Interest distributed across all months
  
  // Generate regular monthly payments
  for (let i = 1; i <= regularPayments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    
    schedules.push({
      dueDate,
      amountDue: monthlyPayment,
      isLastPayment: false
    });
  }
  
  // Final payment includes remaining principal + last monthly payment
  const totalRegularPayments = monthlyPayment * regularPayments;
  const finalPayment = totalAmount - totalRegularPayments;
  
  schedules.push({
    dueDate: maturityDate,
    amountDue: finalPayment,
    isLastPayment: true
  });
  
  return schedules;
}

/**
 * Calculate the difference in months between two dates
 */
function getMonthsDifference(startDate: Date, endDate: Date): number {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  return yearDiff * 12 + monthDiff;
}

/**
 * Validate repayment schedule parameters
 */
export function validateRepaymentParams(
  principal: number,
  interestRate: number,
  startDate: Date,
  maturityDate: Date
): string | null {
  if (principal <= 0) {
    return "Principal amount must be greater than 0";
  }
  
  if (interestRate < 0) {
    return "Interest rate cannot be negative";
  }
  
  if (startDate >= maturityDate) {
    return "Maturity date must be after start date";
  }
  
  const monthsDiff = getMonthsDifference(startDate, maturityDate);
  if (monthsDiff < 1) {
    return "Loan term must be at least 1 month";
  }
  
  return null; // No validation errors
}
