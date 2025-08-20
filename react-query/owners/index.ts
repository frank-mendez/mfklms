import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Owner {
  id: number;
  name: string;
  contactInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateOwnerDTO {
  name: string;
  contactInfo?: string;
}

interface UpdateOwnerDTO {
  id: number;
  name: string;
  contactInfo?: string;
}

// Query hook to fetch all owners
export const useOwners = () => {
  return useQuery({
    queryKey: ['owners'],
    queryFn: async (): Promise<Owner[]> => {
      const response = await fetch('/api/owners');
      if (!response.ok) {
        throw new Error('Network response was not ok');
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
        throw new Error('Network response was not ok');
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
        throw new Error('Network response was not ok');
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
        throw new Error('Network response was not ok');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    }
  });
};
