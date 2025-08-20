'use client';
import { useState, useEffect } from 'react';
import { useCreateLoan, useUpdateLoan } from '@/react-query/loans';
import { useBorrowers } from '@/react-query/borrowers';
import { CreateLoanData, Loan } from '@/types/loan';
import { LoadingSpinner, PlusIcon, EditIcon } from '@/assets/icons';

interface CreateEditLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingLoan: Loan | null;
}

export default function CreateEditLoanModal({ 
  isOpen, 
  onClose, 
  editingLoan 
}: CreateEditLoanModalProps) {
  const createLoan = useCreateLoan();
  const updateLoan = useUpdateLoan();
  const { data: borrowers, isLoading: borrowersLoading } = useBorrowers();
  
  // Form state
  const [formData, setFormData] = useState<CreateLoanData>({
    borrowerId: 0,
    principal: 0,
    interestRate: 0,
    startDate: '',
    maturityDate: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Reset form when modal opens/closes or when editing loan changes
  useEffect(() => {
    if (isOpen) {
      if (editingLoan) {
        setFormData({
          borrowerId: editingLoan.borrowerId,
          principal: editingLoan.principal,
          interestRate: editingLoan.interestRate,
          startDate: editingLoan.startDate.split('T')[0], // Format for date input
          maturityDate: editingLoan.maturityDate?.split('T')[0] || ''
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({ 
          borrowerId: 0,
          principal: 0,
          interestRate: 0,
          startDate: today,
          maturityDate: ''
        });
      }
      setFormErrors({});
    }
  }, [isOpen, editingLoan]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'borrowerId' || name === 'principal' || name === 'interestRate' 
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
    
    if (!formData.borrowerId || formData.borrowerId === 0) {
      errors.borrowerId = 'Please select a borrower';
    }
    
    if (!formData.principal || formData.principal <= 0) {
      errors.principal = 'Principal amount must be greater than 0';
    }
    
    if (!formData.interestRate || formData.interestRate < 0) {
      errors.interestRate = 'Interest rate must be 0 or greater';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (formData.maturityDate && formData.startDate && 
        new Date(formData.maturityDate) <= new Date(formData.startDate)) {
      errors.maturityDate = 'Maturity date must be after start date';
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
      const submitData = {
        ...formData,
        startDate: formData.startDate,
        maturityDate: formData.maturityDate || undefined
      };

      if (editingLoan) {
        // Update existing loan
        await updateLoan.mutateAsync({
          id: editingLoan.id,
          ...submitData
        });
      } else {
        // Create new loan
        await createLoan.mutateAsync(submitData);
      }
      
      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Error saving loan:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-4">
            {editingLoan ? 'Edit Loan' : 'Create New Loan'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Borrower Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Borrower *</span>
              </label>
              <select
                name="borrowerId"
                value={formData.borrowerId}
                onChange={handleInputChange}
                className={`select select-bordered w-full ${formErrors.borrowerId ? 'select-error' : ''}`}
                disabled={borrowersLoading}
              >
                <option value={0}>
                  {borrowersLoading ? 'Loading borrowers...' : 'Select a borrower'}
                </option>
                {borrowers?.map((borrower) => (
                  <option key={borrower.id} value={borrower.id}>
                    {borrower.name}
                  </option>
                ))}
              </select>
              {formErrors.borrowerId && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.borrowerId}</span>
                </label>
              )}
            </div>

            {/* Principal Amount */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Principal Amount (₱) *</span>
              </label>
              <input
                type="number"
                name="principal"
                value={formData.principal || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`input input-bordered w-full ${formErrors.principal ? 'input-error' : ''}`}
              />
              {formErrors.principal && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.principal}</span>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Interest Rate */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Interest Rate (%) *</span>
              </label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                max="100"
                className={`input input-bordered w-full ${formErrors.interestRate ? 'input-error' : ''}`}
              />
              {formErrors.interestRate && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.interestRate}</span>
                </label>
              )}
            </div>

            {/* Start Date */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Start Date *</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${formErrors.startDate ? 'input-error' : ''}`}
              />
              {formErrors.startDate && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.startDate}</span>
                </label>
              )}
            </div>
          </div>

          {/* Maturity Date */}
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Maturity Date</span>
            </label>
            <input
              type="date"
              name="maturityDate"
              value={formData.maturityDate}
              onChange={handleInputChange}
              className={`input input-bordered w-full ${formErrors.maturityDate ? 'input-error' : ''}`}
            />
            {formErrors.maturityDate && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.maturityDate}</span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt">Optional - Leave empty for open-ended loan</span>
            </label>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={createLoan.isPending || updateLoan.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${(createLoan.isPending || updateLoan.isPending) ? 'loading' : ''}`}
              disabled={createLoan.isPending || updateLoan.isPending}
            >
              {(createLoan.isPending || updateLoan.isPending) ? (
                <>
                  <LoadingSpinner />
                  {editingLoan ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {editingLoan ? (
                    <EditIcon className="h-5 w-5 mr-2" />
                  ) : (
                    <PlusIcon className="h-5 w-5 mr-2" />
                  )}
                  {editingLoan ? 'Update Loan' : 'Create Loan'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
