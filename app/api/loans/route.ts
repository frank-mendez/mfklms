import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// Get all loans
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const loans = await db.loan.findMany({
      include: {
        borrower: {
          select: {
            id: true,
            name: true,
          }
        },
        repayments: {
          select: {
            id: true,
            dueDate: true,
            amountDue: true,
            amountPaid: true,
            status: true,
          }
        },
        transactions: {
          select: {
            id: true,
            transactionType: true,
            amount: true,
            date: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(loans);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Create new loan
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { borrowerId, principal, interestRate, startDate, maturityDate } = body;

    if (!borrowerId || !principal || !interestRate || !startDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create loan with initial disbursement transaction
    const loan = await db.loan.create({
      data: {
        borrowerId: parseInt(borrowerId),
        principal,
        interestRate,
        startDate: new Date(startDate),
        maturityDate: maturityDate ? new Date(maturityDate) : null,
        transactions: {
          create: {
            transactionType: 'DISBURSEMENT',
            amount: principal,
            date: new Date(startDate),
          }
        }
      },
      include: {
        borrower: {
          select: {
            name: true,
          }
        },
        transactions: true,
      }
    });

    return NextResponse.json(loan);
  } catch (error) {
    console.error('Loan creation error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
