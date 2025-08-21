'use client';
import { useDeleteBorrower } from '@/react-query/borrowers';
import { useErrorModal } from '@/hooks/useErrorModal';
import { ErrorModal } from '@/components/common';
import { Borrower } from '@/types/borrower';
import { WarningIcon, DeleteIcon, LoadingSpinner } from '@/assets/icons';

interface DeleteBorrowerModalProps {
  borrower: Borrower | null;
  onClose: () => void;
}

export default function DeleteBorrowerModal({ borrower, onClose }: DeleteBorrowerModalProps) {
  const deleteBorrower = useDeleteBorrower();
  const { errorModal, showError, hideError } = useErrorModal();

  const handleConfirmDelete = async () => {
    if (!borrower) return;
    
    try {
      await deleteBorrower.mutateAsync(borrower.id);
      onClose();
    } catch (error) {
      console.error('Error deleting borrower:', error);
      showError(
        'Delete Failed',
        `Failed to delete borrower. ${error}`,
        error instanceof Error ? error : undefined
      );
    }
  };

  if (!borrower) return null;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Delete Borrower</h3>
          <div className="py-4">
            <div className="alert alert-warning mb-4">
              <WarningIcon className="stroke-current shrink-0 h-6 w-6" />
              <span>This action cannot be undone!</span>
            </div>
            <p className="text-base">
              Are you sure you want to delete <strong>{borrower.name}</strong>?
            </p>
            {borrower.contactInfo && (
              <p className="text-sm text-gray-600 mt-2">
                Contact: {borrower.contactInfo}
              </p>
            )}
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={deleteBorrower.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-error ${deleteBorrower.isPending ? 'loading' : ''}`}
              onClick={handleConfirmDelete}
              disabled={deleteBorrower.isPending}
            >
              {deleteBorrower.isPending ? (
                <>
                  <LoadingSpinner />
                  Deleting...
                </>
              ) : (
                <>
                  <DeleteIcon className="h-5 w-5 mr-2" />
                  Delete Borrower
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
