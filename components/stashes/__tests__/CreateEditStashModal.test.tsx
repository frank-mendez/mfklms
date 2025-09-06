import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateEditStashModal from '../CreateEditStashModal';
import { Stash } from '@/types/stash';
import * as stashQueries from '@/react-query/stashes';
import * as ownerQueries from '@/react-query/owners';

// Mock the query hooks
jest.mock('@/react-query/stashes');
jest.mock('@/react-query/owners');
jest.mock('@/assets/icons', () => ({
  LoadingSpinner: ({ className }: { className?: string }) => (
    <div data-testid="loading-spinner" className={className}>Loading...</div>
  ),
  PlusIcon: ({ className }: { className?: string }) => (
    <div data-testid="plus-icon" className={className}>+</div>
  ),
  EditIcon: ({ className }: { className?: string }) => (
    <div data-testid="edit-icon" className={className}>Edit</div>
  ),
  CloseIcon: ({ className }: { className?: string }) => (
    <div data-testid="close-icon" className={className}>×</div>
  ),
}));

const mockCreateStash = jest.fn();
const mockUpdateStash = jest.fn();
const mockUseCreateStash = jest.mocked(stashQueries.useCreateStash);
const mockUseUpdateStash = jest.mocked(stashQueries.useUpdateStash);
const mockUseOwners = jest.mocked(ownerQueries.useOwners);

const mockOwners = [
  { id: 1, name: 'John Doe', contactInfo: 'john@example.com' },
  { id: 2, name: 'Jane Smith', contactInfo: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', contactInfo: 'bob@example.com' },
];

const mockStash: Stash = {
  id: 1,
  ownerId: 1,
  owner: { id: 1, name: 'John Doe' },
  month: new Date('2024-01-01T00:00:00.000Z'),
  amount: 5000,
  remarks: 'Monthly contribution',
  createdAt: new Date('2024-01-10T12:00:00.000Z'),
  updatedAt: new Date('2024-01-12T10:30:00.000Z'),
};

describe('CreateEditStashModal', () => {
  let queryClient: QueryClient;
  const mockOnClose = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockUseCreateStash.mockReturnValue({
      mutateAsync: mockCreateStash,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as any);

    mockUseUpdateStash.mockReturnValue({
      mutateAsync: mockUpdateStash,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as any);

    mockUseOwners.mockReturnValue({
      data: mockOwners,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    jest.clearAllMocks();
  });

  const renderModal = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: mockOnClose,
      editingStash: null,
      onError: mockOnError,
      ...props,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <CreateEditStashModal {...defaultProps} />
      </QueryClientProvider>
    );
  };

  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      renderModal({ isOpen: false });
      expect(screen.queryByText('Add New Stash Contribution')).not.toBeInTheDocument();
    });

    it('renders create modal when editingStash is null', () => {
      renderModal();
      expect(screen.getByText('Add New Stash Contribution')).toBeInTheDocument();
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('renders edit modal when editingStash is provided', () => {
      renderModal({ editingStash: mockStash });
      expect(screen.getByText('Edit Stash Contribution')).toBeInTheDocument();
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    });

    it('renders all form fields correctly', () => {
      renderModal();
      
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Remarks')).toBeInTheDocument();
    });

    it('displays owners in the dropdown', () => {
      renderModal();
      
      const ownerSelect = screen.getByRole('combobox');
      expect(ownerSelect).toBeInTheDocument();
      
      mockOwners.forEach(owner => {
        expect(screen.getByRole('option', { name: owner.name })).toBeInTheDocument();
      });
    });
  });

  describe('Form State Management', () => {
    it('initializes form with default values for create mode', () => {
      renderModal();
      
      const ownerSelect = screen.getByRole('combobox');
      const monthInput = screen.getByDisplayValue(/^\d{4}-\d{2}$/);
      const amountInput = screen.getByDisplayValue('0');
      const remarksInput = screen.getByPlaceholderText(/optional remarks/i);

      expect(ownerSelect).toHaveValue('0');
      expect(monthInput).toBeInTheDocument();
      expect(amountInput).toBeInTheDocument();
      expect(remarksInput).toHaveValue('');
    });

    it('initializes form with stash data for edit mode', () => {
      renderModal({ editingStash: mockStash });
      
      const ownerSelect = screen.getByRole('combobox');
      const monthInput = screen.getByDisplayValue('2024-01');
      const amountInput = screen.getByDisplayValue('5000');
      const remarksInput = screen.getByDisplayValue('Monthly contribution');

      expect(ownerSelect).toHaveValue('1');
      expect(monthInput).toBeInTheDocument();
      expect(amountInput).toBeInTheDocument();
      expect(remarksInput).toBeInTheDocument();
    });

    it('resets form when modal is reopened', () => {
      const { rerender } = renderModal({ isOpen: false });
      
      rerender(
        <QueryClientProvider client={queryClient}>
          <CreateEditStashModal
            isOpen={true}
            onClose={mockOnClose}
            editingStash={null}
            onError={mockOnError}
          />
        </QueryClientProvider>
      );
      
      const amountInput = screen.getByDisplayValue('0');
      expect(amountInput).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('updates owner selection correctly', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const ownerSelect = screen.getByRole('combobox');
      await user.selectOptions(ownerSelect, '2');
      
      expect(ownerSelect).toHaveValue('2');
    });

    it('updates amount input correctly', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const amountInput = screen.getByPlaceholderText(/enter contribution amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '1500.50');
      
      expect(amountInput).toHaveValue(1500.50);
    });

    it('updates remarks correctly', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const remarksInput = screen.getByPlaceholderText(/optional remarks/i);
      await user.type(remarksInput, 'Special contribution note');
      
      expect(remarksInput).toHaveValue('Special contribution note');
    });

    it('shows currency formatting when amount is entered', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const amountInput = screen.getByPlaceholderText(/enter contribution amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '2500');
      
      expect(screen.getByText(/Formatted: ₱2,500.00/)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for required fields', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const submitButton = screen.getByRole('button', { name: /create contribution/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Owner is required')).toBeInTheDocument();
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
    });

    it('shows error for zero amount', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const amountInput = screen.getByPlaceholderText(/enter contribution amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '0');
      
      const submitButton = screen.getByRole('button', { name: /create contribution/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
    });

    it('clears validation errors when user starts typing', async () => {
      const user = userEvent.setup();
      renderModal();
      
      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /create contribution/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Owner is required')).toBeInTheDocument();
      
      // Start typing to clear error
      const ownerSelect = screen.getByRole('combobox');
      await user.selectOptions(ownerSelect, '1');
      
      expect(screen.queryByText('Owner is required')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('creates new stash with correct data', async () => {
      const user = userEvent.setup();
      renderModal();
      
      // Fill form
      const ownerSelect = screen.getByRole('combobox');
      const amountInput = screen.getByPlaceholderText(/enter contribution amount/i);
      const remarksInput = screen.getByPlaceholderText(/optional remarks/i);

      await user.selectOptions(ownerSelect, '1');
      await user.clear(amountInput);
      await user.type(amountInput, '3000');
      await user.type(remarksInput, 'June contribution');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create contribution/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockCreateStash).toHaveBeenCalledWith({
          ownerId: 1,
          month: expect.any(Date),
          amount: 3000,
          remarks: 'June contribution'
        });
      });
    });

    it('calls onClose after successful submission', async () => {
      const user = userEvent.setup();
      renderModal();
      
      // Fill required fields
      const ownerSelect = screen.getByRole('combobox');
      const amountInput = screen.getByPlaceholderText(/enter contribution amount/i);

      await user.selectOptions(ownerSelect, '1');
      await user.clear(amountInput);
      await user.type(amountInput, '1000');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create contribution/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner during create submission', () => {
      mockUseCreateStash.mockReturnValue({
        mutateAsync: mockCreateStash,
        isPending: true,
        isError: false,
        error: null,
      } as unknown as any);

      renderModal();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
    });

    it('disables form fields during submission', () => {
      mockUseCreateStash.mockReturnValue({
        mutateAsync: mockCreateStash,
        isPending: true,
        isError: false,
        error: null,
      } as unknown as any);

      renderModal();
      
      expect(screen.getByRole('combobox')).toBeDisabled();
      expect(screen.getByPlaceholderText(/enter contribution amount/i)).toBeDisabled();
      expect(screen.getByPlaceholderText(/optional remarks/i)).toBeDisabled();
    });
  });

  describe('Modal Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const closeButton = screen.getByTestId('close-icon').closest('button');
      await user.click(closeButton!);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct modal classes', () => {
      renderModal();
      
      const modal = document.querySelector('.modal');
      expect(modal).toHaveClass('modal', 'modal-open');
    });

    it('applies correct modal box classes', () => {
      renderModal();
      
      const modalBox = document.querySelector('.modal-box');
      expect(modalBox).toHaveClass('modal-box', 'max-w-2xl');
    });

    it('applies error styling to form fields with errors', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const submitButton = screen.getByRole('button', { name: /create contribution/i });
      await user.click(submitButton);
      
      const ownerSelect = screen.getByRole('combobox');
      const amountInput = screen.getByPlaceholderText(/enter contribution amount/i);
      
      expect(ownerSelect).toHaveClass('select-error');
      expect(amountInput).toHaveClass('input-error');
    });
  });

  describe('Currency Formatting', () => {
    it('formats currency in Philippine Pesos', () => {
      renderModal({ editingStash: mockStash });
      
      expect(screen.getByText(/Formatted: ₱5,000.00/)).toBeInTheDocument();
    });

    it('handles decimal amounts correctly', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const amountInput = screen.getByPlaceholderText(/enter contribution amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '1234.56');
      
      expect(screen.getByText(/Formatted: ₱1,234.56/)).toBeInTheDocument();
    });

    it('does not show formatting for zero amount', () => {
      renderModal();
      
      expect(screen.queryByText(/Formatted:/)).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing owners data gracefully', () => {
      mockUseOwners.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as any);

      renderModal();
      
      const ownerSelect = screen.getByRole('combobox');
      expect(ownerSelect).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Select an owner' })).toBeInTheDocument();
    });

    it('handles very large amounts', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const amountInput = screen.getByPlaceholderText(/enter contribution amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '999999.99');
      
      expect(screen.getByText(/Formatted: ₱999,999.99/)).toBeInTheDocument();
    });

    it('handles simple text in remarks', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const remarksInput = screen.getByPlaceholderText(/optional remarks/i);
      const simpleText = 'Monthly contribution for August';
      await user.type(remarksInput, simpleText);
      
      expect(remarksInput).toHaveValue(simpleText);
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderModal();
      
      // Look for label text specifically
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Remarks')).toBeInTheDocument();
    });

    it('has proper button roles and names', () => {
      renderModal();
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create contribution/i })).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderModal();
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Add New Stash Contribution');
    });
  });
});
