'use client';

import { useRepayments, useUpdateRepayment } from '@/react-query/repayments';


export default function RepaymentsPage() {
  const { data: repayments, isLoading, error } = useRepayments();
  const updateRepayment = useUpdateRepayment();

  const handlePayment = async (id: number, amountDue: number) => {
    if (confirm('Confirm payment for this repayment?')) {
      try {
        await updateRepayment.mutateAsync({
          id,
          amount: amountDue,
          repaymentDate: new Date()
        });
      } catch (error) {
        console.error('Error recording payment:', error);
      }
    }
  };

  const getStatusBadgeClass = (status: 'PENDING' | 'PAID' | 'LATE' | 'MISSED') => {
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

  const calculatePaymentStatus = (repaymentDate: Date): 'PENDING' | 'PAID' | 'LATE' => {
    // If repayment has been made (date exists and is in the past or present), it's PAID
    const now = new Date();
    if (repaymentDate <= now) {
      return 'PAID';
    }
    return 'PENDING';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Repayments</h1>
        <button className="btn btn-primary">Record Payment</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error loading repayments. Please try again later.</span>
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
              {repayments?.map((repayment) => {
                const currentStatus = calculatePaymentStatus(repayment.repaymentDate);
                return (
                  <tr key={repayment.id}>
                    <td>{repayment.id}</td>
                    <td>{repayment.loanId}</td>
                    <td>{repayment.loan.borrower.name}</td>
                    <td>{repayment.repaymentDate ? new Date(repayment.repaymentDate).toLocaleDateString() : '-'}</td>
                    <td>{formatCurrency(repayment.amount)}</td>
                    <td>
                      {currentStatus === 'PAID'
                        ? formatCurrency(repayment.amount)
                        : '-'
                      }
                    </td>
                    <td>
                      {repayment.repaymentDate
                        ? new Date(repayment.repaymentDate).toLocaleDateString()
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
                        onClick={() => handlePayment(repayment.id, repayment.amount)}
                        disabled={currentStatus === 'PAID' || updateRepayment.isPending}
                      >
                        Pay
                      </button>
                      <button className="btn btn-sm btn-info">View</button>
                      <button className="btn btn-sm btn-warning">Edit</button>
                    </td>
                  </tr>
                );
              })}
              {(!repayments || repayments.length === 0) && (
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
