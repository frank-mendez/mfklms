'use client';

import { useState, useEffect } from 'react';
import { useCreateTransaction, useUpdateTransaction } from '@/react-query/transactions';
import { useLoans } from '@/react-query/loans';
import { useErrorModal } from '@/hooks/useErrorModal';
import { ErrorModal } from '@/components/common';
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO } from '@/types/transaction';
import { TransactionType } from '@/types/repayment';
import { LoadingSpinner, CloseIcon } from '@/assets/icons';

interface CreateEditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export default function CreateEditTransactionModal({
  isOpen,
  onClose,
  transaction
}: CreateEditTransactionModalProps) {
  const { data: loans } = useLoans();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const { errorModal, showError, hideError } = useErrorModal();

  // Form state
  const [formData, setFormData] = useState({
    loanId: 0,
    transactionType: 'DISBURSEMENT' as TransactionType,
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  type FormDataKey = keyof typeof formData;
  type FormDataValue = typeof formData[FormDataKey];

  // Reset form when modal opens/closes or transaction changes
  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        // Edit mode
        setFormData({
          loanId: transaction.loanId,
          transactionType: transaction.transactionType,
          amount: transaction.amount,
          date: new Date(transaction.date).toISOString().split('T')[0]
        });
      } else {
        // Create mode
        setFormData({
          loanId: 0,
          transactionType: 'DISBURSEMENT',
          amount: 0,
          date: new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [isOpen, transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.loanId || formData.amount <= 0) {
      showError('Validation Error', 'Please fill in all required fields with valid values.');
      return;
    }

    try {
      if (transaction) {
        // Update existing transaction
        const updateData: UpdateTransactionDTO = {
          id: transaction.id,
          transactionType: formData.transactionType,
          amount: formData.amount,
          date: new Date(formData.date)
        };
        await updateTransaction.mutateAsync(updateData);
      } else {
        // Create new transaction
        const createData: CreateTransactionDTO = {
          loanId: formData.loanId,
          transactionType: formData.transactionType,
          amount: formData.amount,
          date: new Date(formData.date)
        };
        await createTransaction.mutateAsync(createData);
      }
      onClose();
    } catch (error) {
      showError(
        transaction ? 'Update Failed' : 'Create Failed',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  };

  const handleInputChange = (field: FormDataKey, value: FormDataValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  const isLoading = createTransaction.isPending || updateTransaction.isPending;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              {transaction ? 'Edit Transaction' : 'New Transaction'}
            </h3>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Loan Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Loan *</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.loanId}
                onChange={(e) => handleInputChange('loanId', parseInt(e.target.value))}
                disabled={isLoading}
                required
              >
                <option value={0}>Select a loan</option>
                {loans?.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    Loan #{loan.id} - {loan.borrower.name} (₱{loan.principal.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Transaction Type *</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.transactionType}
                onChange={(e) => handleInputChange('transactionType', e.target.value as TransactionType)}
                disabled={isLoading}
                required
              >
                <option value="DISBURSEMENT">Disbursement</option>
                <option value="REPAYMENT">Repayment</option>
              </select>
            </div>

            {/* Amount */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount *</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            {/* Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date *</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

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
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    {transaction ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  transaction ? 'Update Transaction' : 'Create Transaction'
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
