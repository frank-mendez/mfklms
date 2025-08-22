import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserStatus, UserRole, User } from '@prisma/client'

const USERS_QUERY_KEY = 'users'

interface UserFilters {
  page?: number
  limit?: number
  status?: UserStatus
  role?: UserRole
  search?: string
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Fetch users with filters and pagination
export const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: async (): Promise<UsersResponse> => {
      const params = new URLSearchParams()
      
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())
      if (filters?.status) params.append('status', filters.status)
      if (filters?.role) params.append('role', filters.role)
      if (filters?.search) params.append('search', filters.search)

      const response = await fetch(`/api/users?${params.toString()}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch users')
      }
      
      return response.json()
    },
  })
}

// Update user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: UserStatus }): Promise<User> => {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update user status')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })
}

// Update user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }): Promise<User> => {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update user role')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })
}

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${id}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch user')
      }
      
      return response.json()
    },
    enabled: !!id,
  })
}

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData: {
      email: string
      password: string
      firstName?: string
      lastName?: string
      role?: UserRole
      status?: UserStatus
    }): Promise<User> => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create user')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })
}

// Update user (full update)
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      userData 
    }: { 
      id: string
      userData: {
        email?: string
        firstName?: string
        lastName?: string
        role?: UserRole
        status?: UserStatus
        password?: string
      }
    }): Promise<User> => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update user')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })
}

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to delete user')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })
}

// Register new user (public registration)
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (userData: {
      email: string
      password: string
      firstName?: string
      lastName?: string
    }): Promise<{ message: string; user: User }> => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to register user')
      }
      
      return response.json()
    },
  })
}
