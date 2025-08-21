'use client';

import { WarningIcon, CloseIcon } from '@/assets/icons';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'btn-primary',
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="py-4">
          <div className="alert alert-warning mb-4">
            <WarningIcon className="stroke-current shrink-0 h-6 w-6" />
            <span>Please confirm your action</span>
          </div>
          <p className="text-base">{message}</p>
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${confirmButtonClass} ${isLoading ? 'loading' : ''}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
