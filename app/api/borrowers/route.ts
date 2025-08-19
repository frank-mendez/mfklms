import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// Get all borrowers
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const borrowers = await db.borrower.findMany({
      include: {
        loans: {
          select: {
            id: true,
            principal: true,
            status: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(borrowers);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Create new borrower
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, contactInfo } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const borrower = await db.borrower.create({
      data: {
        name,
        contactInfo,
      }
    });

    return NextResponse.json(borrower);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
