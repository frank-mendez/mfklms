import { db } from '@/lib/db'
import { EntityType, ActionType } from '@prisma/client'

interface LogActivityParams {
  userId: string
  entityType: EntityType
  entityId?: number
  actionType: ActionType
  oldValue?: any
  newValue?: any
  description: string
  ipAddress?: string
}

export async function logActivity({
  userId,
  entityType,
  entityId,
  actionType,
  oldValue,
  newValue,
  description,
  ipAddress,
}: LogActivityParams) {
  try {
    return await db.activity.create({
      data: {
        userId,
        entityType,
        entityId: entityId || null,
        actionType,
        oldValue: oldValue || null,
        newValue: newValue || null,
        description,
        ipAddress: ipAddress || null,
      },
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
    // Don't throw error to avoid breaking the main operation
    return null
  }
}

// Helper functions for common activity logging patterns
export const ActivityLogger = {
  // User activities
  userLogin: (userId: string, ipAddress?: string) =>
    logActivity({
      userId,
      entityType: 'USER',
      entityId: undefined,
      actionType: 'LOGIN',
      description: 'User logged in',
      ipAddress,
    }),

  userLogout: (userId: string, ipAddress?: string) =>
    logActivity({
      userId,
      entityType: 'USER',
      entityId: undefined,
      actionType: 'LOGOUT',
      description: 'User logged out',
      ipAddress,
    }),

  // CRUD operations
  create: (
    userId: string,
    entityType: EntityType,
    entityId: number,
    entityName: string,
    newValue: any,
    ipAddress?: string
  ) =>
    logActivity({
      userId,
      entityType,
      entityId,
      actionType: 'CREATE',
      newValue,
      description: `Created ${entityType.toLowerCase()}: ${entityName}`,
      ipAddress,
    }),

  update: (
    userId: string,
    entityType: EntityType,
    entityId: number,
    entityName: string,
    oldValue: any,
    newValue: any,
    ipAddress?: string
  ) =>
    logActivity({
      userId,
      entityType,
      entityId,
      actionType: 'UPDATE',
      oldValue,
      newValue,
      description: `Updated ${entityType.toLowerCase()}: ${entityName}`,
      ipAddress,
    }),

  delete: (
    userId: string,
    entityType: EntityType,
    entityId: number,
    entityName: string,
    oldValue: any,
    ipAddress?: string
  ) =>
    logActivity({
      userId,
      entityType,
      entityId,
      actionType: 'DELETE',
      oldValue,
      description: `Deleted ${entityType.toLowerCase()}: ${entityName}`,
      ipAddress,
    }),

  read: (
    userId: string,
    entityType: EntityType,
    entityId: number,
    entityName: string,
    ipAddress?: string
  ) =>
    logActivity({
      userId,
      entityType,
      entityId,
      actionType: 'READ',
      description: `Viewed ${entityType.toLowerCase()}: ${entityName}`,
      ipAddress,
    }),
}
