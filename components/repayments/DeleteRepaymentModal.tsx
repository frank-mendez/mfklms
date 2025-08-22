'use client';

import { useDeleteRepayment } from '@/react-query/repayments';
import { useErrorModal } from '@/hooks/useErrorModal';
import { ErrorModal } from '@/components/common';
import { Repayment } from '@/types/repayment';
import { LoadingSpinner } from '@/assets/icons';

interface DeleteRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  repayment: Repayment | null;
}

export default function DeleteRepaymentModal({
  isOpen,
  onClose,
  repayment
}: DeleteRepaymentModalProps) {
  const deleteRepayment = useDeleteRepayment();
  const { errorModal, showError, hideError } = useErrorModal();

  const handleConfirmDelete = async () => {
    if (!repayment) return;

    try {
      await deleteRepayment.mutateAsync(repayment.id);
      onClose();
    } catch (error) {
      showError('Failed to delete repayment', undefined, error as Error);
    }
  };

  if (!isOpen || !repayment) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error mb-4">Delete Repayment</h3>
          
          <div className="py-4">
            <p className="text-base mb-4">
              Are you sure you want to delete this repayment? This action cannot be undone.
            </p>
            
            {/* Repayment details */}
            <div className="bg-base-200 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Repayment ID:</span>
                <span>#{repayment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Loan ID:</span>
                <span>#{repayment.loanId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Borrower:</span>
                <span>{repayment.loan.borrower.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Amount Due:</span>
                <span>{formatCurrency(repayment.amountDue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Due Date:</span>
                <span>{new Date(repayment.dueDate).toLocaleDateString()}</span>
              </div>
              {repayment.amountPaid && (
                <div className="flex justify-between">
                  <span className="font-semibold">Amount Paid:</span>
                  <span>{formatCurrency(repayment.amountPaid)}</span>
                </div>
              )}
              {repayment.paymentDate && (
                <div className="flex justify-between">
                  <span className="font-semibold">Payment Date:</span>
                  <span>{new Date(repayment.paymentDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={onClose}
              disabled={deleteRepayment.isPending}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleConfirmDelete}
              disabled={deleteRepayment.isPending}
            >
              {deleteRepayment.isPending ? (
                <LoadingSpinner className="loading loading-spinner loading-sm" />
              ) : (
                'Delete Repayment'
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
