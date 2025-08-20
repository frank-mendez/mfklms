import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Loan {
  id: number;
  borrowerId: number;
  borrower: {
    name: string;
  };
  principal: number;
  interestRate: number;
  startDate: string;
  maturityDate: string | null;
  status: 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
  createdAt: string;
  updatedAt: string;
}

interface CreateLoanData {
  borrowerId: number;
  principal: number;
  interestRate: number;
  startDate: string;
  maturityDate?: string;
}

interface UpdateLoanData extends Partial<CreateLoanData> {
  id: number;
  status?: 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
}

// Fetch all loans
export function useLoans() {
  return useQuery<Loan[]>({
    queryKey: ['loans'],
    queryFn: async () => {
      const response = await fetch('/api/loans');
      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }
      return response.json();
    }
  });
}

// Fetch a single loan
export function useLoan(id: number) {
  return useQuery<Loan>({
    queryKey: ['loans', id],
    queryFn: async () => {
      const response = await fetch(`/api/loans/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch loan');
      }
      return response.json();
    },
    enabled: !!id
  });
}

// Create a new loan
export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLoanData) => {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create loan');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}

// Update a loan
export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateLoanData) => {
      const response = await fetch(`/api/loans/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update loan');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loans', variables.id] });
    },
  });
}

// Delete a loan
export function useDeleteLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/loans/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete loan');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}
