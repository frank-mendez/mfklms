import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Repayment {
  id: number;
  loanId: number;
  amount: number;
  repaymentDate: Date;
  loan: {
    id: number;
    borrower: {
      id: number;
      name: string;
    };
  };
}

interface CreateRepaymentDTO {
  loanId: number;
  amount: number;
  repaymentDate: Date;
}

interface UpdateRepaymentDTO {
  id: number;
  amount: number;
  repaymentDate: Date;
}

// Query hook to fetch all repayments
export const useRepayments = () => {
  return useQuery({
    queryKey: ['repayments'],
    queryFn: async (): Promise<Repayment[]> => {
      const response = await fetch('/api/repayments');
      if (!response.ok) {
        throw new Error('Network response was not ok');
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
        throw new Error('Network response was not ok');
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
        throw new Error('Network response was not ok');
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
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
        throw new Error('Network response was not ok');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repayments'] });
    }
  });
};
