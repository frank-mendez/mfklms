import { useState } from 'react';

interface ErrorModalState {
  isOpen: boolean;
  title: string;
  message: string;
}

interface UseErrorModalReturn {
  errorModal: ErrorModalState;
  showError: (title: string, message?: string, error?: Error | string) => void;
  hideError: () => void;
  isErrorOpen: boolean;
}

/**
 * Custom hook for managing error modal state
 * @returns Object with error modal state and control functions
 */
export const useErrorModal = (): UseErrorModalReturn => {
  const [errorModal, setErrorModal] = useState<ErrorModalState>({
    isOpen: false,
    title: '',
    message: ''
  });

  const showError = (title: string, message?: string, error?: Error | string) => {
    let errorMessage = message;
    
    if (!errorMessage && error) {
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
    
    setErrorModal({
      isOpen: true,
      title,
      message: errorMessage || 'An unexpected error occurred'
    });
  };

  const hideError = () => {
    setErrorModal({
      isOpen: false,
      title: '',
      message: ''
    });
  };

  return {
    errorModal,
    showError,
    hideError,
    isErrorOpen: errorModal.isOpen
  };
};
