import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ConfirmModal from '../ConfirmModal'

// Mock the icons
jest.mock('@/assets/icons', () => ({
  WarningIcon: ({ className }: { className?: string }) => (
    <div data-testid="warning-icon" className={className} />
  ),
  CloseIcon: ({ className }: { className?: string }) => (
    <div data-testid="close-icon" className={className} />
  ),
}))

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Test Title',
    message: 'Test message',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    render(<ConfirmModal {...defaultProps} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
    expect(screen.getByText('Please confirm your action')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />)
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    fireEvent.click(confirmButton)
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close (X) button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />)
    
    const closeButton = screen.getByTestId('close-icon').closest('button')
    fireEvent.click(closeButton!)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('uses custom button text when provided', () => {
    render(
      <ConfirmModal 
        {...defaultProps} 
        confirmText="Delete" 
        cancelText="Keep" 
      />
    )
    
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument()
  })

  it('applies custom confirm button class', () => {
    render(
      <ConfirmModal 
        {...defaultProps} 
        confirmButtonClass="btn-error" 
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('btn-error')
  })

  it('shows loading state and disables buttons when isLoading is true', () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />)
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    const closeButton = screen.getByTestId('close-icon').closest('button')
    
    expect(confirmButton).toHaveClass('loading')
    expect(confirmButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
    expect(closeButton).toBeDisabled()
  })

  it('does not call onClose when loading and cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('renders warning icon', () => {
    render(<ConfirmModal {...defaultProps} />)
    
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
  })
})
