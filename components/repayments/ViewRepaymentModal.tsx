'use client';

import { Repayment } from '@/types/repayment';
import { formatCurrency } from '@/utils/loans';
import { CheckCircleIcon, WarningIcon, ErrorIcon } from '@/assets/icons';

interface ViewRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  repayment: Repayment | null;
}

export default function ViewRepaymentModal({
  isOpen,
  onClose,
  repayment
}: ViewRepaymentModalProps) {
  if (!isOpen || !repayment) return null;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'badge badge-success';
      case 'PENDING':
        return 'badge badge-warning';
      case 'LATE':
        return 'badge badge-error';
      case 'MISSED':
        return 'badge badge-error badge-outline';
      default:
        return 'badge';
    }
  };

  const calculatePaymentStatus = (dueDate: Date, paymentDate?: Date): string => {
    if (paymentDate) {
      return 'PAID';
    }
    
    const now = new Date();
    if (new Date(dueDate) < now) {
      return 'LATE';
    }
    
    return 'PENDING';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'PENDING':
        return <WarningIcon className="h-4 w-4" />;
      case 'LATE':
        return <ErrorIcon className="h-4 w-4" />;
      case 'MISSED':
        return <ErrorIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const status = calculatePaymentStatus(repayment.dueDate, repayment.paymentDate);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-6">Repayment Details</h3>
        
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Repayment ID</span>
              </label>
              <p className="text-lg">#{repayment.id}</p>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text font-semibold">Status</span>
              </label>
              <span className={getStatusBadgeClass(status)}>
                {getStatusIcon(status)}
                {status}
              </span>
            </div>
          </div>

          {/* Loan Information */}
          <div className="divider">Loan Information</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Loan ID</span>
              </label>
              <p className="text-lg">#{repayment.loanId}</p>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text font-semibold">Borrower</span>
              </label>
              <p className="text-lg">{repayment.loan.borrower.name}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="divider">Payment Details</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Amount Due</span>
              </label>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(repayment.amountDue)}
              </p>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text font-semibold">Due Date</span>
              </label>
              <p className="text-lg">
                {new Date(repayment.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Amount Paid</span>
              </label>
              <p className="text-lg">
                {repayment.amountPaid 
                  ? formatCurrency(repayment.amountPaid)
                  : 'Not paid yet'
                }
              </p>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text font-semibold">Payment Date</span>
              </label>
              <p className="text-lg">
                {repayment.paymentDate 
                  ? new Date(repayment.paymentDate).toLocaleDateString()
                  : 'Not paid yet'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
