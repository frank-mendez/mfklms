'use client';
import { useDeleteBorrower } from '@/react-query/borrowers';
import { Borrower } from '@/types/borrower';

interface DeleteBorrowerModalProps {
  borrower: Borrower | null;
  onClose: () => void;
}

export default function DeleteBorrowerModal({ borrower, onClose }: DeleteBorrowerModalProps) {
  const deleteBorrower = useDeleteBorrower();

  const handleConfirmDelete = async () => {
    if (!borrower) return;
    
    try {
      await deleteBorrower.mutateAsync(borrower.id);
      onClose();
    } catch (error) {
      console.error('Error deleting borrower:', error);
    }
  };

  if (!borrower) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Borrower</h3>
        <div className="py-4">
          <div className="alert alert-warning mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
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
                <span className="loading loading-spinner"></span>
                Deleting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Borrower
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
