'use client';
import { Stash } from '@/types/stash';
import { CloseIcon, EditIcon, UsersIcon, MoneyIcon, CreateIcon } from '@/assets/icons';

interface ViewStashModalProps {
  stash: Stash | null;
  onClose: () => void;
  onEdit?: (stash: Stash) => void;
}

export default function ViewStashModal({ stash, onClose, onEdit }: ViewStashModalProps) {
  if (!stash) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMonth = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Stash Contribution Details</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4 flex items-center gap-2">
                <MoneyIcon className="h-5 w-5" />
                Contribution Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Contribution ID</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-primary font-mono">#{stash.id}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Amount</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="font-bold text-lg text-success">
                      {formatCurrency(stash.amount)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="label">
                  <span className="label-text font-medium">Contribution Month</span>
                </label>
                <div className="bg-base-100 p-3 rounded-lg">
                  <span className="font-medium">{formatMonth(stash.month)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4 flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Owner Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Owner ID</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-primary font-mono">#{stash.owner.id}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Owner Name</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="font-medium">{stash.owner.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4 flex items-center gap-2">
                <CreateIcon className="h-5 w-5" />
                Additional Information
              </h4>
              
              <div className="mb-4">
                <label className="label">
                  <span className="label-text font-medium">Remarks</span>
                </label>
                <div className="bg-base-100 p-3 rounded-lg">
                  {stash.remarks ? (
                    <span>{stash.remarks}</span>
                  ) : (
                    <span className="text-gray-500 italic">No remarks provided</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Created At</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-sm">{formatDate(stash.createdAt)}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Last Updated</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-sm">{formatDate(stash.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Close
          </button>
          {onEdit && (
            <button
              className="btn btn-primary"
              onClick={() => {
                onEdit(stash);
                onClose();
              }}
            >
              <EditIcon className="h-4 w-4" />
              Edit Contribution
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
