import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DeleteBorrowerModal from '../DeleteBorrowerModal'
import { Borrower } from '@/types/borrower'

// Mock the dependencies
jest.mock('@/react-query/borrowers', () => ({
  useDeleteBorrower: jest.fn()
}))

jest.mock('@/hooks/useErrorModal', () => ({
  useErrorModal: jest.fn()
}))

jest.mock('@/components/common', () => ({
  ErrorModal: ({ isOpen, title, message }: { 
    isOpen: boolean
    title: string
    message: string 
  }) => 
    isOpen ? <div data-testid="error-modal">{title}: {message}</div> : null
}))

jest.mock('@/assets/icons', () => ({
  WarningIcon: ({ className }: { className?: string }) => (
    <div data-testid="warning-icon" className={className} />
  ),
  DeleteIcon: ({ className }: { className?: string }) => (
    <div data-testid="delete-icon" className={className} />
  ),
  LoadingSpinner: () => <div data-testid="loading-spinner" />
}))

const mockDeleteBorrower = {
  mutateAsync: jest.fn(),
  isPending: false
}

const mockErrorModal = {
  errorModal: { isOpen: false, title: '', message: '' },
  showError: jest.fn(),
  hideError: jest.fn()
}

// Import the mocked modules  
import { useDeleteBorrower } from '@/react-query/borrowers'
import { useErrorModal } from '@/hooks/useErrorModal'

const mockUseDeleteBorrower = useDeleteBorrower as jest.MockedFunction<typeof useDeleteBorrower>
const mockUseErrorModal = useErrorModal as jest.MockedFunction<typeof useErrorModal>

describe('DeleteBorrowerModal', () => {
  let queryClient: QueryClient

  const mockBorrower: Borrower = {
    id: 1,
    name: 'John Doe',
    contactInfo: 'john@example.com',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }

  const defaultProps = {
    borrower: mockBorrower,
    onClose: jest.fn()
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    
    jest.clearAllMocks()
    mockUseDeleteBorrower.mockReturnValue(mockDeleteBorrower as unknown as ReturnType<typeof useDeleteBorrower>)
    mockUseErrorModal.mockReturnValue(mockErrorModal as unknown as ReturnType<typeof useErrorModal>)
  })

  const renderComponent = (props: { borrower: Borrower | null; onClose: () => void } = defaultProps) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DeleteBorrowerModal {...props} />
      </QueryClientProvider>
    )
  }

  it('renders modal when borrower is provided', () => {
    renderComponent()
    
    expect(screen.getByRole('heading', { name: 'Delete Borrower' })).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('does not render when borrower is null', () => {
    renderComponent({ borrower: null, onClose: jest.fn() })
    
    expect(screen.queryByText('Delete Borrower')).not.toBeInTheDocument()
  })

  it('displays borrower contact info when available', () => {
    renderComponent()
    
    expect(screen.getByText('Contact: john@example.com')).toBeInTheDocument()
  })

  it('does not display contact info when not available', () => {
    const borrowerWithoutContact = { ...mockBorrower, contactInfo: null }
    renderComponent({ ...defaultProps, borrower: borrowerWithoutContact })
    
    expect(screen.queryByText(/Contact:/)).not.toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    renderComponent()
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls deleteBorrower.mutateAsync when delete button is clicked', async () => {
    mockDeleteBorrower.mutateAsync.mockResolvedValue({})
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: /Delete Borrower/ })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(mockDeleteBorrower.mutateAsync).toHaveBeenCalledWith(1)
    })
  })

  it('calls onClose after successful deletion', async () => {
    mockDeleteBorrower.mutateAsync.mockResolvedValue({})
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: /Delete Borrower/ })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('shows error modal when deletion fails', async () => {
    const error = new Error('Delete failed')
    mockDeleteBorrower.mutateAsync.mockRejectedValue(error)
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: /Delete Borrower/ })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(mockErrorModal.showError).toHaveBeenCalledWith(
        'Delete Failed',
        'Error: Delete failed',
        error
      )
    })
  })

  it('shows loading state when deletion is pending', () => {
    useDeleteBorrower.mockReturnValue({
      ...mockDeleteBorrower,
      isPending: true
    })
    renderComponent()
    
    expect(screen.getByText('Deleting...')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    
    const deleteButton = screen.getByRole('button', { name: /Deleting/ })
    expect(deleteButton).toHaveClass('loading')
    expect(deleteButton).toBeDisabled()
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    expect(cancelButton).toBeDisabled()
  })

  it('renders warning icon and message', () => {
    renderComponent()
    
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone!')).toBeInTheDocument()
  })

  it('renders delete icon when not loading', () => {
    renderComponent()
    
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument()
  })
})
