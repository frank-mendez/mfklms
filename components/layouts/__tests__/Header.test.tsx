import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSession, signOut } from 'next-auth/react'
import Header from '../Header'
import { UserRole } from '@prisma/client'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn()
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ 
    children, 
    href, 
    ...props 
  }: { 
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return <a href={href} {...props}>{children}</a>
  }
})

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>

describe('Header', () => {
  const mockUpdate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the MFKLMS logo and link', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: mockUpdate
    })

    render(<Header />)
    
    const logoLink = screen.getByText('MFKLMS')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink.closest('a')).toHaveAttribute('href', '/dashboard')
  })

  it('renders hamburger menu button for mobile', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: mockUpdate
    })

    const { container } = render(<Header />)
    
    const menuButton = container.querySelector('label[for="my-drawer"]')
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveClass('btn', 'btn-ghost', 'lg:hidden')
  })

  it('displays user avatar with first letter of firstName when available', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user1',
          role: 'ADMIN' as UserRole,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        expires: '2024-12-31'
      },
      status: 'authenticated',
      update: mockUpdate
    })

    render(<Header />)
    
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('displays user avatar with first letter of email when firstName not available', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user1',
          role: 'USER' as UserRole,
          firstName: null,
          lastName: null,
          email: 'user@example.com'
        },
        expires: '2024-12-31'
      },
      status: 'authenticated',
      update: mockUpdate
    })

    render(<Header />)
    
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('displays default "U" when no user data available', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: mockUpdate
    })

    render(<Header />)
    
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('displays user full name in dropdown when firstName available', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user1',
          role: 'USER' as UserRole,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        expires: '2024-12-31'
      },
      status: 'authenticated',
      update: mockUpdate
    })

    render(<Header />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('displays user email in dropdown when firstName not available', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user1',
          role: 'USER' as UserRole,
          firstName: null,
          lastName: null,
          email: 'user@example.com'
        },
        expires: '2024-12-31'
      },
      status: 'authenticated',
      update: mockUpdate
    })

    render(<Header />)
    
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
  })

  it('displays user first name only when lastName is null', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user1',
          role: 'USER' as UserRole,
          firstName: 'John',
          lastName: null,
          email: 'john@example.com'
        },
        expires: '2024-12-31'
      },
      status: 'authenticated',
      update: mockUpdate
    })

    render(<Header />)
    
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('calls signOut when logout button is clicked', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user1',
          role: 'USER' as UserRole,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        expires: '2024-12-31'
      },
      status: 'authenticated',
      update: mockUpdate
    })

    render(<Header />)
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('has proper CSS classes for layout structure', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: mockUpdate
    })

    const { container } = render(<Header />)
    
    const navbar = container.querySelector('.navbar')
    expect(navbar).toHaveClass('navbar', 'bg-base-200', 'shadow-lg', 'px-4')
    
    const flexStart = container.querySelector('.flex-1')
    expect(flexStart).toBeInTheDocument()
    
    const flexEnd = container.querySelector('.flex-none')
    expect(flexEnd).toHaveClass('flex-none', 'gap-2')
  })

  it('has proper dropdown structure and classes', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user1',
          role: 'USER' as UserRole,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        expires: '2024-12-31'
      },
      status: 'authenticated',
      update: mockUpdate
    })

    const { container } = render(<Header />)
    
    const dropdown = container.querySelector('.dropdown')
    expect(dropdown).toHaveClass('dropdown', 'dropdown-end')
    
    const avatarButton = container.querySelector('[role="button"]')
    expect(avatarButton).toHaveClass('btn', 'btn-ghost', 'btn-circle', 'avatar')
    
    const menu = container.querySelector('.menu')
    expect(menu).toHaveClass('menu', 'menu-sm', 'dropdown-content', 'bg-base-100', 'rounded-box')
  })
})
