import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// Get specific borrower
export async function GET(
  req: Request,
  { params }: { params: { borrowerId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const borrower = await db.borrower.findUnique({
      where: {
        id: parseInt(params.borrowerId)
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
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Update borrower
export async function PATCH(
  req: Request,
  { params }: { params: { borrowerId: string } }
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

    const borrower = await db.borrower.update({
      where: {
        id: parseInt(params.borrowerId)
      },
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

// Delete borrower
export async function DELETE(
  req: Request,
  { params }: { params: { borrowerId: string } }
) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Check if borrower has any active loans
    const borrower = await db.borrower.findUnique({
      where: {
        id: parseInt(params.borrowerId)
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

    await db.borrower.delete({
      where: {
        id: parseInt(params.borrowerId)
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
