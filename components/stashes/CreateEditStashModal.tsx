'use client';
import { useState, useEffect } from 'react';
import { useCreateStash, useUpdateStash } from '@/react-query/stashes';
import { useOwners } from '@/react-query/owners';
import { CreateStashDTO, Stash } from '@/types/stash';
import { LoadingSpinner, PlusIcon, EditIcon, CloseIcon } from '@/assets/icons';

interface CreateEditStashModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingStash: Stash | null;
  onError?: (title: string, message?: string, error?: Error | string) => void;
}

export default function CreateEditStashModal({ 
  isOpen, 
  onClose, 
  editingStash,
  onError
}: CreateEditStashModalProps) {
  const createStash = useCreateStash();
  const updateStash = useUpdateStash();
  const { data: owners, isLoading: ownersLoading } = useOwners();
  
  // Form state
  const [formData, setFormData] = useState<CreateStashDTO>({
    ownerId: 0,
    month: new Date(),
    amount: 0,
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Reset form when modal opens/closes or when editing stash changes
  useEffect(() => {
    if (isOpen) {
      if (editingStash) {
        setFormData({
          ownerId: editingStash.ownerId,
          month: new Date(editingStash.month),
          amount: editingStash.amount,
          remarks: editingStash.remarks || ''
        });
      } else {
        const today = new Date();
        setFormData({ 
          ownerId: 0,
          month: new Date(today.getFullYear(), today.getMonth(), 1), // First day of current month
          amount: 0,
          remarks: ''
        });
      }
      setFormErrors({});
    }
  }, [isOpen, editingStash]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'month') {
      setFormData(prev => ({
        ...prev,
        [name]: new Date(value)
      }));
    } else if (name === 'amount') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else if (name === 'ownerId') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    
    if (!formData.ownerId || formData.ownerId === 0) {
      errors.ownerId = 'Owner is required';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.month) {
      errors.month = 'Month is required';
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
      if (editingStash) {
        // Update existing stash
        await updateStash.mutateAsync({
          id: editingStash.id,
          ownerId: formData.ownerId,
          month: formData.month,
          amount: formData.amount,
          remarks: formData.remarks || undefined
        });
      } else {
        // Create new stash
        await createStash.mutateAsync({
          ownerId: formData.ownerId,
          month: formData.month,
          amount: formData.amount,
          remarks: formData.remarks || undefined
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving stash:', error);
      if (onError) {
        onError(
          editingStash ? 'Update Error' : 'Create Error',
          'Failed to save stash contribution. Please try again.',
          error instanceof Error ? error : undefined
        );
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatMonthForInput = (date: Date) => {
    return date.toISOString().slice(0, 7); // YYYY-MM format
  };

  const isLoading = createStash.isPending || updateStash.isPending;

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {editingStash ? (
              <>
                <EditIcon className="h-5 w-5" />
                Edit Stash Contribution
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Add New Stash Contribution
              </>
            )}
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
          {/* Owner Selection */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                Owner <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleInputChange}
              className={`select select-bordered w-full ${formErrors.ownerId ? 'select-error' : ''}`}
              disabled={isLoading || ownersLoading}
            >
              <option value={0}>Select an owner</option>
              {owners?.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
            {formErrors.ownerId && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.ownerId}</span>
              </label>
            )}
          </div>

          {/* Month Selection */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                Month <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="month"
              name="month"
              value={formatMonthForInput(formData.month)}
              onChange={handleInputChange}
              className={`input input-bordered w-full ${formErrors.month ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {formErrors.month && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.month}</span>
              </label>
            )}
          </div>

          {/* Amount Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                Amount <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`input input-bordered w-full ${formErrors.amount ? 'input-error' : ''}`}
              placeholder="Enter contribution amount"
              disabled={isLoading}
            />
            {formErrors.amount && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.amount}</span>
              </label>
            )}
            {formData.amount > 0 && (
              <label className="label">
                <span className="label-text-alt text-info">
                  Formatted: {formatCurrency(formData.amount)}
                </span>
              </label>
            )}
          </div>

          {/* Remarks Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Remarks</span>
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full"
              placeholder="Optional remarks or notes"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Form Actions */}
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
                <LoadingSpinner className="h-4 w-4" />
              ) : editingStash ? (
                'Update Contribution'
              ) : (
                'Create Contribution'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
