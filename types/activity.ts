import { Activity, EntityType, ActionType } from '@prisma/client'

export type { Activity, EntityType, ActionType }

export interface ActivityUser {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
}

export interface ActivityWithUser extends Activity {
  user: ActivityUser
}

export interface CreateActivityData {
  userId: string
  entityType: EntityType
  entityId?: number
  actionType: ActionType
  oldValue?: any
  newValue?: any
  description: string
  ipAddress?: string
}

export interface ActivityFilters {
  userId?: string
  entityType?: EntityType
  actionType?: ActionType
  entityId?: number
  dateFrom?: Date
  dateTo?: Date
  page?: number
  limit?: number
}

export interface ActivityTableData {
  id: number
  user: string
  entityType: EntityType
  entityId: number | null
  actionType: ActionType
  description: string
  timestamp: Date
  ipAddress: string | null
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Component Props Interfaces
export interface ActivityFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  entityTypeFilter: EntityType | 'ALL'
  setEntityTypeFilter: (value: EntityType | 'ALL') => void
  actionTypeFilter: ActionType | 'ALL'
  setActionTypeFilter: (value: ActionType | 'ALL') => void
  userFilter: string
  setUserFilter: (value: string) => void
  dateFrom: string
  setDateFrom: (value: string) => void
  dateTo: string
  setDateTo: (value: string) => void
  onResetFilters: () => void
}

export interface ActivityTableProps {
  activities: ActivityWithUser[]
  pagination?: PaginationData
  isLoading: boolean
  onPageChange: (page: number) => void
  onLimitChange: (newLimit: number) => void
  onResetFilters: () => void
}

export interface ActivityRowProps {
  activity: ActivityWithUser
}

export interface ActivityPaginationProps {
  pagination: PaginationData
  onPageChange: (page: number) => void
  onLimitChange: (newLimit: number) => void
}
