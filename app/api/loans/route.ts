import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";
import { logCreate } from "@/lib/activity-logger";
import { calculateRepaymentSchedule, validateRepaymentParams } from "@/utils/loans/repayment-calculator";

// Get all loans
export async function GET() {
  try {
    const authCheck = await checkAuth();
    if (!authCheck.authorized) {
      return authCheck.response;
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
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Create new loan
export async function POST(req: Request) {
  try {
    const authCheck = await checkAuth();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const currentUser = authCheck.user;

    const body = await req.json();
    const { borrowerId, principal, interestRate, startDate, maturityDate } = body;

    if (!borrowerId || !principal || !interestRate || !startDate || !maturityDate) {
      return new NextResponse("Missing required fields: borrowerId, principal, interestRate, startDate, and maturityDate are required", { status: 400 });
    }

    const startDateObj = new Date(startDate);
    const maturityDateObj = new Date(maturityDate);

    // Validate repayment parameters
    const validationError = validateRepaymentParams(
      parseFloat(principal),
      parseFloat(interestRate),
      startDateObj,
      maturityDateObj
    );

    if (validationError) {
      return new NextResponse(validationError, { status: 400 });
    }

    // Calculate repayment schedule
    const repaymentSchedule = calculateRepaymentSchedule(
      parseFloat(principal),
      parseFloat(interestRate),
      startDateObj,
      maturityDateObj
    );

    // Create loan with automatic repayments and initial disbursement transaction
    const loan = await db.loan.create({
      data: {
        borrowerId: parseInt(borrowerId),
        principal,
        interestRate,
        startDate: startDateObj,
        maturityDate: maturityDateObj,
        repayments: {
          create: repaymentSchedule.map((schedule) => ({
            dueDate: schedule.dueDate,
            amountDue: schedule.amountDue,
            status: 'PENDING'
          }))
        },
        transactions: {
          create: {
            transactionType: 'DISBURSEMENT',
            amount: principal,
            date: startDateObj,
          }
        }
      },
      include: {
        borrower: {
          select: {
            name: true,
          }
        },
        repayments: {
          orderBy: {
            dueDate: 'asc'
          }
        },
        transactions: true,
      }
    });

    // Log the loan creation
    await logCreate(
      currentUser.id,
      'LOAN',
      loan.id,
      `Loan for ${loan.borrower.name} with ${loan.repayments.length} scheduled repayments`,
      JSON.stringify({
        borrowerId: loan.borrowerId,
        principal: loan.principal,
        interestRate: loan.interestRate,
        startDate: loan.startDate,
        maturityDate: loan.maturityDate,
        repaymentsCount: loan.repayments.length,
        totalRepaymentAmount: loan.repayments.reduce((sum, r) => sum + parseFloat(r.amountDue.toString()), 0)
      })
    );

    return NextResponse.json(loan);
  } catch (error) {
    console.error('Loan creation error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
