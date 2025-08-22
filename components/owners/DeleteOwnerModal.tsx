'use client';
import { useDeleteOwner } from '@/react-query/owners';
import { Owner } from '@/types/owner';
import { LoadingSpinner, DeleteIcon, WarningIcon, CloseIcon } from '@/assets/icons';

interface DeleteOwnerModalProps {
  owner: Owner | null;
  onClose: () => void;
}

export default function DeleteOwnerModal({ 
  owner, 
  onClose 
}: DeleteOwnerModalProps) {
  const deleteOwner = useDeleteOwner();

  const handleDelete = async () => {
    if (!owner) return;

    try {
      await deleteOwner.mutateAsync(owner.id);
      onClose();
    } catch (error) {
      console.error('Error deleting owner:', error);
    }
  };

  if (!owner) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <DeleteIcon className="h-5 w-5 text-error" />
            Delete Owner
          </h3>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={deleteOwner.isPending}
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
            Are you sure you want to delete the owner <strong>&quot;{owner.name}&quot;</strong>?
          </p>
          
          <div className="bg-base-200 p-4 rounded-lg">
            <div className="text-sm">
              <div className="mb-2">
                <span className="font-medium">Owner ID:</span> #{owner.id}
              </div>
              <div className="mb-2">
                <span className="font-medium">Name:</span> {owner.name}
              </div>
              {owner.contactInfo && (
                <div>
                  <span className="font-medium">Contact:</span> {owner.contactInfo}
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
            disabled={deleteOwner.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-error ${deleteOwner.isPending ? 'loading' : ''}`}
            onClick={handleDelete}
            disabled={deleteOwner.isPending}
          >
            {deleteOwner.isPending ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : (
              <>
                <DeleteIcon className="h-4 w-4" />
                Delete Owner
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
