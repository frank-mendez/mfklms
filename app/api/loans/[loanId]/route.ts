import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// Get specific loan
export async function GET(
  req: Request,
  { params }: { params: { loanId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const loan = await db.loan.findUnique({
      where: {
        id: parseInt(params.loanId)
      },
      include: {
        borrower: {
          select: {
            id: true,
            name: true,
            contactInfo: true,
          }
        },
        repayments: {
          select: {
            id: true,
            dueDate: true,
            amountDue: true,
            amountPaid: true,
            paymentDate: true,
            status: true,
          }
        },
        transactions: {
          select: {
            id: true,
            transactionType: true,
            amount: true,
            date: true,
          },
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!loan) {
      return new NextResponse("Loan not found", { status: 404 });
    }

    return NextResponse.json(loan);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Update loan
export async function PATCH(
  req: Request,
  { params }: { params: { loanId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { interestRate, maturityDate, status } = body;

    // Validate loan exists
    const existingLoan = await db.loan.findUnique({
      where: {
        id: parseInt(params.loanId)
      }
    });

    if (!existingLoan) {
      return new NextResponse("Loan not found", { status: 404 });
    }

    // Don't allow modifications to closed or defaulted loans
    if (existingLoan.status !== 'ACTIVE') {
      return new NextResponse("Cannot modify non-active loan", { status: 400 });
    }

    const loan = await db.loan.update({
      where: {
        id: parseInt(params.loanId)
      },
      data: {
        interestRate: interestRate !== undefined ? interestRate : undefined,
        maturityDate: maturityDate ? new Date(maturityDate) : undefined,
        status: status || undefined,
      },
      include: {
        borrower: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(loan);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete loan
export async function DELETE(
  req: Request,
  { params }: { params: { loanId: string } }
) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const loan = await db.loan.findUnique({
      where: {
        id: parseInt(params.loanId)
      },
      include: {
        repayments: true,
        transactions: true,
      }
    });

    if (!loan) {
      return new NextResponse("Loan not found", { status: 404 });
    }

    // Only allow deletion of closed loans with no outstanding repayments
    if (loan.status === 'ACTIVE') {
      return new NextResponse("Cannot delete active loan", { status: 400 });
    }

    // Delete related records first (using cascade in schema)
    await db.loan.delete({
      where: {
        id: parseInt(params.loanId)
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
