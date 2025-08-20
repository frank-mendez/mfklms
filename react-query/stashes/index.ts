import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stash, CreateStashDTO, UpdateStashDTO } from '@/types/stash';

// Query hook to fetch all stashes
export const useStashes = () => {
  return useQuery({
    queryKey: ['stashes'],
    queryFn: async (): Promise<Stash[]> => {
      const response = await fetch('/api/stashes');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });
};

// Query hook to fetch a single stash
export const useStash = (id: number) => {
  return useQuery({
    queryKey: ['stashes', id],
    queryFn: async (): Promise<Stash> => {
      const response = await fetch(`/api/stashes/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: !!id
  });
};

// Mutation hook to create a stash
export const useCreateStash = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStashDTO): Promise<Stash> => {
      const response = await fetch('/api/stashes', {
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
      queryClient.invalidateQueries({ queryKey: ['stashes'] });
    }
  });
};

// Mutation hook to update a stash
export const useUpdateStash = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateStashDTO): Promise<Stash> => {
      const response = await fetch(`/api/stashes/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ['stashes'] });
      queryClient.invalidateQueries({ queryKey: ['stashes', data.id] });
    }
  });
};

// Mutation hook to delete a stash
export const useDeleteStash = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`/api/stashes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stashes'] });
    }
  });
};
