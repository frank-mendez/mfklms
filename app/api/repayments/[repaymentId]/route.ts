import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { logUpdate, logDelete } from "@/lib/activity-logger";

// Get specific repayment
export async function GET(
  req: Request,
  { params }: { params: Promise<{ repaymentId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { repaymentId } = await params;
    const repayment = await db.repayment.findUnique({
      where: {
        id: parseInt(repaymentId)
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

// Update repayment (using PATCH for partial updates)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ repaymentId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { amountDue, amountPaid, dueDate, paymentDate, status } = body;

    const { repaymentId } = await params;
    const existingRepayment = await db.repayment.findUnique({
      where: { id: parseInt(repaymentId) },
      include: { 
        loan: {
          include: {
            borrower: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!existingRepayment) {
      return new NextResponse("Repayment not found", { status: 404 });
    }

    const updatedRepayment = await db.repayment.update({
      where: {
        id: parseInt(repaymentId)
      },
      data: {
        amountDue: amountDue !== undefined ? amountDue : undefined,
        amountPaid: amountPaid !== undefined ? amountPaid : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
        status: status || undefined,
      },
      include: {
        loan: {
          include: {
            borrower: {
              select: {
                id: true,
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
      'REPAYMENT',
      updatedRepayment.id,
      `Repayment for ${updatedRepayment.loan.borrower.name}`,
      {
        amountDue: existingRepayment.amountDue,
        amountPaid: existingRepayment.amountPaid,
        dueDate: existingRepayment.dueDate,
        paymentDate: existingRepayment.paymentDate,
        status: existingRepayment.status
      },
      {
        amountDue: updatedRepayment.amountDue,
        amountPaid: updatedRepayment.amountPaid,
        dueDate: updatedRepayment.dueDate,
        paymentDate: updatedRepayment.paymentDate,
        status: updatedRepayment.status
      }
    );

    return NextResponse.json(updatedRepayment);
  } catch (error) {
    console.error('Error updating repayment:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete repayment
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ repaymentId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin || !currentUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { repaymentId } = await params;
    const repayment = await db.repayment.findUnique({
      where: { id: parseInt(repaymentId) },
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

    if (!repayment) {
      return new NextResponse("Repayment not found", { status: 404 });
    }

    if (repayment.status === 'PAID') {
      return new NextResponse("Cannot delete paid repayment", { status: 400 });
    }

    await db.repayment.delete({
      where: {
        id: parseInt(repaymentId)
      }
    });

    // Log the deletion
    await logDelete(
      currentUser.id,
      'REPAYMENT',
      repayment.id,
      `Repayment for ${repayment.loan.borrower.name}`,
      {
        amountDue: repayment.amountDue,
        amountPaid: repayment.amountPaid,
        dueDate: repayment.dueDate,
        paymentDate: repayment.paymentDate,
        status: repayment.status
      }
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
