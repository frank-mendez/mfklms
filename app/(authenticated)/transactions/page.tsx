'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  loanId: number;
  loan: {
    borrower: {
      name: string;
    };
  };
  transactionType: 'DISBURSEMENT' | 'REPAYMENT';
  amount: number;
  date: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getTransactionTypeClass = (type: Transaction['transactionType']) => {
    switch (type) {
      case 'DISBURSEMENT':
        return 'badge badge-warning';
      case 'REPAYMENT':
        return 'badge badge-success';
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

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button className="btn btn-primary">New Transaction</button>
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
                <th>Date & Time</th>
                <th>Loan ID</th>
                <th>Borrower</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{formatDateTime(transaction.date)}</td>
                  <td>{transaction.loanId}</td>
                  <td>{transaction.loan.borrower.name}</td>
                  <td>
                    <span className={getTransactionTypeClass(transaction.transactionType)}>
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td className={transaction.transactionType === 'REPAYMENT' ? 'text-success' : 'text-warning'}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-info">View</button>
                    <button className="btn btn-sm btn-warning">Print</button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No transactions found
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
