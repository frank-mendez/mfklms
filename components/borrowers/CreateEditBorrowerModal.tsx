'use client';
import { useState, useEffect } from 'react';
import { useCreateBorrower, useUpdateBorrower } from '@/react-query/borrowers';
import { CreateBorrowerData, Borrower } from '@/types/borrower';
import { LoadingSpinner, PlusIcon, EditIcon } from '@/assets/icons';

interface CreateEditBorrowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBorrower: Borrower | null;
}

export default function CreateEditBorrowerModal({ 
  isOpen, 
  onClose, 
  editingBorrower 
}: CreateEditBorrowerModalProps) {
  const createBorrower = useCreateBorrower();
  const updateBorrower = useUpdateBorrower();
  
  // Form state
  const [formData, setFormData] = useState<CreateBorrowerData>({
    name: '',
    contactInfo: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Reset form when modal opens/closes or when editing borrower changes
  useEffect(() => {
    if (isOpen) {
      if (editingBorrower) {
        setFormData({
          name: editingBorrower.name,
          contactInfo: editingBorrower.contactInfo || ''
        });
      } else {
        setFormData({ name: '', contactInfo: '' });
      }
      setFormErrors({});
    }
  }, [isOpen, editingBorrower]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
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
      if (editingBorrower) {
        // Update existing borrower
        await updateBorrower.mutateAsync({
          id: editingBorrower.id,
          name: formData.name.trim(),
          contactInfo: formData.contactInfo?.trim() || undefined
        });
      } else {
        // Create new borrower
        await createBorrower.mutateAsync({
          name: formData.name.trim(),
          contactInfo: formData.contactInfo?.trim() || undefined
        });
      }
      
      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Error saving borrower:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-4">
            {editingBorrower ? 'Edit Borrower' : 'Add New Borrower'}
          </h3>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Full Name *</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter borrower's full name"
              className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
            />
            {formErrors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.name}</span>
              </label>
            )}
          </div>

          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Contact Information</span>
            </label>
            <textarea
              name="contactInfo"
              value={formData.contactInfo || ''}
              onChange={handleInputChange}
              placeholder="Phone number, email, address, etc."
              className="textarea textarea-bordered w-full"
              rows={3}
            />
            <label className="label">
              <span className="label-text-alt">Optional - Phone, email, address, etc.</span>
            </label>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={createBorrower.isPending || updateBorrower.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${(createBorrower.isPending || updateBorrower.isPending) ? 'loading' : ''}`}
              disabled={createBorrower.isPending || updateBorrower.isPending}
            >
              {(createBorrower.isPending || updateBorrower.isPending) ? (
                <>
                  <LoadingSpinner />
                  {editingBorrower ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {editingBorrower ? (
                    <EditIcon className="h-5 w-5 mr-2" />
                  ) : (
                    <PlusIcon className="h-5 w-5 mr-2" />
                  )}
                  {editingBorrower ? 'Update Borrower' : 'Add Borrower'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
