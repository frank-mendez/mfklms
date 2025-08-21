'use client';

import { useState } from 'react';
import { useTransactions } from '@/react-query/transactions';
import { CreateEditTransactionModal, ViewTransactionModal, DeleteTransactionModal } from '@/components/transactions';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/loans';
import { 
  PlusIcon, 
  EyeIcon, 
  EditIcon, 
  DeleteIcon, 
  ErrorIcon, 
  LoadingSpinner,
  MoneyIcon
} from '@/assets/icons';

export default function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactions();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  const getTransactionTypeClass = (type: 'DISBURSEMENT' | 'REPAYMENT') => {
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
        <button 
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Transaction
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <ErrorIcon className="stroke-current shrink-0 h-6 w-6" />
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
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewTransaction(transaction)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteTransaction(transaction)}
                    >
                      <DeleteIcon className="h-4 w-4" />
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

      {/* Modals */}
      <CreateEditTransactionModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        transaction={null}
      />

      <CreateEditTransactionModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        transaction={selectedTransaction}
      />

      <ViewTransactionModal
        isOpen={isViewModalOpen}
        onClose={closeModals}
        transaction={selectedTransaction}
      />

      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        transaction={selectedTransaction}
      />
    </div>
  );
}
