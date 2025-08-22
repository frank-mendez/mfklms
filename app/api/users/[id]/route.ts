import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin, isSuperAdmin } from "@/lib/auth";
import { hash } from "bcryptjs";
import { logUpdate, logDelete } from "@/lib/activity-logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only super admins can view user details
    const userIsSuperAdmin = await isSuperAdmin();
    if (!userIsSuperAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id },
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

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only super admins can update users
    const userIsSuperAdmin = await isSuperAdmin();
    if (!userIsSuperAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get the old user data for logging
    const oldUser = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        verified: true,
      }
    });

    if (!oldUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await request.json();
    const { email, firstName, lastName, role, status, password } = body;

    const updateData: any = {
      email,
      firstName,
      lastName,
      role,
      status,
    };

    if (password) {
      updateData.password = await hash(password, 12);
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
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

    // Log the update (exclude password from logging for security)
    await logUpdate(
      currentUser.id,
      'USER',
      Math.abs(user.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)), // Convert string ID to number
      `User ${user.firstName} ${user.lastName}`,
      {
        email: oldUser.email,
        firstName: oldUser.firstName,
        lastName: oldUser.lastName,
        role: oldUser.role,
        status: oldUser.status
      },
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userIsSuperAdmin = await isSuperAdmin();
    if (!userIsSuperAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get the old user data for logging
    const oldUser = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        verified: true,
      }
    });

    if (!oldUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await request.json();
    const { email, firstName, lastName, role, status, password } = body;

    const updateData: any = {
      email,
      firstName,
      lastName,
      role,
      status,
    };

    if (password) {
      updateData.password = await hash(password, 12);
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
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

    // Log the update (exclude password from logging for security)
    await logUpdate(
      currentUser.id,
      'USER',
      Math.abs(user.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)), // Convert string ID to number
      `User ${user.firstName} ${user.lastName}`,
      {
        email: oldUser.email,
        firstName: oldUser.firstName,
        lastName: oldUser.lastName,
        role: oldUser.role,
        status: oldUser.status
      },
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userIsSuperAdmin = await isSuperAdmin();
    if (!userIsSuperAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Prevent deleting yourself
    if (currentUser?.id === id) {
      return new NextResponse("Cannot delete yourself", { status: 400 });
    }

    // Get the user data for logging before deletion
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    await db.user.delete({
      where: { id },
    });

    // Log the deletion (exclude sensitive data)
    await logDelete(
      currentUser.id,
      'USER',
      Math.abs(user.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)), // Convert string ID to number
      `User ${user.firstName} ${user.lastName}`,
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      }
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
