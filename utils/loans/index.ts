/**
 * Calculate the loan terms (duration) between start date and maturity date
 * @param startDate - The loan start date (YYYY-MM-DD format)
 * @param maturityDate - The loan maturity date (YYYY-MM-DD format)
 * @returns A human-readable string describing the loan duration
 */
export const calculateLoanTerms = (startDate?: string, maturityDate?: string): string => {
  if (!startDate || !maturityDate) {
    return '';
  }

  const start = new Date(startDate);
  const maturity = new Date(maturityDate);
  const diffTime = maturity.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return '';
  }

  if (diffDays === 1) {
    return '1 day';
  } else if (diffDays < 7) {
    return `${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    if (weeks === 1 && remainingDays === 0) {
      return '1 week';
    } else if (remainingDays === 0) {
      return `${weeks} weeks`;
    } else if (weeks === 1) {
      return `1 week and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    } else {
      return `${weeks} weeks and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    }
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    if (months === 1 && remainingDays === 0) {
      return '1 month';
    } else if (remainingDays === 0) {
      return `${months} months`;
    } else if (months === 1) {
      return `1 month and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    } else {
      return `${months} months and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    }
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    const remainingMonths = Math.floor(remainingDays / 30);
    const finalDays = remainingDays % 30;
    
    let result = years === 1 ? '1 year' : `${years} years`;
    
    if (remainingMonths > 0) {
      result += remainingMonths === 1 ? ' and 1 month' : ` and ${remainingMonths} months`;
    }
    
    if (finalDays > 0 && remainingMonths === 0) {
      result += finalDays === 1 ? ' and 1 day' : ` and ${finalDays} days`;
    }
    
    return result;
  }
};

/**
 * Format currency amount in Philippine Peso
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
};

/**
 * Calculate total amount including interest
 * @param principal - The principal amount
 * @param interestRate - The interest rate as percentage
 * @returns Total amount including interest
 */
export const calculateTotalAmount = (principal: number, interestRate: number): number => {
  return Number(principal) + Number(principal * interestRate / 100);
};

/**
 * Calculate interest amount
 * @param principal - The principal amount
 * @param interestRate - The interest rate as percentage
 * @returns Interest amount
 */
export const calculateInterestAmount = (principal: number, interestRate: number): number => {
  return principal * interestRate / 100;
};

/**
 * Calculate expected monthly payment based on simple interest
 * @param principal - The principal amount
 * @param interestRate - The interest rate as percentage
 * @param termInMonths - The loan term in months
 * @returns Expected monthly payment
 */
export const calculateExpectedMonthlyPayment = (principal: number, interestRate: number, termInMonths: number): number => {
  if (termInMonths <= 0) return 0;
  const totalInterest = principal * (interestRate / 100);
  return totalInterest
};

/**
 * Calculate loan term in months from start and maturity dates
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param maturityDate - Maturity date string (YYYY-MM-DD)
 * @returns Number of months between dates
 */
export const calculateLoanTermInMonths = (startDate?: string, maturityDate?: string): number => {
  if (!startDate || !maturityDate) {
    return 0;
  }

  const start = new Date(startDate);
  const maturity = new Date(maturityDate);
  
  const yearDiff = maturity.getFullYear() - start.getFullYear();
  const monthDiff = maturity.getMonth() - start.getMonth();
  const dayDiff = maturity.getDate() - start.getDate();
  
  let totalMonths = yearDiff * 12 + monthDiff;
  
  // If we haven't reached the same day of the month, subtract one month
  if (dayDiff < 0) {
    totalMonths -= 1;
  }
  
  return Math.max(totalMonths, 0);
};

/**
 * Calculate expected total interest for the loan term
 * @param principal - The principal amount
 * @param interestRate - The interest rate as percentage
 * @param termInMonths - The loan term in months
 * @returns Expected total interest
 */
export const calculateExpectedTotalInterest = (principal: number, interestRate: number, termInMonths: number): number => {
  const monthlyPayment = calculateExpectedMonthlyPayment(principal, interestRate, termInMonths);
  const totalAmount = monthlyPayment * termInMonths;
  return totalAmount
};

/**
 * Calculate expected total return (total interest + principal)
 * @param principal - The principal amount
 * @param interestRate - The interest rate as percentage
 * @param termInMonths - The loan term in months
 * @returns Expected total return (interest + capital)
 */
export const calculateExpectedTotalReturn = (principal: number, interestRate: number, termInMonths: number): number => {
  const totalInterest = calculateExpectedTotalInterest(principal, interestRate, termInMonths);
  return Number(totalInterest) + Number(principal);
};
