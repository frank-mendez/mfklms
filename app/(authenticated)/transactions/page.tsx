'use client';

import { useTransactions, useDeleteTransaction } from '@/react-query/transactions';

interface Transaction {
  id: number;
  loanId: number;
  loan: {
    id: number;
    borrower: {
      id: number;
      name: string;
    };
  };
  transactionType: 'DISBURSEMENT' | 'REPAYMENT';
  amount: number;
  date: Date;
  createdAt: Date;
}

export default function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

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

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
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

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error loading transactions. Please try again later.</span>
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
              {transactions?.map((transaction) => (
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
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deleteTransaction.isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!transactions || transactions.length === 0) && (
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
