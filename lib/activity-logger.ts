import { db } from '@/lib/db'
import { EntityType, ActionType } from '@prisma/client'
import { headers } from 'next/headers'

interface CreateActivityLogOptions {
  userId: string
  entityType: EntityType
  entityId?: number
  actionType: ActionType
  oldValue?: any
  newValue?: any
  description: string
}

export async function createActivityLog(options: CreateActivityLogOptions) {
  try {
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     headersList.get('x-client-ip') || 
                     'Unknown'

    const activity = await db.activity.create({
      data: {
        userId: options.userId,
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
  newValue: any
) {
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
  oldValue: any,
  newValue: any
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
  oldValue: any
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
