'use client';
import { Loan } from '@/types/loan';
import { CloseIcon, CreateIcon, EditIcon, MoneyIcon, LightningIcon, CheckCircleIcon } from '@/assets/icons';
import { formatCurrency, calculateLoanTermInMonths, calculateExpectedTotalInterest, calculateExpectedTotalReturn, calculateLoanTerms, calculateExpectedMonthlyPayment } from '@/utils/loans';

interface ViewLoanModalProps {
  loan: Loan | null;
  onClose: () => void;
  onEdit?: (loan: Loan) => void;
}

export default function ViewLoanModal({ loan, onClose, onEdit }: ViewLoanModalProps) {
  if (!loan) return null;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'badge badge-success';
      case 'CLOSED':
        return 'badge badge-neutral';
      case 'DEFAULTED':
        return 'badge badge-error';
      default:
        return 'badge';
    }
  };

  // Calculate loan metrics using utility functions
  const loanTermInMonths = calculateLoanTermInMonths(loan.startDate, loan.maturityDate || undefined);
  const loanTermsText = calculateLoanTerms(loan.startDate, loan.maturityDate || undefined);
  const expectedMonthlyPayment = calculateExpectedMonthlyPayment(loan.principal, loan.interestRate, loanTermInMonths);
  const totalInterest = calculateExpectedTotalInterest(loan.principal, loan.interestRate, loanTermInMonths);
  const expectedReturnAmount = calculateExpectedTotalReturn(loan.principal, loan.interestRate, loanTermInMonths);
  const daysSinceStart = Math.floor((new Date().getTime() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Loan Details</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Loan ID</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-primary font-mono">#{loan.id}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Borrower</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="font-medium">{loan.borrower.name}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Status</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className={getStatusBadgeClass(loan.status)}>
                      {loan.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4">Financial Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Principal Amount</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-2xl font-bold text-primary">{formatCurrency(loan.principal)}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Interest Rate</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-2xl font-bold text-secondary">{loan.interestRate}%</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Loan Terms</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-lg font-semibold text-info">
                      {loanTermsText || 'Open-ended'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Expected Monthly Payment</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-xl font-semibold text-success">{formatCurrency(expectedMonthlyPayment)}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Expected Total Interest</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-xl font-semibold text-warning">{formatCurrency(totalInterest)}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Expected Return Amount</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span className="text-xl font-semibold text-accent">{formatCurrency(expectedReturnAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-lg mb-4">Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Start Date</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CreateIcon className="h-4 w-4 text-success" />
                      <span>{new Date(loan.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Maturity Date</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <EditIcon className="h-4 w-4 text-warning" />
                      <span>
                        {loan.maturityDate 
                          ? new Date(loan.maturityDate).toLocaleDateString()
                          : 'Open-ended'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Created</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span>{new Date(loan.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Last Updated</span>
                  </label>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <span>{new Date(loan.updatedAt).toLocaleString()}</span>
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
                    <MoneyIcon />
                  </div>
                  <div className="stat-title">Days Active</div>
                  <div className="stat-value text-primary">{daysSinceStart}</div>
                  <div className="stat-desc">Since loan start</div>
                </div>
                <div className="stat bg-base-100 rounded-lg">
                  <div className="stat-figure text-secondary">
                    <LightningIcon />
                  </div>
                  <div className="stat-title">Payments Made</div>
                  <div className="stat-value text-secondary">0</div>
                  <div className="stat-desc">Total repayments</div>
                </div>
                <div className="stat bg-base-100 rounded-lg">
                  <div className="stat-figure text-accent">
                    <CheckCircleIcon />
                  </div>
                  <div className="stat-title">Expected Return</div>
                  <div className="stat-value text-accent">{formatCurrency(expectedReturnAmount)}</div>
                  <div className="stat-desc">Total expected amount</div>
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
                onEdit(loan);
                onClose();
              }}
            >
              <EditIcon className="h-5 w-5 mr-2" />
              Edit Loan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
