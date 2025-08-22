import { db } from '@/lib/db'
import { EntityType, ActionType } from '@prisma/client'
import { headers } from 'next/headers'

interface CreateActivityLogOptions {
  userId: string
  entityType: EntityType
  entityId?: number
  actionType: ActionType
  oldValue?: string
  newValue?: string
  description: string
}

export async function createActivityLog(options: CreateActivityLogOptions) {
  try {
    // Validate userId is provided
    if (!options.userId) {
      console.error('Cannot create activity log: userId is required but was not provided')
      return null
    }

    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     headersList.get('x-client-ip') || 
                     'Unknown'

    // Verify user exists before creating activity log
    const userExists = await db.user.findUnique({
      where: { id: options.userId },
      select: { id: true }
    })

    if (!userExists) {
      console.error(`Cannot create activity log: User ${options.userId} not found`)
      return null
    }

    const activity = await db.activity.create({
      data: {
        user: {
          connect: { id: options.userId }
        },
        entityType: options.entityType,
        entityId: options.entityId,
        actionType: options.actionType,
        oldValue: options.oldValue || undefined,
        newValue: options.newValue || undefined,
        description: options.description,
        ipAddress: ipAddress.split(',')[0].trim(), // Take first IP if multiple
        timestamp: new Date(),
      }
    })

    return activity
  } catch (error) {
    console.error('Failed to create activity log:', error)
    // Don't throw error to avoid breaking the main operation
    return null
  }
}

// Helper functions for common activity types
export async function logCreate(
  userId: string,
  entityType: EntityType,
  entityId: number,
  entityName: string,
  newValue: string
) {
  if (!userId) {
    console.error('Cannot log CREATE activity: userId is required')
    return null
  }
  
  return createActivityLog({
    userId,
    entityType,
    entityId,
    actionType: 'CREATE',
    newValue,
    description: `Created ${entityType.toLowerCase()}: ${entityName}`,
  })
}

export async function logUpdate(
  userId: string,
  entityType: EntityType,
  entityId: number,
  entityName: string,
  oldValue: string,
  newValue: string
) {
  return createActivityLog({
    userId,
    entityType,
    entityId,
    actionType: 'UPDATE',
    oldValue,
    newValue,
    description: `Updated ${entityType.toLowerCase()}: ${entityName}`,
  })
}

export async function logDelete(
  userId: string,
  entityType: EntityType,
  entityId: number,
  entityName: string,
  oldValue: string
) {
  return createActivityLog({
    userId,
    entityType,
    entityId,
    actionType: 'DELETE',
    oldValue,
    description: `Deleted ${entityType.toLowerCase()}: ${entityName}`,
  })
}

export async function logRead(
  userId: string,
  entityType: EntityType,
  entityId?: number,
  description?: string
) {
  return createActivityLog({
    userId,
    entityType,
    entityId,
    actionType: 'READ',
    description: description || `Viewed ${entityType.toLowerCase()}${entityId ? ` #${entityId}` : 's'}`,
  })
}

export async function logLogin(userId: string, userEmail: string) {
  return createActivityLog({
    userId,
    entityType: 'USER',
    actionType: 'LOGIN',
    description: `User logged in: ${userEmail}`,
  })
}

export async function logLogout(userId: string, userEmail: string) {
  return createActivityLog({
    userId,
    entityType: 'USER',
    actionType: 'LOGOUT',
    description: `User logged out: ${userEmail}`,
  })
}
