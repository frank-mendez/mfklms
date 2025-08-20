'use client';
import { ErrorIcon, CloseIcon } from '@/assets/icons';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function ErrorModal({ 
  isOpen, 
  onClose, 
  title, 
  message 
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <ErrorIcon className="h-8 w-8 text-error" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-error">{title}</h3>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-base-content">{message}</p>
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-primary"
            onClick={onClose}
          >
            <CloseIcon className="h-4 w-4 mr-2" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
