'use client';
import { useDeleteStash } from '@/react-query/stashes';
import { Stash } from '@/types/stash';
import { LoadingSpinner, DeleteIcon, WarningIcon, CloseIcon } from '@/assets/icons';

interface DeleteStashModalProps {
  stash: Stash | null;
  onClose: () => void;
  onError?: (title: string, message?: string, error?: Error | string) => void;
}

export default function DeleteStashModal({ 
  stash, 
  onClose,
  onError 
}: DeleteStashModalProps) {
  const deleteStash = useDeleteStash();

  const handleDelete = async () => {
    if (!stash) return;

    try {
      await deleteStash.mutateAsync(stash.id);
      onClose();
    } catch (error) {
      console.error('Error deleting stash:', error);
      if (onError) {
        onError(
          'Delete Error',
          'Failed to delete stash contribution. Please try again.',
          error instanceof Error ? error : undefined
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

  const formatMonth = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  if (!stash) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <DeleteIcon className="h-5 w-5 text-error" />
            Delete Stash Contribution
          </h3>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={deleteStash.isPending}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="py-4">
          <div className="alert alert-warning mb-4">
            <WarningIcon className="stroke-current shrink-0 h-6 w-6" />
            <span>This action cannot be undone!</span>
          </div>
          
          <p className="mb-4">
            Are you sure you want to delete this stash contribution?
          </p>
          
          <div className="bg-base-200 p-4 rounded-lg">
            <div className="text-sm">
              <div className="mb-2">
                <span className="font-medium">Contribution ID:</span> #{stash.id}
              </div>
              <div className="mb-2">
                <span className="font-medium">Owner:</span> {stash.owner.name}
              </div>
              <div className="mb-2">
                <span className="font-medium">Month:</span> {formatMonth(stash.month)}
              </div>
              <div className="mb-2">
                <span className="font-medium">Amount:</span> {formatCurrency(stash.amount)}
              </div>
              {stash.remarks && (
                <div>
                  <span className="font-medium">Remarks:</span> {stash.remarks}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={deleteStash.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-error ${deleteStash.isPending ? 'loading' : ''}`}
            onClick={handleDelete}
            disabled={deleteStash.isPending}
          >
            {deleteStash.isPending ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : (
              <>
                <DeleteIcon className="h-4 w-4" />
                Delete Contribution
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
