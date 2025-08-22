import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { logUpdate, logDelete } from "@/lib/activity-logger";
import { Prisma } from "@prisma/client";

// Get specific loan
export async function GET(
  req: Request,
  { params }: { params: Promise<{ loanId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { loanId } = await params;
    const loan = await db.loan.findUnique({
      where: {
        id: parseInt(loanId)
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
  } catch {
    return new NextResponse(`Internal Error`, { status: 500 });
  }
}

// Update loan
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ loanId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log('Received update data:', body);
    const { borrowerId, principal, interestRate, startDate, maturityDate, status } = body;

    const { loanId } = await params;
    // Validate loan exists
    const existingLoan = await db.loan.findUnique({
      where: {
        id: parseInt(loanId)
      }
    });

    if (!existingLoan) {
      return new NextResponse("Loan not found", { status: 404 });
    }

    // Build update data object, filtering out undefined values
    const updateData: Prisma.LoanUpdateInput = {};
    if (borrowerId !== undefined && borrowerId !== null) updateData.borrower = { connect: { id: parseInt(borrowerId) } };
    if (principal !== undefined && principal !== null) updateData.principal = principal;
    if (interestRate !== undefined && interestRate !== null) updateData.interestRate = interestRate;
    if (startDate && startDate !== '') updateData.startDate = new Date(startDate);
    if (maturityDate && maturityDate !== '') updateData.maturityDate = new Date(maturityDate);
    if (status && status !== '') updateData.status = status;

    console.log('Update data to be sent to database:', updateData);
    
    // Ensure we have at least one field to update
    if (Object.keys(updateData).length === 0) {
      return new NextResponse("No valid fields to update", { status: 400 });
    }

    const loan = await db.loan.update({
      where: {
        id: parseInt(loanId)
      },
      data: updateData,
      include: {
        borrower: {
          select: {
            name: true,
          }
        }
      }
    });

    // Log the loan update
    await logUpdate(
      currentUser.id,
      'LOAN',
      loan.id,
      `Loan for ${loan.borrower.name}`,
      JSON.stringify(existingLoan),
      JSON.stringify(updateData)
    );

    return NextResponse.json(loan);
  } catch (error) {
    console.error('Error updating loan:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete loan
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ loanId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin || !currentUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { loanId } = await params;
    const loan = await db.loan.findUnique({
      where: {
        id: parseInt(loanId)
      },
      include: {
        repayments: true,
        transactions: true,
        borrower: {
          select: {
            name: true,
          }
        }
      }
    });

    if (!loan) {
      return new NextResponse("Loan not found", { status: 404 });
    }

    // Only allow deletion of closed loans with no outstanding repayments
    if (loan.status === 'ACTIVE') {
      return new NextResponse("Cannot delete active loan", { status: 400 });
    }

    // Log the deletion before deleting
    await logDelete(
      currentUser.id,
      'LOAN',
      loan.id,
      `Loan for ${loan.borrower.name}`,
      JSON.stringify({
        borrowerId: loan.borrowerId,
        principal: loan.principal,
        interestRate: loan.interestRate,
        status: loan.status
      })
    );

    // Delete related records first (using cascade in schema)
    await db.loan.delete({
      where: {
        id: parseInt(loanId)
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
