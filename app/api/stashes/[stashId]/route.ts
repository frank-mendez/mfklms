import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { checkAdminOrSuperAdminAuth } from '@/lib/auth';
import { logUpdate, logDelete } from '@/lib/activity-logger';

// GET /api/stashes/[stashId] - Get a specific stash contribution
export async function GET(
  request: Request,
  { params }: { params: Promise<{ stashId: string }> }
) {
  try {
    const { stashId } = await params;
    const stashIdNum = parseInt(stashId);
    const stash = await db.stash.findUnique({
      where: { id: stashIdNum },
      include: {
        owner: {
          select: {
            name: true
          }
        }
      }
    });

    if (!stash) {
      return NextResponse.json(
        { error: 'Stash contribution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(stash);
  } catch (error) {
    console.error('Error fetching stash:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stash contribution' },
      { status: 500 }
    );
  }
}

// PATCH /api/stashes/[stashId] - Update a specific stash contribution
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ stashId: string }> }
) {
  try {
    const authCheck = await checkAdminOrSuperAdminAuth();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const currentUser = authCheck.user;

    const { stashId } = await params;
    const stashIdNum = parseInt(stashId);
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

    // Get the old stash data for logging
    const oldStash = await db.stash.findUnique({
      where: { id: stashIdNum },
      include: {
        owner: {
          select: {
            name: true
          }
        }
      }
    });

    if (!oldStash) {
      return NextResponse.json(
        { error: 'Stash contribution not found' },
        { status: 404 }
      );
    }

    const stash = await db.stash.update({
      where: { id: stashIdNum },
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

    // Log the update
    await logUpdate(
      currentUser.id,
      'STASH',
      stash.id,
      `Stash contribution for ${stash.owner.name}`,
      JSON.stringify({
        ownerId: oldStash.ownerId,
        month: oldStash.month,
        amount: oldStash.amount,
        remarks: oldStash.remarks
      }),
      JSON.stringify({
        ownerId: stash.ownerId,
        month: stash.month,
        amount: stash.amount,
        remarks: stash.remarks
      })
    );

    return NextResponse.json(stash);
  } catch (error) {
    console.error('Error updating stash:', error);
    return NextResponse.json(
      { error: 'Failed to update stash contribution' },
      { status: 500 }
    );
  }
}

// DELETE /api/stashes/[stashId] - Delete a specific stash contribution
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ stashId: string }> }
) {
  try {
    const authCheck = await checkAdminOrSuperAdminAuth();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const currentUser = authCheck.user;

    const { stashId } = await params;
    const stashIdNum = parseInt(stashId);
    
    // Get the stash data for logging before deletion
    const stash = await db.stash.findUnique({
      where: { id: stashIdNum },
      include: {
        owner: {
          select: {
            name: true
          }
        }
      }
    });

    if (!stash) {
      return NextResponse.json(
        { error: 'Stash contribution not found' },
        { status: 404 }
      );
    }

    await db.stash.delete({
      where: { id: stashIdNum }
    });

    // Log the deletion
    await logDelete(
      currentUser.id,
      'STASH',
      stash.id,
      `Stash contribution for ${stash.owner.name}`,
      JSON.stringify({
        ownerId: stash.ownerId,
        month: stash.month,
        amount: stash.amount,
        remarks: stash.remarks
      })
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting stash:', error);
    return NextResponse.json(
      { error: 'Failed to delete stash contribution' },
      { status: 500 }
    );
  }
}
