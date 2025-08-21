'use client';

import { useState, useEffect } from 'react';
import { useCreateRepayment, useUpdateRepayment } from '@/react-query/repayments';
import { useLoans } from '@/react-query/loans';
import { useErrorModal } from '@/hooks/useErrorModal';
import { ErrorModal } from '@/components/common';
import { Repayment } from '@/types/repayment';
import { LoadingSpinner } from '@/assets/icons';

interface CreateEditRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRepayment?: Repayment | null;
}

interface FormData {
  loanId: number;
  amountDue: number;
  dueDate: string;
}

export default function CreateEditRepaymentModal({
  isOpen,
  onClose,
  editingRepayment
}: CreateEditRepaymentModalProps) {
  const createRepayment = useCreateRepayment();
  const updateRepayment = useUpdateRepayment();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { errorModal, showError, hideError } = useErrorModal();

  const [formData, setFormData] = useState<FormData>({
    loanId: 0,
    amountDue: 0,
    dueDate: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Reset form when modal opens/closes or when editing repayment changes
  useEffect(() => {
    if (isOpen) {
      if (editingRepayment) {
        setFormData({
          loanId: editingRepayment.loanId,
          amountDue: editingRepayment.amountDue,
          dueDate: new Date(editingRepayment.dueDate).toISOString().split('T')[0]
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          loanId: 0,
          amountDue: 0,
          dueDate: today
        });
      }
      setFormErrors({});
      hideError();
    }
  }, [isOpen, editingRepayment]); // Removed hideError from dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'loanId' || name === 'amountDue' 
        ? Number(value) 
        : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.loanId || formData.loanId === 0) {
      errors.loanId = 'Please select a loan';
    }
    
    if (!formData.amountDue || formData.amountDue <= 0) {
      errors.amountDue = 'Amount due must be greater than 0';
    }
    
    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingRepayment) {
        // Update existing repayment
        const updateData = {
          id: editingRepayment.id,
          amountDue: formData.amountDue,
          dueDate: new Date(formData.dueDate)
        };
        await updateRepayment.mutateAsync(updateData);
      } else {
        // Create new repayment
        const createData = {
          loanId: formData.loanId,
          amountDue: formData.amountDue,
          dueDate: new Date(formData.dueDate)
        };
        await createRepayment.mutateAsync(createData);
      }
      
      // Close modal on success
      onClose();
    } catch (error) {
      showError('Failed to save repayment', undefined, error as Error);
    }
  };

  if (!isOpen) return null;

  const isLoading = createRepayment.isPending || updateRepayment.isPending;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {editingRepayment ? 'Edit Repayment Schedule' : 'Create New Repayment Schedule'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Loan Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Loan</span>
              </label>
              <select
                name="loanId"
                value={formData.loanId}
                onChange={handleInputChange}
                className={`select select-bordered w-full ${formErrors.loanId ? 'select-error' : ''}`}
                disabled={loansLoading || !!editingRepayment}
              >
                <option value={0}>
                  {loansLoading ? 'Loading loans...' : 'Select a loan'}
                </option>
                {loans?.filter(loan => loan.status === 'ACTIVE').map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    Loan #{loan.id} - {loan.borrower.name} (₱{loan.principal.toLocaleString()})
                  </option>
                ))}
              </select>
              {formErrors.loanId && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.loanId}</span>
                </label>
              )}
            </div>

            {/* Amount Due */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount Due</span>
              </label>
              <input
                type="number"
                name="amountDue"
                value={formData.amountDue}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${formErrors.amountDue ? 'input-error' : ''}`}
                placeholder="Enter amount due"
                step="0.01"
                min="0"
              />
              {formErrors.amountDue && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.amountDue}</span>
                </label>
              )}
            </div>

            {/* Due Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Due Date</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${formErrors.dueDate ? 'input-error' : ''}`}
              />
              {formErrors.dueDate && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.dueDate}</span>
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="loading loading-spinner loading-sm" />
                ) : (
                  editingRepayment ? 'Update Schedule' : 'Create Schedule'
                )}
              </button>
            </div>
          </form>
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
