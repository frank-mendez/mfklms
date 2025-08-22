import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { hash } from "bcryptjs";
import { UserStatus, UserRole, Prisma } from '@prisma/client';
import { logCreate } from "@/lib/activity-logger";

// GET all users with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only super admins can view users list
    const userIsSuperAdmin = await isSuperAdmin();
    if (!userIsSuperAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') as UserStatus;
    const role = searchParams.get('role') as UserRole;
    const search = searchParams.get('search');

    const where: Prisma.UserWhereInput = {};

    if (status) where.status = status;
    if (role) where.role = role;
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.user.count({ where });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST - Create new user
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    console.log('currentUser.id', currentUser?.id);
    const userIsSuperAdmin = await isSuperAdmin();
    
    if (!userIsSuperAdmin || !currentUser || !currentUser.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { email, password, firstName, lastName, role, status } = body;

    if (!email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "USER",
        status: status || "PENDING",
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        verified: true,
        createdAt: true,
      }
    });

    // Log the user creation (exclude password)
    const logCreated = await logCreate(
      currentUser.id,
      'USER',
      Math.abs(user.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)), // Convert string ID to number
      `User ${user.firstName} ${user.lastName}`,
      JSON.stringify({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      })
    );

    console.log('User created and logged:', logCreated);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}