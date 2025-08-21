import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { UserStatus } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(UserStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const user = await db.user.update({
      where: { id: params.id },
      data: { status },
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
    console.error('Error updating user status:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
