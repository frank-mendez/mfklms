'use client';
import { Borrower } from '@/types/borrower';

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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="stat-title">Active Loans</div>
                  <div className="stat-value text-primary">0</div>
                  <div className="stat-desc">Currently borrowing</div>
                </div>
                <div className="stat bg-base-100 rounded-lg">
                  <div className="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="stat-title">Total Borrowed</div>
                  <div className="stat-value text-secondary">$0</div>
                  <div className="stat-desc">Lifetime amount</div>
                </div>
                <div className="stat bg-base-100 rounded-lg">
                  <div className="stat-figure text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Borrower
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
