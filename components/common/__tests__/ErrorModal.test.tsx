import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorModal from '../ErrorModal'

// Mock the icons
jest.mock('@/assets/icons', () => ({
  ErrorIcon: ({ className }: { className?: string }) => (
    <div data-testid="error-icon" className={className} />
  ),
  CloseIcon: ({ className }: { className?: string }) => (
    <div data-testid="close-icon" className={className} />
  ),
}))

describe('ErrorModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Error Title',
    message: 'Error message description',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    render(<ErrorModal {...defaultProps} />)
    
    expect(screen.getByText('Error Title')).toBeInTheDocument()
    expect(screen.getByText('Error message description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<ErrorModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Error Title')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<ErrorModal {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('renders error icon with correct styling', () => {
    render(<ErrorModal {...defaultProps} />)
    
    const errorIcon = screen.getByTestId('error-icon')
    expect(errorIcon).toBeInTheDocument()
    expect(errorIcon).toHaveClass('h-8', 'w-8', 'text-error')
  })

  it('renders close icon in button', () => {
    render(<ErrorModal {...defaultProps} />)
    
    expect(screen.getByTestId('close-icon')).toBeInTheDocument()
  })

  it('displays title with error styling', () => {
    render(<ErrorModal {...defaultProps} />)
    
    const title = screen.getByText('Error Title')
    expect(title).toHaveClass('font-bold', 'text-lg', 'text-error')
  })
})
