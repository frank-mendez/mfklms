import { Activity, EntityType, ActionType } from '@prisma/client'

export type { Activity, EntityType, ActionType }

export interface ActivityWithUser extends Activity {
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
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
