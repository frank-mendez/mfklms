import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { logCreate } from "@/lib/activity-logger";

// Get all repayments
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const repayments = await db.repayment.findMany({
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
        dueDate: 'asc'
      }
    });

    return NextResponse.json(repayments);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Create new repayment schedule
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { loanId, dueDate, amountDue } = body;

    if (!loanId || !dueDate || !amountDue) {
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
      return new NextResponse("Cannot add repayments to non-active loan", { status: 400 });
    }

    const repayment = await db.repayment.create({
      data: {
        loanId: parseInt(loanId),
        dueDate: new Date(dueDate),
        amountDue,
      },
      include: {
        loan: {
          select: {
            id: true,
            borrower: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(repayment);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
