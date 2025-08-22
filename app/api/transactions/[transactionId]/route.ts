import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { logUpdate, logDelete } from "@/lib/activity-logger";

// Get specific transaction
export async function GET(
  req: Request,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { transactionId } = await params;
    const transaction = await db.transaction.findUnique({
      where: {
        id: parseInt(transactionId)
      },
      include: {
        loan: {
          select: {
            id: true,
            principal: true,
            status: true,
            borrower: {
              select: {
                id: true,
                name: true,
                contactInfo: true,
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Update transaction
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin || !currentUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { transactionId } = await params;

    const body = await req.json();
    const { amount, date } = body;

    const transaction = await db.transaction.findUnique({
      where: { id: parseInt(transactionId) },
      include: { 
        loan: {
          include: {
            borrower: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    // Don't allow modifications to transactions of closed/defaulted loans
    if (transaction.loan.status !== 'ACTIVE') {
      return new NextResponse("Cannot modify transactions of non-active loan", { status: 400 });
    }

    // Special validation for disbursement modifications
    if (transaction.transactionType === 'DISBURSEMENT' && amount !== undefined) {
      return new NextResponse("Cannot modify disbursement amount", { status: 400 });
    }

    const updatedTransaction = await db.transaction.update({
      where: {
        id: parseInt(transactionId)
      },
      data: {
        amount: amount !== undefined ? amount : undefined,
        date: date ? new Date(date) : undefined,
      },
      include: {
        loan: {
          include: {
            borrower: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Log the update
    await logUpdate(
      currentUser.id,
      'OTHER',
      updatedTransaction.id,
      `Transaction for ${updatedTransaction.loan.borrower.name}`,
      JSON.stringify({
        amount: transaction.amount,
        date: transaction.date,
        transactionType: transaction.transactionType
      }),
      JSON.stringify({
        amount: updatedTransaction.amount,
        date: updatedTransaction.date,
        transactionType: updatedTransaction.transactionType
      })
    );

    return NextResponse.json(updatedTransaction);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete transaction
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin || !currentUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { transactionId } = await params;
    const transaction = await db.transaction.findUnique({
      where: { id: parseInt(transactionId) },
      include: { 
        loan: {
          include: {
            borrower: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    // Don't allow deletion of disbursement transactions
    if (transaction.transactionType === 'DISBURSEMENT') {
      return new NextResponse("Cannot delete loan disbursement", { status: 400 });
    }

    // Don't allow deletion of transactions for closed/defaulted loans
    if (transaction.loan.status !== 'ACTIVE') {
      return new NextResponse("Cannot delete transactions of non-active loan", { status: 400 });
    }

    await db.transaction.delete({
      where: {
        id: parseInt(transactionId)
      }
    });

    // Log the deletion
    await logDelete(
      currentUser.id,
      'OTHER',
      transaction.id,
      `Transaction for ${transaction.loan.borrower.name}`,
      JSON.stringify({
        amount: transaction.amount,
        date: transaction.date,
        transactionType: transaction.transactionType
      })
    );

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
