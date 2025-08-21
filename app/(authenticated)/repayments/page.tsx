'use client';

import { useState } from 'react';
import { useRepayments, useUpdateRepayment } from '@/react-query/repayments';
import { useCreateTransaction } from '@/react-query/transactions';
import { useErrorModal } from '@/hooks/useErrorModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { ErrorModal, ConfirmModal } from '@/components/common';
import { CreateEditRepaymentModal, DeleteRepaymentModal, ViewRepaymentModal } from '@/components/repayments';
import { Repayment } from '@/types/repayment';
import { 
  PlusIcon, 
  EyeIcon, 
  EditIcon, 
  DeleteIcon, 
  ErrorIcon, 
  LoadingSpinner,
  MoneyIcon,
  CheckCircleIcon,
  WarningIcon
} from '@/assets/icons';


export default function RepaymentsPage() {
  const { data: repayments, isLoading, error } = useRepayments();
  const updateRepayment = useUpdateRepayment();
  const createTransaction = useCreateTransaction();
  const { errorModal, showError, hideError } = useErrorModal();
  const { 
    isOpen: isConfirmOpen, 
    config: confirmConfig, 
    isLoading: isConfirmLoading,
    showConfirm, 
    hideConfirm, 
    handleConfirm 
  } = useConfirmModal();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRepayment, setSelectedRepayment] = useState<Repayment | null>(null);

  const handlePayment = (repayment: Repayment) => {
    showConfirm(
      {
        title: 'Confirm Payment',
        message: 'Confirm payment for this repayment? This will update the repayment status and create a transaction record.',
        confirmText: 'Confirm Payment',
        cancelText: 'Cancel',
        confirmButtonClass: 'btn-success'
      },
      async () => {
        try {
          const paymentDate = new Date();
          
          // Update the repayment status first
          await updateRepayment.mutateAsync({
            id: repayment.id,
            amountPaid: repayment.amountDue,
            paymentDate: paymentDate,
            status: 'PAID'
          });

          // Create a transaction record for the payment
          await createTransaction.mutateAsync({
            loanId: repayment.loanId,
            transactionType: 'REPAYMENT',
            amount: repayment.amountDue,
            date: paymentDate
          });

          // Optional: Show success message
          console.log('Payment recorded successfully and transaction created');

        } catch (error) {
          console.error('Error recording payment or creating transaction:', error);
          // If repayment was updated but transaction failed, user should be notified
          showError(
            'Payment Processing Error',
            'Payment was recorded but there was an issue creating the transaction record. Please check the transactions page.',
            error instanceof Error ? error : undefined
          );
          throw error; // Re-throw to keep the modal open and show error
        }
      }
    );
  };

  const handleViewRepayment = (repayment: Repayment) => {
    setSelectedRepayment(repayment);
    setIsViewModalOpen(true);
  };

  const handleEditRepayment = (repayment: Repayment) => {
    setSelectedRepayment(repayment);
    setIsEditModalOpen(true);
  };

  const handleDeleteRepayment = (repayment: Repayment) => {
    setSelectedRepayment(repayment);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedRepayment(null);
  };

  const getStatusBadgeClass = (status: 'PENDING' | 'PAID' | 'LATE' | 'MISSED') => {
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

  const getStatusIcon = (status: 'PENDING' | 'PAID' | 'LATE' | 'MISSED') => {
    switch (status) {
      case 'PAID':
        return <CheckCircleIcon className="h-3 w-3" />;
      case 'PENDING':
        return <WarningIcon className="h-3 w-3" />;
      case 'LATE':
        return <ErrorIcon className="h-3 w-3" />;
      case 'MISSED':
        return <ErrorIcon className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const calculatePaymentStatus = (dueDate: Date, paymentDate?: Date): 'PENDING' | 'PAID' | 'LATE' => {
    // If payment has been made, it's PAID
    if (paymentDate) {
      return 'PAID';
    }
    
    // Check if overdue
    const now = new Date();
    if (new Date(dueDate) < now) {
      return 'LATE';
    }
    
    return 'PENDING';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Repayments</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          Create Schedule
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner className="loading loading-spinner loading-lg" />
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <ErrorIcon className="stroke-current shrink-0 h-6 w-6" />
          <span>Error loading repayments. Please try again later.</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Loan ID</th>
                <th>Borrower</th>
                <th>Due Date</th>
                <th>Amount Due</th>
                <th>Amount Paid</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {repayments?.map((repayment) => {
                const currentStatus = calculatePaymentStatus(repayment.dueDate, repayment.paymentDate);
                return (
                  <tr key={repayment.id}>
                    <td>{repayment.id}</td>
                    <td>{repayment.loanId}</td>
                    <td>{repayment.loan.borrower.name}</td>
                    <td>{new Date(repayment.dueDate).toLocaleDateString()}</td>
                    <td>{formatCurrency(repayment.amountDue)}</td>
                    <td>
                      {repayment.amountPaid
                        ? formatCurrency(repayment.amountPaid)
                        : '-'
                      }
                    </td>
                    <td>
                      {repayment.paymentDate
                        ? new Date(repayment.paymentDate).toLocaleDateString()
                        : '-'
                      }
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(currentStatus)}>
                        {getStatusIcon(currentStatus)}
                        {currentStatus}
                      </span>
                    </td>
                    <td className="space-x-2">
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handlePayment(repayment)}
                        disabled={currentStatus === 'PAID' || updateRepayment.isPending || createTransaction.isPending}
                      >
                        <MoneyIcon className="h-4 w-4" />
                        {(updateRepayment.isPending || createTransaction.isPending) ? 'Processing...' : 'Pay'}
                      </button>
                      <button 
                        className="btn btn-sm btn-info"
                        onClick={() => handleViewRepayment(repayment)}
                      >
                        <EyeIcon className="h-4 w-4" />
                        View
                      </button>
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEditRepayment(repayment)}
                      >
                        <EditIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-error"
                        onClick={() => handleDeleteRepayment(repayment)}
                      >
                        <DeleteIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(!repayments || repayments.length === 0) && (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No repayments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateEditRepaymentModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        editingRepayment={null}
      />

      <CreateEditRepaymentModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        editingRepayment={selectedRepayment}
      />

      <ViewRepaymentModal
        isOpen={isViewModalOpen}
        onClose={closeModals}
        repayment={selectedRepayment}
      />

      <DeleteRepaymentModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        repayment={selectedRepayment}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={hideError}
        title={errorModal.title}
        message={errorModal.message}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        confirmButtonClass={confirmConfig.confirmButtonClass}
        isLoading={isConfirmLoading}
      />
    </div>
  );
}
