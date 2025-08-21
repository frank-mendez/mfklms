'use client';
import { Owner } from '@/types/owner';
import { CloseIcon, EditIcon, UsersIcon, WarningIcon, CreateIcon } from '@/assets/icons';

interface ViewOwnerModalProps {
  owner: Owner | null;
  onClose: () => void;
  onEdit?: (owner: Owner) => void;
}

export default function ViewOwnerModal({ owner, onClose, onEdit }: ViewOwnerModalProps) {
  if (!owner) return null;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Owner Details</h3>
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
                <UsersIcon className="h-5 w-5" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Owner ID</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-primary font-mono">#{owner.id}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="font-medium">{owner.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <WarningIcon className="h-4 w-4" />
                    Contact Information
                  </span>
                </label>
                <div className="bg-base-100 p-3 rounded-lg">
                  {owner.contactInfo ? (
                    <span>{owner.contactInfo}</span>
                  ) : (
                    <span className="text-gray-500 italic">No contact information provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4 flex items-center gap-2">
                <CreateIcon className="h-5 w-5" />
                Record Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Created At</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-sm">{formatDate(owner.createdAt)}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Last Updated</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-sm">{formatDate(owner.updatedAt)}</span>
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
                onEdit(owner);
                onClose();
              }}
            >
              <EditIcon className="h-4 w-4" />
              Edit Owner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
