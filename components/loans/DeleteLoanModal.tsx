'use client';
import { useDeleteLoan } from '@/react-query/loans';
import { Loan } from '@/types/loan';
import { WarningIcon, DeleteIcon, LoadingSpinner } from '@/assets/icons';

interface DeleteLoanModalProps {
  loan: Loan | null;
  onClose: () => void;
  onError?: (title: string, message?: string, error?: Error | string) => void;
}

export default function DeleteLoanModal({ loan, onClose, onError }: DeleteLoanModalProps) {
  const deleteLoan = useDeleteLoan();

  const handleConfirmDelete = async () => {
    if (!loan) return;
    
    try {
      await deleteLoan.mutateAsync(loan.id);
      onClose();
    } catch (error) {
      console.error('Error deleting loan:', error);
      if (onError) {
        onError(
          'Failed to Delete Loan',
          `${error}`,
          error as Error
        );
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  if (!loan) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Loan</h3>
        <div className="py-4">
          <div className="alert alert-warning mb-4">
            <WarningIcon className="stroke-current shrink-0 h-6 w-6" />
            <span>This action cannot be undone!</span>
          </div>
          <p className="text-base mb-4">
            Are you sure you want to delete this loan?
          </p>
          
          {/* Loan Details */}
          <div className="bg-base-200 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Loan ID:</span>
              <span>#{loan.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Borrower:</span>
              <span>{loan.borrower.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Principal:</span>
              <span>{formatCurrency(loan.principal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Interest Rate:</span>
              <span>{loan.interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className={
                loan.status === 'ACTIVE' ? 'badge badge-success' :
                loan.status === 'CLOSED' ? 'badge badge-neutral' :
                'badge badge-error'
              }>
                {loan.status}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={deleteLoan.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-error ${deleteLoan.isPending ? 'loading' : ''}`}
            onClick={handleConfirmDelete}
            disabled={deleteLoan.isPending}
          >
            {deleteLoan.isPending ? (
              <>
                <LoadingSpinner />
                Deleting...
              </>
            ) : (
              <>
                <DeleteIcon className="h-5 w-5 mr-2" />
                Delete Loan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
