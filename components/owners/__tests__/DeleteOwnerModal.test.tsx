import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DeleteOwnerModal from '../DeleteOwnerModal'
import { Owner } from '@/types/owner'

// Mock the dependencies
jest.mock('@/react-query/owners', () => ({
  useDeleteOwner: jest.fn()
}))

jest.mock('@/assets/icons', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner" />,
  DeleteIcon: ({ className }: { className?: string }) => (
    <div data-testid="delete-icon" className={className} />
  ),
  WarningIcon: ({ className }: { className?: string }) => (
    <div data-testid="warning-icon" className={className} />
  ),
  CloseIcon: ({ className }: { className?: string }) => (
    <div data-testid="close-icon" className={className} />
  )
}))

const mockDeleteOwner = {
  mutateAsync: jest.fn(),
  isPending: false
}

// Import the mocked modules  
import { useDeleteOwner } from '@/react-query/owners'

const mockUseDeleteOwner = useDeleteOwner as jest.MockedFunction<typeof useDeleteOwner>

describe('DeleteOwnerModal', () => {
  let queryClient: QueryClient

  const mockOwner: Owner = {
    id: 1,
    name: 'John Doe',
    contactInfo: 'john@example.com',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z')
  }

  const defaultProps = {
    owner: mockOwner,
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
    mockUseDeleteOwner.mockReturnValue(mockDeleteOwner as unknown as ReturnType<typeof useDeleteOwner>)
    
    // Mock console.error to avoid error output in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const renderComponent = (props: { owner: Owner | null; onClose: () => void } = defaultProps) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DeleteOwnerModal {...props} />
      </QueryClientProvider>
    )
  }

  it('renders modal when owner is provided', () => {
    renderComponent()
    
    expect(screen.getByRole('heading', { name: 'Delete Owner' })).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('does not render when owner is null', () => {
    renderComponent({ owner: null, onClose: jest.fn() })
    
    expect(screen.queryByText('Delete Owner')).not.toBeInTheDocument()
  })

  it('displays owner contact info when available', () => {
    renderComponent()
    
    expect(screen.getByText(/Contact:/)).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('does not display contact info when not available', () => {
    const ownerWithoutContact = { ...mockOwner, contactInfo: null }
    renderComponent({ ...defaultProps, owner: ownerWithoutContact })
    
    expect(screen.queryByText(/Contact:/)).not.toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    renderComponent()
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close (X) button is clicked', () => {
    renderComponent()
    
    const closeButton = screen.getByTestId('close-icon').closest('button')
    fireEvent.click(closeButton!)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls deleteOwner.mutateAsync when delete button is clicked', async () => {
    mockDeleteOwner.mutateAsync.mockResolvedValue({})
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: /Delete Owner/ })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(mockDeleteOwner.mutateAsync).toHaveBeenCalledWith(1)
    })
  })

  it('calls onClose after successful deletion', async () => {
    mockDeleteOwner.mutateAsync.mockResolvedValue({})
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: /Delete Owner/ })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('logs error when deletion fails', async () => {
    const error = new Error('Delete failed')
    mockDeleteOwner.mutateAsync.mockRejectedValue(error)
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: /Delete Owner/ })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error deleting owner:', error)
    })
  })

  it('shows loading state when deletion is pending', () => {
    mockUseDeleteOwner.mockReturnValue({
      ...mockDeleteOwner,
      isPending: true
    } as unknown as ReturnType<typeof useDeleteOwner>)
    renderComponent()
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.find(button => button.classList.contains('btn-error'))
    expect(deleteButton).toHaveClass('loading')
    expect(deleteButton).toBeDisabled()
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    expect(cancelButton).toBeDisabled()
    
    const closeButton = screen.getByTestId('close-icon').closest('button')
    expect(closeButton).toBeDisabled()
  })

  it('renders warning icon and message', () => {
    renderComponent()
    
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone!')).toBeInTheDocument()
  })

  it('renders delete icon when not loading', () => {
    renderComponent()
    
    const deleteIcons = screen.getAllByTestId('delete-icon')
    expect(deleteIcons.length).toBeGreaterThan(0) // Should have at least one delete icon
  })
})
