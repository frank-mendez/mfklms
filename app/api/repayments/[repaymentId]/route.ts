import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// Get specific repayment
export async function GET(
  req: Request,
  { params }: { params: { repaymentId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const repayment = await db.repayment.findUnique({
      where: {
        id: parseInt(params.repaymentId)
      },
      include: {
        loan: {
          select: {
            id: true,
            principal: true,
            interestRate: true,
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

    if (!repayment) {
      return new NextResponse("Repayment not found", { status: 404 });
    }

    return NextResponse.json(repayment);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Update repayment
export async function PATCH(
  req: Request,
  { params }: { params: { repaymentId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { amountPaid, paymentDate, status } = body;

    const repayment = await db.repayment.findUnique({
      where: { id: parseInt(params.repaymentId) },
      include: { loan: true }
    });

    if (!repayment) {
      return new NextResponse("Repayment not found", { status: 404 });
    }

    if (repayment.loan.status !== 'ACTIVE') {
      return new NextResponse("Cannot update repayment for non-active loan", { status: 400 });
    }

    const updatedRepayment = await db.repayment.update({
      where: {
        id: parseInt(params.repaymentId)
      },
      data: {
        amountPaid: amountPaid !== undefined ? amountPaid : undefined,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
        status: status || undefined,
      }
    });

    // If payment is made, create a transaction record
    if (amountPaid && paymentDate) {
      await db.transaction.create({
        data: {
          loanId: repayment.loanId,
          transactionType: 'REPAYMENT',
          amount: amountPaid,
          date: new Date(paymentDate),
        }
      });
    }

    return NextResponse.json(updatedRepayment);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete repayment
export async function DELETE(
  req: Request,
  { params }: { params: { repaymentId: string } }
) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const repayment = await db.repayment.findUnique({
      where: { id: parseInt(params.repaymentId) },
      include: { loan: true }
    });

    if (!repayment) {
      return new NextResponse("Repayment not found", { status: 404 });
    }

    if (repayment.status === 'PAID') {
      return new NextResponse("Cannot delete paid repayment", { status: 400 });
    }

    await db.repayment.delete({
      where: {
        id: parseInt(params.repaymentId)
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
