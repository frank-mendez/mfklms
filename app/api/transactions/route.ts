import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logCreate } from "@/lib/activity-logger";

// Get all transactions
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactions = await db.transaction.findMany({
      include: {
        loan: {
          select: {
            id: true,
            principal: true,
            borrower: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(transactions);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Create new transaction
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { loanId, transactionType, amount, date } = body;

    if (!loanId || !transactionType || !amount || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate loan exists and is active
    const loan = await db.loan.findUnique({
      where: { id: parseInt(loanId) }
    });

    if (!loan) {
      return new NextResponse("Loan not found", { status: 404 });
    }

    if (loan.status !== 'ACTIVE') {
      return new NextResponse("Cannot add transactions to non-active loan", { status: 400 });
    }

    // Additional validation for transaction types
    if (transactionType === 'DISBURSEMENT') {
      const existingDisbursement = await db.transaction.findFirst({
        where: {
          loanId: parseInt(loanId),
          transactionType: 'DISBURSEMENT'
        }
      });

      if (existingDisbursement) {
        return new NextResponse("Loan already has a disbursement", { status: 400 });
      }

      if (amount !== loan.principal) {
        return new NextResponse("Disbursement amount must match loan principal", { status: 400 });
      }
    }

    const transaction = await db.transaction.create({
      data: {
        loanId: parseInt(loanId),
        transactionType,
        amount,
        date: new Date(date),
      },
      include: {
        loan: {
          select: {
            borrower: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    // Log the transaction creation
    await logCreate(
      currentUser.id,
      'OTHER',
      transaction.id,
      `Transaction for ${transaction.loan.borrower.name}`,
      JSON.stringify({
        loanId: transaction.loanId,
        transactionType: transaction.transactionType,
        amount: transaction.amount,
        date: transaction.date
      })
    );

    return NextResponse.json(transaction);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
