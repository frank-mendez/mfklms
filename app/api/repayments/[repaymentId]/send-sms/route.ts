import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";
import { logCreate } from "@/lib/activity-logger";

// POST /api/repayments/[repaymentId]/send-sms - Send SMS reminder for overdue repayment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ repaymentId: string }> }
) {
  try {
    const authCheck = await checkAuth();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const currentUser = authCheck.user;

    const { repaymentId } = await params;
    const repaymentIdNum = parseInt(repaymentId);

    // Get repayment details with borrower info
    const repayment = await db.repayment.findUnique({
      where: { id: repaymentIdNum },
      include: {
        loan: {
          include: {
            borrower: {
              select: {
                id: true,
                name: true,
                contactInfo: true
              }
            }
          }
        }
      }
    });

    if (!repayment) {
      return NextResponse.json(
        { error: 'Repayment not found' },
        { status: 404 }
      );
    }

    // Check if repayment is overdue and pending
    const now = new Date();
    const isOverdue = new Date(repayment.dueDate) < now;
    const isPending = repayment.status === 'PENDING';

    if (!isOverdue || !isPending) {
      return NextResponse.json(
        { error: 'SMS reminder can only be sent for overdue pending repayments' },
        { status: 400 }
      );
    }

    // Check if borrower has contact info
    if (!repayment.loan.borrower.contactInfo) {
      return NextResponse.json(
        { error: 'Borrower has no contact information' },
        { status: 400 }
      );
    }

    // Format the SMS message
    const smsMessage = `
Dear ${repayment.loan.borrower.name},

This is a reminder that your loan repayment of ${formatCurrency(Number(repayment.amountDue))} was due on ${new Date(repayment.dueDate).toLocaleDateString()}.

Please contact us to arrange payment.

Thank you,
MFK LMS
    `.trim();

    // TODO: Integrate with actual SMS service (Twilio, etc.)
    // For now, we'll just log the SMS attempt
    console.log('SMS would be sent to:', repayment.loan.borrower.contactInfo);
    console.log('SMS message:', smsMessage);

    // Log the SMS reminder activity
    await logCreate(
      currentUser.id,
      'REPAYMENT',
      repayment.id,
      `SMS reminder sent to ${repayment.loan.borrower.name}`,
      JSON.stringify({
        borrowerName: repayment.loan.borrower.name,
        borrowerContact: repayment.loan.borrower.contactInfo,
        repaymentId: repayment.id,
        amountDue: repayment.amountDue,
        dueDate: repayment.dueDate,
        smsMessage: smsMessage
      })
    );

    return NextResponse.json({
      success: true,
      message: 'SMS reminder sent successfully',
      borrower: repayment.loan.borrower.name,
      contact: repayment.loan.borrower.contactInfo
    });

  } catch (error) {
    console.error('Error sending SMS reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS reminder' },
      { status: 500 }
    );
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
}
