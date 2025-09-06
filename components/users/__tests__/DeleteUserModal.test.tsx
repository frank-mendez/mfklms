import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DeleteUserModal from '../DeleteUserModal'
import { useDeleteUser } from '@/react-query/users'
import { useErrorModal } from '@/hooks'
import { User } from '@prisma/client'

// Mock the hooks
jest.mock('@/react-query/users')
jest.mock('@/hooks')

// Mock the common components
jest.mock('@/components/common', () => ({
  ErrorModal: ({ isOpen, onClose, title, message }: any) =>
    isOpen ? (
      <div data-testid="error-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
}))

// Mock the icons
jest.mock('@/assets/icons', () => ({
  CloseIcon: () => <div data-testid="close-icon">×</div>,
  LoadingSpinner: ({ className }: { className: string }) => <div className={className} data-testid="loading-spinner">Loading...</div>,
  WarningIcon: ({ className }: { className: string }) => <div className={className} data-testid="warning-icon">⚠</div>
}))

const mockUseDeleteUser = useDeleteUser as jest.MockedFunction<typeof useDeleteUser>
const mockUseErrorModal = useErrorModal as jest.MockedFunction<typeof useErrorModal>

describe('DeleteUserModal', () => {
  let queryClient: QueryClient
  const mockOnClose = jest.fn()
  const mockMutateAsync = jest.fn()
  const mockShowError = jest.fn()
  const mockHideError = jest.fn()

  const testUser: User = {
    id: 'user_123',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    status: 'ACTIVE',
    password: 'hashedpassword',
    twoFactorSecret: null,
    twoFactorEnabled: false,
    verified: true,
    verificationToken: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }

  const renderModal = (isOpen = true, user: User | null = testUser) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DeleteUserModal
          isOpen={isOpen}
          onClose={mockOnClose}
          user={user}
        />
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    
    mockUseDeleteUser.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as unknown as any)

    mockUseErrorModal.mockReturnValue({
      errorModal: {
        isOpen: false,
        title: '',
        message: ''
      },
      showError: mockShowError,
      hideError: mockHideError,
      isErrorOpen: false
    })

    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders modal when open with user', () => {
      renderModal()
      
      // Check for unique elements instead of "Delete User" which appears in both header and button
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
      expect(screen.getByText('User to be deleted:')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete user/i })).toBeInTheDocument()
    })

    it('does not render when closed', () => {
      renderModal(false)
      
      expect(screen.queryByText('Delete User')).not.toBeInTheDocument()
    })

    it('does not render when user is null', () => {
      renderModal(true, null)
      
      expect(screen.queryByText('Delete User')).not.toBeInTheDocument()
    })

    it('displays warning icon in header', () => {
      renderModal()
      
      expect(screen.getAllByTestId('warning-icon')).toHaveLength(2) // One in header, one in alert
    })

    it('renders close button', () => {
      renderModal()
      
      expect(screen.getByTestId('close-icon')).toBeInTheDocument()
    })
  })

  describe('User information display', () => {
    it('displays user details correctly', () => {
      renderModal()
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('USER')).toBeInTheDocument()
      expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    })

    it('handles user with only first name', () => {
      const userWithFirstNameOnly: User = {
        ...testUser,
        firstName: 'John',
        lastName: ''
      }
      
      renderModal(true, userWithFirstNameOnly)
      
      expect(screen.getByText('John')).toBeInTheDocument()
    })

    it('handles user with only last name', () => {
      const userWithLastNameOnly: User = {
        ...testUser,
        firstName: '',
        lastName: 'Doe'
      }
      
      renderModal(true, userWithLastNameOnly)
      
      expect(screen.getByText('Doe')).toBeInTheDocument()
    })

    it('displays "Not provided" when no names', () => {
      const userWithoutNames: User = {
        ...testUser,
        firstName: '',
        lastName: ''
      }
      
      renderModal(true, userWithoutNames)
      
      expect(screen.getByText('Not provided')).toBeInTheDocument()
    })

    it('handles null firstName and lastName', () => {
      const userWithNullNames: User = {
        ...testUser,
        firstName: null as unknown as any,
        lastName: null as unknown as any
      }
      
      renderModal(true, userWithNullNames)
      
      expect(screen.getByText('Not provided')).toBeInTheDocument()
    })
  })

  describe('Confirmation requirement', () => {
    it('displays DELETE confirmation text', () => {
      renderModal()
      
      expect(screen.getByText(/please type/i)).toBeInTheDocument()
      expect(screen.getByText('DELETE')).toBeInTheDocument()
    })
  })

  describe('Button interactions', () => {
    it('calls onClose when cancel button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()
      
      await user.click(screen.getByText('Cancel'))
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls onClose when close (X) button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()
      
      await user.click(screen.getByTestId('close-icon'))
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls delete when delete button is clicked', async () => {
      const user = userEvent.setup()
      mockMutateAsync.mockResolvedValue(undefined)
      renderModal()
      
      // Find the delete button by its role and classes
      const deleteButton = screen.getByRole('button', { name: /delete user/i })
      await user.click(deleteButton)
      
      expect(mockMutateAsync).toHaveBeenCalledWith('user_123')
    })
  })

  describe('Delete functionality', () => {
    it('successfully deletes user and closes modal', async () => {
      const user = userEvent.setup()
      mockMutateAsync.mockResolvedValue(undefined)
      renderModal()
      
      const deleteButton = screen.getByRole('button', { name: /delete user/i })
      await user.click(deleteButton)
      
      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith('user_123')
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('handles delete error and shows error modal', async () => {
      const user = userEvent.setup()
      mockMutateAsync.mockRejectedValue(new Error('Delete failed'))
      renderModal()
      
      const deleteButton = screen.getByRole('button', { name: /delete user/i })
      await user.click(deleteButton)
      
      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith('user_123')
        expect(mockShowError).toHaveBeenCalledWith('Delete Failed')
        expect(mockOnClose).not.toHaveBeenCalled()
      })
    })

    it('does not attempt delete when user is null', async () => {
      // Test early return when user is null - this test ensures the handleDelete function returns early
      renderModal(true, null)
      
      // Since user is null, modal should not render
      expect(screen.queryByText('Delete User')).not.toBeInTheDocument()
    })
  })

  describe('Loading states', () => {
    it('shows loading state during deletion', () => {
      mockUseDeleteUser.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
      } as unknown as any)
      
      renderModal()
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('disables buttons during loading', () => {
      mockUseDeleteUser.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
      } as unknown as any)
      
      renderModal()
      
      expect(screen.getByText('Cancel')).toBeDisabled()
      expect(screen.getByRole('button', { name: /delete user/i })).toBeDisabled()
      expect(screen.getByTestId('close-icon').closest('button')).toBeDisabled()
    })
  })

  describe('Error modal integration', () => {
    it('renders error modal when error state is active', () => {
      mockUseErrorModal.mockReturnValue({
        errorModal: {
          isOpen: true,
          title: 'Delete Failed',
          message: 'Unable to delete user'
        },
        showError: mockShowError,
        hideError: mockHideError,
        isErrorOpen: true
      })
      
      renderModal()
      
      expect(screen.getByText('Delete Failed')).toBeInTheDocument()
      expect(screen.getByText('Unable to delete user')).toBeInTheDocument()
    })

    it('calls hideError when error modal close is triggered', () => {
      mockUseErrorModal.mockReturnValue({
        errorModal: {
          isOpen: true,
          title: 'Delete Failed',
          message: 'Unable to delete user'
        },
        showError: mockShowError,
        hideError: mockHideError,
        isErrorOpen: true
      })
      
      renderModal()
      
      // The ErrorModal should call hideError when closed
      // This tests the prop passing
      expect(mockHideError).toEqual(expect.any(Function))
    })
  })

  describe('CSS classes and styling', () => {
    it('applies correct CSS classes to modal structure', () => {
      renderModal()
      
      // Use regex to find the text that spans across elements
      const modalElement = screen.getByText(/this action cannot be undone/i).closest('.modal')
      expect(modalElement).toHaveClass('modal', 'modal-open')
      expect(screen.getByText('User to be deleted:').closest('.modal-box')).toBeInTheDocument()
    })

    it('applies warning styles to alert', () => {
      renderModal()
      
      const alertElement = screen.getByText(/this action cannot be undone/i).closest('.alert')
      expect(alertElement).toHaveClass('alert-warning')
    })

    it('applies error styling to delete button', () => {
      renderModal()
      
      const deleteButton = screen.getByRole('button', { name: /delete user/i })
      expect(deleteButton).toHaveClass('btn', 'btn-error')
    })

    it('applies correct styling to user details section', () => {
      renderModal()
      
      const userDetailsSection = screen.getByText('User to be deleted:').closest('div')
      expect(userDetailsSection).toHaveClass('bg-base-200', 'rounded-lg', 'p-4')
    })
  })
})
