import { useQuery } from '@tanstack/react-query';

export interface FinancialSummary {
  totalContributions: number;
  totalLoans: number;
  totalRepayments: number;
  amountOnHand: number;
}

const fetchFinancialSummary = async (): Promise<FinancialSummary> => {
  const response = await fetch('/api/dashboard/financial-summary');
  if (!response.ok) {
    throw new Error('Failed to fetch financial summary');
  }
  return response.json();
};

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: ['financial-summary'],
    queryFn: fetchFinancialSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
