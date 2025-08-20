import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/owners/[ownerId] - Get a specific owner
export async function GET(
  request: Request,
  { params }: { params: { ownerId: string } }
) {
  try {
    const ownerId = parseInt(params.ownerId);
    const owner = await db.owner.findUnique({
      where: { id: ownerId }
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
  { params }: { params: { ownerId: string } }
) {
  try {
    const ownerId = parseInt(params.ownerId);
    const body = await request.json();
    const { name, contactInfo } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const owner = await db.owner.update({
      where: { id: ownerId },
      data: {
        name,
        contactInfo
      }
    });

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
  { params }: { params: { ownerId: string } }
) {
  try {
    const ownerId = parseInt(params.ownerId);
    await db.owner.delete({
      where: { id: ownerId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting owner:', error);
    return NextResponse.json(
      { error: 'Failed to delete owner' },
      { status: 500 }
    );
  }
}
