import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total contributions (from stashes)
    const totalContributions = await db.stash.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Get total loans (principal amounts)
    const totalLoans = await db.loan.aggregate({
      _sum: {
        principal: true,
      },
    });

    // Get total repayments (amount paid)
    const totalRepayments = await db.repayment.aggregate({
      _sum: {
        amountPaid: true,
      },
      where: {
        amountPaid: {
          not: null,
        },
      },
    });

    // Calculate totals
    const contributions = totalContributions._sum.amount || 0;
    const loans = totalLoans._sum.principal || 0;
    const repayments = totalRepayments._sum.amountPaid || 0;
    const amountOnHand = Number(contributions) + Number(repayments) - Number(loans);

    const financialSummary = {
      totalContributions: contributions,
      totalLoans: loans,
      totalRepayments: repayments,
      amountOnHand: amountOnHand,
    };

    return NextResponse.json(financialSummary);
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
