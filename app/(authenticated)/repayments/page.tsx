'use client';

import { useEffect, useState } from 'react';

interface Repayment {
  id: number;
  loanId: number;
  loan: {
    borrower: {
      name: string;
    };
  };
  dueDate: string;
  amountDue: number;
  amountPaid: number | null;
  paymentDate: string | null;
  status: 'PENDING' | 'PAID' | 'LATE' | 'MISSED';
  createdAt: string;
}

export default function RepaymentsPage() {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        const response = await fetch('/api/repayments');
        if (!response.ok) throw new Error('Failed to fetch repayments');
        const data = await response.json();
        setRepayments(data);
      } catch (error) {
        console.error('Error fetching repayments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepayments();
  }, []);

  const getStatusBadgeClass = (status: Repayment['status']) => {
    switch (status) {
      case 'PAID':
        return 'badge badge-success';
      case 'PENDING':
        return 'badge badge-warning';
      case 'LATE':
        return 'badge badge-error';
      case 'MISSED':
        return 'badge badge-error badge-outline';
      default:
        return 'badge';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const calculatePaymentStatus = (dueDate: string, status: Repayment['status']) => {
    if (status !== 'PENDING') return status;
    const now = new Date();
    const due = new Date(dueDate);
    return now > due ? 'LATE' : 'PENDING';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Repayments</h1>
        <button className="btn btn-primary">Record Payment</button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Loan ID</th>
                <th>Borrower</th>
                <th>Due Date</th>
                <th>Amount Due</th>
                <th>Amount Paid</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {repayments.map((repayment) => {
                const currentStatus = calculatePaymentStatus(repayment.dueDate, repayment.status);
                return (
                  <tr key={repayment.id}>
                    <td>{repayment.id}</td>
                    <td>{repayment.loanId}</td>
                    <td>{repayment.loan.borrower.name}</td>
                    <td>{new Date(repayment.dueDate).toLocaleDateString()}</td>
                    <td>{formatCurrency(repayment.amountDue)}</td>
                    <td>
                      {repayment.amountPaid 
                        ? formatCurrency(repayment.amountPaid)
                        : '-'
                      }
                    </td>
                    <td>
                      {repayment.paymentDate
                        ? new Date(repayment.paymentDate).toLocaleDateString()
                        : '-'
                      }
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(currentStatus)}>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="space-x-2">
                      <button 
                        className="btn btn-sm btn-success"
                        disabled={currentStatus === 'PAID'}
                      >
                        Pay
                      </button>
                      <button className="btn btn-sm btn-info">View</button>
                      <button className="btn btn-sm btn-warning">Edit</button>
                    </td>
                  </tr>
                );
              })}
              {repayments.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No repayments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
