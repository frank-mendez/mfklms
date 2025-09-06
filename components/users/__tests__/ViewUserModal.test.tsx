import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ViewUserModal from '../ViewUserModal'
import { User } from '@prisma/client'

// Mock the icons
jest.mock('@/assets/icons', () => ({
  CloseIcon: () => <div data-testid="close-icon">×</div>,
  UsersIcon: ({ className }: { className: string }) => <div className={className} data-testid="users-icon">👤</div>
}))

describe('ViewUserModal', () => {
  const mockOnClose = jest.fn()

  const testUser: User = {
    id: 'user_123',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    status: 'ACTIVE',
    password: 'hashedpassword',
    twoFactorSecret: null,
    twoFactorEnabled: false,
    verified: true,
    verificationToken: null,
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-02-20T14:45:00.000Z')
  }

  const renderModal = (isOpen = true, user: User | null = testUser) => {
    return render(
      <ViewUserModal
        isOpen={isOpen}
        onClose={mockOnClose}
        user={user}
      />
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders modal when open with user', () => {
      renderModal()
      
      expect(screen.getByText('User Details')).toBeInTheDocument()
      expect(screen.getByText('Basic Information')).toBeInTheDocument()
      expect(screen.getByText('Timeline')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
      renderModal(false)
      
      expect(screen.queryByText('User Details')).not.toBeInTheDocument()
    })

    it('does not render when user is null', () => {
      renderModal(true, null)
      
      expect(screen.queryByText('User Details')).not.toBeInTheDocument()
    })

    it('renders header with users icon', () => {
      renderModal()
      
      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
      expect(screen.getByText('User Details')).toBeInTheDocument()
    })

    it('renders close button', () => {
      renderModal()
      
      expect(screen.getByTestId('close-icon')).toBeInTheDocument()
    })
  })

  describe('Basic Information Display', () => {
    it('displays user full name correctly', () => {
      renderModal()
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('displays user email', () => {
      renderModal()
      
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    })

    it('displays user role', () => {
      renderModal()
      
      expect(screen.getByText('USER')).toBeInTheDocument()
    })

    it('displays user status', () => {
      renderModal()
      
      expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    })

    it('displays user ID', () => {
      renderModal()
      
      expect(screen.getByText('user_123')).toBeInTheDocument()
    })

    it('displays verification status when verified', () => {
      renderModal()
      
      expect(screen.getByText('Verified')).toBeInTheDocument()
    })

    it('displays verification status when not verified', () => {
      const unverifiedUser: User = {
        ...testUser,
        verified: false
      }
      
      renderModal(true, unverifiedUser)
      
      expect(screen.getByText('Not Verified')).toBeInTheDocument()
    })
  })

  describe('Name variations', () => {
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

  describe('Status badge styling', () => {
    it('applies success badge for ACTIVE status', () => {
      const activeUser: User = { ...testUser, status: 'ACTIVE' }
      renderModal(true, activeUser)
      
      const statusBadge = screen.getByText('ACTIVE')
      expect(statusBadge).toHaveClass('badge', 'badge-success')
    })

    it('applies warning badge for PENDING status', () => {
      const pendingUser: User = { ...testUser, status: 'PENDING' }
      renderModal(true, pendingUser)
      
      const statusBadge = screen.getByText('PENDING')
      expect(statusBadge).toHaveClass('badge', 'badge-warning')
    })

    it('applies error badge for DEACTIVATED status', () => {
      const deactivatedUser: User = { ...testUser, status: 'DEACTIVATED' }
      renderModal(true, deactivatedUser)
      
      const statusBadge = screen.getByText('DEACTIVATED')
      expect(statusBadge).toHaveClass('badge', 'badge-error')
    })

    it('applies default badge for unknown status', () => {
      const unknownStatusUser: User = { ...testUser, status: 'UNKNOWN' as unknown as any }
      renderModal(true, unknownStatusUser)
      
      const statusBadge = screen.getByText('UNKNOWN')
      expect(statusBadge).toHaveClass('badge')
      expect(statusBadge).not.toHaveClass('badge-success', 'badge-warning', 'badge-error')
    })
  })

  describe('Role badge styling', () => {
    it('applies error badge for SUPERADMIN role', () => {
      const superAdminUser: User = { ...testUser, role: 'SUPERADMIN' }
      renderModal(true, superAdminUser)
      
      const roleBadge = screen.getByText('SUPERADMIN')
      expect(roleBadge).toHaveClass('badge', 'badge-error')
    })

    it('applies warning badge for ADMIN role', () => {
      const adminUser: User = { ...testUser, role: 'ADMIN' }
      renderModal(true, adminUser)
      
      const roleBadge = screen.getByText('ADMIN')
      expect(roleBadge).toHaveClass('badge', 'badge-warning')
    })

    it('applies info badge for USER role', () => {
      const regularUser: User = { ...testUser, role: 'USER' }
      renderModal(true, regularUser)
      
      const roleBadge = screen.getByText('USER')
      expect(roleBadge).toHaveClass('badge', 'badge-info')
    })

    it('applies default badge for unknown role', () => {
      const unknownRoleUser: User = { ...testUser, role: 'UNKNOWN' as unknown as any }
      renderModal(true, unknownRoleUser)
      
      const roleBadge = screen.getByText('UNKNOWN')
      expect(roleBadge).toHaveClass('badge')
      expect(roleBadge).not.toHaveClass('badge-error', 'badge-warning', 'badge-info')
    })
  })

  describe('Verification badge styling', () => {
    it('applies success badge for verified users', () => {
      const verifiedUser: User = { ...testUser, verified: true }
      renderModal(true, verifiedUser)
      
      const verificationBadge = screen.getByText('Verified')
      expect(verificationBadge).toHaveClass('badge', 'badge-success')
    })

    it('applies warning badge for unverified users', () => {
      const unverifiedUser: User = { ...testUser, verified: false }
      renderModal(true, unverifiedUser)
      
      const verificationBadge = screen.getByText('Not Verified')
      expect(verificationBadge).toHaveClass('badge', 'badge-warning')
    })
  })

  describe('Timeline Information', () => {
    it('displays formatted creation date', () => {
      renderModal()
      
      // The date should be formatted as "January 15, 2024 at 10:30 AM"
      expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument()
    })

    it('displays formatted update date', () => {
      renderModal()
      
      // The date should be formatted as "February 20, 2024 at 02:45 PM"
      expect(screen.getByText(/February 20, 2024/)).toBeInTheDocument()
    })

    it('displays time information in creation date', () => {
      renderModal()
      
      // Should include the specific creation time
      expect(screen.getByText(/January 15, 2024 at 06:30 PM/)).toBeInTheDocument()
    })

    it('displays time information in update date', () => {
      renderModal()
      
      // Should include the specific update time
      expect(screen.getByText(/February 20, 2024 at 10:45 PM/)).toBeInTheDocument()
    })
  })

  describe('Modal interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()
      
      await user.click(screen.getByTestId('close-icon'))
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls onClose when Close button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()
      
      await user.click(screen.getByText('Close'))
      
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('CSS classes and layout', () => {
    it('applies correct modal classes', () => {
      renderModal()
      
      const modalElement = screen.getByText('User Details').closest('.modal')
      expect(modalElement).toHaveClass('modal', 'modal-open')
    })

    it('applies correct modal box classes', () => {
      renderModal()
      
      const modalBoxElement = screen.getByText('User Details').closest('.modal-box')
      expect(modalBoxElement).toHaveClass('modal-box', 'w-11/12', 'max-w-2xl')
    })

    it('applies card styling to basic information section', () => {
      renderModal()
      
      const basicInfoCard = screen.getByText('Basic Information').closest('.card')
      expect(basicInfoCard).toHaveClass('card', 'bg-base-200')
    })

    it('applies card styling to timeline section', () => {
      renderModal()
      
      const timelineCard = screen.getByText('Timeline').closest('.card')
      expect(timelineCard).toHaveClass('card', 'bg-base-200')
    })

    it('applies grid layout to information fields', () => {
      renderModal()
      
      const basicInfoGrid = screen.getByText('Basic Information').closest('.card-body')?.querySelector('.grid')
      expect(basicInfoGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')
    })

    it('applies monospace font to user ID', () => {
      renderModal()
      
      const userIdElement = screen.getByText('user_123')
      expect(userIdElement).toHaveClass('font-mono')
    })
  })

  describe('Accessibility', () => {
    it('has proper label text for form fields', () => {
      renderModal()
      
      expect(screen.getByText('Full Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Email Verified')).toBeInTheDocument()
      expect(screen.getByText('User ID')).toBeInTheDocument()
      expect(screen.getByText('Created')).toBeInTheDocument()
      expect(screen.getByText('Last Updated')).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      renderModal()
      
      expect(screen.getByRole('heading', { name: /user details/i })).toBeInTheDocument()
      expect(screen.getByText('Basic Information')).toBeInTheDocument()
      expect(screen.getByText('Timeline')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles very long user names gracefully', () => {
      const userWithLongName: User = {
        ...testUser,
        firstName: 'VeryLongFirstNameThatMightCauseLayoutIssues',
        lastName: 'VeryLongLastNameThatMightAlsoCauseLayoutIssues'
      }
      
      renderModal(true, userWithLongName)
      
      expect(screen.getByText('VeryLongFirstNameThatMightCauseLayoutIssues VeryLongLastNameThatMightAlsoCauseLayoutIssues')).toBeInTheDocument()
    })

    it('handles very long email addresses', () => {
      const userWithLongEmail: User = {
        ...testUser,
        email: 'very.long.email.address.that.might.cause.layout.issues@very-long-domain-name.example.com'
      }
      
      renderModal(true, userWithLongEmail)
      
      expect(screen.getByText('very.long.email.address.that.might.cause.layout.issues@very-long-domain-name.example.com')).toBeInTheDocument()
    })

    it('handles dates with different timezones correctly', () => {
      const userWithDifferentTimezone: User = {
        ...testUser,
        createdAt: new Date('2024-06-15T23:59:59.999Z'),
        updatedAt: new Date('2024-07-01T00:00:00.000Z')
      }
      
      renderModal(true, userWithDifferentTimezone)
      
      // The dates will be converted to local timezone
      expect(screen.getByText(/June 16, 2024/)).toBeInTheDocument()
      expect(screen.getByText(/July 1, 2024/)).toBeInTheDocument()
    })
  })
})
