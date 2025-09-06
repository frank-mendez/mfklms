import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthLayout from '../AuthLayout'

// Mock the child components
jest.mock('../Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header Component</div>
  }
})

jest.mock('../Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar Component</div>
  }
})

// Mock useSession
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  }))
}))

describe('AuthLayout', () => {
  it('renders children content', () => {
    render(
      <AuthLayout>
        <div data-testid="test-content">Test Content</div>
      </AuthLayout>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders Header component', () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders Sidebar component', () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('has correct layout structure', () => {
    render(
      <AuthLayout>
        <div data-testid="content">Content</div>
      </AuthLayout>
    )
    
    // Check for drawer structure
    const drawer = screen.getByRole('checkbox')
    expect(drawer).toHaveAttribute('type', 'checkbox')
    expect(drawer).toHaveClass('drawer-toggle')
    
    // Check main content wrapper
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('p-4', 'lg:p-8')
  })

  it('applies correct CSS classes for layout', () => {
    const { container } = render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )
    
    const rootDiv = container.firstChild as HTMLElement
    expect(rootDiv).toHaveClass('min-h-screen', 'bg-base-100')
    
    const drawerDiv = screen.getByRole('checkbox').closest('.drawer')
    expect(drawerDiv).toHaveClass('drawer', 'lg:drawer-open')
  })
})
