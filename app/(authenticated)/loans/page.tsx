'use client';

import { useLoans, useDeleteLoan } from '@/react-query/loans';

export default function LoansPage() {
  const { data: loans, isLoading, error } = useLoans();
  const deleteLoan = useDeleteLoan();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this loan?')) {
      try {
        await deleteLoan.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting loan:', error);
      }
    }
  };

  const getStatusBadgeClass = (status: 'ACTIVE' | 'CLOSED' | 'DEFAULTED') => {
    switch (status) {
      case 'ACTIVE':
        return 'badge badge-success';
      case 'CLOSED':
        return 'badge badge-neutral';
      case 'DEFAULTED':
        return 'badge badge-error';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Loans</h1>
        <button className="btn btn-primary">Create Loan</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error loading loans. Please try again later.</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Borrower</th>
                <th>Principal</th>
                <th>Interest Rate</th>
                <th>Start Date</th>
                <th>Maturity Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans?.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.borrower.name}</td>
                  <td>{formatCurrency(loan.principal)}</td>
                  <td>{loan.interestRate}%</td>
                  <td>{new Date(loan.startDate).toLocaleDateString()}</td>
                  <td>
                    {loan.maturityDate
                      ? new Date(loan.maturityDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(loan.status)}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-info">View</button>
                    <button className="btn btn-sm btn-warning">Edit</button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(loan.id)}
                      disabled={deleteLoan.isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!loans || loans.length === 0) && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No loans found
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
