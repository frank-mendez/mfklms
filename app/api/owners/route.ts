import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { logCreate } from '@/lib/activity-logger';

// GET /api/owners - List all owners
export async function GET() {
  try {
    const owners = await db.owner.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(owners);
  } catch (error) {
    console.error('Error fetching owners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owners' },
      { status: 500 }
    );
  }
}

// POST /api/owners - Create a new owner
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, contactInfo } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const owner = await db.owner.create({
      data: {
        name,
        contactInfo
      }
    });

    // Log the owner creation
    await logCreate(
      currentUser.id,
      'OTHER',
      owner.id,
      owner.name,
      JSON.stringify({ name: owner.name, contactInfo: owner.contactInfo })
    );

    return NextResponse.json(owner, { status: 201 });
  } catch (error) {
    console.error('Error creating owner:', error);
    return NextResponse.json(
      { error: 'Failed to create owner' },
      { status: 500 }
    );
  }
}
