import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Repayment, CreateRepaymentDTO, UpdateRepaymentDTO } from '@/types/repayment';

// Query hook to fetch all repayments
export const useRepayments = () => {
  return useQuery({
    queryKey: ['repayments'],
    queryFn: async (): Promise<Repayment[]> => {
      const response = await fetch('/api/repayments');
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch repayments error:', errorText);
        throw new Error(`Failed to fetch repayments: ${errorText}`);
      }
      return response.json();
    }
  });
};

// Query hook to fetch a single repayment
export const useRepayment = (id: number) => {
  return useQuery({
    queryKey: ['repayments', id],
    queryFn: async (): Promise<Repayment> => {
      const response = await fetch(`/api/repayments/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch repayment error:', errorText);
        throw new Error(`Failed to fetch repayment: ${errorText}`);
      }
      return response.json();
    },
    enabled: !!id
  });
};

// Mutation hook to create a repayment
export const useCreateRepayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRepaymentDTO): Promise<Repayment> => {
      const response = await fetch('/api/repayments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create repayment error:', errorText);
        throw new Error(`Failed to create repayment: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repayments'] });
    }
  });
};

// Mutation hook to update a repayment
export const useUpdateRepayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateRepaymentDTO): Promise<Repayment> => {
      const response = await fetch(`/api/repayments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update repayment error:', errorText);
        throw new Error(`Failed to update repayment: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['repayments'] });
      queryClient.invalidateQueries({ queryKey: ['repayments', data.id] });
    }
  });
};

// Mutation hook to delete a repayment
export const useDeleteRepayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`/api/repayments/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete repayment error:', errorText);
        throw new Error(`Failed to delete repayment: ${errorText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repayments'] });
    }
  });
};
