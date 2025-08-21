'use client';
import { useState, useEffect } from 'react';
import { useCreateOwner, useUpdateOwner } from '@/react-query/owners';
import { CreateOwnerDTO, Owner } from '@/types/owner';
import { LoadingSpinner, PlusIcon, EditIcon, CloseIcon } from '@/assets/icons';

interface CreateEditOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingOwner: Owner | null;
}

export default function CreateEditOwnerModal({ 
  isOpen, 
  onClose, 
  editingOwner 
}: CreateEditOwnerModalProps) {
  const createOwner = useCreateOwner();
  const updateOwner = useUpdateOwner();
  
  // Form state
  const [formData, setFormData] = useState<CreateOwnerDTO>({
    name: '',
    contactInfo: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Reset form when modal opens/closes or when editing owner changes
  useEffect(() => {
    if (isOpen) {
      if (editingOwner) {
        setFormData({
          name: editingOwner.name,
          contactInfo: editingOwner.contactInfo || ''
        });
      } else {
        setFormData({ name: '', contactInfo: '' });
      }
      setFormErrors({});
    }
  }, [isOpen, editingOwner]);

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
      if (editingOwner) {
        // Update existing owner
        await updateOwner.mutateAsync({
          id: editingOwner.id,
          name: formData.name,
          contactInfo: formData.contactInfo || undefined
        });
      } else {
        // Create new owner
        await createOwner.mutateAsync({
          name: formData.name,
          contactInfo: formData.contactInfo || undefined
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving owner:', error);
    }
  };

  const isLoading = createOwner.isPending || updateOwner.isPending;

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {editingOwner ? (
              <>
                <EditIcon className="h-5 w-5" />
                Edit Owner
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Add New Owner
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
          {/* Name Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
              placeholder="Enter owner name"
              disabled={isLoading}
            />
            {formErrors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.name}</span>
              </label>
            )}
          </div>

          {/* Contact Info Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Contact Information</span>
            </label>
            <textarea
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full"
              placeholder="Enter contact information (phone, email, address, etc.)"
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
              ) : editingOwner ? (
                'Update Owner'
              ) : (
                'Create Owner'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
