'use client';

import { useDeleteTransaction } from '@/react-query/transactions';
import { useErrorModal } from '@/hooks/useErrorModal';
import { ErrorModal } from '@/components/common';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/loans';
import { WarningIcon, DeleteIcon, LoadingSpinner } from '@/assets/icons';

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function DeleteTransactionModal({
  isOpen,
  onClose,
  transaction
}: DeleteTransactionModalProps) {
  const deleteTransaction = useDeleteTransaction();
  const { errorModal, showError, hideError } = useErrorModal();

  const handleConfirmDelete = async () => {
    if (!transaction) return;

    try {
      await deleteTransaction.mutateAsync(transaction.id);
      onClose();
    } catch (error) {
      showError(
        'Delete Failed',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  };

  if (!isOpen || !transaction) return null;

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
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Delete Transaction</h3>
          <div className="py-4">
            <div className="alert alert-warning mb-4">
              <WarningIcon className="stroke-current shrink-0 h-6 w-6" />
              <span>This action cannot be undone!</span>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <p className="text-base mb-2">
                Are you sure you want to delete this transaction?
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-semibold">#{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className={`badge ${
                    transaction.transactionType === 'DISBURSEMENT' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {transaction.transactionType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{formatDateTime(transaction.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Borrower:</span>
                  <span className="font-semibold">{transaction.loan.borrower.name}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={deleteTransaction.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-error ${deleteTransaction.isPending ? 'loading' : ''}`}
              onClick={handleConfirmDelete}
              disabled={deleteTransaction.isPending}
            >
              {deleteTransaction.isPending ? (
                <>
                  <LoadingSpinner />
                  Deleting...
                </>
              ) : (
                <>
                  <DeleteIcon className="h-5 w-5 mr-2" />
                  Delete Transaction
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={hideError}
        title={errorModal.title}
        message={errorModal.message}
      />
    </>
  );
}
