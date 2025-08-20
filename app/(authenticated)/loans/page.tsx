'use client';

import { useEffect, useState } from 'react';

interface Loan {
  id: number;
  borrowerId: number;
  borrower: {
    name: string;
  };
  principal: number;
  interestRate: number;
  startDate: string;
  maturityDate: string | null;
  status: 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
  createdAt: string;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch('/api/loans');
        if (!response.ok) throw new Error('Failed to fetch loans');
        const data = await response.json();
        setLoans(data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const getStatusBadgeClass = (status: Loan['status']) => {
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
              {loans.map((loan) => (
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
                    <button className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
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
