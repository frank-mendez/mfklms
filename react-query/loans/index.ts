import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loan, CreateLoanData, UpdateLoanData } from "@/types/loan";

// Fetch all loans
export function useLoans() {
  return useQuery<Loan[]>({
    queryKey: ['loans'],
    queryFn: async () => {
      const response = await fetch('/api/loans');
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch loans error:', errorText);
        throw new Error(`Failed to fetch loans: ${errorText}`);
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
        const errorText = await response.text();
        console.error('Fetch loan error:', errorText);
        throw new Error(`Failed to fetch loan: ${errorText}`);
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
        const errorText = await response.text();
        console.error('Create loan error:', errorText);
        throw new Error(`Failed to create loan: ${errorText}`);
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
        const errorText = await response.text();
        console.error('Update loan error:', errorText);
        throw new Error(`Failed to update loan: ${errorText}`);
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
        const errorText = await response.text();
        console.error('Delete loan error:', errorText);
        throw new Error(`Failed to delete loan: ${errorText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}
