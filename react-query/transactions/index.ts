import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO } from '@/types/transaction';

// Query hook to fetch all transactions
export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch transactions error:', errorText);
        throw new Error(`Failed to fetch transactions: ${errorText}`);
      }
      return response.json();
    }
  });
};

// Query hook to fetch a single transaction
export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: async (): Promise<Transaction> => {
      const response = await fetch(`/api/transactions/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch transaction error:', errorText);
        throw new Error(`Failed to fetch transaction: ${errorText}`);
      }
      return response.json();
    },
    enabled: !!id
  });
};

// Mutation hook to create a transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransactionDTO): Promise<Transaction> => {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create transaction error:', errorText);
        throw new Error(`Failed to create transaction: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
};

// Mutation hook to update a transaction
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateTransactionDTO): Promise<Transaction> => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update transaction error:', errorText);
        throw new Error(`Failed to update transaction: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', data.id] });
    }
  });
};

// Mutation hook to delete a transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete transaction error:', errorText);
        throw new Error(`Failed to delete transaction: ${errorText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
};
