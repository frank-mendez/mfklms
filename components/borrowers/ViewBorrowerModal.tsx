'use client';
import { Borrower } from '@/types/borrower';
import { CloseIcon, CreateIcon, EditIcon, MoneyIcon, LightningIcon, CheckCircleIcon } from '@/assets/icons';

interface ViewBorrowerModalProps {
  borrower: Borrower | null;
  onClose: () => void;
  onEdit?: (borrower: Borrower) => void;
}

export default function ViewBorrowerModal({ borrower, onClose, onEdit }: ViewBorrowerModalProps) {
  if (!borrower) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Borrower Details</h3>
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
              <h4 className="card-title text-lg mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">ID</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-primary font-mono">#{borrower.id}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="font-medium">{borrower.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4">Contact Information</h4>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Contact Details</span>
                </label>
                <div className="bg-base-100 p-3 rounded-lg min-h-[60px]">
                  {borrower.contactInfo ? (
                    <span className="whitespace-pre-wrap">{borrower.contactInfo}</span>
                  ) : (
                    <span className="text-gray-500 italic">No contact information provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4">Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Created</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CreateIcon className="h-4 w-4 text-success" />
                      <span>{new Date(borrower.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Last Updated</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <EditIcon className="h-4 w-4 text-warning" />
                      <span>{new Date(borrower.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4">Quick Stats</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat bg-base-100 rounded-lg">
                  <div className="stat-figure text-primary">
                  </div>
                  <div className="stat-title">Active Loans</div>
                  <div className="stat-value text-primary">0</div>
                  <div className="stat-desc">Currently borrowing</div>
                </div>
                <div className="stat bg-base-100 rounded-lg">
                  <div className="stat-figure text-secondary">
                    <LightningIcon />
                  </div>
                  <div className="stat-title">Total Borrowed</div>
                  <div className="stat-value text-secondary">0</div>
                  <div className="stat-desc">Lifetime amount</div>
                </div>
                <div className="stat bg-base-100 rounded-lg">
                  <div className="stat-figure text-accent">
                    <CheckCircleIcon />
                  </div>
                  <div className="stat-title">Repayment Rate</div>
                  <div className="stat-value text-accent">100%</div>
                  <div className="stat-desc">On-time payments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action mt-6">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onEdit(borrower);
                onClose();
              }}
            >
              <EditIcon className="h-5 w-5 mr-2" />
              Edit Borrower
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
