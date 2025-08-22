import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validate required fields
    if (!email || !password) {
      return new NextResponse("Email and password are required", { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse("Invalid email format", { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return new NextResponse("Password must be at least 6 characters long", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return new NextResponse("User already exists with this email", { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with default role and status
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        role: "USER", // Default role
        status: "PENDING", // Default status - requires admin approval
        verified: false, // Email not verified yet
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        verified: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      message: "User registered successfully. Your account is pending approval.",
      user
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle unique constraint violation (duplicate email)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return new NextResponse("User already exists with this email", { status: 409 });
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
