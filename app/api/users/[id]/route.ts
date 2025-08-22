import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin, isSuperAdmin } from "@/lib/auth";
import { hash } from "bcryptjs";

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

    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
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

    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName } = body;

    const user = await db.user.update({
      where: { id },
      data: { firstName, lastName },
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
    const userIsSuperAdmin = await isSuperAdmin();
    if (!userIsSuperAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
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
    const userIsSuperAdmin = await isSuperAdmin();
    if (!userIsSuperAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Prevent deleting yourself
    const currentUser = await getCurrentUser();
    if (currentUser?.id === id) {
      return new NextResponse("Cannot delete yourself", { status: 400 });
    }

    await db.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
