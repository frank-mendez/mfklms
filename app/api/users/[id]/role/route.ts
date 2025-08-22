import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { UserRole } from '@prisma/client';
import { logUpdate } from "@/lib/activity-logger";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    const userIsSuperAdmin = await isSuperAdmin();
    if (!userIsSuperAdmin || !currentUser) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get the old user data for logging
    const oldUser = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      }
    });

    if (!oldUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !Object.values(UserRole).includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const user = await db.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Log the role update
    await logUpdate(
      currentUser.id,
      'USER',
      Math.abs(user.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)), // Convert string ID to number
      `User ${user.firstName} ${user.lastName}`,
      JSON.stringify({ role: oldUser.role }),
      JSON.stringify({ role: user.role })
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
