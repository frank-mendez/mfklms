import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Borrower, CreateBorrowerData, UpdateBorrowerData } from "@/types/borrower";

// Fetch all borrowers
export function useBorrowers() {
  return useQuery<Borrower[]>({
    queryKey: ['borrowers'],
    queryFn: async () => {
      const response = await fetch('/api/borrowers');
      if (!response.ok) {
        throw new Error('Failed to fetch borrowers');
      }
      return response.json();
    }
  });
}

// Fetch a single borrower
export function useBorrower(id: number) {
  return useQuery<Borrower>({
    queryKey: ['borrowers', id],
    queryFn: async () => {
      const response = await fetch(`/api/borrowers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch borrower');
      }
      return response.json();
    },
    enabled: !!id
  });
}

// Create a new borrower
export function useCreateBorrower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBorrowerData) => {
      const response = await fetch('/api/borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create borrower');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
    },
  });
}

// Update a borrower
export function useUpdateBorrower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateBorrowerData) => {
      const response = await fetch(`/api/borrowers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update borrower');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
      queryClient.invalidateQueries({ queryKey: ['borrowers', variables.id] });
    },
  });
}

// Delete a borrower
export function useDeleteBorrower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/borrowers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete borrower');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
    },
  });
}
