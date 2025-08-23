import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { checkAdminOrSuperAdminAuth } from '@/lib/auth';
import { logUpdate, logDelete } from '@/lib/activity-logger';

// GET /api/owners/[ownerId] - Get a specific owner
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ownerId: string }> }
) {
  try {
    const { ownerId } = await params;
    const ownerIdNum = parseInt(ownerId);
    const owner = await db.owner.findUnique({
      where: { id: ownerIdNum }
    });

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(owner);
  } catch (error) {
    console.error('Error fetching owner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owner' },
      { status: 500 }
    );
  }
}

// PATCH /api/owners/[ownerId] - Update a specific owner
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ownerId: string }> }
) {
  try {
     const authCheck = await checkAdminOrSuperAdminAuth();
      if (!authCheck.authorized) {
        return authCheck.response;
      }
      const currentUser = authCheck.user;

    const { ownerId } = await params;
    const ownerIdNum = parseInt(ownerId);
    const body = await request.json();
    const { name, contactInfo } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Get the old owner data for logging
    const oldOwner = await db.owner.findUnique({
      where: { id: ownerIdNum }
    });

    if (!oldOwner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    const owner = await db.owner.update({
      where: { id: ownerIdNum },
      data: {
        name,
        contactInfo
      }
    });

    // Log the update
    await logUpdate(
      currentUser.id,
      'OTHER',
      owner.id,
      `Owner ${owner.name}`,
     JSON.stringify( {
        name: oldOwner.name,
        contactInfo: oldOwner.contactInfo
      }),
      JSON.stringify({
        name: owner.name,
        contactInfo: owner.contactInfo
      })
    );

    return NextResponse.json(owner);
  } catch (error) {
    console.error('Error updating owner:', error);
    return NextResponse.json(
      { error: 'Failed to update owner' },
      { status: 500 }
    );
  }
}

// DELETE /api/owners/[ownerId] - Delete a specific owner
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ ownerId: string }> }
) {
  try {
    const authCheck = await checkAdminOrSuperAdminAuth();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const currentUser = authCheck.user;

    const { ownerId } = await params;
    const ownerIdNum = parseInt(ownerId);
    
    // Get the owner data for logging before deletion
    const owner = await db.owner.findUnique({
      where: { id: ownerIdNum }
    });

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    await db.owner.delete({
      where: { id: ownerIdNum }
    });

    // Log the deletion
    await logDelete(
      currentUser.id,
      'OTHER',
      owner.id,
      `Owner ${owner.name}`,
      JSON.stringify({
        name: owner.name,
        contactInfo: owner.contactInfo
      })
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting owner:', error);
    return NextResponse.json(
      { error: 'Failed to delete owner' },
      { status: 500 }
    );
  }
}
