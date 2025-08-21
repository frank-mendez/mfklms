import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActivityWithUser, CreateActivityData, ActivityFilters } from '@/types'

const ACTIVITIES_QUERY_KEY = 'activities'

interface ActivitiesResponse {
  activities: ActivityWithUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Fetch activities with filters
export const useActivities = (filters?: ActivityFilters) => {
  return useQuery({
    queryKey: [ACTIVITIES_QUERY_KEY, filters],
    queryFn: async (): Promise<ActivitiesResponse> => {
      const params = new URLSearchParams()
      
      if (filters?.userId) params.append('userId', filters.userId)
      if (filters?.entityType) params.append('entityType', filters.entityType)
      if (filters?.actionType) params.append('actionType', filters.actionType)
      if (filters?.entityId) params.append('entityId', filters.entityId.toString())
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString())
      if (filters?.dateTo) params.append('dateTo', filters.dateTo.toISOString())
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/activities?${params.toString()}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch activities')
      }
      
      return response.json()
    },
  })
}

// Create activity log
export const useCreateActivity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateActivityData): Promise<ActivityWithUser> => {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create activity log')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_QUERY_KEY] })
    },
  })
}

// Get activity by ID
export const useActivity = (id: number) => {
  return useQuery({
    queryKey: [ACTIVITIES_QUERY_KEY, id],
    queryFn: async (): Promise<ActivityWithUser> => {
      const response = await fetch(`/api/activities/${id}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch activity')
      }
      
      return response.json()
    },
    enabled: !!id,
  })
}

// Get activities for a specific entity
export const useEntityActivities = (entityType: string, entityId: number) => {
  return useQuery({
    queryKey: [ACTIVITIES_QUERY_KEY, 'entity', entityType, entityId],
    queryFn: async (): Promise<ActivityWithUser[]> => {
      const response = await fetch(`/api/activities?entityType=${entityType}&entityId=${entityId}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch entity activities')
      }
      
      return response.json()
    },
    enabled: !!entityType && !!entityId,
  })
}

// Get user activities
export const useUserActivities = (userId: string) => {
  return useQuery({
    queryKey: [ACTIVITIES_QUERY_KEY, 'user', userId],
    queryFn: async (): Promise<ActivityWithUser[]> => {
      const response = await fetch(`/api/activities?userId=${userId}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch user activities')
      }
      
      return response.json()
    },
    enabled: !!userId,
  })
}
