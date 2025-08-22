import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { logCreate } from '@/lib/activity-logger';

// GET /api/stashes - List all stash contributions
export async function GET() {
  try {
    const stashes = await db.stash.findMany({
      include: {
        owner: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        month: 'desc'
      }
    });
    return NextResponse.json(stashes);
  } catch (error) {
    console.error('Error fetching stashes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stashes' },
      { status: 500 }
    );
  }
}

// POST /api/stashes - Create a new stash contribution
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { ownerId, month, amount, remarks } = body;

    if (!ownerId || !month || !amount) {
      return NextResponse.json(
        { error: 'Owner ID, month, and amount are required' },
        { status: 400 }
      );
    }

    // Validate owner exists
    const owner = await db.owner.findUnique({
      where: { id: parseInt(ownerId) }
    });

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    const stash = await db.stash.create({
      data: {
        ownerId: parseInt(ownerId),
        month: new Date(month),
        amount: parseFloat(amount),
        remarks
      },
      include: {
        owner: {
          select: {
            name: true
          }
        }
      }
    });

    // Log the stash creation
    await logCreate(
      currentUser.id,
      'STASH',
      stash.id,
      `Stash contribution by ${stash.owner.name}`,
      JSON.stringify({
        ownerId: stash.ownerId,
        month: stash.month,
        amount: stash.amount,
        remarks: stash.remarks
      })  
    );

    return NextResponse.json(stash, { status: 201 });
  } catch (error) {
    console.error('Error creating stash:', error);
    return NextResponse.json(
      { error: 'Failed to create stash contribution' },
      { status: 500 }
    );
  }
}
