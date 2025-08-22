import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { logUpdate, logDelete } from "@/lib/activity-logger";

// Get specific borrower
export async function GET(
  req: Request,
  { params }: { params: Promise<{ borrowerId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { borrowerId } = await params;
    const borrower = await db.borrower.findUnique({
      where: {
        id: parseInt(borrowerId)
      },
      include: {
        loans: {
          select: {
            id: true,
            principal: true,
            status: true,
            startDate: true,
            maturityDate: true,
            repayments: {
              select: {
                id: true,
                dueDate: true,
                amountDue: true,
                status: true,
              }
            }
          }
        }
      }
    });

    if (!borrower) {
      return new NextResponse("Borrower not found", { status: 404 });
    }

    return NextResponse.json(borrower);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Update borrower
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ borrowerId: string }> }
) {
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

    const { borrowerId } = await params;
    
    // Get current borrower data for logging
    const currentBorrower = await db.borrower.findUnique({
      where: { id: parseInt(borrowerId) }
    });

    if (!currentBorrower) {
      return new NextResponse("Borrower not found", { status: 404 });
    }

    const borrower = await db.borrower.update({
      where: {
        id: parseInt(borrowerId)
      },
      data: {
        name,
        contactInfo,
      }
    });

    // Log the update activity
    await logUpdate(
      currentUser.id,
      'OTHER', // Using OTHER since borrower doesn't have specific entity type
      borrower.id,
      borrower.name,
      JSON.stringify({ name: currentBorrower.name, contactInfo: currentBorrower.contactInfo }),
      JSON.stringify({ name: borrower.name, contactInfo: borrower.contactInfo })
    );

    return NextResponse.json(borrower);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete borrower
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ borrowerId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin || !currentUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { borrowerId } = await params;
    // Check if borrower has any active loans
    const borrower = await db.borrower.findUnique({
      where: {
        id: parseInt(borrowerId)
      },
      include: {
        loans: {
          where: {
            status: 'ACTIVE'
          }
        }
      }
    });

    if (!borrower) {
      return new NextResponse("Borrower not found", { status: 404 });
    }

    if (borrower.loans.length > 0) {
      return new NextResponse(
        "Cannot delete borrower with active loans", 
        { status: 400 }
      );
    }

    // Log the deletion before deleting
    await logDelete(
      currentUser.id,
      'OTHER',
      borrower.id,
      borrower.name,
      JSON.stringify({ name: borrower.name, contactInfo: borrower.contactInfo })
    );

    await db.borrower.delete({
      where: {
        id: parseInt(borrowerId)
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
