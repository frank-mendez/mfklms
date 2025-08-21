'use client';

import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/loans';
import { CloseIcon, MoneyIcon, UsersIcon } from '@/assets/icons';

interface ViewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function ViewTransactionModal({
  isOpen,
  onClose,
  transaction
}: ViewTransactionModalProps) {
  if (!isOpen || !transaction) return null;

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeClass = (type: 'DISBURSEMENT' | 'REPAYMENT') => {
    return type === 'DISBURSEMENT' ? 'badge badge-warning' : 'badge badge-success';
  };

  const getTransactionTypeIcon = (type: 'DISBURSEMENT' | 'REPAYMENT') => {
    return <MoneyIcon className="h-4 w-4" />;
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Transaction Details</h3>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Transaction Info */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 flex items-center">
              {getTransactionTypeIcon(transaction.transactionType)}
              <span className="ml-2">Transaction Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Transaction ID</span>
                <p className="font-semibold">#{transaction.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Type</span>
                <div className="mt-1">
                  <span className={getTransactionTypeClass(transaction.transactionType)}>
                    {transaction.transactionType}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Amount</span>
                <p className={`font-bold text-lg ${
                  transaction.transactionType === 'REPAYMENT' ? 'text-success' : 'text-warning'
                }`}>
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600 flex items-center">
                  Transaction Date
                </span>
                <p className="font-semibold">{formatDateTime(transaction.date)}</p>
              </div>
            </div>
          </div>

          {/* Loan Info */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 flex items-center">
              <UsersIcon className="h-5 w-5" />
              <span className="ml-2">Loan Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Loan ID</span>
                <p className="font-semibold">#{transaction.loanId}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Borrower</span>
                <p className="font-semibold">{transaction.loan.borrower.name}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3">Record Information</h4>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-sm text-gray-600">Created At</span>
                <p className="font-semibold">{formatDateTime(transaction.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
