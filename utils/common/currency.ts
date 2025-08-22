/**
 * Format currency value to display with proper formatting
 * @param value - The numeric value to format
 * @param currency - Currency code (default: 'PHP')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string, currency: string = 'PHP'): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return `${currency} 0.00`;
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numericValue);
};

/**
 * Format large numbers with abbreviations (K, M, B)
 * @param value - The numeric value to format
 * @param currency - Currency code (default: 'PHP')
 * @returns Formatted currency string with abbreviations
 */
export const formatCompactCurrency = (value: number | string, currency: string = 'PHP'): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return `${currency} 0.00`;
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(numericValue);
};
