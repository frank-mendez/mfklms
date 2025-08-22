import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const activityId = parseInt(id)
    if (isNaN(activityId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    const activity = await db.activity.findUnique({
      where: { id: activityId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!activity) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 })
    }

    return NextResponse.json(activity)
  } catch {
    console.error('Error fetching activity:')
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
