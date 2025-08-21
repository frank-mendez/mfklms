'use client';

import { useState } from 'react';

interface ConfirmModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmModalConfig>({
    title: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void | Promise<void>) | null>(null);

  const showConfirm = (
    confirmConfig: ConfirmModalConfig,
    onConfirm: () => void | Promise<void>
  ) => {
    setConfig(confirmConfig);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const hideConfirm = () => {
    if (!isLoading) {
      setIsOpen(false);
      setConfig({ title: '', message: '' });
      setOnConfirmCallback(null);
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (onConfirmCallback) {
      try {
        setIsLoading(true);
        await onConfirmCallback();
        hideConfirm();
      } catch (error) {
        setIsLoading(false);
        // Error will be handled by the calling component
        throw error;
      }
    }
  };

  return {
    isOpen,
    config,
    isLoading,
    showConfirm,
    hideConfirm,
    handleConfirm
  };
};
