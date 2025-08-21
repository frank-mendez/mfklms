import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Owner, CreateOwnerDTO, UpdateOwnerDTO } from '@/types/owner';

// Query hook to fetch all owners
export const useOwners = () => {
  return useQuery({
    queryKey: ['owners'],
    queryFn: async (): Promise<Owner[]> => {
      const response = await fetch('/api/owners');
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch owners error:', errorText);
        throw new Error(`Failed to fetch owners: ${errorText}`);
      }
      return response.json();
    }
  });
};

// Query hook to fetch a single owner
export const useOwner = (id: number) => {
  return useQuery({
    queryKey: ['owners', id],
    queryFn: async (): Promise<Owner> => {
      const response = await fetch(`/api/owners/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch owner error:', errorText);
        throw new Error(`Failed to fetch owner: ${errorText}`);
      }
      return response.json();
    },
    enabled: !!id
  });
};

// Mutation hook to create an owner
export const useCreateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOwnerDTO): Promise<Owner> => {
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create owner error:', errorText);
        throw new Error(`Failed to create owner: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    }
  });
};

// Mutation hook to update an owner
export const useUpdateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateOwnerDTO): Promise<Owner> => {
      const response = await fetch(`/api/owners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update owner error:', errorText);
        throw new Error(`Failed to update owner: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['owners', data.id] });
    }
  });
};

// Mutation hook to delete an owner
export const useDeleteOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`/api/owners/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete owner error:', errorText);
        throw new Error(`Failed to delete owner: ${errorText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    }
  });
};
