import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Sidebar from '../Sidebar'
import { UserRole } from '@prisma/client'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
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
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('Sidebar', () => {
  const mockUpdate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/dashboard')
  })

  describe('Role-based access control', () => {
    it('shows all navigation items for SUPERADMIN users', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user1',
            role: 'SUPERADMIN' as UserRole,
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@example.com'
          },
          expires: '2024-12-31'
        },
        status: 'authenticated',
        update: mockUpdate
      })

      render(<Sidebar />)

      // Check dashboard (available to all)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      
      // Check lending section (available to all)
      expect(screen.getByText('Lending')).toBeInTheDocument()
      expect(screen.getByText('Borrowers')).toBeInTheDocument()
      expect(screen.getByText('Loans')).toBeInTheDocument()
      expect(screen.getByText('Repayments')).toBeInTheDocument()
      expect(screen.getByText('Transactions')).toBeInTheDocument()
      
      // Check stash section (ADMIN, SUPERADMIN only)
      expect(screen.getByText('Stash')).toBeInTheDocument()
      expect(screen.getByText('Owners')).toBeInTheDocument()
      expect(screen.getByText('Contributions')).toBeInTheDocument()
      
      // Check management section (SUPERADMIN only)
      expect(screen.getByText('Management')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('Activity Logs')).toBeInTheDocument()
    })

    it('shows limited navigation items for ADMIN users', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user1',
            role: 'ADMIN' as UserRole,
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com'
          },
          expires: '2024-12-31'
        },
        status: 'authenticated',
        update: mockUpdate
      })

      render(<Sidebar />)

      // Check dashboard (available to all)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      
      // Check lending section (available to all)
      expect(screen.getByText('Lending')).toBeInTheDocument()
      expect(screen.getByText('Borrowers')).toBeInTheDocument()
      
      // Check stash section (ADMIN, SUPERADMIN only)
      expect(screen.getByText('Stash')).toBeInTheDocument()
      expect(screen.getByText('Owners')).toBeInTheDocument()
      
      // Check management section is NOT available for ADMIN
      expect(screen.queryByText('Management')).not.toBeInTheDocument()
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
      expect(screen.queryByText('Activity Logs')).not.toBeInTheDocument()
    })

    it('shows basic navigation items for regular USER', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user1',
            role: 'USER' as UserRole,
            firstName: 'Regular',
            lastName: 'User',
            email: 'user@example.com'
          },
          expires: '2024-12-31'
        },
        status: 'authenticated',
        update: mockUpdate
      })

      render(<Sidebar />)

      // Check dashboard (available to all)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      
      // Check lending section (available to all)
      expect(screen.getByText('Lending')).toBeInTheDocument()
      expect(screen.getByText('Borrowers')).toBeInTheDocument()
      
      // Check stash section is NOT available for USER
      expect(screen.queryByText('Stash')).not.toBeInTheDocument()
      expect(screen.queryByText('Owners')).not.toBeInTheDocument()
      
      // Check management section is NOT available for USER
      expect(screen.queryByText('Management')).not.toBeInTheDocument()
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
    })

    it('shows basic navigation when no user session', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: mockUpdate
      })

      render(<Sidebar />)

      // Check dashboard (available to all)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      
      // Check lending section (available to all)
      expect(screen.getByText('Lending')).toBeInTheDocument()
      
      // Check restricted sections are NOT available
      expect(screen.queryByText('Stash')).not.toBeInTheDocument()
      expect(screen.queryByText('Management')).not.toBeInTheDocument()
    })
  })

  describe('Active state highlighting', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user1',
            role: 'SUPERADMIN' as UserRole,
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@example.com'
          },
          expires: '2024-12-31'
        },
        status: 'authenticated',
        update: mockUpdate
      })
    })

    it('highlights active dashboard link', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Sidebar />)

      const dashboardLink = screen.getByText('Dashboard').closest('a')
      expect(dashboardLink).toHaveClass('bg-primary', 'text-primary-content')
    })

    it('highlights active borrowers link', () => {
      mockUsePathname.mockReturnValue('/borrowers')
      render(<Sidebar />)

      const borrowersLink = screen.getByText('Borrowers').closest('a')
      expect(borrowersLink).toHaveClass('bg-primary', 'text-primary-content')
    })

    it('highlights active loans link', () => {
      mockUsePathname.mockReturnValue('/loans')
      render(<Sidebar />)

      const loansLink = screen.getByText('Loans').closest('a')
      expect(loansLink).toHaveClass('bg-primary', 'text-primary-content')
    })

    it('does not highlight inactive links', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Sidebar />)

      const borrowersLink = screen.getByText('Borrowers').closest('a')
      expect(borrowersLink).not.toHaveClass('bg-primary', 'text-primary-content')
    })
  })

  describe('Navigation links', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user1',
            role: 'SUPERADMIN' as UserRole,
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@example.com'
          },
          expires: '2024-12-31'
        },
        status: 'authenticated',
        update: mockUpdate
      })
    })

    it('has correct href attributes for all links', () => {
      render(<Sidebar />)

      expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard')
      expect(screen.getByText('Borrowers').closest('a')).toHaveAttribute('href', '/borrowers')
      expect(screen.getByText('Loans').closest('a')).toHaveAttribute('href', '/loans')
      expect(screen.getByText('Repayments').closest('a')).toHaveAttribute('href', '/repayments')
      expect(screen.getByText('Transactions').closest('a')).toHaveAttribute('href', '/transactions')
      expect(screen.getByText('Owners').closest('a')).toHaveAttribute('href', '/owners')
      expect(screen.getByText('Contributions').closest('a')).toHaveAttribute('href', '/stashes')
      expect(screen.getByText('Users').closest('a')).toHaveAttribute('href', '/users')
      expect(screen.getByText('Activity Logs').closest('a')).toHaveAttribute('href', '/activities')
    })

    it('displays appropriate icons for each navigation item', () => {
      render(<Sidebar />)

      // Icons are rendered as text content in spans
      expect(screen.getByText('📊')).toBeInTheDocument() // Dashboard
      expect(screen.getByText('👥')).toBeInTheDocument() // Borrowers
      expect(screen.getByText('💰')).toBeInTheDocument() // Loans
      expect(screen.getByText('💸')).toBeInTheDocument() // Repayments
      expect(screen.getByText('📝')).toBeInTheDocument() // Transactions
      expect(screen.getByText('👤')).toBeInTheDocument() // Owners
      expect(screen.getByText('💹')).toBeInTheDocument() // Contributions
      expect(screen.getByText('👨‍💼')).toBeInTheDocument() // Users
      expect(screen.getByText('📋')).toBeInTheDocument() // Activity Logs
    })
  })

  describe('CSS structure and classes', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user1',
            role: 'USER' as UserRole,
            firstName: 'Regular',
            lastName: 'User',
            email: 'user@example.com'
          },
          expires: '2024-12-31'
        },
        status: 'authenticated',
        update: mockUpdate
      })
    })

    it('has proper sidebar structure and CSS classes', () => {
      const { container } = render(<Sidebar />)

      const drawerSide = container.querySelector('.drawer-side')
      expect(drawerSide).toBeInTheDocument()

      const overlay = container.querySelector('.drawer-overlay')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveAttribute('for', 'my-drawer')

      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('menu', 'w-64', 'min-h-full', 'bg-base-200', 'text-base-content', 'pt-4', 'px-4')

      const mainList = container.querySelector('ul.space-y-4')
      expect(mainList).toBeInTheDocument()
    })

    it('applies correct CSS classes to menu sections', () => {
      const { container } = render(<Sidebar />)

      const menuSection = container.querySelector('.menu-section')
      expect(menuSection).toBeInTheDocument()

      const menuTitle = container.querySelector('.menu-title')
      expect(menuTitle).toHaveClass('menu-title', 'px-4', 'mb-2', 'text-sm', 'font-semibold', 'text-base-content/60')
    })

    it('applies hover and transition classes to navigation links', () => {
      const { container } = render(<Sidebar />)

      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link).toHaveClass('hover:bg-base-300', 'transition-colors')
      })
    })
  })
})
